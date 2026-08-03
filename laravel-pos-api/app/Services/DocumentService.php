<?php

namespace App\Services;

use App\Models\GeneratedDocument;
use App\Models\Company;
use App\Models\Branch;
use App\Models\User;
use App\Models\Sale;
use App\Models\Product;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Supplier;
use App\Models\Purchase;
use App\Models\BranchProduct;
use App\Models\CashSession;
use App\Models\AuditLog;
use App\Models\StockTransfer;
use App\Models\CommunicationLog;
use App\Models\MaintenanceMode;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class DocumentService
{
    protected PdfExportService $pdfService;
    protected ExcelExportService $excelService;

    public function __construct(PdfExportService $pdfService, ExcelExportService $excelService)
    {
        $this->pdfService   = $pdfService;
        $this->excelService = $excelService;
    }

    /**
     * Obtenir les définitions/contrats de structure de tous les types de documents supportés.
     */
    public function getDocumentContracts(): array
    {
        return [
            'sales_report' => [
                'type'     => 'sales_report',
                'title'    => 'RAPPORT DES VENTES',
                'subtitle' => 'Synthèse et liste détaillée des transactions financières de vente',
                'columns'  => [
                    ['key' => 'date',           'label' => 'Date & Heure',   'align' => 'left'],
                    ['key' => 'reference',      'label' => 'N° Ticket',       'align' => 'left'],
                    ['key' => 'customer',       'label' => 'Client',          'align' => 'left'],
                    ['key' => 'cashier',        'label' => 'Caissier',        'align' => 'left'],
                    ['key' => 'payment_method', 'label' => 'Paiement',        'align' => 'center'],
                    ['key' => 'subtotal',       'label' => 'Sous-total (FCFA)', 'align' => 'right'],
                    ['key' => 'discount',       'label' => 'Remise (FCFA)',  'align' => 'right'],
                    ['key' => 'tax',            'label' => 'TVA (FCFA)',     'align' => 'right'],
                    ['key' => 'total',          'label' => 'Total TTC (FCFA)', 'align' => 'right'],
                ],
            ],
            'stock_status' => [
                'type'     => 'stock_status',
                'title'    => 'ÉTAT GLOBAL DES STOCKS',
                'subtitle' => 'Inventaire des quantités disponibles par article et valorisation du stock',
                'columns'  => [
                    ['key' => 'sku',            'label' => 'SKU / Code',     'align' => 'left'],
                    ['key' => 'name',           'label' => 'Désignation Article', 'align' => 'left'],
                    ['key' => 'category',       'label' => 'Catégorie',      'align' => 'left'],
                    ['key' => 'quantity',       'label' => 'Qté Disponible', 'align' => 'center'],
                    ['key' => 'alert_quantity', 'label' => 'Seuil Alerte',   'align' => 'center'],
                    ['key' => 'cost_price',     'label' => 'Prix d\'Achat (FCFA)', 'align' => 'right'],
                    ['key' => 'selling_price',  'label' => 'Prix Vente (FCFA)', 'align' => 'right'],
                    ['key' => 'stock_value',    'label' => 'Valeur Stock (FCFA)', 'align' => 'right'],
                    ['key' => 'status',         'label' => 'Alerte Statut',  'align' => 'center'],
                ],
            ],
            'products_list' => [
                'type'     => 'products_list',
                'title'    => 'CATALOGUE DES PRODUITS',
                'subtitle' => 'Répertoire complet des articles référencés dans le système',
                'columns'  => [
                    ['key' => 'sku',           'label' => 'SKU',            'align' => 'left'],
                    ['key' => 'barcode',       'label' => 'Code-barres',     'align' => 'left'],
                    ['key' => 'name',          'label' => 'Nom Produit',    'align' => 'left'],
                    ['key' => 'category',      'label' => 'Catégorie',      'align' => 'left'],
                    ['key' => 'unit',          'label' => 'Unité',          'align' => 'center'],
                    ['key' => 'selling_price', 'label' => 'Prix Vente (FCFA)', 'align' => 'right'],
                    ['key' => 'cost_price',    'label' => 'Prix Achat (FCFA)', 'align' => 'right'],
                    ['key' => 'tax_rate',      'label' => 'TVA (%)',        'align' => 'center'],
                ],
            ],
            'customers_list' => [
                'type'     => 'customers_list',
                'title'    => 'LISTE ET CRÉDITS CLIENTS',
                'subtitle' => 'Coordonnées des clients et solde de leurs dettes/crédits',
                'columns'  => [
                    ['key' => 'name',       'label' => 'Nom Client',      'align' => 'left'],
                    ['key' => 'phone',      'label' => 'Téléphone',       'align' => 'left'],
                    ['key' => 'email',      'label' => 'E-mail',          'align' => 'left'],
                    ['key' => 'address',    'label' => 'Adresse',         'align' => 'left'],
                    ['key' => 'debt',       'label' => 'Dette Due (FCFA)', 'align' => 'right'],
                    ['key' => 'status',     'label' => 'Statut',          'align' => 'center'],
                ],
            ],
            'suppliers_list' => [
                'type'     => 'suppliers_list',
                'title'    => 'LISTE DES FOURNISSEURS',
                'subtitle' => 'Carnet d\'adresses des partenaires et fournisseurs de la boutique',
                'columns'  => [
                    ['key' => 'name',    'label' => 'Nom Fournisseur', 'align' => 'left'],
                    ['key' => 'contact', 'label' => 'Contact / Représentant', 'align' => 'left'],
                    ['key' => 'phone',   'label' => 'Téléphone',       'align' => 'left'],
                    ['key' => 'email',   'label' => 'E-mail',          'align' => 'left'],
                    ['key' => 'address', 'label' => 'Adresse',         'align' => 'left'],
                ],
            ],
            'cash_sessions' => [
                'type'     => 'cash_sessions',
                'title'    => 'SESSIONS ET RAPPORTS DE CAISSE',
                'subtitle' => 'Historique des ouvertures, fermetures et écarts financiers de caisse',
                'columns'  => [
                    ['key' => 'id',                'label' => 'N° Session',      'align' => 'left'],
                    ['key' => 'user',              'label' => 'Caissier',        'align' => 'left'],
                    ['key' => 'opened_at',         'label' => 'Ouverture',       'align' => 'left'],
                    ['key' => 'closed_at',         'label' => 'Fermeture',       'align' => 'left'],
                    ['key' => 'opening_cash',      'label' => 'Fond Caisse (FCFA)', 'align' => 'right'],
                    ['key' => 'theoretical_cash',  'label' => 'Théorique (FCFA)', 'align' => 'right'],
                    ['key' => 'closing_cash',      'label' => 'Compté (FCFA)',   'align' => 'right'],
                    ['key' => 'discrepancy',       'label' => 'Écart (FCFA)',    'align' => 'right'],
                    ['key' => 'status',            'label' => 'Statut',          'align' => 'center'],
                ],
            ],
            'audit_log' => [
                'type'     => 'audit_log',
                'title'    => 'JOURNAL D\'AUDIT ET SÉCURITÉ',
                'subtitle' => 'Traçabilité exhaustive des actions et modifications réalisées dans le système',
                'columns'  => [
                    ['key' => 'date',       'label' => 'Date & Heure',   'align' => 'left'],
                    ['key' => 'user',       'label' => 'Utilisateur',    'align' => 'left'],
                    ['key' => 'role',       'label' => 'Rôle',           'align' => 'center'],
                    ['key' => 'module',     'label' => 'Module / Entité', 'align' => 'left'],
                    ['key' => 'action',     'label' => 'Action Effet',   'align' => 'left'],
                    ['key' => 'ip',         'label' => 'Adresse IP',     'align' => 'left'],
                    ['key' => 'device',     'label' => 'Appareil',       'align' => 'left'],
                    ['key' => 'result',     'label' => 'Résultat',       'align' => 'center'],
                ],
            ],
        ];
    }

    /**
     * Génère et archive un document selon le contrat de données.
     */
    public function generateAndArchiveDocument(string $type, string $format, array $filters, Company $company, ?Branch $branch, ?User $user, ?array $customData = null): GeneratedDocument
    {
        $contracts = $this->getDocumentContracts();
        $contract  = $contracts[$type] ?? [
            'type'     => $type,
            'title'    => strtoupper(str_replace('_', ' ', $type)),
            'subtitle' => 'Rapport généré par le système ApexPOS',
            'columns'  => [
                ['key' => 'id', 'label' => 'ID', 'align' => 'left'],
                ['key' => 'name', 'label' => 'Libellé / Désignation', 'align' => 'left'],
                ['key' => 'date', 'label' => 'Date', 'align' => 'left'],
            ],
        ];

        // Charger les données si non transmises
        $data = $customData ?: $this->fetchDataForContract($type, $company, $branch, $filters);
        $data['document_uuid'] = (string) Str::uuid();

        // Générer les octets du fichier
        if ($format === 'xlsx') {
            $content = $this->excelService->generateExcel($contract, $data, $company, $branch, $user);
            $ext     = 'xlsx';
        } else {
            $content = $this->pdfService->generatePdf($contract, $data, $company, $branch, $user);
            $ext     = 'pdf';
        }

        // Définir le nom et chemin de stockage
        $cleanTitle = Str::slug($contract['title']);
        $fileName   = "{$type}_{$company->id}_" . time() . ".{$ext}";
        $relativeFolder = "documents/company_{$company->id}";
        $filePath       = "{$relativeFolder}/{$fileName}";

        // Enregistrer le fichier dans le disk public
        Storage::disk('public')->put($filePath, $content);
        $fileSize = strlen($content);

        // Créer l'enregistrement dans la table des documents générés
        $doc = GeneratedDocument::create([
            'uuid'          => $data['document_uuid'],
            'company_id'    => $company->id,
            'branch_id'     => $branch ? $branch->id : null,
            'user_id'       => $user ? $user->id : null,
            'document_type' => $type,
            'template_id'   => $type . '_template_v1',
            'format'        => $format,
            'title'         => $contract['title'],
            'file_name'     => $fileName,
            'file_path'     => '/storage/' . $filePath,
            'file_size'     => $fileSize,
            'filters'       => $filters,
            'metadata'      => [
                'rows_count'   => count($data['rows'] ?? []),
                'totals_count' => count($data['totals'] ?? []),
                'generated_by' => $user ? $user->name : 'Système',
            ],
            'status'        => 'generated',
        ]);

        return $doc;
    }

    /**
     * Extraire les données métier associées au type de document depuis la base SQL.
     */
    public function fetchDataForContract(string $type, Company $company, ?Branch $branch, array $filters): array
    {
        $rows   = [];
        $totals = [];

        switch ($type) {
            case 'sales_report':
                $query = Sale::where('company_id', $company->id)->with(['user', 'customer', 'branch']);
                if ($branch) {
                    $query->where('branch_id', $branch->id);
                }
                if (!empty($filters['start_date'])) {
                    $query->whereDate('created_at', '>=', $filters['start_date']);
                }
                if (!empty($filters['end_date'])) {
                    $query->whereDate('created_at', '<=', $filters['end_date']);
                }

                $sales = $query->orderBy('id', 'desc')->get();
                $sumTotal = 0; $sumTax = 0; $sumDiscount = 0;

                foreach ($sales as $s) {
                    $sumTotal    += floatval($s->total);
                    $sumTax      += floatval($s->tax);
                    $sumDiscount += floatval($s->discount);

                    $rows[] = [
                        'date'           => $s->created_at ? $s->created_at->format('d/m/Y H:i') : '',
                        'reference'      => $s->sale_number ?: $s->uuid,
                        'customer'       => $s->client_name ?: ($s->customer ? $s->customer->name : 'Client Comptant'),
                        'cashier'        => $s->user ? $s->user->name : 'Caissier',
                        'payment_method' => strtoupper($s->payment_method),
                        'subtotal'       => number_format($s->subtotal, 0, ',', ' '),
                        'discount'       => number_format($s->discount, 0, ',', ' '),
                        'tax'            => number_format($s->tax, 0, ',', ' '),
                        'total'          => number_format($s->total, 0, ',', ' '),
                    ];
                }

                $totals = [
                    'Nombre de ventes'     => count($sales),
                    'Total Remises'        => $sumDiscount,
                    'Total TVA Collectée'  => $sumTax,
                    'Chiffre d\'Affaires Global (TTC)' => $sumTotal,
                ];
                break;

            case 'stock_status':
                $query = Product::where('company_id', $company->id)->with(['category', 'branchProducts']);
                $products = $query->get();
                $totalValuation = 0; $totalItems = 0;

                foreach ($products as $p) {
                    $qty = 0;
                    if ($branch) {
                        $bp = $p->branchProducts->where('branch_id', $branch->id)->first();
                        $qty = $bp ? $bp->quantity : 0;
                    } else {
                        $qty = $p->branchProducts->sum('quantity');
                    }

                    $stockVal = $qty * floatval($p->cost_price);
                    $totalValuation += $stockVal;
                    $totalItems     += $qty;

                    $statusStr = ($qty <= intval($p->alert_quantity)) ? '🚨 ALERTE RUPTURE' : 'OK';

                    $rows[] = [
                        'sku'            => $p->sku,
                        'name'           => $p->name,
                        'category'       => $p->category ? $p->category->name : 'Général',
                        'quantity'       => $qty,
                        'alert_quantity' => $p->alert_quantity,
                        'cost_price'     => number_format($p->cost_price, 0, ',', ' '),
                        'selling_price'  => number_format($p->selling_price, 0, ',', ' '),
                        'stock_value'    => number_format($stockVal, 0, ',', ' '),
                        'status'         => $statusStr,
                    ];
                }

                $totals = [
                    'Nombre d\'articles référencés' => count($products),
                    'Quantité totale en stock'     => $totalItems,
                    'Valorisation du Stock (Achat)' => $totalValuation,
                ];
                break;

            case 'products_list':
                $products = Product::where('company_id', $company->id)->with('category')->get();
                foreach ($products as $p) {
                    $rows[] = [
                        'sku'           => $p->sku,
                        'barcode'       => $p->barcode ?: '—',
                        'name'          => $p->name,
                        'category'      => $p->category ? $p->category->name : 'Général',
                        'unit'          => $p->unit ?: 'unité',
                        'selling_price' => number_format($p->selling_price, 0, ',', ' '),
                        'cost_price'    => number_format($p->cost_price, 0, ',', ' '),
                        'tax_rate'      => $p->tax_rate . '%',
                    ];
                }
                $totals = ['Nombre de produits au catalogue' => count($products)];
                break;

            case 'customers_list':
                $customers = Customer::where('company_id', $company->id)->get();
                $totalDebt = 0;
                foreach ($customers as $c) {
                    $debt = floatval($c->debt || 0);
                    $totalDebt += $debt;
                    $rows[] = [
                        'name'    => $c->name,
                        'phone'   => $c->phone ?: '—',
                        'email'   => $c->email ?: '—',
                        'address' => $c->address ?: '—',
                        'debt'    => number_format($debt, 0, ',', ' '),
                        'status'  => $debt > 0 ? '⚠️ En Dette' : 'Régulier',
                    ];
                }
                $totals = [
                    'Nombre total de clients' => count($customers),
                    'Total Dettes Clients'    => $totalDebt,
                ];
                break;

            case 'cash_sessions':
                $sessions = CashSession::where('company_id', $company->id)->with(['user', 'branch'])->orderBy('id', 'desc')->get();
                $totalDiscrepancy = 0;
                foreach ($sessions as $cs) {
                    $disc = floatval($cs->discrepancy || 0);
                    $totalDiscrepancy += $disc;
                    $rows[] = [
                        'id'               => 'SESSION #' . $cs->id,
                        'user'             => $cs->user ? $cs->user->name : 'Caissier',
                        'opened_at'        => $cs->opened_at ? $cs->opened_at->format('d/m/Y H:i') : '',
                        'closed_at'        => $cs->closed_at ? $cs->closed_at->format('d/m/Y H:i') : 'En cours',
                        'opening_cash'     => number_format($cs->opening_balance, 0, ',', ' '),
                        'theoretical_cash' => number_format($cs->theoretical_closing_balance, 0, ',', ' '),
                        'closing_cash'     => number_format($cs->closing_balance, 0, ',', ' '),
                        'discrepancy'      => number_format($disc, 0, ',', ' '),
                        'status'           => $cs->status === 'closed' ? 'Clôturée' : 'Ouverte',
                    ];
                }
                $totals = [
                    'Nombre de sessions de caisse' => count($sessions),
                    'Cumul des Écarts de Caisse'   => $totalDiscrepancy,
                ];
                break;

            case 'audit_log':
                $logs = AuditLog::where('company_id', $company->id)->orderBy('id', 'desc')->limit(200)->get();
                foreach ($logs as $l) {
                    $rows[] = [
                        'date'   => $l->created_at ? $l->created_at->format('d/m/Y H:i:s') : '',
                        'user'   => $l->user ? $l->user->name : 'Système',
                        'role'   => $l->user_role ?: '—',
                        'module' => $l->module,
                        'action' => $l->action,
                        'ip'     => $l->ip_address ?: '127.0.0.1',
                        'device' => $l->device ?: 'Web',
                        'result' => strtoupper($l->result),
                    ];
                }
                $totals = ['Nombre d\'événements enregistrés' => count($logs)];
                break;

            default:
                $rows = [];
                $totals = [];
                break;
        }

        return [
            'rows'    => $rows,
            'totals'  => $totals,
            'filters' => $filters,
        ];
    }
}
