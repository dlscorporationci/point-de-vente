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
            'purchases_list' => [
                'type'     => 'purchases_list',
                'title'    => 'HISTORIQUE DES ACHATS & APPROVISIONNEMENTS',
                'subtitle' => 'Commandes fournisseurs, livraisons de stock et montants engagés',
                'columns'  => [
                    ['key' => 'reference',   'label' => 'N° Bon / Ref',    'align' => 'left'],
                    ['key' => 'supplier',    'label' => 'Fournisseur',     'align' => 'left'],
                    ['key' => 'date',        'label' => 'Date Commande',   'align' => 'left'],
                    ['key' => 'total_amount','label' => 'Montant (FCFA)',  'align' => 'right'],
                    ['key' => 'status',      'label' => 'Statut Livraison','align' => 'center'],
                ],
            ],
            'transfers_list' => [
                'type'     => 'transfers_list',
                'title'    => 'HISTORIQUE DES TRANSFERTS DE STOCK INTER-BOUTIQUES',
                'subtitle' => 'Mouvements d\'expéditions et réceptions d\'articles entre succursales',
                'columns'  => [
                    ['key' => 'reference',    'label' => 'N° Transfert',    'align' => 'left'],
                    ['key' => 'from_branch',  'label' => 'Boutique Source', 'align' => 'left'],
                    ['key' => 'to_branch',    'label' => 'Boutique Cible',  'align' => 'left'],
                    ['key' => 'items_count',  'label' => 'Articles',        'align' => 'center'],
                    ['key' => 'date',         'label' => 'Date Expédition', 'align' => 'left'],
                    ['key' => 'status',       'label' => 'Statut',          'align' => 'center'],
                ],
            ],
            'companies_list' => [
                'type'     => 'companies_list',
                'title'    => 'REPERTOIRE DES ENTREPRISES ET TENANTS SAAS',
                'subtitle' => 'Liste officielle des entreprises clientes, formules d\'abonnement et boutiques',
                'columns'  => [
                    ['key' => 'code',         'label' => 'Code POS',      'align' => 'left'],
                    ['key' => 'name',         'label' => 'Entreprise',    'align' => 'left'],
                    ['key' => 'plan',         'label' => 'Formule',       'align' => 'center'],
                    ['key' => 'branches_cnt', 'label' => 'Boutiques',     'align' => 'center'],
                    ['key' => 'users_cnt',    'label' => 'Comptes',       'align' => 'center'],
                    ['key' => 'status',       'label' => 'Statut',        'align' => 'center'],
                ],
            ],
            'suppliers_list' => [
                'type'     => 'suppliers_list',
                'title'    => 'RÉPERTOIRE ET ÉTAT DES FOURNISSEURS',
                'subtitle' => 'Liste des partenaires d\'approvisionnement, coordonnées et soldes créditeurs',
                'columns'  => [
                    ['key' => 'name',    'label' => 'Nom du Fournisseur', 'align' => 'left'],
                    ['key' => 'phone',   'label' => 'Téléphone',          'align' => 'left'],
                    ['key' => 'email',   'label' => 'Adresse E-mail',     'align' => 'left'],
                    ['key' => 'address', 'label' => 'Adresse / Ville',    'align' => 'left'],
                    ['key' => 'debt',    'label' => 'Solde Dette (FCFA)', 'align' => 'right'],
                    ['key' => 'status',  'label' => 'Statut Compte',      'align' => 'center'],
                ],
            ],
            'users_list' => [
                'type'     => 'users_list',
                'title'    => 'REPERTOIRE DES UTILISATEURS DU SYSTEME SAAS',
                'subtitle' => 'Comptes opérateurs, gérants et administrateurs référencés sur la plateforme',
                'columns'  => [
                    ['key' => 'name',    'label' => 'Nom Utilisateur', 'align' => 'left'],
                    ['key' => 'email',   'label' => 'Adresse E-mail',  'align' => 'left'],
                    ['key' => 'company', 'label' => 'Entreprise',      'align' => 'left'],
                    ['key' => 'role',    'label' => 'Rôle Applicatif', 'align' => 'center'],
                    ['key' => 'status',  'label' => 'Statut Compte',   'align' => 'center'],
                ],
            ],
            'saas_metrics' => [
                'type'     => 'saas_metrics',
                'title'    => 'SUPERVISION ET INDICATEURS CLES SAAS',
                'subtitle' => 'Bilan des souscriptions, volumes de transactions et santé du parc d\'entreprises',
                'columns'  => [
                    ['key' => 'metric_name',  'label' => 'Indicateur de Supervision', 'align' => 'left'],
                    ['key' => 'metric_val',   'label' => 'Valeur Quantifiée',        'align' => 'right'],
                    ['key' => 'description',  'label' => 'Détails & Portée',         'align' => 'left'],
                ],
            ],
            'subscriptions_list' => [
                'type'     => 'subscriptions_list',
                'title'    => 'REGISTRE DES ABONNEMENTS SAAS',
                'subtitle' => 'Suivi des contrats, périodes de facturation et statuts des entreprises',
                'columns'  => [
                    ['key' => 'company',     'label' => 'Entreprise',      'align' => 'left'],
                    ['key' => 'plan',        'label' => 'Formule Plan',    'align' => 'center'],
                    ['key' => 'period',      'label' => 'Période',         'align' => 'center'],
                    ['key' => 'amount',      'label' => 'Montant (FCFA)',  'align' => 'right'],
                    ['key' => 'start_date',  'label' => 'Début',           'align' => 'left'],
                    ['key' => 'end_date',    'label' => 'Échéance',        'align' => 'left'],
                    ['key' => 'status',      'label' => 'Statut',          'align' => 'center'],
                ],
            ],
            'payments_list' => [
                'type'     => 'payments_list',
                'title'    => 'JOURNAL DES PAIEMENTS D\'ABONNEMENT',
                'subtitle' => 'Enregistrement des règlements reçus, modes de paiement et références',
                'columns'  => [
                    ['key' => 'date',        'label' => 'Date Règlement',  'align' => 'left'],
                    ['key' => 'company',     'label' => 'Entreprise',      'align' => 'left'],
                    ['key' => 'amount',      'label' => 'Montant (FCFA)',  'align' => 'right'],
                    ['key' => 'method',      'label' => 'Mode Règlement',  'align' => 'center'],
                    ['key' => 'reference',   'label' => 'Référence Trans.', 'align' => 'left'],
                    ['key' => 'status',      'label' => 'Statut',          'align' => 'center'],
                ],
            ],
            'company_inspection_report' => [
                'type'     => 'company_inspection_report',
                'title'    => 'RAPPORT D\'INSPECTION D\'ENTREPRISE',
                'subtitle' => 'Bilan et audit complet des activités, ventes, clients et stocks d\'une entreprise client',
                'columns'  => [
                    ['key' => 'module',      'label' => 'Module / Rubrique',  'align' => 'left'],
                    ['key' => 'indicator',   'label' => 'Indicateur Clef',    'align' => 'left'],
                    ['key' => 'val',         'label' => 'Valeur Mesurée',     'align' => 'right'],
                    ['key' => 'notes',       'label' => 'Observation Audit',  'align' => 'left'],
                ],
            ],
            'invoices_list' => [
                'type'     => 'invoices_list',
                'title'    => 'LIVRE DES FACTURES CLIENTS SAAS',
                'subtitle' => 'Factures d\'abonnement générées, montants HT/TTC et dates d\'échéance',
                'columns'  => [
                    ['key' => 'number',      'label' => 'N° Facture',      'align' => 'left'],
                    ['key' => 'company',     'label' => 'Entreprise',      'align' => 'left'],
                    ['key' => 'period',      'label' => 'Période',         'align' => 'center'],
                    ['key' => 'total_amount','label' => 'Montant TTC',     'align' => 'right'],
                    ['key' => 'issue_date',  'label' => 'Émission',        'align' => 'left'],
                    ['key' => 'due_date',    'label' => 'Échéance',        'align' => 'left'],
                    ['key' => 'status',      'label' => 'Statut',          'align' => 'center'],
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
                    'Total Dettes Clients'    => number_format($totalDebt, 0, ',', ' ') . ' FCFA',
                ];
                break;
            case 'suppliers_list':
                $suppliers = Supplier::where('company_id', $company->id)->get();
                $totalDebt = 0;
                foreach ($suppliers as $s) {
                    $debt = floatval($s->debt_balance || $s->debt || 0);
                    $totalDebt += $debt;
                    $rows[] = [
                        'name'    => $s->name,
                        'phone'   => $s->phone ?: '—',
                        'email'   => $s->email ?: '—',
                        'address' => $s->address ?: '—',
                        'debt'    => number_format($debt, 0, ',', ' '),
                        'status'  => $debt > 0 ? '⚠️ Solde En Dette' : 'Régulier',
                    ];
                }
                $totals = [
                    'Nombre total de fournisseurs' => count($suppliers),
                    'Total Dette Fournisseurs'    => number_format($totalDebt, 0, ',', ' ') . ' FCFA',
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
                        'opened_at'        => $cs->opened_at ? \Carbon\Carbon::parse($cs->opened_at)->format('d/m/Y H:i') : '',
                        'closed_at'        => $cs->closed_at ? \Carbon\Carbon::parse($cs->closed_at)->format('d/m/Y H:i') : 'En cours',
                        'opening_cash'     => number_format(floatval($cs->opening_balance ?: 0), 0, ',', ' '),
                        'theoretical_cash' => number_format(floatval($cs->theoretical_closing_balance ?: 0), 0, ',', ' '),
                        'closing_cash'     => number_format(floatval($cs->closing_balance ?: 0), 0, ',', ' '),
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
                $logs = AuditLog::where('company_id', $company->id)->with('user')->orderBy('id', 'desc')->limit(500)->get();
                foreach ($logs as $log) {
                    $rows[] = [
                        'created_at'  => $log->created_at ? \Carbon\Carbon::parse($log->created_at)->format('d/m/Y H:i:s') : '',
                        'user'        => $log->user ? $log->user->name : 'Système / Anonyme',
                        'action'      => $log->action,
                        'entity'      => $log->entity_type . ($log->entity_id ? " #{$log->entity_id}" : ''),
                        'details'     => is_array($log->details) ? json_encode($log->details, JSON_UNESCAPED_UNICODE) : ($log->details ?: '—'),
                        'ip_address'  => $log->ip_address ?: '127.0.0.1',
                    ];
                }
                $totals = ['Nombre d\'événements enregistrés' => count($logs)];
                break;

                $sumPurchases = 0;
                foreach ($purchases as $pur) {
                    $amt = floatval($pur->total_amount || 0);
                    $sumPurchases += $amt;
                    $rows[] = [
                        'reference'    => $pur->purchase_number ?: ('ACHAT #' . $pur->id),
                        'supplier'     => $pur->supplier ? $pur->supplier->name : 'Fournisseur Général',
                        'date'         => $pur->created_at ? $pur->created_at->format('d/m/Y') : '',
                        'total_amount' => number_format($amt, 0, ',', ' '),
                        'status'       => strtoupper($pur->status ?: 'COMPLÉTÉ'),
                    ];
                }
                $totals = [
                    'Nombre de commandes' => count($purchases),
                    'Montant total des achats' => $sumPurchases,
                ];
                break;

            case 'transfers_list':
                $query = StockTransfer::where('company_id', $company->id)->with(['fromBranch', 'toBranch']);
                if ($branch) {
                    $query->where(function($q) use ($branch) {
                        $q->where('from_branch_id', $branch->id)->orWhere('to_branch_id', $branch->id);
                    });
                }
                $transfers = $query->orderBy('id', 'desc')->get();
                foreach ($transfers as $tr) {
                    $rows[] = [
                        'reference'   => $tr->transfer_number ?: ('TRF #' . $tr->id),
                        'from_branch' => $tr->fromBranch ? $tr->fromBranch->name : 'Source',
                        'to_branch'   => $tr->toBranch ? $tr->toBranch->name : 'Destination',
                        'items_count' => is_array($tr->items) ? count($tr->items) : 1,
                        'date'        => $tr->created_at ? $tr->created_at->format('d/m/Y H:i') : '',
                        'status'      => strtoupper($tr->status ?: 'EXPÉDIÉ'),
                    ];
                }
                $totals = ['Nombre de transferts inter-boutiques' => count($transfers)];
                break;

            case 'companies_list':
                $companies = Company::withCount(['branches', 'users'])->get();
                foreach ($companies as $c) {
                    $rows[] = [
                        'code'         => $c->company_code ?: ('COMP-' . $c->id),
                        'name'         => $c->name,
                        'plan'         => strtoupper($c->subscription_plan ?: 'Starter'),
                        'branches_cnt' => $c->branches_count,
                        'users_cnt'    => $c->users_count,
                        'status'       => strtoupper($c->status ?: 'ACTIVE'),
                    ];
                }
                $totals = ['Nombre total d\'entreprises enregistrées' => count($companies)];
                break;

            case 'users_list':
                $users = User::with(['company', 'role'])->get();
                foreach ($users as $u) {
                    $rows[] = [
                        'name'    => $u->name,
                        'email'   => $u->email,
                        'company' => $u->company ? $u->company->name : 'Plateforme SaaS',
                        'role'    => strtoupper($u->role ? ($u->role->name ?: $u->role->slug) : 'Utilisateur'),
                        'status'  => strtoupper($u->status ?: 'ACTIVE'),
                    ];
                }
                $totals = ['Nombre total d\'utilisateurs répertoriés' => count($users)];
                break;

            case 'saas_metrics':
                $totalCompanies = Company::count();
                $activeCompanies = Company::where('status', 'active')->count();
                $totalUsers = User::count();
                $totalSales = \App\Models\Sale::count();
                $totalRevenue = \App\Models\Sale::sum('total');

                $rows = [
                    ['metric_name' => 'Entreprises Enregistrées', 'metric_val' => $totalCompanies, 'description' => 'Nombre total d\'organisations sur la plateforme'],
                    ['metric_name' => 'Entreprises Actives',      'metric_val' => $activeCompanies, 'description' => 'Entreprises avec compte actif et valide'],
                    ['metric_name' => 'Comptes Utilisateurs',     'metric_val' => $totalUsers, 'description' => 'Utilisateurs globaux (Admins, Gérants, Caissiers)'],
                    ['metric_name' => 'Volume de Ventes (TTC)',   'metric_val' => number_format($totalRevenue, 0, ',', ' ') . ' FCFA', 'description' => 'Montant cumule de l\'ensemble des transactions'],
                    ['metric_name' => 'Nombre de Transactions',   'metric_val' => $totalSales, 'description' => 'Nombre total de tickets de caisse edites'],
                ];
                $totals = [
                    'Supervision globale plateforme' => 'Rapport généré le ' . date('d/m/Y H:i')
                ];
                break;

            case 'subscriptions_list':
                $subs = \App\Models\CompanySubscription::withoutGlobalScopes()->with(['company', 'plan'])->get();
                $sumAmt = 0;
                if ($subs->count() > 0) {
                    foreach ($subs as $s) {
                        $amt = floatval($s->amount || 50000);
                        $sumAmt += $amt;
                        $rows[] = [
                            'company'    => $s->company ? $s->company->name : 'N/A',
                            'plan'       => $s->plan ? $s->plan->name : strtoupper($s->company->subscription_plan ?? 'PRO'),
                            'period'     => strtoupper($s->billing_period ?: 'Mensuel'),
                            'amount'     => number_format($amt, 0, ',', ' '),
                            'start_date' => $s->start_date ? \Carbon\Carbon::parse($s->start_date)->format('d/m/Y') : '—',
                            'end_date'   => $s->end_date ? \Carbon\Carbon::parse($s->end_date)->format('d/m/Y') : '—',
                            'status'     => strtoupper($s->status ?: 'ACTIF'),
                        ];
                    }
                } else {
                    $companies = \App\Models\Company::all();
                    foreach ($companies as $comp) {
                        $amt = 50000;
                        $sumAmt += $amt;
                        $rows[] = [
                            'company'    => $comp->name,
                            'plan'       => strtoupper($comp->subscription_plan ?: 'PRO'),
                            'period'     => 'MENSUEL',
                            'amount'     => number_format($amt, 0, ',', ' '),
                            'start_date' => $comp->created_at ? $comp->created_at->format('d/m/Y') : '—',
                            'end_date'   => $comp->subscription_expires_at ? \Carbon\Carbon::parse($comp->subscription_expires_at)->format('d/m/Y') : '—',
                            'status'     => strtoupper($comp->status ?: 'ACTIF'),
                        ];
                    }
                }
                $totals = [
                    'Nombre d\'abonnements' => count($rows),
                    'Montant cumulé'       => number_format($sumAmt, 0, ',', ' ') . ' FCFA'
                ];
                break;

            case 'company_inspection_report':
                $targetCompId = $filters['company_id'] ?? $company->id;
                $comp = Company::withoutGlobalScopes()->find($targetCompId) ?: $company;

                $totalCA = Sale::withoutGlobalScopes()->where('company_id', $comp->id)->where('payment_status', 'paid')->sum('total');
                $salesCount = Sale::withoutGlobalScopes()->where('company_id', $comp->id)->count();
                $customersCount = Customer::withoutGlobalScopes()->where('company_id', $comp->id)->count();
                $suppliersCount = Supplier::withoutGlobalScopes()->where('company_id', $comp->id)->count();
                $productsCount = Product::withoutGlobalScopes()->where('company_id', $comp->id)->count();
                $usersCount = User::withoutGlobalScopes()->where('company_id', $comp->id)->count();

                $rows = [
                    ['module' => 'IDENTIFICATION', 'indicator' => 'Nom Entreprise', 'val' => $comp->name, 'notes' => 'Code: ' . $comp->code],
                    ['module' => 'IDENTIFICATION', 'indicator' => 'Formule Abonnement', 'val' => strtoupper($comp->subscription_plan ?: 'Starter'), 'notes' => 'Statut: ' . strtoupper($comp->status)],
                    ['module' => 'FINANCES & VENTES', 'indicator' => 'CA Total Encaissé', 'val' => number_format($totalCA, 0, ',', ' ') . ' FCFA', 'notes' => $salesCount . ' transactions enregistrées'],
                    ['module' => 'FINANCES & VENTES', 'indicator' => 'Panier Moyen', 'val' => number_format($salesCount > 0 ? $totalCA / $salesCount : 0, 0, ',', ' ') . ' FCFA', 'notes' => 'Moyenne par ticket de caisse'],
                    ['module' => 'RÉPERTOIRE', 'indicator' => 'Portefeuille Clients', 'val' => $customersCount . ' client(s)', 'notes' => 'Base de données clients'],
                    ['module' => 'RÉPERTOIRE', 'indicator' => 'Partenaires Fournisseurs', 'val' => $suppliersCount . ' fournisseur(s)', 'notes' => 'Achats & approvisionnements'],
                    ['module' => 'CATALOGUE & STOCK', 'indicator' => 'Nombre d\'Articles', 'val' => $productsCount . ' référence(s)', 'notes' => 'Catalogue produits'],
                    ['module' => 'OPERATEURS', 'indicator' => 'Comptes Utilisateurs', 'val' => $usersCount . ' compte(s)', 'notes' => 'Administrateurs & caissiers'],
                ];

                $totals = [
                    'Inspection d\'entreprise client' => $comp->name . ' (ID: ' . $comp->id . ')',
                    'Horodatage d\'inspection'      => date('d/m/Y H:i:s')
                ];
                break;

            case 'payments_list':
                $payments = \App\Models\SubscriptionPayment::withoutGlobalScopes()->with(['company'])->get();
                $sumPaid = 0;
                foreach ($payments as $p) {
                    $amt = floatval($p->amount || 0);
                    if ($p->status === 'paid') $sumPaid += $amt;
                    $rows[] = [
                        'date'      => $p->payment_date ? \Carbon\Carbon::parse($p->payment_date)->format('d/m/Y H:i') : '',
                        'company'   => $p->company ? $p->company->name : 'N/A',
                        'amount'    => number_format($amt, 0, ',', ' '),
                        'method'    => strtoupper($p->payment_method ?: 'Espèces'),
                        'reference' => $p->reference ?: 'PAY-' . $p->id,
                        'status'    => strtoupper($p->status ?: 'PAYÉ'),
                    ];
                }
                $totals = [
                    'Nombre de paiements'  => count($payments),
                    'Montant total réglé'  => number_format($sumPaid, 0, ',', ' ') . ' FCFA'
                ];
                break;

            case 'invoices_list':
                $invoices = \App\Models\SubscriptionInvoice::withoutGlobalScopes()->with(['company'])->get();
                $sumInv = 0;
                foreach ($invoices as $inv) {
                    $amt = floatval($inv->total_amount || 0);
                    $sumInv += $amt;
                    $rows[] = [
                        'number'       => $inv->invoice_number,
                        'company'      => $inv->company ? $inv->company->name : 'N/A',
                        'period'       => strtoupper($inv->billing_period ?: 'Mensuel'),
                        'total_amount' => number_format($amt, 0, ',', ' '),
                        'issue_date'   => $inv->issue_date ? \Carbon\Carbon::parse($inv->issue_date)->format('d/m/Y') : '',
                        'due_date'     => $inv->due_date ? \Carbon\Carbon::parse($inv->due_date)->format('d/m/Y') : '',
                        'status'       => strtoupper($inv->status ?: 'ÉMISE'),
                    ];
                }
                $totals = [
                    'Nombre de factures' => count($invoices),
                    'Montant total émis' => number_format($sumInv, 0, ',', ' ') . ' FCFA'
                ];
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
