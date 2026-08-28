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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'github_id')) {
                $table->string('github_id')->nullable()->after('google_verified_at');
            }
            if (!Schema::hasColumn('users', 'github_username')) {
                $table->string('github_username')->nullable()->after('github_id');
            }
            if (!Schema::hasColumn('users', 'github_avatar')) {
                $table->string('github_avatar')->nullable()->after('github_username');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['github_id', 'github_username', 'github_avatar']);
        });
    }
};
