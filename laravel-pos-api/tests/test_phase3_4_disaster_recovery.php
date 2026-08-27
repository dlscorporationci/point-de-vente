<?php

/**
 * Phase 3.4 — Backup & Disaster Recovery Qualification Suite
 *
 * Scénarios :
 * MU-14-A : Préparation du Dataset de Test Isolé
 * MU-14-B : Exécution du Backup & Validation du fichier (Gzip, Taille, Code Retour)
 * MU-14-C : Simulation de Sinistre / Corruption des données source
 * MU-14-D : Restauration Sécurisée dans une Base Isolée (quincaillerie_pos_test_restore)
 * MU-14-E : Vérification d'Intégrité Strictement Identique (Nombre, Valeurs, Checksum)
 * MU-14-F : Protection Inviolable de la Base de Production (Refus de restauration sur quincaillerie_pos)
 * MU-14-Failures : Validation des cas d'échecs (Fichier inexistant, gzip corrompu, DB non autorisée)
 */

require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

$globalPassed = true;

function logTestHeader(string $title): void
{
    echo "\n=========================================================\n";
    echo "   {$title}\n";
    echo "=========================================================\n";
}

function logTestResult(string $testName, bool $passed, string $message = ''): void
{
    global $globalPassed;
    if ($passed) {
        echo "▶ {$testName}\n";
        echo "   \033[32m[PASS]\033[0m {$message}\n\n";
    } else {
        echo "▶ {$testName}\n";
        echo "   \033[31m[FAIL]\033[0m {$message}\n\n";
        $globalPassed = false;
    }
}

$prodDbName   = 'quincaillerie_pos';
$restoreDbName = 'quincaillerie_pos_test_restore';
$testTableName = 'phase3_disaster_recovery_test';

// Clean legacy test tables/databases before starting
DB::statement("DROP TABLE IF EXISTS `{$testTableName}`");
DB::statement("DROP DATABASE IF EXISTS `{$restoreDbName}`");


// ────────────────────────────────────────────────────────────────────────────
// MU-14-A — Préparation Dataset Isolé
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-14-A — Préparation du Dataset de Test Isolé');

DB::statement("CREATE TABLE `{$testTableName}` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(100) NOT NULL,
    `numeric_val` DECIMAL(10,2) NOT NULL,
    `created_at` DATETIME NOT NULL
)");

$insertedRecords = [
    ['title' => 'Article Disaster 1', 'numeric_val' => 1500.50, 'created_at' => '2026-08-26 12:00:00'],
    ['title' => 'Article Disaster 2', 'numeric_val' => 9900.00, 'created_at' => '2026-08-26 13:30:00'],
    ['title' => 'Article Disaster 3', 'numeric_val' => 450.75,  'created_at' => '2026-08-26 15:45:00'],
];

foreach ($insertedRecords as $row) {
    DB::table($testTableName)->insert($row);
}

$initialCount = DB::table($testTableName)->count();
$initialSum   = DB::table($testTableName)->sum('numeric_val');
$initialData  = array_map(fn($row) => (array)$row, DB::table($testTableName)->orderBy('id')->get()->toArray());
$initialHash  = md5(serialize($initialData));

logTestResult(
    'MU-14-A (Dataset Isolé) — Table et données de test créées avec checksum déterministe',
    $initialCount === 3 && $initialSum == 11851.25,
    "Enregistrements={$initialCount} | Somme={$initialSum} | Checksum={$initialHash}"
);


// ────────────────────────────────────────────────────────────────────────────
// MU-14-B — Backup Database
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-14-B — Exécution du Script de Sauvegarde');

$scriptBackup = __DIR__ . '/../scripts/backup_database.sh';
$outputBackup = [];
$exitCodeBackup = 0;

exec("DB_NAME={$prodDbName} bash " . escapeshellarg($scriptBackup) . " 2>&1", $outputBackup, $exitCodeBackup);
$backupOutputStr = implode("\n", $outputBackup);

// Retrouver le fichier généré dans storage/backups/
$backups = glob(__DIR__ . '/../storage/backups/apexpos_' . $prodDbName . '_*.sql.gz');
sort($backups);
$latestBackup = end($backups);

$backupExists = $latestBackup && file_exists($latestBackup);
$backupSize   = $backupExists ? filesize($latestBackup) : 0;
$gzipValid    = false;

if ($backupExists) {
    exec("gzip -t " . escapeshellarg($latestBackup) . " 2>&1", $gzipOut, $gzipCode);
    $gzipValid = ($gzipCode === 0);
}

$hasNoPasswordInLogs = !str_contains($backupOutputStr, 'DB_PASSWORD') && !str_contains($backupOutputStr, 'root');

logTestResult(
    'MU-14-B (Backup Database) — Sauvegarde exécutée avec succès (gzip valide, code 0, zéro secret)',
    $exitCodeBackup === 0 && $backupExists && $backupSize > 0 && $gzipValid && $hasNoPasswordInLogs,
    "Fichier=" . basename($latestBackup ?: 'none') . " | Taille={$backupSize} octets | CodeRetour={$exitCodeBackup}"
);


// ────────────────────────────────────────────────────────────────────────────
// MU-14-C — Simulation Disaster
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-14-C — Simulation de Disaster / Altération des Données');

// Altération / Suppression des données source
DB::table($testTableName)->where('id', 2)->update(['numeric_val' => 0]);
DB::table($testTableName)->where('id', 3)->delete();

$corruptedCount = DB::table($testTableName)->count();
$corruptedSum   = DB::table($testTableName)->sum('numeric_val');

