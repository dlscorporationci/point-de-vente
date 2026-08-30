<?php

use Illuminate\Support\Facades\Route;

Route::get('/storage/{path}', function ($path) {
    $fullPath = storage_path('app/public/' . $path);
    if (!file_exists($fullPath)) {
        $fullPath = storage_path('app/' . $path);
    }
    if (!file_exists($fullPath) || is_dir($fullPath)) {
        abort(404);
    }
    $mimeType = mime_content_type($fullPath) ?: 'image/jpeg';
    return response()->file($fullPath, ['Content-Type' => $mimeType]);
})->where('path', '.*');

Route::get('/{any?}', function () {
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return file_get_contents($indexPath);
    }
    return view('welcome');
})->where('any', '^(?!api).*$');
