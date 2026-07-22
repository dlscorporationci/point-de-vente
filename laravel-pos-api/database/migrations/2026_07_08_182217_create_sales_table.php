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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('cash_session_id')->constrained('cash_sessions')->onDelete('cascade');
            $table->string('sale_number', 50);
            $table->string('client_name')->nullable();
            $table->string('client_phone')->nullable();
            $table->decimal('subtotal', 12, 2);
            $table->decimal('discount', 12, 2)->default(0.00);
            $table->decimal('tax', 12, 2);
            $table->decimal('total', 12, 2);
            $table->string('payment_method', 30);
            $table->string('payment_status', 30)->default('paid');
            $table->decimal('amount_received', 12, 2)->nullable();
            $table->decimal('amount_change', 12, 2)->nullable();
            $table->text('notes')->nullable();
            $table->string('geniuspay_transaction_id')->nullable();
            $table->timestamps();

            $table->unique(['company_id', 'sale_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
