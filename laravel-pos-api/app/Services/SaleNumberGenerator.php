<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Models\Sale;

class SaleNumberGenerator
{
    /**
     * Génère de manière atomique et ultra-sécurisée le numéro de vente suivant pour une entreprise donnée.
     * 
     * SÉCURITÉ CONCURRENTE :
     * - Utilise la table `company_sale_sequences` avec verrou pessimiste `lockForUpdate()`.
     * - Boucle de tentative (retry loop) automatique en cas de collision SQL.
     * 
     * @param int $companyId
     * @param int|null $branchId
     * @return string Ex: "VTE-000123"
     */
    public static function generate(int $companyId, ?int $branchId = null): string
    {
        $maxAttempts = 5;
        $attempt = 0;

        while ($attempt < $maxAttempts) {
            $attempt++;

            try {
                // Recherche ou création avec verrouillage pessimiste lockForUpdate()
                $seqRecord = DB::table('company_sale_sequences')
                    ->where('company_id', $companyId)
                    ->where(function ($q) use ($branchId) {
                        if ($branchId) {
                            $q->where('branch_id', $branchId)->orWhereNull('branch_id');
                        } else {
                            $q->whereNull('branch_id');
                        }
                    })
                    ->lockForUpdate()
                    ->first();

                if (!$seqRecord) {
                    // Initialiser à partir du MAX actuel des ventes existantes en BDD
                    $maxId = Sale::where('company_id', $companyId)->max('id') ?? 0;
                    $nextSeq = $maxId + 1;

                    DB::table('company_sale_sequences')->insert([
                        'company_id'    => $companyId,
                        'branch_id'     => $branchId,
                        'last_sequence' => $nextSeq,
                        'created_at'    => now(),
                        'updated_at'    => now(),
                    ]);
                } else {
                    $nextSeq = (int) $seqRecord->last_sequence + 1;

                    DB::table('company_sale_sequences')
                        ->where('id', $seqRecord->id)
                        ->update([
                            'last_sequence' => $nextSeq,
                            'updated_at'    => now(),
                        ]);
                }

                $candidateNumber = 'VTE-' . str_pad($nextSeq, 6, '0', STR_PAD_LEFT);

                // Vérifier s'il n'existe pas déjà en BDD (filet de sécurité)
                $exists = Sale::where('company_id', $companyId)
                    ->where('sale_number', $candidateNumber)
                    ->exists();

                if (!$exists) {
                    return $candidateNumber;
                }

                // Si collision détectée (ex: lors d'une migration initiale), incrémenter manuellement
                $maxExisting = Sale::where('company_id', $companyId)->max('id') ?? 0;
                $fallbackSeq = $maxExisting + $attempt;
                
                if ($seqRecord) {
                    DB::table('company_sale_sequences')
                        ->where('id', $seqRecord->id)
                        ->update(['last_sequence' => $fallbackSeq, 'updated_at' => now()]);
                }

                return 'VTE-' . str_pad($fallbackSeq, 6, '0', STR_PAD_LEFT);

            } catch (\Throwable $e) {
                if ($attempt >= $maxAttempts) {
                    // Fallback ultime déterministe avec horodatage + microsecondes
                    return 'VTE-' . strtoupper(substr(md5(microtime() . rand(1000, 9999)), 0, 8));
                }
                usleep(10000); // Attendre 10ms avant de réessayer
            }
        }

        return 'VTE-' . strtoupper(substr(md5(microtime() . rand(1000, 9999)), 0, 8));
    }
}
