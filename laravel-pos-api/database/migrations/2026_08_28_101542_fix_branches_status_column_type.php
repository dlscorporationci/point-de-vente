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
        if (Schema::hasTable('branches') && Schema::hasColumn('branches', 'status')) {
            try {
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE branches MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'open'");
            } catch (\Throwable $e) {}
        }
    }

    public function down(): void
    {
    }
};
