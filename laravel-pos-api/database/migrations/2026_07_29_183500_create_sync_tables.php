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
        if (!Schema::hasTable('sync_idempotency')) {
            Schema::create('sync_idempotency', function (Blueprint $table) {
                $table->id();
                $table->string('uuid', 64)->unique();
                $table->string('entity_type', 50);
                $table->unsignedBigInteger('entity_id')->nullable();
                $table->unsignedBigInteger('company_id');
                $table->unsignedBigInteger('branch_id')->nullable();
                $table->unsignedBigInteger('user_id');
                $table->string('payload_hash', 64)->nullable();
                $table->text('response_json')->nullable();
                $table->timestamps();

                $table->index(['company_id', 'branch_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sync_idempotency');
    }
};
