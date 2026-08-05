@extends('emails.layouts.apexpos')

@section('content')
<h1>Rappel : Votre abonnement expire prochainement ⚠️</h1>

<p>Bonjour <strong>{{ $user['name'] ?? 'Administrateur' }}</strong>,</p>

<p>Nous vous rappelons que l'abonnement ApexPOS de l'entreprise <strong>{{ $company['name'] }}</strong> arrive à échéance sous <strong>{{ $daysRemaining }} jour(s)</strong>.</p>

<div class="info-card" style="border-left-color: #f59e0b; background-color: #fffbeb;">
    <table>
        <tr>
            <td class="label">Entreprise :</td>
            <td class="value">{{ $company['name'] }}</td>
        </tr>
        <tr>
            <td class="label">Formule Actuelle :</td>
            <td class="value"><span class="badge badge-warning">{{ strtoupper($company['subscription_plan'] ?? 'PRO') }}</span></td>
        </tr>
        <tr>
            <td class="label">Date d'Expiration :</td>
            <td class="value" style="color: #d97706; font-size: 16px;">{{ $expiresAt }}</td>
        </tr>
        <tr>
            <td class="label">Délai Restant :</td>
            <td class="value"><strong>{{ $daysRemaining }} jour(s)</strong></td>
        </tr>
    </table>
</div>

<p>Pour éviter toute interruption de vos sessions de caisse et conserver l'accès continu à votre portail de gestion, veuillez procéder au renouvellement de votre abonnement.</p>

<div class="btn-container">
    <a href="{{ $appUrl ?? 'http://localhost:5173' }}" class="btn" style="background: linear-gradient(135deg, #d97706 0%, #b45309 100%);">Renouveler mon abonnement</a>
</div>
@endsection
