<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('stock_adjustments')) {
            Schema::create('stock_adjustments', function (Blueprint $table) {
                $table->id();
                $table->uuid('uuid')->unique();
                $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
                $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
                $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
                $table->enum('type', ['addition', 'withdrawal', 'correction'])->default('addition');
                $table->decimal('previous_quantity', 15, 2)->default(0);
                $table->decimal('quantity_change', 15, 2)->default(0);
                $table->decimal('new_quantity', 15, 2)->default(0);
                $table->enum('reason_code', [
                    'counting_error',
                    'loss',
                    'breakage',
                    'theft',
                    'deteriorated',
                    'entry_error',
                    'other'
                ])->default('entry_error');
                $table->text('comment')->nullable();
                $table->string('reference')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_adjustments');
    }
};
