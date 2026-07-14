<?php

use App\Models\Voucher;
use App\Services\SeatGeneratorService;

it('reports that no vouchers exist for an unassigned flight', function () {
    $response = $this->postJson('/api/check', [
        'flightNumber' => 'GA102',
        'date' => '2025-07-12',
    ]);

    $response->assertOk()->assertExactJson(['exists' => false]);
});

it('reports that vouchers exist for an assigned flight', function () {
    Voucher::factory()->create([
        'flight_number' => 'GA102',
        'flight_date' => '2025-07-12',
    ]);

    $response = $this->postJson('/api/check', [
        'flightNumber' => 'GA102',
        'date' => '2025-07-12',
    ]);

    $response->assertOk()->assertExactJson(['exists' => true]);
});

it('validates the check payload', function () {
    $this->postJson('/api/check', [])
        ->assertUnprocessable()
        ->assertInvalid(['flightNumber', 'date']);
});

it('generates three unique seats and persists them', function () {
    $response = $this->postJson('/api/generate', [
        'name' => 'Sarah',
        'id' => '98123',
        'flightNumber' => 'ID102',
        'date' => '2025-07-12',
        'aircraft' => 'Airbus 320',
    ]);

    $response->assertCreated()->assertJson(['success' => true]);

    $seats = $response->json('seats');

    expect($seats)->toHaveCount(3)
        ->and(array_unique($seats))->toHaveCount(3)
        ->and($seats)->each->toBeIn(app(SeatGeneratorService::class)->seatMapFor('Airbus 320'));

    $voucher = Voucher::sole();

    expect($voucher->crew_name)->toBe('Sarah')
        ->and($voucher->crew_id)->toBe('98123')
        ->and($voucher->flight_number)->toBe('ID102')
        ->and($voucher->aircraft_type)->toBe('Airbus 320')
        ->and($voucher->flight_date->toDateString())->toBe('2025-07-12')
        ->and($voucher->seats)->toBe($seats);
});

it('rejects a second generation for the same flight and date', function () {
    Voucher::factory()->create([
        'flight_number' => 'ID102',
        'flight_date' => '2025-07-12',
    ]);

    $response = $this->postJson('/api/generate', [
        'name' => 'Sarah',
        'id' => '98123',
        'flightNumber' => 'ID102',
        'date' => '2025-07-12',
        'aircraft' => 'Airbus 320',
    ]);

    $response->assertConflict()->assertJson(['success' => false]);

    expect(Voucher::count())->toBe(1);
});

it('allows the same flight number on a different date', function () {
    Voucher::factory()->create([
        'flight_number' => 'ID102',
        'flight_date' => '2025-07-12',
    ]);

    $this->postJson('/api/generate', [
        'name' => 'Sarah',
        'id' => '98123',
        'flightNumber' => 'ID102',
        'date' => '2025-07-13',
        'aircraft' => 'ATR',
    ])->assertCreated();

    expect(Voucher::count())->toBe(2);
});

it('validates the generate payload', function () {
    $this->postJson('/api/generate', [])
        ->assertUnprocessable()
        ->assertInvalid(['name', 'id', 'flightNumber', 'date', 'aircraft']);
});

it('rejects an unsupported aircraft type', function () {
    $this->postJson('/api/generate', [
        'name' => 'Sarah',
        'id' => '98123',
        'flightNumber' => 'ID102',
        'date' => '2025-07-12',
        'aircraft' => 'Concorde',
    ])->assertUnprocessable()->assertInvalid(['aircraft']);
});
