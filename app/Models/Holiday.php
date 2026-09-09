<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'holiday_date',
    'name',
    'type',
    'pay_multiplier',
    'is_active',
    'remarks',
])]
class Holiday extends Model
{
    use HasFactory, HasUuids;

    protected function casts(): array
    {
        return [
            'holiday_date' => 'date',
            'pay_multiplier' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }
}
