<?php

namespace App\Http\Requests;

use App\Services\SeatGeneratorService;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

/**
 * @property string $name
 * @property string $id
 * @property string $flightNumber
 * @property string $date
 * @property string $aircraft
 */
class GenerateVoucherRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<int, mixed>|string>
     */
    public function rules(SeatGeneratorService $seatGenerator): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'id' => ['required', 'string', 'max:255'],
            'flightNumber' => ['required', 'string', 'max:10'],
            'date' => ['required', 'date'],
            'aircraft' => ['required', Rule::in($seatGenerator->supportedAircraftTypes())],
        ];
    }

    /**
     * Get the custom error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The crew name is required.',
            'id.required' => 'The crew ID is required.',
            'flightNumber.required' => 'A flight number is required, for example GA102.',
            'flightNumber.max' => 'A flight number may not be longer than :max characters.',
            'date.required' => 'A flight date is required.',
            'date.date' => 'The flight date must be a valid date.',
            'aircraft.required' => 'An aircraft type is required.',
            'aircraft.in' => 'The aircraft type must be one of: ATR, Airbus 320, Boeing 737 Max.',
        ];
    }

    /**
     * The flight date normalised to the Y-m-d format used for storage.
     */
    public function flightDate(): string
    {
        return Carbon::parse($this->date)->toDateString();
    }
}
