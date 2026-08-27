@extends('emails.layouts.apexpos')

@section('content')
<h1>Bienvenue sur ApexPOS ! 🎉</h1>

<p>Bonjour <strong>{{ $user['name'] }}</strong>,</p>

<p>Félicitations et bienvenue sur <strong>ApexPOS Enterprise</strong>. Votre compte utilisateur et votre entreprise ont été initialisés avec succès sur la plateforme.</p>

<div class="info-card">
    <table>
        <tr>
            <td class="label">Entreprise :</td>
            <td class="value">{{ $company['name'] ?? 'N/A' }}</td>
        </tr>
        <tr>
            <td class="label">Adresse E-mail :</td>
            <td class="value">{{ $user['email'] }}</td>
        </tr>
        <tr>
            <td class="label">Formule SaaS :</td>
            <td class="value"><span class="badge badge-info">{{ strtoupper($company['subscription_plan'] ?? 'PRO') }}</span></td>
        </tr>
        @if(!empty($company['code']))
        <tr>
            <td class="label">Code Connexion Caisse :</td>
            <td class="value"><span class="badge" style="background-color: #ea580c; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 14px;">{{ $company['code'] }}</span></td>
        </tr>
        @endif
        @if(!empty($user['pin_code']))
        <tr>
            <td class="label">Code PIN Opérateur (4 chiffres) :</td>
            <td class="value"><span class="badge" style="background-color: #10b981; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 14px; letter-spacing: 2px;">{{ $user['pin_code'] }}</span></td>
        </tr>
        @endif
    </table>
</div>

<p>Vous pouvez dès à présent vous connecter à votre espace de gestion, configurer vos boutiques, ajouter votre catalogue de produits et commencer vos encaissements en caisse.</p>

<div class="btn-container">
    <a href="{{ $loginUrl ?? 'https://pos.dlscorporation.ci' }}" class="btn">Accéder à ApexPOS</a>
</div>

<p style="font-size: 13px; color: #64748b;"><em>Remarque : Pour des raisons de sécurité, ne partagez jamais votre mot de passe ni vos PINs de caisse.</em></p>
@endsection
