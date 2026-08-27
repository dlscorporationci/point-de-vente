<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        try {
            DB::statement("ALTER TABLE branch_products ADD CONSTRAINT check_stock_non_negative CHECK (quantity >= 0.00)");
        } catch (\Throwable $e) {
            // Silently ignore if constraint already exists or CHECK syntax not supported by older MySQL versions
        }

        try {
            DB::statement("ALTER TABLE sync_idempotency ADD UNIQUE INDEX sync_idempotency_company_uuid_unique (company_id, uuid)");
        } catch (\Throwable $e) {
            // Silently ignore if unique index already exists
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        try {
            DB::statement("ALTER TABLE branch_products DROP CONSTRAINT check_stock_non_negative");
        } catch (\Throwable $e) {}

        try {
            DB::statement("ALTER TABLE sync_idempotency DROP INDEX sync_idempotency_company_uuid_unique");
        } catch (\Throwable $e) {}
    }
};
