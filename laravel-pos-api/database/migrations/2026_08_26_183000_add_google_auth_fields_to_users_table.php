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
            if (!Schema::hasColumn('users', 'google_id')) {
                $table->string('google_id')->nullable()->unique()->after('email');
            }
            if (!Schema::hasColumn('users', 'google_email')) {
                $table->string('google_email')->nullable()->after('google_id');
            }
            if (!Schema::hasColumn('users', 'google_avatar')) {
                $table->text('google_avatar')->nullable()->after('google_email');
            }
            if (!Schema::hasColumn('users', 'google_verified_at')) {
                $table->timestamp('google_verified_at')->nullable()->after('google_avatar');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['google_id', 'google_email', 'google_avatar', 'google_verified_at']);
        });
    }
};
