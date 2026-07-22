<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('audit_logs')) {
            Schema::table('audit_logs', function (Blueprint $table) {
                if (!Schema::hasColumn('audit_logs', 'branch_id')) {
                    $table->foreignId('branch_id')->nullable()->after('user_id')->constrained('branches')->nullOnDelete();
                }
                if (!Schema::hasColumn('audit_logs', 'user_role')) {
                    $table->string('user_role', 50)->nullable()->after('user_id');
                }
                if (!Schema::hasColumn('audit_logs', 'module')) {
                    $table->string('module', 50)->nullable()->after('action');
                }
                if (!Schema::hasColumn('audit_logs', 'device')) {
                    $table->string('device', 100)->nullable()->after('user_agent');
                }
                if (!Schema::hasColumn('audit_logs', 'result')) {
                    $table->string('result', 20)->default('success')->after('device');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('audit_logs')) {
            Schema::table('audit_logs', function (Blueprint $table) {
                $table->dropForeign(['branch_id']);
                $table->dropColumn(['branch_id', 'user_role', 'module', 'device', 'result']);
            });
        }
    }
};
