<?php

namespace App\Services;

use Throwable;
use Illuminate\Database\QueryException;
use PDOException;

class ErrorSanitizer
{
    /**
     * Obtenir un message d'erreur sécurisé pour l'utilisateur / API.
     * Masque TOUJOURS les erreurs SQL, PDO et structures de base de données.
     *
     * @param Throwable $e
     * @param string|null $fallbackMessage
     * @return string
     */
    public static function sanitize(Throwable $e, ?string $fallbackMessage = null): string
    {
        if (self::isDatabaseError($e)) {
            return 'Une erreur de base de données est survenue. L\'opération a été annulée en toute sécurité.';
        }

        $msg = $e->getMessage();

        // En production (APP_DEBUG=false), si un message fallback est fourni ou si le message est vide
        if (!config('app.debug')) {
            return $fallbackMessage ?? 'Une erreur interne s\'est produite sur le serveur.';
        }

        return $msg ?: ($fallbackMessage ?? 'Une erreur s\'est produite.');
    }

    /**
     * Vérifier si l'exception est liée à la base de données ou à une syntaxe SQL.
     *
     * @param Throwable $e
     * @return bool
     */
    public static function isDatabaseError(Throwable $e): bool
    {
        if ($e instanceof QueryException || $e instanceof PDOException) {
            return true;
        }

        $lowerMsg = strtolower($e->getMessage());
        $sqlKeywords = [
            'sqlstate',
            'syntax error or access violation',
            'integrity constraint violation',
            'foreign key constraint',
            'column not found',
            'table or view not found',
            'base table or view not found',
            'duplicate entry',
            'connection refused',
            'access denied for user',
            'unknown database',
            'general error',
        ];

        foreach ($sqlKeywords as $keyword) {
            if (str_contains($lowerMsg, $keyword)) {
                return true;
            }
        }

        return false;
    }
}
