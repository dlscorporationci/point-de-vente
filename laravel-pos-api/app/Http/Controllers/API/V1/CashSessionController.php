<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CashSession;
use App\Models\CashSessionTransaction;
use App\Models\Sale;
use Illuminate\Support\Facades\DB;
use App\Events\CashSession\CashSessionOpened;
use App\Events\CashSession\CashSessionClosed;
use App\Events\CashSession\CashSessionValidated;
use App\Events\CashSession\CashSessionTransactionAdded;
use App\Services\AuthorizationService;

class CashSessionController extends Controller
{
    /**
     * Enrichit l'objet CashSession avec le détail des flux financiers et des calculs théoriques.
     */
    private function enrichSessionSummary(CashSession $session)
    {
        // 1. Sommes des ventes par mode de paiement
        $cashSalesSum = Sale::where('cash_session_id', $session->id)
            ->where('payment_method', 'cash')
            ->sum('total');

        $cardSalesSum = Sale::where('cash_session_id', $session->id)
            ->where('payment_method', 'card')
            ->sum('total');

        $creditSalesSum = Sale::where('cash_session_id', $session->id)
            ->where('payment_method', 'credit')
            ->sum('total');

        $totalSalesSum = Sale::where('cash_session_id', $session->id)
            ->sum('total');

        // 2. Mouvements de fond manuels (dépôts / retraits)
        $depositsSum = CashSessionTransaction::where('cash_session_id', $session->id)
            ->where('type', 'deposit')
            ->sum('amount');

        $withdrawalsSum = CashSessionTransaction::where('cash_session_id', $session->id)
            ->where('type', 'withdrawal')
            ->sum('amount');

        // 3. Calcul du solde théorique physique en espèces (Tiroir-caisse)
        // Solde = Fonds ouverture + Ventes espèces + Dépôts - Retraits
        $openingBalance = floatval($session->opening_balance);
        $theoreticalCash = $openingBalance + floatval($cashSalesSum) + floatval($depositsSum) - floatval($withdrawalsSum);

        $session->cash_sales = floatval($cashSalesSum);
        $session->card_sales = floatval($cardSalesSum);
        $session->credit_sales = floatval($creditSalesSum);
        $session->total_sales = floatval($totalSalesSum);
        $session->deposits_sum = floatval($depositsSum);
        $session->withdrawals_sum = floatval($withdrawalsSum);
        $session->computed_theoretical_balance = floatval($theoreticalCash);

        return $session;
    }

