<?php

namespace App\Http\Controllers;

use App\Models\PayrollSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        $settings = PayrollSetting::query()->firstOrCreate(
            [],
            [
                'holiday_pay_enabled' => true,
                'holiday_regular_multiplier' => 2.00,
                'holiday_special_multiplier' => 1.30,
                'late_grace_minutes' => 0,
                'night_shift_start' => '22:00:00',
                'night_shift_end' => '06:00:00',
                'night_shift_multiplier' => 0.10,
                'overtime_threshold_minutes' => 60,
                'overtime_multiplier' => 1.25,
            ],
        );

        return inertia('settings/index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'holiday_pay_enabled' => ['required', 'boolean'],
            'holiday_regular_multiplier' => ['required', 'numeric', 'min:0'],
            'holiday_special_multiplier' => ['required', 'numeric', 'min:0'],
            'late_grace_minutes' => ['required', 'integer', 'min:0'],
            'night_shift_start' => ['required', 'date_format:H:i'],
            'night_shift_end' => ['required', 'date_format:H:i'],
            'night_shift_multiplier' => ['required', 'numeric', 'min:0'],
            'overtime_threshold_minutes' => ['required', 'integer', 'min:0'],
            'overtime_multiplier' => ['required', 'numeric', 'min:0'],
        ]);

        PayrollSetting::query()->updateOrCreate(
            [],
            $validated,
        );

        return to_route('settings.index')
            ->with('success', 'Payroll settings updated successfully.');
    }
}