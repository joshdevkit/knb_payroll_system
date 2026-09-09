<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'employee_id',
    'attendance_date',
    'time_in',
    'time_out',
    'tardy_minutes',
    'status',
    'source',
    'biometric_reference',
    'remarks',
])]
class Attendance extends Model
{
    use HasFactory, HasUuids;

    protected function casts(): array
    {
        return [
            'attendance_date' => 'date',
            'time_in' => 'datetime',
            'time_out' => 'datetime',
            'tardy_minutes' => 'integer',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