logTestResult(
    'MU-14-C (Simulation Disaster) — Base source délibérément altérée',
    $corruptedCount === 2 && $corruptedSum == 1500.50,
    "Enregistrements avant=3 -> après={$corruptedCount} | Somme avant=11851.25 -> après={$corruptedSum}"
);


// ────────────────────────────────────────────────────────────────────────────
// MU-14-D — Restore Isolé dans quincaillerie_pos_test_restore
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-14-D — Restauration dans une Base Isolée de Test');

$scriptRestore = __DIR__ . '/../scripts/restore_database.sh';
$outputRestore = [];
$exitCodeRestore = 0;

exec("bash " . escapeshellarg($scriptRestore) . " " . escapeshellarg($latestBackup) . " " . escapeshellarg($restoreDbName) . " 2>&1", $outputRestore, $exitCodeRestore);

logTestResult(
    'MU-14-D (Restore Isolé) — Restauration réussie dans quincaillerie_pos_test_restore',
    $exitCodeRestore === 0,
    "CodeRetour={$exitCodeRestore} | Base Cible={$restoreDbName}"
);


// ────────────────────────────────────────────────────────────────────────────
// MU-14-E — Vérification Intégrité Strictement Identique
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-14-E — Vérification d\'Intégrité Strictement Identique');

$restoredData = DB::select("SELECT * FROM `{$restoreDbName}`.`{$testTableName}` ORDER BY id");
$restoredDataArray = array_map(fn($row) => (array)$row, $restoredData);
$restoredHash = md5(serialize($restoredDataArray));
$restoredCount = count($restoredDataArray);
$restoredSum = array_reduce($restoredDataArray, fn($acc, $item) => $acc + (float)$item['numeric_val'], 0);

$integrityMatch = ($initialHash === $restoredHash) && ($initialCount === $restoredCount) && (abs($initialSum - $restoredSum) < 0.01);

logTestResult(
    'MU-14-E (Intégrité Restauration) — Données restaurées 100% identiques (Nombre, Valeurs, Checksum)',
    $integrityMatch,
    "Count initial=3, restauré={$restoredCount} | Checksum initial={$initialHash}, restauré={$restoredHash}"
);


// ────────────────────────────────────────────────────────────────────────────
// MU-14-F — Protection Inviolable de la Base de Production
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('MU-14-F — Protection Inviolable de la Base de Production');

$outputProdBlock = [];
$exitCodeProdBlock = 0;

// Tentative explicite de restaurer dans quincaillerie_pos (doit être REFUSÉ)
exec("bash " . escapeshellarg($scriptRestore) . " " . escapeshellarg($latestBackup) . " " . escapeshellarg($prodDbName) . " 2>&1", $outputProdBlock, $exitCodeProdBlock);
$prodBlockOutputStr = implode("\n", $outputProdBlock);

$isBlocked = ($exitCodeProdBlock !== 0) && str_contains($prodBlockOutputStr, 'STRICTLY FORBIDDEN');

logTestResult(
    'MU-14-F (Protection Production) — Tentative de restauration vers quincaillerie_pos BLOQUÉE avec succès',
    $isBlocked,
    "CodeRetour={$exitCodeProdBlock} (attendu != 0) | Message=" . trim($outputProdBlock[1] ?? 'Blocked')
);


// ────────────────────────────────────────────────────────────────────────────
// Cas d'Échecs Supplémentaires
// ────────────────────────────────────────────────────────────────────────────
logTestHeader('Cas d\'Échecs Supplémentaires (Edge Cases)');

// 1. Fichier de backup inexistant
exec("bash " . escapeshellarg($scriptRestore) . " /tmp/non_existent_file.sql.gz " . escapeshellarg($restoreDbName) . " 2>&1", $out1, $code1);
logTestResult('Cas Échec 1 — Backup inexistant refusé', $code1 !== 0, "CodeRetour={$code1}");

// 2. Fichier gzip corrompu
$corruptFile = __DIR__ . '/../storage/backups/corrupted_test.sql.gz';
file_put_contents($corruptFile, 'THIS IS NOT GZIP DATA');
exec("bash " . escapeshellarg($scriptRestore) . " " . escapeshellarg($corruptFile) . " " . escapeshellarg($restoreDbName) . " 2>&1", $out2, $code2);
@unlink($corruptFile);
logTestResult('Cas Échec 2 — Fichier gzip corrompu refusé', $code2 !== 0, "CodeRetour={$code2}");

// 3. Base cible non autorisée
exec("bash " . escapeshellarg($scriptRestore) . " " . escapeshellarg($latestBackup) . " random_unauthorized_db 2>&1", $out3, $code3);
logTestResult('Cas Échec 3 — Base cible non autorisée refusée', $code3 !== 0, "CodeRetour={$code3}");


// ── Nettoyage des Fixtures de Test ──────────────────────────────────────────
DB::statement("DROP TABLE IF EXISTS `{$testTableName}`");
DB::statement("DROP DATABASE IF EXISTS `{$restoreDbName}`");


// ── Bilan Final Phase 3.4 ────────────────────────────────────────────────────
echo "\n=========================================================\n";
if ($globalPassed) {
    echo " \033[32mRÉSULTAT PHASE 3.4 : TOUS LES TESTS MU-14 ONT RÉUSSI ! 🎉\033[0m\n";
} else {
    echo " \033[31mRÉSULTAT PHASE 3.4 : CERTAINS TESTS ONT ÉCHOUÉ. ❌\033[0m\n";
}
echo "=========================================================\n";

if (!$globalPassed) {
    exit(1);
}
