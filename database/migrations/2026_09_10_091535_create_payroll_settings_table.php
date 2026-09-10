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
        Schema::create('payroll_settings', function (Blueprint $table) {
            $table->id();

            $table->boolean('holiday_pay_enabled')->default(true);
            $table->decimal('holiday_regular_multiplier', 5, 2)->default(2.00);
            $table->decimal('holiday_special_multiplier', 5, 2)->default(1.30);

            $table->unsignedInteger('late_grace_minutes')->default(0);

            $table->time('night_shift_start')->default('22:00:00');
            $table->time('night_shift_end')->default('06:00:00');
            $table->decimal('night_shift_multiplier', 5, 2)->default(0.10);

            $table->unsignedInteger('overtime_threshold_minutes')->default(60);
            $table->decimal('overtime_multiplier', 5, 2)->default(1.25);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payroll_settings');
    }
};
