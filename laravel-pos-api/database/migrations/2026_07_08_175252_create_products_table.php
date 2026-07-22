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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('name', 150);
            $table->string('sku', 50);
            $table->string('barcode', 50)->nullable();
            $table->text('description')->nullable();
            $table->decimal('selling_price', 15, 2);
            $table->decimal('tax_rate', 5, 2)->default(18.00); // 18% par défaut (TVA Sénégal)
            $table->decimal('alert_quantity', 10, 2)->default(10.00);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->unique(['company_id', 'sku']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
