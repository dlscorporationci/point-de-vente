<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ajout des champs de branding personnalisé par entreprise :
     * - slogan : texte affiché dans la navbar et l'onglet navigateur
     * - favicon_path : chemin du favicon personnalisé (optionnel)
     */
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->string('slogan', 255)->nullable()->after('logo_path');
            $table->string('favicon_path', 255)->nullable()->after('slogan');
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['slogan', 'favicon_path']);
        });
    }
};
