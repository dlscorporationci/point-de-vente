<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('user_branches')) {
            Schema::create('user_branches', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
                $table->json('permissions')->nullable()->comment('Override permissions for this specific branch');
                $table->timestamps();

                $table->unique(['user_id', 'branch_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('user_branches');
    }
};
