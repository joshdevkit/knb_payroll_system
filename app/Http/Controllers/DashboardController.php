<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Holiday;
use App\Models\PayrollRun;
use Illuminate\Support\Carbon;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = now()->toDateString();

        $employeeCount = Employee::query()
            ->where('status', 'active')
            ->count();

        /*
         * Latest payroll run.
         *
         * Payroll items contain the actual calculated
         * earnings, deductions, and net earnings.
         */
        $latestPayroll = PayrollRun::query()
            ->with([
                'items.employee',
            ])
            ->latest('pay_date')
            ->latest()
            ->first();

        $payrollSummary = null;

        if ($latestPayroll) {
            $items = $latestPayroll->items;

            $payrollSummary = [
                'id' => $latestPayroll->id,

                'periodStart' => $latestPayroll->period_start?->format('Y-m-d'),
                'periodEnd' => $latestPayroll->period_end?->format('Y-m-d'),
                'payDate' => $latestPayroll->pay_date?->format('Y-m-d'),

                'status' => $latestPayroll->status,

                'employeeCount' => $items->count(),

                'grossPay' => (float) $items->sum(
                    fn ($item) => (float) $item->total_earnings
                ),

                /*
                 * This system currently has no bonus field.
                 */
                'bonuses' => 0,

                'deductions' => (float) $items->sum(
                    fn ($item) => (float) $item->total_deductions
                ),

                'netPay' => (float) $items->sum(
                    fn ($item) => (float) $item->net_earnings
                ),
            ];
        }

        /*
         * Recent payroll history.
         */
        $recentPayrolls = PayrollRun::query()
            ->withCount('items')
            ->with('items')
            ->latest('pay_date')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function (PayrollRun $payroll) {
                return [
                    'id' => $payroll->id,

                    'periodStart' => $payroll->period_start?->format('Y-m-d'),
                    'periodEnd' => $payroll->period_end?->format('Y-m-d'),
                    'payDate' => $payroll->pay_date?->format('Y-m-d'),

                    'status' => $payroll->status,

                    'employeeCount' => $payroll->items_count,

                    'grossPay' => (float) $payroll->items->sum(
                        fn ($item) => (float) $item->total_earnings
                    ),

                    'deductions' => (float) $payroll->items->sum(
                        fn ($item) => (float) $item->total_deductions
                    ),

                    'netPay' => (float) $payroll->items->sum(
                        fn ($item) => (float) $item->net_earnings
                    ),
                ];
            })
            ->values();

        /*
         * Upcoming Philippine holidays.
         */
        $upcomingHolidays = Holiday::query()
            ->where('is_active', true)
            ->whereDate('holiday_date', '>=', $today)
            ->orderBy('holiday_date')
            ->limit(5)
            ->get()
            ->map(function (Holiday $holiday) {
                return [
                    'id' => $holiday->id,
                    'date' => $holiday->holiday_date?->format('Y-m-d'),
                    'name' => $holiday->name,
                    'type' => $holiday->type,
                    'payMultiplier' => (float) $holiday->pay_multiplier,
                ];
            })
            ->values();

        $nextHoliday = $upcomingHolidays->first();

        return inertia('dashboard', [
            'stats' => [
                'employeeCount' => $employeeCount,
            ],

            'payroll' => $payrollSummary,

            'recentPayrolls' => $recentPayrolls,

            'nextHoliday' => $nextHoliday,

            'upcomingHolidays' => $upcomingHolidays,
        ]);
    }
}