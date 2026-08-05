<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->nullable()->constrained('companies')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->boolean('email_welcome')->default(true);
            $table->boolean('email_password_security')->default(true);
            $table->boolean('email_subscription')->default(true);
            $table->boolean('email_payment')->default(true);
            $table->boolean('email_maintenance')->default(true);
            $table->boolean('email_security')->default(true);
            $table->boolean('in_app_notifications')->default(true);
            $table->timestamps();

            $table->unique(['company_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_preferences');
    }
};
