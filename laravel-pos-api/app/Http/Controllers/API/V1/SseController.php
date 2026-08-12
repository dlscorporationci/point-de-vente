<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\RealtimeEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * SseController — Server-Sent Events pour la synchronisation temps réel
 * 
 * SÉCURITÉ ABSOLUE :
 * - company_id toujours depuis auth()->user()->company_id (jamais depuis le client)
 * - branch_id vérifié contre les accès autorisés de l'utilisateur
 * - Middleware auth:sanctum obligatoire
 * 
 * FONCTIONNEMENT :
 * - Le client ouvre une connexion GET /api/v1/sse/stream
 * - Le serveur maintient la connexion ouverte (60 secondes max)
 * - Toutes les 2 secondes, il vérifie les nouveaux événements
 * - Si un événement arrive, il est envoyé au client
 * - Un heartbeat est envoyé toutes les 15 secondes (keep-alive)
 * - Après 60 secondes, le navigateur se reconnecte automatiquement (EventSource)
 * 
 * COMPATIBILITÉ Apache + Nginx :
 * - Headers X-Accel-Buffering: no (désactive le buffering Nginx)
 * - ob_flush() + flush() pour Apache
 * - Content-Type: text/event-stream obligatoire
 * 
 * OFFLINE-FIRST :
 * - Si SSE est indisponible, le PULL reste fonctionnel
 * - SSE n'est qu'un signal, jamais une source de vérité
 */
class SseController extends Controller
{
    /**
     * Durée maximale d'une connexion SSE (60 secondes).
     * Après quoi, EventSource du navigateur se reconnecte automatiquement.
     */
    private const MAX_DURATION_SECONDS = 60;

    /**
     * Intervalle de polling interne (vérification BDD).
     */
    private const POLL_INTERVAL_MS = 2000000; // 2 secondes en microsecondes

    /**
     * Intervalle heartbeat.
     */
    private const HEARTBEAT_INTERVAL_SECONDS = 15;

    /**
     * Ouvre le flux SSE pour l'utilisateur authentifié.
     * 
     * Route : GET /api/v1/sse/stream
     * Middleware : auth:sanctum, tenant
     */
    public function stream(Request $request): StreamedResponse
    {
        // Récupérer l'utilisateur depuis Sanctum (header Authorization ou paramètre ?token= de EventSource)
        $user = $request->user('sanctum');

        if (!$user && $request->query('token')) {
            $tokenStr = $request->query('token');
            $accessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($tokenStr);
            if ($accessToken && $accessToken->tokenable) {
                $user = $accessToken->tokenable;
            }
        }

        if (!$user) {
            abort(401, 'Non authentifié.');
        }

        // company_id TOUJOURS depuis le serveur (jamais depuis X-Company-ID du client)
        $companyId = (int) $user->company_id;
        $userId    = (int) $user->id;
        $branchId  = $user->branch_id ? (int) $user->branch_id : null;

        if (!$companyId) {
            abort(403, 'Entreprise non identifiée.');
        }

        // Curseur : dernier ID reçu (pour rattrapage)
        $lastEventId = (int) ($request->header('Last-Event-ID') ?? $request->query('lastEventId', 0));

        return new StreamedResponse(function () use ($companyId, $branchId, $userId, $lastEventId) {
            // 0. Débloquer la session PHP immédiatement pour ne pas bloquer les autres requêtes de l'utilisateur
            if (session_status() === PHP_SESSION_ACTIVE) {
                @session_write_close();
            }

            if (ob_get_level() > 0) {
                @ob_end_clean();
            }

            ignore_user_abort(false);

            $startTime     = time();
            $currentLastId = $lastEventId;

            // Padding 2KB pour forcer Nginx à désactiver le buffering FastCGI immédiatement
            echo ": " . str_repeat(" ", 2048) . "\n\n";

            // 1. Événement initial de connexion
            echo "event: connected\n";
            echo "data: " . json_encode([
                'status'     => 'connected',
                'company_id' => $companyId,
                'branch_id'  => $branchId,
                'user_id'    => $userId,
                'server_ts'  => now()->toISOString(),
            ]) . "\n\n";

            if (ob_get_level() > 0) @ob_flush();
            @flush();

            // 2. Boucle SSE de 15s max (verification toutes les 0.5s)
            while (true) {
                if (connection_aborted()) {
                    break;
                }

                if ((time() - $startTime) >= 15) {
                    break;
                }

                try {
                    $events = RealtimeEvent::getForUser($companyId, $branchId, $userId, $currentLastId);

                    foreach ($events as $event) {
                        if ((int) $event->company_id === $companyId) {
                            $payload = is_array($event->payload) ? $event->payload : json_decode($event->payload, true);

                            echo "id: {$event->id}\n";
                            echo "event: {$event->event_type}\n";
                            echo "data: " . json_encode($payload) . "\n\n";

                            $currentLastId = $event->id;

                            if (ob_get_level() > 0) @ob_flush();
                            @flush();
                        }
                    }
                } catch (\Throwable $e) {
                    Log::warning('SSE stream error', ['error' => $e->getMessage(), 'user_id' => $userId]);
                }

                // Pause de 0.5 seconde (500ms) pour une ultra-réactivité sans bloquer
                usleep(500000);
            }

            // 3. Signal de reconnexion propre sans déclencher d'erreur EventSource
            echo "event: reconnect\n";
            echo "data: " . json_encode(['reason' => 'cycle_complete', 'last_id' => $currentLastId]) . "\n\n";

            if (ob_get_level() > 0) @ob_flush();
            @flush();

        }, 200, [
            'Content-Type'                 => 'text/event-stream',
            'Cache-Control'                => 'no-cache, no-store, must-revalidate',
            'Connection'                   => 'keep-alive',
            'X-Accel-Buffering'            => 'no',
            'Access-Control-Allow-Origin'  => '*',
            'Access-Control-Allow-Headers' => 'Authorization, X-Company-ID, X-Branch-ID, Last-Event-ID',
        ]);
    }
}
