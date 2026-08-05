<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * Modèle RealtimeEvent
 * 
 * Représente un événement dans la file d'attente SSE.
 * Chaque événement est strictement isolé par company_id.
 * 
 * @property int         $id
 * @property int         $company_id
 * @property int|null    $branch_id
 * @property array|null  $user_ids
 * @property string      $event_type
 * @property array       $payload
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon|null $expires_at
 */
class RealtimeEvent extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'company_id',
        'branch_id',
        'user_ids',
        'event_type',
        'payload',
        'created_at',
        'expires_at',
    ];

    protected $casts = [
        'user_ids'   => 'array',
        'payload'    => 'array',
        'created_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    /**
     * Récupère les événements non expirés destinés à un utilisateur spécifique.
     * 
     * SÉCURITÉ : company_id est toujours vérifié depuis le serveur.
     * Jamais depuis un paramètre client.
     * 
     * @param int      $companyId   Company_id de l'utilisateur authentifié
     * @param int|null $branchId    Branch_id de l'utilisateur
     * @param int      $userId      ID de l'utilisateur
     * @param int|null $afterId     Curseur SSE (dernier ID reçu)
     */
    public static function getForUser(
        int $companyId,
        ?int $branchId,
        int $userId,
        ?int $afterId = null
    ): \Illuminate\Database\Eloquent\Collection {
        $query = static::query()
            ->where('company_id', $companyId)
            ->where(function ($q) use ($branchId) {
                // Événements pour tous les branches OU pour cette branche spécifique
                $q->whereNull('branch_id')
                  ->orWhere('branch_id', $branchId);
            })
            ->where(function ($q) use ($userId) {
                // Événements pour tous les users OU pour cet utilisateur spécifique
                $q->whereNull('user_ids')
                  ->orWhereJsonContains('user_ids', $userId);
            })
            ->where(function ($q) {
                // Exclure les événements expirés
                $q->whereNull('expires_at')
                  ->orWhere('expires_at', '>', now());
            })
            ->orderBy('id', 'asc');

        if ($afterId !== null) {
            $query->where('id', '>', $afterId);
        }

        return $query->limit(50)->get();
    }

    /**
     * Purge les événements expirés (appelé lors de chaque stream SSE).
     * Suppression rapide avec DELETE direct pour les performances.
     */
    public static function purgeExpired(): int
    {
        return static::where('expires_at', '<', now())->delete();
    }

    /**
     * Purge les événements de plus de 10 minutes (filet de sécurité).
     */
    public static function purgeOld(): int
    {
        return static::where('created_at', '<', now()->subMinutes(10))->delete();
    }
}
