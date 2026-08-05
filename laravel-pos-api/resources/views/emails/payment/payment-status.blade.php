@extends('emails.layouts.apexpos')

@section('content')
@if(($payment['status'] ?? 'paid') === 'paid')
    <h1>Confirmation de Règlement d'Abonnement 💳</h1>

    <p>Bonjour <strong>{{ $user['name'] ?? 'Administrateur' }}</strong>,</p>

    <p>Nous vous confirmons la bonne réception de votre paiement concernant l'entreprise <strong>{{ $company['name'] }}</strong>.</p>

    <div class="info-card" style="border-left-color: #16a34a;">
        <table>
            <tr>
                <td class="label">Entreprise :</td>
                <td class="value">{{ $company['name'] }}</td>
            </tr>
            <tr>
                <td class="label">Montant Réglé :</td>
                <td class="value" style="color: #16a34a; font-size: 18px;">{{ number_format($payment['amount'], 0, ',', ' ') }} XOF</td>
            </tr>
            <tr>
                <td class="label">Mode de Règlement :</td>
                <td class="value">{{ strtoupper($payment['payment_method'] ?? 'Cash') }}</td>
            </tr>
            <tr>
                <td class="label">Référence Transaction :</td>
                <td class="value"><code>{{ $payment['payment_reference'] }}</code></td>
            </tr>
            <tr>
                <td class="label">Date de Règlement :</td>
                <td class="value">{{ \Carbon\Carbon::parse($payment['payment_date'] ?? now())->format('d/m/Y H:i') }}</td>
            </tr>
        </table>
    </div>

    <p>Votre facture correspondante est disponible en téléchargement dans votre espace abonnement.</p>
@else
    <h1>Échec du Règlement d'Abonnement ❌</h1>

    <p>Bonjour <strong>{{ $user['name'] ?? 'Administrateur' }}</strong>,</p>

    <p>La tentative de règlement concernant l'entreprise <strong>{{ $company['name'] }}</strong> n'a pas pu être validée.</p>

    <div class="info-card" style="border-left-color: #ef4444; background-color: #fef2f2;">
        <table>
            <tr>
                <td class="label">Montant Tenté :</td>
                <td class="value" style="color: #dc2626;">{{ number_format($payment['amount'], 0, ',', ' ') }} XOF</td>
            </tr>
            <tr>
                <td class="label">Motif / Erreur :</td>
                <td class="value">{{ $payment['error_message'] ?? 'Transaction annulée ou rejetée par l’opérateur.' }}</td>
            </tr>
        </table>
    </div>

    <div class="btn-container">
        <a href="{{ $appUrl ?? 'http://localhost:5173' }}" class="btn" style="background: #dc2626;">Réessayer le paiement</a>
    </div>
@endif
@endsection
