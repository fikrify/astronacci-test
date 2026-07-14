<?php

namespace App\Models;

use Database\Factories\VoucherFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string[] $seats
 * @method static static create(array<string, mixed> $attributes = [])
 * @method static count()
 * @method static sole()
 */
class Voucher extends Model
{
    /** @use HasFactory<VoucherFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'crew_id',
        'crew_name',
        'flight_number',
        'flight_date',
        'aircraft_type',
        'seats',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'flight_date' => 'date',
            'seats' => 'array',
        ];
    }
}
