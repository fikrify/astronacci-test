<?php

namespace Database\Factories;

use App\Exceptions\InsufficientSeatsException;
use App\Models\Voucher;
use App\Services\SeatGeneratorService;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Voucher>
 */
class VoucherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     *
     * @throws InsufficientSeatsException
     */
    public function definition(): array
    {
        $aircraftType = fake()->randomElement(['ATR', 'Airbus 320', 'Boeing 737 Max']);

        return [
            'crew_id' => (string) fake()->numberBetween(10000, 99999),
            'crew_name' => fake()->firstName(),
            'flight_number' => fake()->randomElement(['GA', 'ID', 'QG']).fake()->numberBetween(100, 999),
            'flight_date' => fake()->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
            'aircraft_type' => $aircraftType,
            'seats' => app(SeatGeneratorService::class)->generateSeats($aircraftType),
        ];
    }
}
