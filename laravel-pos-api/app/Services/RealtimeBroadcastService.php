<?php

namespace App\Services;

use App\Models\RealtimeEvent;
use Illuminate\Support\Facades\Log;

/**
 * RealtimeBroadcastService
 * 
 * Service central de diffusion SSE multi-tenant.
 * 
 * RÈGLE ABSOLUE :
 * - company_id est toujours imposé par le serveur, jamais par le client
 * - Un événement ne peut jamais traverser les frontières d'une entreprise
 * - Les payloads ne contiennent jamais de données sensibles (mots de passe,
 *   tokens, données financières brutes d'autres entreprises)
 * 
 * ARCHITECTURE :
 * Action → Controller → DB::transaction() → MySQL → Event → Listener
 *       → RealtimeBroadcastService::push() → realtime_events (BDD)
 *       → SseController (polling) → EventSource navigateur
 *       → RealtimeService.js → useRealtime hook → PULL ciblé → Dexie → React
 */
class RealtimeBroadcastService
{
    /**
     * Durée de vie par défaut des événements en secondes (5 minutes).
     * Après cette durée, l'événement est supprimé et ne sera plus distribué.
     */
    private const TTL_SECONDS = 300;

    /**
     * Pousse un événement temps réel dans la file SSE.
     * 
     * @param string   $eventType  Type d'événement ('sale_created', 'stock_updated', ...)
     * @param int      $companyId  ID de l'entreprise (SOURCE DE VÉRITÉ : toujours depuis le serveur)
     * @param int|null $branchId   ID de la boutique (null = toutes les boutiques de l'entreprise)
     * @param array    $payload    Données publiques de l'événement (non sensibles)
     * @param int[]|null $userIds  Liste d'user_ids ciblés (null = tous les users autorisés de la boutique)
     * @param int|null $actorId    ID de l'utilisateur ayant déclenché l'action (pour exclure l'émetteur si besoin)
     */
    public static function push(
        string $eventType,
        int $companyId,
        ?int $branchId,
        array $payload,
        ?array $userIds = null,
        ?int $actorId = null
    ): void {
        try {
            // Toujours injecter company_id dans le payload pour double vérification côté client
            $securePayload = array_merge($payload, [
                'company_id' => $companyId,
                'branch_id'  => $branchId,
                'event_type' => $eventType,
                'actor_id'   => $actorId,
                'server_ts'  => now()->toISOString(),
            ]);

            RealtimeEvent::create([
                'company_id' => $companyId,
                'branch_id'  => $branchId,
                'user_ids'   => $userIds,
                'event_type' => $eventType,
                'payload'    => $securePayload,
                'created_at' => now(),
                'expires_at' => now()->addSeconds(self::TTL_SECONDS),
            ]);

        } catch (\Throwable $e) {
            // Ne jamais bloquer l'opération métier si SSE échoue
            Log::warning('RealtimeBroadcastService::push failed', [
                'event_type' => $eventType,
                'company_id' => $companyId,
                'branch_id'  => $branchId,
                'error'      => $e->getMessage(),
            ]);
        }
    }

    /**
     * Pousse un événement pour plusieurs boutiques simultanément.
     * Utile pour les transferts inter-boutiques.
     * 
     * @param string    $eventType
     * @param int       $companyId
     * @param int[]     $branchIds  Liste des branch_ids concernés
     * @param array     $payload
     * @param int|null  $actorId
     */
    public static function pushMultiBranch(
        string $eventType,
        int $companyId,
        array $branchIds,
        array $payload,
        ?int $actorId = null
    ): void {
        foreach ($branchIds as $branchId) {
            static::push($eventType, $companyId, $branchId, $payload, null, $actorId);
        }
    }

    /**
     * Pousse un événement ciblant toute l'entreprise (tous les branches).
     * Utilisé pour les modifications de produits, rôles, etc.
     */
    public static function pushCompanyWide(
        string $eventType,
        int $companyId,
        array $payload,
        ?int $actorId = null
    ): void {
        static::push($eventType, $companyId, null, $payload, null, $actorId);
    }
}
