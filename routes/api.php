<?php

use App\Http\Controllers\VoucherController;
use Illuminate\Support\Facades\Route;

Route::post('/generate', [VoucherController::class, 'generate']);
Route::post('/check', [VoucherController::class, 'check']);
