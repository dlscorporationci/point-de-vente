<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use App\Models\Company;
use App\Models\Branch;
use App\Models\User;

class ExcelExportService
{
    /**
     * Génère un fichier Excel multi-feuilles structuré à partir d'un contrat de document et des données.
     */
    public function generateExcel(array $contract, array $data, ?Company $company, ?Branch $branch, ?User $user): string
    {
        $spreadsheet = new Spreadsheet();
        
        $companyName  = $company ? $company->name : 'ApexPOS Enterprise';
        $companyCode  = $company ? $company->code : '';
        $branchName   = $branch ? $branch->name : 'Toutes les boutiques';
        $userName     = $user ? $user->name : 'Système';
        $generatedAt  = now()->format('d/m/Y H:i:s');
        $documentUuid = $data['document_uuid'] ?? (string) \Illuminate\Support\Str::uuid();
        $title        = $contract['title'] ?? 'Rapport Documentaire';

        // ═════════════════════════════════════════════════════════════════════
        // FEUILLE 1 : INFORMATIONS GÉNÉRALES
        // ═════════════════════════════════════════════════════════════════════
        $sheetInfo = $spreadsheet->getActiveSheet();
        $sheetInfo->setTitle('INFORMATIONS');

        $sheetInfo->setCellValue('A1', 'APEXPOS ENTERPRISE — INFORMATIONS DU RAPPORT');
        $sheetInfo->getStyle('A1')->getFont()->setBold(true)->setSize(14)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('1E3A8A'));

        $infoData = [
            ['Propriété', 'Valeur'],
            ['Titre du Rapport', $title],
            ['Entreprise', $companyName],
            ['Code Entreprise', $companyCode],
            ['Boutique / Succursale', $branchName],
            ['Date de Génération', $generatedAt],
            ['Généré par', $userName],
            ['Identifiant Unique (UUID)', $documentUuid],
            ['Format', 'Excel (.xlsx) Multi-Feuilles'],
            ['Données serveur certifiées', empty($data['is_offline_local_data']) ? 'OUI' : 'NON (Données locales de caisse)'],
        ];

        $sheetInfo->fromArray($infoData, null, 'A3');
        $sheetInfo->getStyle('A3:B3')->getFont()->setBold(true);
        $sheetInfo->getStyle('A3:B3')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('1E293B');
        $sheetInfo->getStyle('A3:B3')->getFont()->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FFFFFF'));

        foreach (range('A', 'B') as $col) {
            $sheetInfo->getColumnDimension($col)->setAutoSize(true);
        }

        // ═════════════════════════════════════════════════════════════════════
        // FEUILLE 2 : DONNÉES DÉTAILLÉES
        // ═════════════════════════════════════════════════════════════════════
        $sheetData = $spreadsheet->createSheet();
        $sheetData->setTitle('DONNÉES DÉTAILLÉES');

        $columns = $contract['columns'] ?? [];
        $rows    = $data['rows'] ?? [];

        // Titres des colonnes
        $colIndex = 1;
        foreach ($columns as $col) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex);
            $sheetData->setCellValue("{$colLetter}1", $col['label']);
            $colIndex++;
        }

        $lastColLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(count($columns) ?: 1);
        if (count($columns) > 0) {
            $sheetData->getStyle("A1:{$lastColLetter}1")->getFont()->setBold(true);
            $sheetData->getStyle("A1:{$lastColLetter}1")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('1E293B');
            $sheetData->getStyle("A1:{$lastColLetter}1")->getFont()->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FFFFFF'));
        }

        // Lignes de données
        $rowIndex = 2;
        foreach ($rows as $row) {
            $cIndex = 1;
            foreach ($columns as $col) {
                $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($cIndex);
                $val = $row[$col['key']] ?? '';
                if (is_array($val)) {
                    $val = json_encode($val);
                }
                $sheetData->setCellValue("{$colLetter}{$rowIndex}", $val);
                $cIndex++;
            }
            $rowIndex++;
        }

        // Auto-fit des colonnes
        for ($i = 1; $i <= max(1, count($columns)); $i++) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($i);
            $sheetData->getColumnDimension($colLetter)->setAutoSize(true);
        }

        // ═════════════════════════════════════════════════════════════════════
        // FEUILLE 3 : STATISTIQUES & RÉSUMÉ
        // ═════════════════════════════════════════════════════════════════════
        $sheetStats = $spreadsheet->createSheet();
        $sheetStats->setTitle('SYNTHÈSE & STATISTIQUES');

        $sheetStats->setCellValue('A1', 'SYNTHÈSE ET RECAPITULATIF FINANCIER');
        $sheetStats->getStyle('A1')->getFont()->setBold(true)->setSize(13)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('1E3A8A'));

        $totals = $data['totals'] ?? [];
        $statsRows = [['Indicateur / Clé', 'Valeur (FCFA / Unités)']];
        foreach ($totals as $k => $v) {
            $statsRows[] = [$k, $v];
        }

        $sheetStats->fromArray($statsRows, null, 'A3');
        $sheetStats->getStyle('A3:B3')->getFont()->setBold(true);
        $sheetStats->getStyle('A3:B3')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('3B82F6');
        $sheetStats->getStyle('A3:B3')->getFont()->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FFFFFF'));

        foreach (range('A', 'B') as $col) {
            $sheetStats->getColumnDimension($col)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);
        
        ob_start();
        $writer->save('php://output');
        return ob_get_clean();
    }
}
