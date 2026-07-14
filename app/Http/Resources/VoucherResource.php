<?php

namespace App\Http\Resources;

use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Voucher
 */
class VoucherResource extends JsonResource
{
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array{success: bool, seats: array<string>}
     */
    public function toArray(Request $request): array
    {
        return [
            'success' => true,
            'seats' => $this->seats,
        ];
    }
}
