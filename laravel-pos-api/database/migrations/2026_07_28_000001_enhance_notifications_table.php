<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            if (!Schema::hasColumn('notifications', 'priority')) {
                $table->string('priority', 20)->default('info')->after('type'); // info, important, warning, critical
            }
            if (!Schema::hasColumn('notifications', 'permission_required')) {
                $table->string('permission_required', 100)->nullable()->after('priority');
            }
            if (!Schema::hasColumn('notifications', 'target_route')) {
                $table->string('target_route', 255)->nullable()->after('permission_required');
            }
            if (!Schema::hasColumn('notifications', 'actor_id')) {
                $table->foreignId('actor_id')->nullable()->after('user_id')->constrained('users')->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            if (Schema::hasColumn('notifications', 'actor_id')) {
                $table->dropForeign(['actor_id']);
                $table->dropColumn('actor_id');
            }
            if (Schema::hasColumn('notifications', 'target_route')) {
                $table->dropColumn('target_route');
            }
            if (Schema::hasColumn('notifications', 'permission_required')) {
                $table->dropColumn('permission_required');
            }
            if (Schema::hasColumn('notifications', 'priority')) {
                $table->dropColumn('priority');
            }
        });
    }
};
