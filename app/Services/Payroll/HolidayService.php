<?php

namespace App\Services\Payroll;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Holiday;
use App\Models\PayrollSetting;

class HolidayService
{
    public function calculate(
        Employee $employee,
        Attendance $attendance
    ): float {
        if ($attendance->status !== 'present') {
            return 0;
        }

        $holiday = Holiday::query()
            ->whereDate('holiday_date', $attendance->attendance_date)
            ->where('is_active', true)
            ->first();

        if (! $holiday) {
            return 0;
        }

        $settings = PayrollSetting::query()->first();

        if (! $settings || ! $settings->holiday_pay_enabled) {
            return 0;
        }

        $dailyRate = $this->getDailyRate($employee);

        $multiplier = match ($holiday->type) {
            'regular' => (float) $settings->holiday_regular_multiplier,
            'special', 'local' => (float) $settings->holiday_special_multiplier,
            default => 1.00,
        };

        /*
         * Basic earnings already includes the employee's
         * normal daily rate.
         *
         * Therefore only pay the additional holiday premium.
         *
         * Regular: 2.00 - 1.00 = 1.00 additional
         * Special: 1.30 - 1.00 = 0.30 additional
         * Local:   1.30 - 1.00 = 0.30 additional
         */
        $additionalMultiplier = max($multiplier - 1, 0);

        return $dailyRate * $additionalMultiplier;
    }

    private function getDailyRate(Employee $employee): float
    {
        if ($employee->rate_type === 'monthly') {
            return (float) $employee->rate / 26;
        }

        return (float) $employee->rate;
    }
}