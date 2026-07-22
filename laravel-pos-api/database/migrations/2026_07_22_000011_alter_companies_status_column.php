<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            DB::statement("ALTER TABLE companies MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'active'");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            DB::statement("ALTER TABLE companies MODIFY COLUMN status ENUM('active','inactive','suspended','archived') NOT NULL DEFAULT 'active'");
        });
    }
};
