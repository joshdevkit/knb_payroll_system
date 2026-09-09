<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'key',
    'value',
    'type',
    'group',
    'description',
])]
class Setting extends Model
{
    use HasFactory, HasUuids;

    protected function casts(): array
    {
        return [
            'value' => 'string',
        ];
    }
}
