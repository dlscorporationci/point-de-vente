<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    /**
     * Servir n'importe quel fichier média (image produit, catégorie, logo) de manière 100% garantie.
     * Contourne tous les problèmes de symlinks Nginx/Apache et de permissions VPS.
     */
    public function show($type, $filename)
    {
        $path = $type . '/' . $filename;

        // 1. Vérifier dans storage/app/public/
        if (Storage::disk('public')->exists($path)) {
            $file = Storage::disk('public')->get($path);
            $mime = Storage::disk('public')->mimeType($path) ?: 'image/jpeg';
            return response($file, 200)->header('Content-Type', $mime);
        }

        // 2. Vérifier dans public/storage/
        $publicFile = public_path('storage/' . $path);
        if (file_exists($publicFile) && !is_dir($publicFile)) {
            $mime = mime_content_type($publicFile) ?: 'image/jpeg';
            return response(file_get_contents($publicFile), 200)->header('Content-Type', $mime);
        }

        // 3. Vérifier dans storage/app/
        $appFile = storage_path('app/' . $path);
        if (file_exists($appFile) && !is_dir($appFile)) {
            $mime = mime_content_type($appFile) ?: 'image/jpeg';
            return response(file_get_contents($appFile), 200)->header('Content-Type', $mime);
        }

        abort(404);
    }
}