    /**
     * Liste des sessions de caisse paginées.
     */
    public function index(Request $request)
    {
        $query = CashSession::with(['user', 'branch', 'validatedBy', 'transactions']);

        $branchId = $request->input('branch_id') ?: app(\App\Services\TenantManager::class)->getBranchId();
        if ($branchId && $branchId !== 'all') {
            $query->where('branch_id', $branchId);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $sessions = $query->orderBy('created_at', 'desc')->paginate(20);

        foreach ($sessions->items() as $session) {
            $this->enrichSessionSummary($session);
        }

        return response()->json($sessions);
    }

    /**
     * Récupère la session de caisse ouverte pour la boutique active (partagée entre les utilisateurs de la boutique).
     */
    public function current(Request $request)
    {
        $user = $request->user();
        $branchId = app(\App\Services\TenantManager::class)->getBranchId() ?: $user->branch_id;

        if (!$branchId) {
            return response()->json(null);
        }

        // Chercher une session ouverte dans cette boutique
        $session = CashSession::with(['transactions', 'user', 'branch'])
            ->where('branch_id', $branchId)
            ->where('status', 'open')
            ->orderByDesc('opened_at')
            ->first();

        if ($session) {
            $this->enrichSessionSummary($session);
        }

        return response()->json($session);
    }

    /**
     * Ouverture d'une session de caisse pour la boutique active.
     */
    public function open(Request $request)
    {
        $user = $request->user();
        $authService = app(AuthorizationService::class);
        if (!$authService->hasPermission($user, 'cash.open')) {
            return response()->json(['error' => "Accès refusé. La permission 'cash.open' est obligatoire pour ouvrir une session de caisse."], 403);
        }

        $branchId = app(\App\Services\TenantManager::class)->getBranchId() ?: $user->branch_id;

        if (!$branchId) {
            return response()->json(['error' => 'Aucune boutique n\'est associée à votre profil utilisateur.'], 400);
        }

        // Vérifier si une caisse est déjà ouverte pour cette boutique
        $activeSession = CashSession::where('branch_id', $branchId)
            ->where('status', 'open')
            ->first();

        if ($activeSession) {
            $openedBy = $activeSession->user ? $activeSession->user->name : 'un membre de l\'équipe';
            return response()->json([
                'error' => "Une session de caisse est déjà ouverte pour cette boutique par {$openedBy}."
            ], 422);
        }

        $validated = $request->validate([
            'opening_balance' => 'required|numeric|min:0',
            'notes'           => 'nullable|string|max:500',
        ]);

        $companyId = app(\App\Services\TenantManager::class)->getCompanyId() ?: $user->company_id;

        $session = CashSession::create([
            'company_id'      => $companyId,
            'branch_id'       => $branchId,
            'user_id'         => $user->id,
            'opening_balance' => $validated['opening_balance'],
            'status'          => 'open',
            'notes'           => $validated['notes'] ?? null,
            'opened_at'       => now(),
        ]);

        try {
            event(new CashSessionOpened($session, $user));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('CashSessionOpened event error: ' . $e->getMessage());
        }

        $session->load(['transactions', 'user', 'branch']);
        $this->enrichSessionSummary($session);

        return response()->json([
            'message' => 'Session de caisse ouverte avec succès pour la boutique.',
            'session' => $session
        ], 201);
    }

    /**
     * Dépôt ou Retrait d'argent manuel sur la caisse ouverte.
     */
    public function transaction(Request $request, string $id)
    {
        $user = $request->user();
        $authService = app(AuthorizationService::class);

        $session = CashSession::findOrFail($id);

        if ($session->status !== 'open') {
            return response()->json(['error' => 'Cette caisse est fermée. Transactions impossibles.'], 422);
        }

        $type = $request->input('type');
        if ($type === 'withdrawal' && !$authService->hasPermission($user, 'cash.withdraw')) {
            return response()->json(['error' => "Accès refusé. La permission 'cash.withdraw' est obligatoire pour effectuer un retrait de caisse."], 403);
        }

        $validated = $request->validate([
            'type'        => 'required|in:deposit,withdrawal',
            'amount'      => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
        ]);

        $transaction = CashSessionTransaction::create([
            'cash_session_id' => $session->id,
            'type'            => $validated['type'],
            'amount'          => $validated['amount'],
            'description'     => $validated['description'],
        ]);

        try {
            event(new CashSessionTransactionAdded($session, $transaction, $request->user()));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('CashSessionTransactionAdded event error: ' . $e->getMessage());
        }

        $session->load(['transactions', 'user', 'branch']);
        $this->enrichSessionSummary($session);

        return response()->json([
            'message'     => $validated['type'] === 'deposit' ? 'Dépôt de monnaie enregistré.' : 'Retrait de caisse enregistré.',
            'transaction' => $transaction,
            'session'     => $session
        ], 201);
    }

    /**
     * Fermeture de caisse.
     */
    public function close(Request $request, string $id)
    {
        $user = $request->user();
        $authService = app(AuthorizationService::class);
        if (!$authService->hasPermission($user, 'cash.close')) {
            return response()->json(['error' => "Accès refusé. La permission 'cash.close' est obligatoire pour fermer une session de caisse."], 403);
        }

        $session = CashSession::findOrFail($id);

        if ($session->status !== 'open') {
            return response()->json(['error' => 'Cette caisse est déjà fermée.'], 422);
        }

        $validated = $request->validate([
            'closing_balance' => 'required|numeric|min:0',
            'notes'           => 'nullable|string|max:500',
        ]);

        // Calculer le solde théorique physique de caisse (Espèces)
        $cashSalesSum = Sale::where('cash_session_id', $session->id)
            ->where('payment_method', 'cash')
            ->sum('total');

        $depositsSum = CashSessionTransaction::where('cash_session_id', $session->id)
            ->where('type', 'deposit')
            ->sum('amount');

        $withdrawalsSum = CashSessionTransaction::where('cash_session_id', $session->id)
            ->where('type', 'withdrawal')
            ->sum('amount');

        $theoreticalBalance = floatval($session->opening_balance) + floatval($cashSalesSum) + floatval($depositsSum) - floatval($withdrawalsSum);
        $closingBalance = floatval($validated['closing_balance']);
        $gap = round($closingBalance - $theoreticalBalance, 2);

        $session->update([
            'closing_balance'     => $closingBalance,
            'theoretical_balance' => $theoreticalBalance,
            'status'              => 'closed',
            'closed_at'           => now(),
            'notes'               => $validated['notes'] ?? $session->notes,
        ]);

        try {
            event(new CashSessionClosed($session, $request->user(), $gap));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('CashSessionClosed event error: ' . $e->getMessage());
        }

        $session->load(['transactions', 'user', 'branch']);
        $this->enrichSessionSummary($session);

        return response()->json([
            'message' => 'Caisse fermée avec succès.',
            'gap'     => $gap,
            'session' => $session
        ]);
    }

    /**
     * Validation d'une caisse fermée et régularisation des écarts par un gérant/admin.
     */
    public function validateSession(Request $request, string $id)
    {
        if (!$request->user()->hasPermission('cash-sessions.manage')) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $session = CashSession::findOrFail($id);

        if ($session->status !== 'closed') {
            return response()->json(['error' => 'La session doit être fermée pour pouvoir être validée.'], 422);
        }

        $validated = $request->validate([
            'validation_notes' => 'nullable|string|max:500',
        ]);

        $session->update([
            'status'           => 'validated',
            'validated_by'     => $request->user()->id,
            'validated_at'     => now(),
            'validation_notes' => $validated['validation_notes'] ?? null,
        ]);

        try {
            event(new CashSessionValidated($session, $request->user()));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('CashSessionValidated event error: ' . $e->getMessage());
        }

        $session->load(['user', 'branch', 'validatedBy', 'transactions']);
        $this->enrichSessionSummary($session);

        return response()->json([
            'message' => 'Écarts validés et session régularisée.',
            'session' => $session
        ]);
    }
}
