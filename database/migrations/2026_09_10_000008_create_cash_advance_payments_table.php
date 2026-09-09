<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cash_advance_payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('cash_advance_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('payroll_item_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('amount', 12, 2);
            $table->date('payment_date');
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->index(['cash_advance_id', 'payment_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_advance_payments');
    }
};
