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
        Schema::create('catalog_template_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('catalog_template_id')->constrained('catalog_templates')->onDelete('cascade');
            $table->string('category_name', 100)->nullable();
            $table->string('name', 150);
            $table->string('sku', 50)->nullable();
            $table->string('barcode', 50)->nullable();
            $table->text('description')->nullable();
            $table->string('unit', 20)->default('unité');
            $table->decimal('selling_price', 12, 2)->default(0);
            $table->decimal('cost_price', 12, 2)->default(0);
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->decimal('alert_quantity', 10, 2)->default(5);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('catalog_template_products');
    }
};
