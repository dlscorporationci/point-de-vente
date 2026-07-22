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
        Schema::create('cash_session_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cash_session_id')->constrained('cash_sessions')->onDelete('cascade');
            $table->enum('type', ['deposit', 'withdrawal']);
            $table->decimal('amount', 12, 2);
            $table->string('description');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cash_session_transactions');
    }
};
