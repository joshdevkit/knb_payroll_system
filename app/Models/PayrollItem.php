<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'payroll_run_id',
    'employee_id',
    'basic_earnings',
    'tardy',
    'holiday_pay',
    'total_earnings',
    'cash_advance',
    'total_deductions',
    'net_earnings',
    'days_present',
    'days_absent',
    'tardy_minutes',
])]
class PayrollItem extends Model
{
    use HasFactory, HasUuids;

    protected function casts(): array
    {
        return [
            'basic_earnings' => 'decimal:2',
            'tardy' => 'decimal:2',
            'holiday_pay' => 'decimal:2',
            'total_earnings' => 'decimal:2',
            'cash_advance' => 'decimal:2',
            'total_deductions' => 'decimal:2',
            'net_earnings' => 'decimal:2',
            'days_present' => 'integer',
            'days_absent' => 'integer',
            'tardy_minutes' => 'integer',
        ];
    }

    public function payrollRun(): BelongsTo
    {
        return $this->belongsTo(PayrollRun::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function cashAdvancePayments(): HasMany
    {
        return $this->hasMany(CashAdvancePayment::class);
    }
}
