<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;

/**
 * @property string $flightNumber
 * @property string $date
 */
class CheckVoucherRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<int, string>|string>
     */
    public function rules(): array
    {
        return [
            'flightNumber' => ['required', 'string', 'max:10'],
            'date' => ['required', 'date'],
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
            'flightNumber.required' => 'A flight number is required, for example GA102.',
            'flightNumber.max' => 'A flight number may not be longer than :max characters.',
            'date.required' => 'A flight date is required.',
            'date.date' => 'The flight date must be a valid date.',
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
