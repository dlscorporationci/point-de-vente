<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('branches') && !Schema::hasColumn('branches', 'status')) {
            Schema::table('branches', function (Blueprint $table) {
                $table->enum('status', ['open', 'closed', 'maintenance', 'suspended', 'archived'])
                      ->default('open')
                      ->after('phone');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('branches') && Schema::hasColumn('branches', 'status')) {
            Schema::table('branches', function (Blueprint $table) {
                $table->dropColumn('status');
            });
        }
    }
};
