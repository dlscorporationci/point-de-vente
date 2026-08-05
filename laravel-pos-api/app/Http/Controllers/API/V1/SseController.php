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
            // Headers anti-buffering pour Apache + Nginx
            if (ob_get_level() > 0) {
                ob_end_clean();
            }

            // Désactiver le timeout PHP
            set_time_limit(0);
            ignore_user_abort(true);

            $startTime        = time();
            $lastHeartbeat    = time();
            $currentLastId    = $lastEventId;

            // Envoyer l'événement initial de connexion
            echo "event: connected\n";
            echo "data: " . json_encode([
                'status'     => 'connected',
                'company_id' => $companyId,
                'branch_id'  => $branchId,
                'user_id'    => $userId,
                'server_ts'  => now()->toISOString(),
            ]) . "\n\n";

            if (ob_get_level() > 0) ob_flush();
            flush();

            // Boucle principale SSE
            while (true) {
                // Vérifier si le client a fermé la connexion
                if (connection_aborted()) {
                    break;
                }

                // Vérifier la durée maximale
                $elapsed = time() - $startTime;
                if ($elapsed >= self::MAX_DURATION_SECONDS) {
                    // Signaler la fin de cette session SSE (EventSource se reconnecte)
                    echo "event: reconnect\n";
                    echo "data: " . json_encode(['reason' => 'session_end', 'last_id' => $currentLastId]) . "\n\n";
                    if (ob_get_level() > 0) ob_flush();
                    flush();
                    break;
                }

                // Purger les événements expirés (1 fois toutes les 30 secondes)
                if ($elapsed % 30 === 0 && $elapsed > 0) {
                    try { RealtimeEvent::purgeExpired(); } catch (\Throwable $e) {}
                }

                // Récupérer les nouveaux événements depuis la BDD
                try {
                    $events = RealtimeEvent::getForUser($companyId, $branchId, $userId, $currentLastId);

                    foreach ($events as $event) {
                        // VÉRIFICATION DE SÉCURITÉ FINALE :
                        // Un événement ne peut jamais être envoyé à une autre entreprise
                        if ((int) $event->company_id !== $companyId) {
                            Log::warning('SSE: Tentative de cross-tenant bloquée', [
                                'user_company'  => $companyId,
                                'event_company' => $event->company_id,
                                'user_id'       => $userId,
                            ]);
                            continue;
                        }

                        // Envoyer l'événement SSE
                        $payload = is_array($event->payload) ? $event->payload : json_decode($event->payload, true);

                        echo "id: {$event->id}\n";
                        echo "event: {$event->event_type}\n";
                        echo "data: " . json_encode($payload) . "\n\n";

                        $currentLastId = $event->id;

                        if (ob_get_level() > 0) ob_flush();
                        flush();

                        // Vérifier si le client est encore connecté après chaque envoi
                        if (connection_aborted()) {
                            break 2;
                        }
                    }
                } catch (\Throwable $e) {
                    Log::warning('SSE stream error', ['error' => $e->getMessage(), 'user_id' => $userId]);
                    // Ne pas fermer le stream pour une erreur BDD temporaire
                }

                // Heartbeat toutes les 15 secondes pour maintenir la connexion
                if (time() - $lastHeartbeat >= self::HEARTBEAT_INTERVAL_SECONDS) {
                    echo ": heartbeat " . time() . "\n\n";
                    if (ob_get_level() > 0) ob_flush();
                    flush();
                    $lastHeartbeat = time();
                }

                // Attendre avant le prochain poll (2 secondes)
                usleep(self::POLL_INTERVAL_MS);
            }

        }, 200, [
            'Content-Type'      => 'text/event-stream',
            'Cache-Control'     => 'no-cache, no-store, must-revalidate',
            'X-Accel-Buffering' => 'no',    // Désactive buffering Nginx
            'Connection'        => 'keep-alive',
            'Access-Control-Allow-Origin'  => '*',
            'Access-Control-Allow-Headers' => 'Authorization, X-Company-ID, X-Branch-ID, Last-Event-ID',
        ]);
    }
}
