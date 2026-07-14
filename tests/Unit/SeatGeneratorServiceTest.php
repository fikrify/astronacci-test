<?php

use App\Exceptions\InsufficientSeatsException;
use App\Services\SeatGeneratorService;

beforeEach(function () {
    $this->seatGenerator = new SeatGeneratorService;
});

it('builds the full seat map for every supported aircraft', function (string $aircraftType, int $expectedCount, string $firstSeat, string $lastSeat) {
    $seats = $this->seatGenerator->seatMapFor($aircraftType);

    expect($seats)->toHaveCount($expectedCount)
        ->and(array_unique($seats))->toHaveCount($expectedCount)
        ->and($seats[0])->toBe($firstSeat)
        ->and($seats[$expectedCount - 1])->toBe($lastSeat);
})->with([
    'ATR' => ['ATR', 72, '1A', '18F'],
    'Airbus 320' => ['Airbus 320', 192, '1A', '32F'],
    'Boeing 737 Max' => ['Boeing 737 Max', 192, '1A', '32F'],
]);

it('never puts a passenger in a seat column the aircraft does not have', function () {
    expect($this->seatGenerator->seatMapFor('ATR'))
        ->not->toContain('5B')
        ->not->toContain('5E');
});

it('rejects an unknown aircraft type', function () {
    expect(fn () => $this->seatGenerator->seatMapFor('Concorde'))
        ->toThrow(InvalidArgumentException::class, 'Unknown aircraft type: Concorde');
});

it('generates three unique seats that exist on the aircraft by default', function (string $aircraftType) {
    $seats = $this->seatGenerator->generateSeats($aircraftType);

    expect($seats)->toHaveCount(3)
        ->and(array_unique($seats))->toHaveCount(3)
        ->and($seats)->each->toBeIn($this->seatGenerator->seatMapFor($aircraftType));
})->with(['ATR', 'Airbus 320', 'Boeing 737 Max']);

it('generates the requested number of seats', function () {
    $seats = $this->seatGenerator->generateSeats('ATR', 10);

    expect($seats)->toHaveCount(10)
        ->and(array_unique($seats))->toHaveCount(10);
});

it('can hand out every seat on the aircraft', function () {
    $seats = $this->seatGenerator->generateSeats('ATR', 72);

    expect($seats)->toHaveCount(72)
        ->and(array_unique($seats))->toHaveCount(72);
});

it('throws when more seats are requested than the aircraft has', function () {
    expect(fn () => $this->seatGenerator->generateSeats('ATR', 73))
        ->toThrow(InsufficientSeatsException::class, 'Only 72 seat(s) available on ATR, 73 required.');
});

it('does not always return the same seats', function () {
    $runs = array_map(
        fn () => $this->seatGenerator->generateSeats('Airbus 320'),
        range(1, 10),
    );

    expect(array_unique(array_map(fn (array $seats) => implode(',', $seats), $runs)))
        ->not->toHaveCount(1);
});
