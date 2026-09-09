<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('payroll_run_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('employee_id')->constrained()->restrictOnDelete();
            $table->decimal('basic_earnings', 12, 2)->default(0);
            $table->decimal('tardy', 12, 2)->default(0);
            $table->decimal('holiday_pay', 12, 2)->default(0);
            $table->decimal('total_earnings', 12, 2)->default(0);
            $table->decimal('cash_advance', 12, 2)->default(0);
            $table->decimal('total_deductions', 12, 2)->default(0);
            $table->decimal('net_earnings', 12, 2)->default(0);
            $table->unsignedInteger('days_present')->default(0);
            $table->unsignedInteger('days_absent')->default(0);
            $table->unsignedInteger('tardy_minutes')->default(0);
            $table->timestamps();

            $table->unique(['payroll_run_id', 'employee_id']);
            $table->index('employee_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_items');
    }
};
