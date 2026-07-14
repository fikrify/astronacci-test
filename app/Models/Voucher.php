<?php

namespace App\Models;

use Database\Factories\VoucherFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $crew_name
 * @property string $crew_id
 * @property string $flight_number
 * @property string $flight_date
 * @property string $aircraft_type
 * @property string $seat1
 * @property string $seat2
 * @property string $seat3
 * @property list<string> $seats
 *
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
        'crew_name',
        'crew_id',
        'flight_number',
        'flight_date',
        'aircraft_type',
        'seats',
    ];

    /**
     * The three assigned seats, read and written as one list.
     *
     * Seats are stored in dedicated seat1, seat2 and seat3 columns, while the
     * rest of the application works with them as an array.
     *
     * @return Attribute<list<string>, array{seat1: string, seat2: string, seat3: string}>
     */
    protected function seats(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes): array => [
                $attributes['seat1'],
                $attributes['seat2'],
                $attributes['seat3'],
            ],
            set: fn (array $seats): array => [
                'seat1' => $seats[0],
                'seat2' => $seats[1],
                'seat3' => $seats[2],
            ],
        );
    }
}
