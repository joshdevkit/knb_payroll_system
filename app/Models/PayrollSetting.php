<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayrollSetting extends Model
{
    protected $fillable = [
        'holiday_pay_enabled',
        'holiday_regular_multiplier',
        'holiday_special_multiplier',
        'late_grace_minutes',
        'night_shift_start',
        'night_shift_end',
        'night_shift_multiplier',
        'overtime_threshold_minutes',
        'overtime_multiplier',
    ];

    protected function casts(): array
    {
        return [
            'holiday_pay_enabled' => 'boolean',
            'holiday_regular_multiplier' => 'decimal:2',
            'holiday_special_multiplier' => 'decimal:2',
            'late_grace_minutes' => 'integer',
            'night_shift_multiplier' => 'decimal:2',
            'overtime_threshold_minutes' => 'integer',
            'overtime_multiplier' => 'decimal:2',
        ];
    }
}