<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Rendre supplier_id optionnel (nullable) sur la table purchases
        Schema::table('purchases', function (Blueprint $table) {
            $table->foreignId('supplier_id')->nullable()->change();
        });

        // Packs de Fournisseurs
        if (!Schema::hasTable('supplier_packs')) {
            Schema::create('supplier_packs', function (Blueprint $table) {
                $table->id();
                $table->uuid('uuid')->unique();
                $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
                $table->string('name');
                $table->text('description')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // Types de Fournisseurs
        if (!Schema::hasTable('supplier_types')) {
            Schema::create('supplier_types', function (Blueprint $table) {
                $table->id();
                $table->uuid('uuid')->unique();
                $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
                $table->foreignId('pack_id')->nullable()->constrained('supplier_packs')->onDelete('cascade');
                $table->string('name');
                $table->string('code')->nullable();
                $table->timestamps();
            });
        }

        // Pivot Types de Fournisseurs <-> Catégories
        if (!Schema::hasTable('supplier_type_categories')) {
            Schema::create('supplier_type_categories', function (Blueprint $table) {
                $table->id();
                $table->foreignId('supplier_type_id')->constrained('supplier_types')->onDelete('cascade');
                $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
                $table->timestamps();
            });
        }

        // Colonne optionnelle supplier_type_id sur la table suppliers
        if (!Schema::hasColumn('suppliers', 'supplier_type_id')) {
            Schema::table('suppliers', function (Blueprint $table) {
                $table->foreignId('supplier_type_id')->nullable()->constrained('supplier_types')->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropForeign(['supplier_type_id']);
            $table->dropColumn('supplier_type_id');
        });
        Schema::dropIfExists('supplier_type_categories');
        Schema::dropIfExists('supplier_types');
        Schema::dropIfExists('supplier_packs');
    }
};
