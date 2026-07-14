<?php

namespace App\Services;

use App\Exceptions\InsufficientSeatsException;
use App\Models\Voucher;
use InvalidArgumentException;

class SeatGeneratorService
{
    /**
     * Seat layout per supported aircraft type.
     *
     * @var array<string, array{rows: int, columns: list<string>}>
     */
    protected array $aircrafts = [
        'ATR' => [
            'rows' => 18,
            'columns' => ['A', 'C', 'D', 'F'],
        ],
        'Airbus 320' => [
            'rows' => 32,
            'columns' => ['A', 'B', 'C', 'D', 'E', 'F'],
        ],
        'Boeing 737 Max' => [
            'rows' => 32,
            'columns' => ['A', 'B', 'C', 'D', 'E', 'F'],
        ],
    ];

    /**
     * The aircraft types this service knows how to generate seats for.
     *
     * @return list<string>
     */
    public function supportedAircraftTypes(): array
    {
        return array_keys($this->aircrafts);
    }

    /**
     * Pick unique random seats from the aircraft's seat map.
     *
     * @return list<string>
     *
     * @throws InvalidArgumentException
     * @throws InsufficientSeatsException
     */
    public function generateSeats(string $aircraftType, int $count = 3): array
    {
        $seats = $this->seatMapFor($aircraftType);

        if (count($seats) < $count) {
            throw new InsufficientSeatsException($aircraftType, $count, count($seats));
        }

        shuffle($seats);

        return array_slice($seats, 0, $count);
    }

    /**
     * Whether a flight already has vouchers assigned on the given date.
     *
     * The date must be normalised to Y-m-d, the same format the unique
     * flight_number + flight_date constraint is enforced on.
     */
    public function hasExistingVouchers(string $flightNumber, string $flightDate): bool
    {
        return Voucher::query()
            ->where('flight_number', $flightNumber)
            ->where('flight_date', $flightDate)
            ->exists();
    }

    /**
     * Every seat the given aircraft type has.
     *
     * @return list<string>
     *
     * @throws InvalidArgumentException
     */
    public function seatMapFor(string $aircraftType): array
    {
        if (! isset($this->aircrafts[$aircraftType])) {
            throw new InvalidArgumentException("Unknown aircraft type: {$aircraftType}");
        }

        $config = $this->aircrafts[$aircraftType];

        $seats = [];

        foreach (range(1, $config['rows']) as $row) {
            foreach ($config['columns'] as $column) {
                $seats[] = "{$row}{$column}";
            }
        }

        return $seats;
    }
}
