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
        $seatGenerator = app(SeatGeneratorService::class);
        $aircraftType = fake()->randomElement($seatGenerator->supportedAircraftTypes());

        return [
            'crew_name' => fake()->firstName(),
            'crew_id' => (string) fake()->numberBetween(10000, 99999),
            'flight_number' => fake()->randomElement(['GA', 'ID', 'QG']).fake()->numberBetween(100, 999),
            'flight_date' => fake()->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
            'aircraft_type' => $aircraftType,
            'seats' => $seatGenerator->generateSeats($aircraftType),
        ];
    }
}
