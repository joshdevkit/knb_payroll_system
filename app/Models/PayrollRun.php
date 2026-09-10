<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'period_start',
    'period_end',
    'pay_date',
    'status',
    'remarks',
])]
class PayrollRun extends Model
{
    use HasFactory, HasUuids;

    protected $primaryKey = 'id';

    protected $keyType = 'string';

    public $incrementing = false;

    protected function casts(): array
    {
        return [
            'period_start' => 'date',
            'period_end' => 'date',
            'pay_date' => 'date',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (PayrollRun $payrollRun) {
            if (! $payrollRun->id) {
                $payrollRun->id = (string) \Illuminate\Support\Str::uuid();
            }
        });
    }

    public function items(): HasMany
    {
        return $this->hasMany(PayrollItem::class);
    }
}