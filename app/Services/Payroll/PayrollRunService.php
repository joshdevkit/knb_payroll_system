<?php

namespace App\Services\Payroll;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\PayrollItem;
use App\Models\PayrollRun;
use App\Services\CashAdvance\CashAdvanceService;
use Illuminate\Support\Facades\DB;

class PayrollRunService
{
    public function __construct(
        private HolidayService $holidayService,
        private CashAdvanceService $cashAdvanceService
    ) {}

    public function generate(
        PayrollRun $payrollRun
    ): PayrollRun {
        return DB::transaction(function () use (
            $payrollRun
        ) {
            /*
             * Regenerating a draft payroll should replace
             * its payroll items without touching cash
             * advance balances.
             */
            $payrollRun->items()->delete();

            $employees = Employee::query()
                ->where('status', 'active')
                ->get();

            foreach ($employees as $employee) {
                $this->createItem(
                    $payrollRun,
                    $employee
                );
            }

            /*
             * Generated payroll remains a draft until
             * explicitly confirmed.
             */
            $payrollRun->update([
                'status' => 'draft',
            ]);

            return $payrollRun->fresh([
                'items.employee',
            ]);
        });
    }

    private function createItem(
        PayrollRun $payrollRun,
        Employee $employee
    ): PayrollItem {
        $attendances = Attendance::query()
            ->where('employee_id', $employee->id)
            ->whereBetween('attendance_date', [
                $payrollRun->period_start,
                $payrollRun->period_end,
            ])
            ->get();

        $daysPresent = $attendances
            ->where('status', 'present')
            ->count();

        $daysAbsent = $attendances
            ->where('status', 'absent')
            ->count();

        $tardyMinutes = $attendances->sum(
            fn (Attendance $attendance) =>
                (int) (
                    $attendance->tardy_minutes ?? 0
                )
        );

        $basicEarnings = $this->calculateBasicEarnings(
            $employee,
            $daysPresent
        );

        $tardy = $this->calculateTardy(
            $employee,
            $tardyMinutes
        );

        $holidayPay = $attendances->sum(
            fn (Attendance $attendance) =>
                $this->holidayService->calculate(
                    $employee,
                    $attendance
                )
        );

        /*
         * Basic earnings already contain the normal
         * attendance earnings.
         *
         * Holiday pay is added separately.
         */
        $totalEarnings =
            $basicEarnings
            - $tardy
            + $holidayPay;

        /*
         * READ ONLY.
         *
         * This does NOT modify cash advances.
         */
        $cashAdvance =
            $this->cashAdvanceService
                ->calculatePayrollDeduction(
                    $employee
                );

        $totalDeductions =
            $tardy
            + $cashAdvance;

        $netEarnings =
            $totalEarnings
            - $totalDeductions;

        return PayrollItem::create([
            'payroll_run_id' => $payrollRun->id,
            'employee_id' => $employee->id,

            'basic_earnings' => $basicEarnings,
            'tardy' => $tardy,
            'holiday_pay' => $holidayPay,

            'total_earnings' => $totalEarnings,

            /*
             * This is only the amount that WILL be
             * deducted when the payroll is confirmed.
             */
            'cash_advance' => $cashAdvance,

            'total_deductions' => $totalDeductions,
            'net_earnings' => $netEarnings,

            'days_present' => $daysPresent,
            'days_absent' => $daysAbsent,
            'tardy_minutes' => $tardyMinutes,
        ]);
    }

    private function calculateBasicEarnings(
        Employee $employee,
        int $daysPresent
    ): float {
        if ($employee->rate_type === 'monthly') {
            return (
                (float) $employee->rate / 26
            ) * $daysPresent;
        }

        return (
            (float) $employee->rate
        ) * $daysPresent;
    }

    private function calculateTardy(
        Employee $employee,
        int $tardyMinutes
    ): float {
        if ($tardyMinutes <= 0) {
            return 0;
        }

        $dailyRate = $this->getDailyRate(
            $employee
        );

        // 8-hour workday.
        $minuteRate =
            $dailyRate / 8 / 60;

        return $minuteRate * $tardyMinutes;
    }

    private function getDailyRate(
        Employee $employee
    ): float {
        if ($employee->rate_type === 'monthly') {
            return (
                (float) $employee->rate / 26
            );
        }

        return (float) $employee->rate;
    }
}
