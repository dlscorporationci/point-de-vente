@extends('emails.layouts.apexpos')

@section('content')
<h1>Alerte de Sécurité Système 🛡️</h1>

<p>Bonjour <strong>{{ $user['name'] ?? 'Utilisateur' }}</strong>,</p>

<p>Un événement de sécurité important a été détecté sur votre compte ApexPOS ou votre entreprise.</p>

<div class="info-card" style="border-left-color: #ef4444; background-color: #fef2f2;">
    <table>
        <tr>
            <td class="label">Événement :</td>
            <td class="value"><strong style="color: #dc2626;">{{ $alertTitle }}</strong></td>
        </tr>
        <tr>
            <td class="label">Compte :</td>
            <td class="value">{{ $user['email'] }}</td>
        </tr>
        <tr>
            <td class="label">Adresse IP :</td>
            <td class="value"><code>{{ $ipAddress ?? 'Non disponible' }}</code></td>
        </tr>
        <tr>
            <td class="label">Horodatage :</td>
            <td class="value">{{ now()->format('d/m/Y H:i:s') }} GMT</td>
        </tr>
    </table>
</div>

<p>{{ $alertDescription }}</p>

<p style="font-size: 13px; color: #991b1b;">
    Si vous n'êtes pas l'auteur de cette action, veuillez changer votre mot de passe immédiatement et contacter l'administrateur système.
</p>

<div class="btn-container">
    <a href="{{ $appUrl ?? 'http://localhost:5173' }}" class="btn" style="background: #dc2626;">Sécuriser mon compte</a>
</div>
@endsection
