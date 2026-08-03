<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\CommunicationService;
use App\Models\CommunicationLog;
use App\Models\Company;

class CommunicationController extends Controller
{
    protected CommunicationService $communicationService;

    public function __construct(CommunicationService $communicationService)
    {
        $this->communicationService = $communicationService;
    }

    /**
     * Liste des communications émises par le SuperAdmin.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role && !in_array($user->role->slug, ['super-admin', 'admin'])) {
            return response()->json(['error' => 'Accès refusé. Réservé aux administrateurs.'], 403);
        }

        $query = CommunicationLog::with(['company', 'branch', 'user', 'sender']);

        if ($request->filled('company_id')) {
            $query->where('company_id', $request->company_id);
        }

        if ($request->filled('channel')) {
            $query->where('channel', $request->channel);
        }

        $logs = $query->orderBy('id', 'desc')->paginate($request->input('per_page', 20));
        $companies = Company::withoutGlobalScopes()->select('id', 'name', 'code')->get();

        return response()->json([
            'success'   => true,
            'companies' => $companies,
            'logs'      => $logs,
        ]);
    }

    /**
     * Envoyer un message / email d'administration.
     */
    public function send(Request $request)
    {
        $user = $request->user();
        if ($user->role && !in_array($user->role->slug, ['super-admin', 'admin'])) {
            return response()->json(['error' => 'Accès refusé.'], 403);
        }

        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'channel' => 'required|in:email,system_message,notification',
        ]);

        $log = $this->communicationService->sendCommunication($request->all(), $user);

        return response()->json([
            'success' => true,
            'message' => "Message d'administration envoyé et historisé avec succès.",
            'log'     => $log,
        ]);
    }
}
