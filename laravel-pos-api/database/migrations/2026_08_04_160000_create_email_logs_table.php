<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('company_id')->nullable()->constrained('companies')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('recipient');
            $table->string('sender')->default('infos@dlscorporation.ci');
            $table->string('type')->index(); // WELCOME, PASSWORD_RESET, SUBSCRIPTION_ACTIVATED, etc.
            $table->string('subject');
            $table->enum('status', ['queued', 'sending', 'sent', 'failed'])->default('queued')->index();
            $table->integer('attempts')->default(0);
            $table->string('message_id')->nullable();
            $table->text('error_message')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->timestamps();

            $table->index(['company_id', 'type']);
            $table->index(['recipient', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_logs');
    }
};
