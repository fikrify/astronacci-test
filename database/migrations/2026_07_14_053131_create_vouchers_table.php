<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('crew_id');
            $table->string('crew_name');
            $table->string('flight_number');
            $table->date('flight_date');
            $table->enum('aircraft_type', ['ATR', 'Airbus 320', 'Boeing 737 Max']);
            $table->json('seats');
            $table->timestamps();

            $table->unique(['flight_number', 'flight_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
