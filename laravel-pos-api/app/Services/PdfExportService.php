<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Company;
use App\Models\Branch;
use App\Models\User;

class PdfExportService
{
    /**
     * Génère un fichier PDF à partir d'un contrat de document et de ses données.
     */
    public function generatePdf(array $contract, array $data, ?Company $company, ?Branch $branch, ?User $user): string
    {
        $companyName  = $company ? $company->name : 'ApexPOS Enterprise';
        $companyCode  = $company ? $company->code : '';
        $companyLogo  = $company ? $company->logo_path : null;
        $branchName   = $branch ? $branch->name : 'Toutes les boutiques';
        $userName     = $user ? $user->name : 'Système';
        $generatedAt  = now()->format('d/m/Y H:i:s');
        $documentUuid = $data['document_uuid'] ?? (string) \Illuminate\Support\Str::uuid();
        $title        = $contract['title'] ?? 'Rapport Documentaire';
        $subtitle     = $contract['subtitle'] ?? '';

        $html = view('documents.pdf_template', [
            'companyName'  => $companyName,
            'companyCode'  => $companyCode,
            'companyLogo'  => $companyLogo,
            'branchName'   => $branchName,
            'userName'     => $userName,
            'generatedAt'  => $generatedAt,
            'documentUuid' => $documentUuid,
            'title'        => $title,
            'subtitle'     => $subtitle,
            'columns'      => $contract['columns'] ?? [],
            'rows'         => $data['rows'] ?? [],
            'totals'       => $data['totals'] ?? [],
            'stats'        => $data['stats'] ?? [],
            'filters'      => $data['filters'] ?? [],
        ])->render();

        $pdf = Pdf::loadHTML($html)
            ->setPaper('a4', 'portrait')
            ->setOption('isRemoteEnabled', true);

        return $pdf->output();
    }
}
