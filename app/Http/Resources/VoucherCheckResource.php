<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VoucherCheckResource extends JsonResource
{
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array{exists: bool}
     */
    public function toArray(Request $request): array
    {
        return [
            'exists' => (bool) $this->resource,
        ];
    }
}
