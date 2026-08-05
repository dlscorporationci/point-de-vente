@extends('emails.layouts.apexpos')

@section('content')
<h1>Abonnement SaaS Activé / Renouvelé 🚀</h1>

<p>Bonjour <strong>{{ $user['name'] ?? 'Administrateur' }}</strong>,</p>

<p>Nous avons le plaisir de vous informer que l'abonnement ApexPOS de votre entreprise <strong>{{ $company['name'] }}</strong> a été activé / renouvelé avec succès.</p>

<div class="info-card">
    <table>
        <tr>
            <td class="label">Entreprise :</td>
            <td class="value">{{ $company['name'] }}</td>
        </tr>
        <tr>
            <td class="label">Formule Choisie :</td>
            <td class="value"><span class="badge badge-success">{{ strtoupper($subscription['plan_name'] ?? $company['subscription_plan'] ?? 'PRO') }}</span></td>
        </tr>
        <tr>
            <td class="label">Statut Abonnement :</td>
            <td class="value"><span class="badge badge-success">ACTIF</span></td>
        </tr>
        @if(!empty($subscription['starts_at']))
        <tr>
            <td class="label">Date de Début :</td>
            <td class="value">{{ \Carbon\Carbon::parse($subscription['starts_at'])->format('d/m/Y') }}</td>
        </tr>
        @endif
        @if(!empty($subscription['ends_at']))
        <tr>
            <td class="label">Date d'Échéance :</td>
            <td class="value">{{ \Carbon\Carbon::parse($subscription['ends_at'])->format('d/m/Y') }}</td>
        </tr>
        @endif
        @if(!empty($payment['amount']))
        <tr>
            <td class="label">Montant Règlement :</td>
            <td class="value" style="color: #16a34a; font-size: 16px;">{{ number_format($payment['amount'], 0, ',', ' ') }} XOF</td>
        </tr>
        @endif
        @if(!empty($payment['payment_reference']))
        <tr>
            <td class="label">Référence Paiement :</td>
            <td class="value"><code>{{ $payment['payment_reference'] }}</code></td>
        </tr>
        @endif
    </table>
</div>

<p>Vos accès, boutiques et fonctionnalités restent pleinement opérationnels sans interruption.</p>

<div class="btn-container">
    <a href="{{ $appUrl ?? 'http://localhost:5173' }}" class="btn">Accéder au Backoffice ApexPOS</a>
</div>
@endsection
