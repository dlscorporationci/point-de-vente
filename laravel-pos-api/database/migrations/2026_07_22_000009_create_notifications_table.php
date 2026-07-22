<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('notifications')) {
            Schema::create('notifications', function (Blueprint $table) {
                $table->id();
                $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
                $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('cascade');
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
                $table->string('type', 50);
                $table->string('title', 255);
                $table->text('message');
                $table->json('data')->nullable();
                $table->timestamp('read_at')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
