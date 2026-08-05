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
        if (!Schema::hasTable('access_control_logs')) {
            Schema::create('access_control_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('company_id')->nullable()->constrained('companies')->onDelete('cascade');
                $table->foreignId('actor_user_id')->nullable()->constrained('users')->onDelete('set null');
                $table->foreignId('target_user_id')->nullable()->constrained('users')->onDelete('set null');
                
                $table->string('action'); // e.g. role.created, role.updated, access_zone.updated, user.role_changed, access.denied
                
                $table->foreignId('old_role_id')->nullable()->constrained('roles')->onDelete('set null');
                $table->foreignId('new_role_id')->nullable()->constrained('roles')->onDelete('set null');
                
                $table->foreignId('old_access_zone_id')->nullable()->constrained('access_zones')->onDelete('set null');
                $table->foreignId('new_access_zone_id')->nullable()->constrained('access_zones')->onDelete('set null');
                
                $table->json('old_permissions')->nullable();
                $table->json('new_permissions')->nullable();
                
                $table->json('old_modules')->nullable();
                $table->json('new_modules')->nullable();
                
                $table->json('old_branches')->nullable();
                $table->json('new_branches')->nullable();
                
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('access_control_logs');
    }
};
