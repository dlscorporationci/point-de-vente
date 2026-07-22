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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->string('name', 100);
            $table->string('email', 100)->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('address', 255)->nullable();
            $table->decimal('credit_limit', 15, 2)->default(0.00); // Plafond de crédit autorisé
            $table->decimal('debt_balance', 15, 2)->default(0.00); // Encours de dette (ce que le client nous doit)
            $table->integer('loyalty_points')->default(0); // Points de fidélité cumulés
            $table->timestamps();

            $table->unique(['company_id', 'phone']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
