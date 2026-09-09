<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_runs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('category_id')->nullable()->constrained()->nullOnDelete();
            $table->date('period_start');
            $table->date('period_end');
            $table->date('pay_date');
            $table->string('status')->default('draft');
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->index(['pay_date', 'status']);
            $table->index(['period_start', 'period_end']);
            $table->unique(['category_id', 'period_start', 'period_end', 'pay_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_runs');
    }
};
