<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('cash_sessions')) {
            Schema::table('cash_sessions', function (Blueprint $table) {
                if (!Schema::hasColumn('cash_sessions', 'cash_register_id')) {
                    $table->foreignId('cash_register_id')->nullable()->after('branch_id')->constrained('cash_registers')->nullOnDelete();
                }
                if (!Schema::hasColumn('cash_sessions', 'terminal_id')) {
                    $table->string('terminal_id', 100)->nullable()->after('cash_register_id');
                }
            });
        }

        if (Schema::hasTable('sales')) {
            Schema::table('sales', function (Blueprint $table) {
                if (!Schema::hasColumn('sales', 'cash_register_id')) {
                    $table->foreignId('cash_register_id')->nullable()->after('branch_id')->constrained('cash_registers')->nullOnDelete();
                }
                if (!Schema::hasColumn('sales', 'terminal_id')) {
                    $table->string('terminal_id', 100)->nullable()->after('cash_register_id');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('cash_sessions')) {
            Schema::table('cash_sessions', function (Blueprint $table) {
                $table->dropForeign(['cash_register_id']);
                $table->dropColumn(['cash_register_id', 'terminal_id']);
            });
        }

        if (Schema::hasTable('sales')) {
            Schema::table('sales', function (Blueprint $table) {
                $table->dropForeign(['cash_register_id']);
                $table->dropColumn(['cash_register_id', 'terminal_id']);
            });
        }
    }
};
