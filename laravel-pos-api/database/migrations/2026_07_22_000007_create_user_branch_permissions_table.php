<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('user_branch_permissions')) {
            Schema::create('user_branch_permissions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
                $table->foreignId('permission_id')->constrained('permissions')->onDelete('cascade');
                $table->timestamps();

                $table->unique(['user_id', 'branch_id', 'permission_id'], 'ubp_user_branch_perm_unique');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('user_branch_permissions');
    }
};
