<?php

use App\Models\Voucher;
use App\Services\SeatGeneratorService;

beforeEach(function () {
    $this->seatGenerator = app(SeatGeneratorService::class);
});

it('finds no existing vouchers for an unassigned flight', function () {
    expect($this->seatGenerator->hasExistingVouchers('GA102', '2025-07-12'))->toBeFalse();
});

it('finds existing vouchers for an assigned flight', function () {
    Voucher::factory()->create([
        'flight_number' => 'GA102',
        'flight_date' => '2025-07-12',
    ]);

    expect($this->seatGenerator->hasExistingVouchers('GA102', '2025-07-12'))->toBeTrue();
});

it('scopes the lookup to both the flight number and the date', function (string $flightNumber, string $flightDate) {
    Voucher::factory()->create([
        'flight_number' => 'GA102',
        'flight_date' => '2025-07-12',
    ]);

    expect($this->seatGenerator->hasExistingVouchers($flightNumber, $flightDate))->toBeFalse();
})->with([
    'same date, other flight' => ['GA103', '2025-07-12'],
    'same flight, other date' => ['GA102', '2025-07-13'],
]);
