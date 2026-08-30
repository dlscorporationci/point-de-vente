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

        $spreadsheet = new Spreadsheet();
        
        $companyName  = $company ? $company->name : 'ApexPOS Enterprise';
        $companyCode  = $company ? $company->code : '';
        $branchName   = $branch ? $branch->name : 'Toutes les boutiques';
        $userName     = $user ? $user->name : 'Système';
        $generatedAt  = now()->format('d/m/Y H:i:s');
        $documentUuid = $data['document_uuid'] ?? (string) \Illuminate\Support\Str::uuid();
        $title        = $contract['title'] ?? 'Rapport Documentaire';

        $columns = $contract['columns'] ?? [];
        $rows    = $data['rows'] ?? [];
        $totals  = $data['totals'] ?? [];

        // ═════════════════════════════════════════════════════════════════════
        // FEUILLE 1 : DONNÉES DÉTAILLÉES (FEUILLE ACTIVE DE DÉMARRAGE)
        // ═════════════════════════════════════════════════════════════════════
        $sheetData = $spreadsheet->getActiveSheet();
        $sheetData->setTitle('DONNÉES DÉTAILLÉES');

        // En-tête du Rapport
        $sheetData->setCellValue('A1', mb_strtoupper($title, 'UTF-8'));
        $sheetData->getStyle('A1')->getFont()->setBold(true)->setSize(14)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('1E3A8A'));
        $sheetData->setCellValue('A2', "Entreprise : {$companyName} | Boutique : {$branchName} | Date : {$generatedAt} | Nombre d'enregistrements : " . count($rows));
        $sheetData->getStyle('A2')->getFont()->setItalic(true)->setSize(10)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('64748B'));

        // Titres des colonnes (Ligne 4)
        $startRow = 4;
        $colIndex = 1;
        foreach ($columns as $col) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex);
            $sheetData->setCellValue("{$colLetter}{$startRow}", $col['label']);
            $colIndex++;
        }

        $lastColLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(max(1, count($columns)));
        if (count($columns) > 0) {
            $sheetData->getStyle("A{$startRow}:{$lastColLetter}{$startRow}")->getFont()->setBold(true);
            $sheetData->getStyle("A{$startRow}:{$lastColLetter}{$startRow}")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('1E293B');
            $sheetData->getStyle("A{$startRow}:{$lastColLetter}{$startRow}")->getFont()->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FFFFFF'));
        }

        // Remplissage des lignes de données
        $rowIndex = $startRow + 1;
        foreach ($rows as $row) {
            $cIndex = 1;
            foreach ($columns as $col) {
                $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($cIndex);
                $val = $row[$col['key']] ?? '';
                if (is_array($val)) {
                    $val = json_encode($val, JSON_UNESCAPED_UNICODE);
                }
                $sheetData->setCellValue("{$colLetter}{$rowIndex}", $val);
                $cIndex++;
            }
            $rowIndex++;
        }

        // Ligne de Totaux au bas du tableau de données si disponible
        if (!empty($totals)) {
            $totalsRowIndex = $rowIndex + 1;
            $sheetData->setCellValue("A{$totalsRowIndex}", 'SYNTHÈSE / TOTAUX :');
            $sheetData->getStyle("A{$totalsRowIndex}")->getFont()->setBold(true);

            $tIndex = 2;
            foreach ($totals as $totLabel => $totVal) {
                $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($tIndex);
                $sheetData->setCellValue("{$colLetter}{$totalsRowIndex}", "{$totLabel}: {$totVal}");
                $sheetData->getStyle("{$colLetter}{$totalsRowIndex}")->getFont()->setBold(true);
                $tIndex++;
            }
            $sheetData->getStyle("A{$totalsRowIndex}:{$lastColLetter}{$totalsRowIndex}")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('E2E8F0');
        }

        // Ajustement automatique des colonnes
        for ($i = 1; $i <= max(1, count($columns)); $i++) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($i);
            $sheetData->getColumnDimension($colLetter)->setAutoSize(true);
        }

        // ═════════════════════════════════════════════════════════════════════
        // FEUILLE 2 : INFORMATIONS & CERTIFICATION DU DOCUMENT
        // ═════════════════════════════════════════════════════════════════════
        $sheetInfo = $spreadsheet->createSheet();
        $sheetInfo->setTitle('INFORMATIONS & AUDIT');

        $sheetInfo->setCellValue('A1', 'INFORMATIONS DE CERTIFICATION ET D’AUDIT APEXPOS');
        $sheetInfo->getStyle('A1')->getFont()->setBold(true)->setSize(13)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('1E3A8A'));

        $infoData = [
            ['Propriété', 'Valeur'],
            ['Titre du Rapport', $title],
            ['Entreprise', $companyName],
            ['Code Entreprise', $companyCode],
            ['Boutique / Succursale', $branchName],
            ['Date de Génération', $generatedAt],
            ['Généré par', $userName],
            ['Identifiant Unique (UUID)', $documentUuid],
            ['Format Fichier', 'Microsoft Excel (.xlsx)'],
        ];

        $sheetInfo->fromArray($infoData, null, 'A3');
        $sheetInfo->getStyle('A3:B3')->getFont()->setBold(true);
        $sheetInfo->getStyle('A3:B3')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('1E293B');
        $sheetInfo->getStyle('A3:B3')->getFont()->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FFFFFF'));

        foreach (range('A', 'B') as $col) {
            $sheetInfo->getColumnDimension($col)->setAutoSize(true);
        }

        // Sélectionner la première feuille de données comme feuille active par défaut lors de l'ouverture d'Excel
        $spreadsheet->setActiveSheetIndex(0);

        $writer = new Xlsx($spreadsheet);
        
        ob_start();
        $writer->save('php://output');
        return ob_get_clean();
    }
}
