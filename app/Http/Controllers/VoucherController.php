<?php

namespace App\Http\Controllers;

use App\Exceptions\InsufficientSeatsException;
use App\Exceptions\VoucherAlreadyGeneratedException;
use App\Http\Requests\CheckVoucherRequest;
use App\Http\Requests\GenerateVoucherRequest;
use App\Http\Resources\VoucherCheckResource;
use App\Http\Resources\VoucherResource;
use App\Models\Voucher;
use App\Services\SeatGeneratorService;
use Illuminate\Database\UniqueConstraintViolationException;

class VoucherController extends Controller
{
    public function __construct(
        protected SeatGeneratorService $seatGeneratorService,
    ) {}

    /**
     * Report whether vouchers were already generated for a flight on a date.
     */
    public function check(CheckVoucherRequest $request): VoucherCheckResource
    {
        $exists = $this->seatGeneratorService->hasExistingVouchers(
            $request->flightNumber,
            $request->flightDate(),
        );

        return new VoucherCheckResource($exists);
    }

    /**
     * Assign three unique random seats to a flight and persist them.
     *
     * @throws VoucherAlreadyGeneratedException|InsufficientSeatsException
     */
    public function generate(GenerateVoucherRequest $request): VoucherResource
    {
        $flightNumber = $request->flightNumber;
        $flightDate = $request->flightDate();
        $aircraftType = $request->aircraft;

        if ($this->seatGeneratorService->hasExistingVouchers($flightNumber, $flightDate)) {
            throw new VoucherAlreadyGeneratedException($flightNumber, $flightDate);
        }

        try {
            $voucher = Voucher::create([
                'crew_id' => $request->id,
                'crew_name' => $request->name,
                'flight_number' => $flightNumber,
                'flight_date' => $flightDate,
                'aircraft_type' => $aircraftType,
                'seats' => $this->seatGeneratorService->generateSeats($aircraftType),
            ]);
        } catch (UniqueConstraintViolationException) {
            throw new VoucherAlreadyGeneratedException($flightNumber, $flightDate);
        }

        return new VoucherResource($voucher);
    }
}
