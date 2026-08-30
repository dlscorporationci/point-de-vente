<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\DocumentService;
use App\Models\GeneratedDocument;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    protected DocumentService $documentService;

    public function __construct(DocumentService $documentService)
    {
        $this->documentService = $documentService;
    }

    /**
     * Obtenir la liste paginée des documents archivés dans le Centre de Documents.
     */
    public function index(Request $request)
    {
        $user      = $request->user();
        $companyId = $user->company_id;
        $userRole  = is_object($user->role) ? ($user->role->slug ?? '') : (string)$user->role;
        $isSuperAdmin = ($user->email === 'superadmin@dls.com') || in_array($userRole, ['super-admin', 'superadmin']) || !$companyId;

        $query = GeneratedDocument::withoutGlobalScopes()->with(['company', 'user', 'branch']);

        if (!$isSuperAdmin && $companyId) {
            $query->where('company_id', $companyId);
        }

        if ($request->filled('document_type')) {
            $query->where('document_type', $request->document_type);
        }

        if ($request->filled('format')) {
            $query->where('format', $request->format);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('file_name', 'like', "%{$search}%")
                  ->orWhere('uuid', 'like', "%{$search}%");
            });
        }

        $documents = $query->orderBy('id', 'desc')->paginate($request->input('per_page', 50));

        return response()->json([
            'success'   => true,
            'contracts' => $this->documentService->getDocumentContracts(),
            'documents' => $documents,
        ]);
    }

    /**
     * Générer et archiver un document (PDF ou Excel).
     */
    public function export(Request $request)
    {
        $request->validate([
            'document_type' => 'required|string',
            'format'        => 'required|in:pdf,xlsx,csv',
            'filters'       => 'nullable|array',
        ]);

        try {
            $user    = $request->user();
            $company = $user->company;
            $branch  = $user->branch;
            $type    = $request->document_type;
            $format  = $request->format;
            $filters = $request->filters ?? [];

            $doc = $this->documentService->generateAndArchiveDocument($type, $format, $filters, $company, $branch, $user);

            // Audit log
            try {
                AuditLog::create([
                    'company_id'     => $company->id,
                    'branch_id'      => $branch ? $branch->id : null,
                    'user_id'        => $user->id,
                    'user_role'      => $user->role ? (is_string($user->role) ? $user->role : $user->role->name) : 'User',
                    'auditable_type' => GeneratedDocument::class,
                    'auditable_id'   => $doc->id,
                    'action'         => 'DOCUMENT_EXPORTED',
                    'module'         => 'DocumentCenter',
                    'description'    => "Génération et archivage de document [Type: {$type}] [Format: {$format}] - UUID: {$doc->uuid}",
                    'ip_address'     => $request->ip(),
                    'device'         => substr($request->userAgent() ?? 'Web App', 0, 190),
                    'result'         => 'success',
                ]);
            } catch (\Throwable $logEx) {
                \Log::warning("Erreur secondaire AuditLog lors de l'export: " . $logEx->getMessage());
            }

            return response()->json([
                'success'  => true,
                'message'  => "Document {$doc->title} généré et archivé avec succès.",
                'document' => $doc,
            ]);
        } catch (\Throwable $e) {
            \Log::error("Erreur d'exportation de document: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'error'   => "Impossible de générer le document. Veuillez réessayer ou ajuster vos critères de filtre."
            ], 500);
        }
    }

    /**
     * Télécharger un fichier de document archivé.
     */
    public function download(Request $request, $id)
    {
        $user = $request->user();
        $doc  = GeneratedDocument::where('company_id', $user->company_id)->findOrFail($id);

        $relative = str_replace('/storage/', '', $doc->file_path);
        $fullPath = storage_path("app/public/{$relative}");

        if (!file_exists($fullPath) && !Storage::disk('public')->exists($relative)) {
            return response()->json(['error' => "Le fichier spécifié n'existe plus sur le serveur."], 404);
        }

        @chmod($fullPath, 0664);

        // Audit Log
        AuditLog::create([
            'company_id'     => $user->company_id,
            'user_id'        => $user->id,
            'auditable_type' => GeneratedDocument::class,
            'auditable_id'   => $doc->id,
            'action'         => 'DOCUMENT_DOWNLOADED',
            'module'         => 'DocumentCenter',
            'description'    => "Téléchargement du document ID: {$doc->id} - Title: {$doc->title}",
            'ip_address'     => $request->ip(),
            'result'         => 'success',
        ]);

        if ($request->has('stream') || !$request->wantsJson()) {
            return response()->download($fullPath, $doc->file_name);
        }

        return response()->json([
            'success'      => true,
            'download_url' => asset($doc->file_path),
            'file_name'    => $doc->file_name,
        ]);
    }

    /**
     * Supprimer un document archivé.
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $doc  = GeneratedDocument::where('company_id', $user->company_id)->findOrFail($id);

        $relative = str_replace('/storage/', '', $doc->file_path);
        if (Storage::disk('public')->exists($relative)) {
            Storage::disk('public')->delete($relative);
        }

        $doc->delete();

        // Audit Log
        AuditLog::create([
            'company_id'     => $user->company_id,
            'user_id'        => $user->id,
            'auditable_type' => GeneratedDocument::class,
            'auditable_id'   => $doc->id,
            'action'         => 'DOCUMENT_DELETED',
            'module'         => 'DocumentCenter',
            'description'    => "Suppression du document ID: {$doc->id} - Title: {$doc->title}",
            'ip_address'     => $request->ip(),
            'result'         => 'success',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Document supprimé du centre d\'archivage avec succès.',
        ]);
    }

    /**
     * Télécharger un document archivé via son UUID (Direct stream sans blocage Sanctum/Apache).
     */
    public function publicDownload($uuid)
    {
        $doc = GeneratedDocument::where('uuid', $uuid)->firstOrFail();

        $relative = str_replace('/storage/', '', $doc->file_path);
        $fullPath = storage_path("app/public/{$relative}");

        if (!file_exists($fullPath) && !Storage::disk('public')->exists($relative)) {
            return response()->json(['error' => "Le fichier spécifié n'existe plus sur le serveur."], 404);
        }

        @chmod($fullPath, 0664);

        try {
            AuditLog::create([
                'company_id'     => $doc->company_id,
                'user_id'        => $doc->user_id,
                'auditable_type' => GeneratedDocument::class,
                'auditable_id'   => $doc->id,
                'action'         => 'DOCUMENT_DOWNLOADED_DIRECT',
                'module'         => 'DocumentCenter',
                'description'    => "Téléchargement direct mobile du document UUID: {$doc->uuid}",
                'ip_address'     => request()->ip(),
                'device'         => substr(request()->userAgent() ?? 'Mobile Direct', 0, 190),
                'result'         => 'success',
            ]);
        } catch (\Throwable $th) {
            \Log::warning("AuditLog direct download: " . $th->getMessage());
        }

        return response()->download($fullPath, $doc->file_name);
    }
}
