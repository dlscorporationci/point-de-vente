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
        Schema::table('products', function (Blueprint $table) {
            $table->string('image_path', 255)->nullable()->after('status');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->string('image_path', 255)->nullable()->after('slug');
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->string('logo_path', 255)->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('image_path');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('image_path');
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('logo_path');
        });
    }
};
