<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InsufficientSeatsException extends Exception
{
    public function __construct(
        public readonly string $aircraftType,
        public readonly int $requested,
        public readonly int $available,
    ) {
        parent::__construct("Only {$available} seat(s) available on {$aircraftType}, {$requested} required.");
    }

    /**
     * Render the exception as an HTTP response.
     */
    public function render(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
