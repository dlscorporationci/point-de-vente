<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('cash_registers')) {
            Schema::create('cash_registers', function (Blueprint $table) {
                $table->id();
                $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
                $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
                $table->string('name', 100);
                $table->string('code', 50)->nullable();
                $table->enum('status', ['active', 'inactive', 'maintenance'])->default('active');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_registers');
    }
};
