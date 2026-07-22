<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Mise à jour de branches : type, is_warehouse, settings, softDeletes
        if (Schema::hasTable('branches')) {
            Schema::table('branches', function (Blueprint $table) {
                if (!Schema::hasColumn('branches', 'type')) {
                    $table->enum('type', ['store', 'warehouse'])->default('store')->after('name');
                }
                if (!Schema::hasColumn('branches', 'is_warehouse')) {
                    $table->boolean('is_warehouse')->default(false)->after('type');
                }
                if (!Schema::hasColumn('branches', 'settings')) {
                    $table->json('settings')->nullable()->after('status');
                }
                if (!Schema::hasColumn('branches', 'deleted_at')) {
                    $table->softDeletes();
                }
            });
        }

        // 2. Ajout de softDeletes sur d'autres tables principales
        $softDeleteTables = ['products', 'customers', 'suppliers', 'users', 'categories'];
        foreach ($softDeleteTables as $tableName) {
            if (Schema::hasTable($tableName) && !Schema::hasColumn($tableName, 'deleted_at')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->softDeletes();
                });
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('branches')) {
            Schema::table('branches', function (Blueprint $table) {
                $table->dropColumn(['type', 'is_warehouse', 'settings', 'deleted_at']);
            });
        }

        $softDeleteTables = ['products', 'customers', 'suppliers', 'users', 'categories'];
        foreach ($softDeleteTables as $tableName) {
            if (Schema::hasTable($tableName) && Schema::hasColumn($tableName, 'deleted_at')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->dropSoftDeletes();
                });
            }
        }
    }
};
