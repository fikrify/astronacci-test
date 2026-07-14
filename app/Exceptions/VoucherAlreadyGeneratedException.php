<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VoucherAlreadyGeneratedException extends Exception
{
    public function __construct(
        public readonly string $flightNumber,
        public readonly string $flightDate,
    ) {
        parent::__construct("Vouchers have already been generated for flight {$flightNumber} on {$flightDate}.");
    }

    /**
     * Render the exception as an HTTP response.
     */
    public function render(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
        ], Response::HTTP_CONFLICT);
    }
}
