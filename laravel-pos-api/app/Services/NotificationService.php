<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * Envoyer/enregistrer UNE notification système ciblée avec sécurité par
     * entreprise, boutique, rôle et permission.
     */
    public static function send(
        int $companyId,
        ?int $branchId,
        ?int $userId,
        string $type,
        string $title,
        string $message,
        string $priority = 'info',
        ?string $permissionRequired = null,
        ?string $targetRoute = null,
        ?array $data = null,
        ?int $actorId = null
    ): Notification {
        return Notification::create([
            'company_id'          => $companyId,
            'branch_id'           => $branchId,
            'user_id'             => $userId,
            'actor_id'            => $actorId,
            'type'                => $type,
            'priority'            => in_array($priority, ['info', 'important', 'warning', 'critical']) ? $priority : 'info',
            'permission_required' => $permissionRequired,
            'target_route'        => $targetRoute,
            'title'               => $title,
            'message'             => $message,
            'data'                => $data,
        ]);
    }

    /**
     * Envoyer des notifications CIBLÉES à des utilisateurs spécifiques d'une
     * boutique, selon leurs rôles et leurs permissions.
     *
     * Logique :
     * - On identifie les utilisateurs de la boutique cible ayant un des rôles demandés
     * - On vérifie que chaque utilisateur a la permission requise
     * - On exclut l'acteur de l'action (il n'a pas besoin de se notifier lui-même)
     * - On peut personnaliser le message selon le rôle du destinataire
     *
     * @param int         $companyId          Entreprise concernée
     * @param int         $branchId           Boutique concernée
     * @param array       $targetRoles        Rôles autorisés à recevoir (ex: ['admin','gerant'])
     * @param string      $requiredPermission Permission nécessaire pour recevoir (ex: 'sales.view')
     * @param string      $type               Type de notification
     * @param string      $title              Titre de la notification
     * @param string      $message            Message pour les rôles avec pleins droits
     * @param string      $priority           Priorité (info, important, warning, critical)
     * @param array|null  $data               Données JSON supplémentaires
     * @param int|null    $actorId            ID de l'auteur de l'action (exclu des destinataires)
     * @param string|null $targetRoute        Route frontend cible (pour navigation directe)
     * @param string|null $restrictedMessage  Message alternatif pour les rôles restreints
     * @param array       $restrictedRoles    Rôles qui reçoivent le message restreint
     * @param array       $excludeUserIds     IDs utilisateurs à exclure explicitement
     */
    public static function notifyBranchUsers(
        int    $companyId,
        int    $branchId,
        array  $targetRoles,
        string $requiredPermission,
        string $type,
        string $title,
        string $message,
        string $priority = 'info',
        ?array $data = null,
        ?int   $actorId = null,
        ?string $targetRoute = null,
        ?string $restrictedMessage = null,
        array  $restrictedRoles = [],
        array  $excludeUserIds = []
    ): void {
        // Récupérer tous les utilisateurs de la boutique ayant les bons rôles
        $users = User::with('role')
            ->where('company_id', $companyId)
            ->where('status', 'active')
            ->whereHas('role', fn ($q) => $q->whereIn('slug', $targetRoles))
            ->where(function ($q) use ($branchId) {
                // Utilisateur principal de la boutique OU accès global entreprise (branch_id null) OU assigné via user_branches
                $q->where('branch_id', $branchId)
                  ->orWhereNull('branch_id')
                  ->orWhereHas('branches', fn ($b) => $b->where('branches.id', $branchId));
            })
            ->get();

        foreach ($users as $user) {
            // Ne pas notifier les utilisateurs explicitement exclus
            if (in_array($user->id, $excludeUserIds)) {
                continue;
            }

            // Vérifier que l'utilisateur a la permission requise
            if (!$user->hasPermission($requiredPermission)) {
                continue;
            }

            // Déterminer le message selon le rôle du destinataire
            $roleSlug = $user->role ? $user->role->slug : '';
            $finalMessage = (!empty($restrictedRoles) && in_array($roleSlug, $restrictedRoles) && $restrictedMessage !== null)
                ? $restrictedMessage
                : $message;

            static::send(
                $companyId,
                $branchId,
                $user->id,          // ← Destinataire ciblé (pas null)
                $type,
                $title,
                $finalMessage,
                $priority,
                $requiredPermission,
                $targetRoute,
                $data,
                $actorId
            );
        }
    }

    /**
     * Notifier les utilisateurs de PLUSIEURS boutiques (ex: pour les transferts
     * inter-boutiques). Chaque boutique reçoit son propre message.
     *
     * @param array $notifications Tableau de configurations par boutique :
     *   [
     *     [
     *       'branch_id'          => int,
     *       'roles'              => array,
     *       'permission'         => string,
     *       'message'            => string,
     *       'restricted_message' => string|null,
     *       'restricted_roles'   => array,
     *     ],
     *     ...
     *   ]
     */
    public static function notifyMultipleBranches(
        int    $companyId,
        string $type,
        string $title,
        string $priority,
        ?array $data,
        ?int   $actorId,
        ?string $targetRoute,
        array  $notifications
    ): void {
        foreach ($notifications as $config) {
            static::notifyBranchUsers(
                companyId:          $companyId,
                branchId:           $config['branch_id'],
                targetRoles:        $config['roles'] ?? ['admin', 'gerant'],
                requiredPermission: $config['permission'],
                type:               $type,
                title:              $title,
                message:            $config['message'],
                priority:           $priority,
                data:               $data,
                actorId:            $actorId,
                targetRoute:        $targetRoute,
                restrictedMessage:  $config['restricted_message'] ?? null,
                restrictedRoles:    $config['restricted_roles'] ?? [],
            );
        }
    }
}
