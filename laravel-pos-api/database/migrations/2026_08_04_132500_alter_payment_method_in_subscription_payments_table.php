<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('subscription_payments')) {
            DB::statement("ALTER TABLE subscription_payments MODIFY payment_method VARCHAR(50) NOT NULL DEFAULT 'mobile_money'");
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('subscription_payments')) {
            DB::statement("ALTER TABLE subscription_payments MODIFY payment_method ENUM('cash', 'mobile_money', 'bank_transfer', 'card', 'cheque') NOT NULL DEFAULT 'mobile_money'");
        }
    }
};
