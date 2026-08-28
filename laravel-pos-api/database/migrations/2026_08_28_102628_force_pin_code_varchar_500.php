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
        if (Schema::hasTable('users') && Schema::hasColumn('users', 'pin_code')) {
            try {
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE users MODIFY COLUMN pin_code VARCHAR(500) NULL");
            } catch (\Throwable $e) {
                try {
                    \Illuminate\Support\Facades\DB::statement("ALTER TABLE users MODIFY COLUMN pin_code TEXT NULL");
                } catch (\Throwable $e2) {}
            }
        }
    }

    public function down(): void
    {
    }
};
