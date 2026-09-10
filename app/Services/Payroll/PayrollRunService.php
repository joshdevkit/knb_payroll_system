<?php

namespace App\Services\Payroll;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\PayrollItem;
use App\Models\PayrollRun;
use Illuminate\Support\Facades\DB;

class PayrollRunService
{
    public function __construct(
        private HolidayService $holidayService
    ) {}

    public function generate(PayrollRun $payrollRun): PayrollRun
    {
        return DB::transaction(function () use ($payrollRun) {
            $payrollRun->items()->delete();

            $employees = Employee::query()
                ->where('status', 'active')
                ->get();

            foreach ($employees as $employee) {
                $this->createItem($payrollRun, $employee);
            }

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
                (int) ($attendance->tardy_minutes ?? 0)
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

        $totalEarnings =
            $basicEarnings
            - $tardy
            + $holidayPay;

        // Cash advances are selected manually on the draft payroll.
        // Nothing is deducted merely because a payroll is generated.
        $cashAdvance = 0;

        $totalDeductions = $tardy;

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
            return ((float) $employee->rate / 26) * $daysPresent;
        }

        return (float) $employee->rate * $daysPresent;
    }

    private function calculateTardy(
        Employee $employee,
        int $tardyMinutes
    ): float {
        if ($tardyMinutes <= 0) {
            return 0;
        }

        $dailyRate = $this->getDailyRate($employee);
        $minuteRate = $dailyRate / 8 / 60;

        return $minuteRate * $tardyMinutes;
    }

    private function getDailyRate(Employee $employee): float
    {
        if ($employee->rate_type === 'monthly') {
            return (float) $employee->rate / 26;
        }

        return (float) $employee->rate;
    }
}
