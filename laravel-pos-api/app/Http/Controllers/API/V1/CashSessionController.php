<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\CashSession;
use App\Models\CashSessionTransaction;
use Illuminate\Support\Facades\DB;

class CashSessionController extends Controller
{
    /**
     * Liste des sessions de caisse paginées.
     */
    public function index(Request $request)
    {
        $query = CashSession::with(['user', 'branch', 'validatedBy']);

        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate(15));
    }

    /**
     * Récupère la session de caisse ouverte pour l'utilisateur connecté.
     */
    public function current(Request $request)
    {
        $session = CashSession::with(['transactions', 'user', 'branch'])
            ->where('user_id', $request->user()->id)
            ->where('status', 'open')
            ->first();

        return response()->json($session);
    }

    /**
     * Ouverture d'une session de caisse.
     */
    public function open(Request $request)
    {
        $activeSession = CashSession::where('user_id', $request->user()->id)
            ->where('status', 'open')
            ->first();

        if ($activeSession) {
            return response()->json(['error' => 'Vous avez déjà une session de caisse ouverte.'], 422);
        }

        $validated = $request->validate([
            'opening_balance' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $companyId = app(\App\Services\TenantManager::class)->getCompanyId();
        
        // Utiliser la branch de l'utilisateur connecté
        $branchId = $request->user()->branch_id;

        if (!$branchId) {
            return response()->json(['error' => 'Aucune boutique n\'est associée à votre profil utilisateur.'], 400);
        }

        $session = CashSession::create([
            'company_id' => $companyId,
            'branch_id' => $branchId,
            'user_id' => $request->user()->id,
            'opening_balance' => $validated['opening_balance'],
            'status' => 'open',
            'notes' => $validated['notes'] ?? null,
            'opened_at' => now(),
        ]);

        return response()->json([
            'message' => 'Session de caisse ouverte avec succès.',
            'session' => $session->load('transactions')
        ], 201);
    }

    /**
     * Dépôt ou Retrait d'argent manuel.
     */
    public function transaction(Request $request, string $id)
    {
        $session = CashSession::findOrFail($id);

        if ($session->status !== 'open') {
            return response()->json(['error' => 'Cette caisse est fermée. Transactions impossibles.'], 422);
        }

        $validated = $request->validate([
            'type' => 'required|in:deposit,withdrawal',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
        ]);

        $transaction = CashSessionTransaction::create([
            'cash_session_id' => $session->id,
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'description' => $validated['description'],
        ]);

        return response()->json([
            'message' => $validated['type'] === 'deposit' ? 'Dépôt enregistré.' : 'Retrait enregistré.',
            'transaction' => $transaction,
            'session' => $session->load('transactions')
        ], 201);
    }

    /**
     * Fermeture de caisse.
     */
    public function close(Request $request, string $id)
    {
        $session = CashSession::findOrFail($id);

        if ($session->status !== 'open') {
            return response()->json(['error' => 'Cette caisse est déjà fermée.'], 422);
        }

        $validated = $request->validate([
            'closing_balance' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        // Calculer le solde théorique de caisse
        // Solde = ouverture + dépôts - retraits (les ventes s'ajouteront plus tard)
        $depositsSum = CashSessionTransaction::where('cash_session_id', $session->id)
            ->where('type', 'deposit')
            ->sum('amount');

        $withdrawalsSum = CashSessionTransaction::where('cash_session_id', $session->id)
            ->where('type', 'withdrawal')
            ->sum('amount');

        $theoreticalBalance = $session->opening_balance + $depositsSum - $withdrawalsSum;

        $session->update([
            'closing_balance' => $validated['closing_balance'],
            'theoretical_balance' => $theoreticalBalance,
            'status' => 'closed',
            'closed_at' => now(),
            'notes' => $validated['notes'] ?? $session->notes,
        ]);

        return response()->json([
            'message' => 'Caisse fermée avec succès.',
            'session' => $session->load('transactions')
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
            'validation_notes' => 'nullable|string',
        ]);

        $session->update([
            'status' => 'validated',
            'validated_by' => $request->user()->id,
            'validated_at' => now(),
            'validation_notes' => $validated['validation_notes'] ?? null,
        ]);

        return response()->json([
            'message' => 'Écarts validés et régularisés.',
            'session' => $session->load(['user', 'branch', 'validatedBy'])
        ]);
    }
}
