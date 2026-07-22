<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('stock_transfers')) {
            DB::statement("ALTER TABLE stock_transfers MODIFY COLUMN status ENUM('draft', 'pending_approval', 'approved', 'shipped', 'received', 'rejected', 'cancelled', 'pending', 'transit', 'completed') DEFAULT 'draft'");
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('stock_transfers')) {
            DB::statement("ALTER TABLE stock_transfers MODIFY COLUMN status ENUM('pending', 'transit', 'completed', 'cancelled') DEFAULT 'pending'");
        }
    }
};
