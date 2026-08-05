<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration : Table realtime_events
 * 
 * File d'attente SSE pour la diffusion temps réel.
 * Les événements sont isolés par company_id (multi-tenant strict).
 * Purgés automatiquement après 5 minutes.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('realtime_events', function (Blueprint $table) {
            $table->id();

            // Isolation Multi-Tenant absolue — jamais null
            $table->unsignedBigInteger('company_id');

            // Boutique cible — null = tous les branches de la company
            $table->unsignedBigInteger('branch_id')->nullable();

            // Ciblage utilisateurs spécifiques — null = tous les users autorisés
            $table->json('user_ids')->nullable();

            // Type d'événement (ex: 'cash_session_opened', 'sale_created')
            $table->string('event_type', 100);

            // Payload de l'événement (données publiques, non sensibles)
            $table->json('payload');

            // Timestamps
            $table->timestamp('created_at')->useCurrent();

            // Date d'expiration (purge automatique après 5 min)
            $table->timestamp('expires_at')->nullable()->index();

            // Index critiques pour les performances SSE
            $table->index(['company_id', 'branch_id', 'id']);
            $table->index(['company_id', 'id']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('realtime_events');
    }
};
