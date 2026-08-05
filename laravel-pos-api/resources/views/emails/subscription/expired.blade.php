@extends('emails.layouts.apexpos')

@section('content')
<h1>Alerte : Votre abonnement ApexPOS a expiré 🔴</h1>

<p>Bonjour <strong>{{ $user['name'] ?? 'Administrateur' }}</strong>,</p>

<p>L'abonnement ApexPOS de l'entreprise <strong>{{ $company['name'] }}</strong> est arrivé à terme le <strong>{{ $expiredAt }}</strong> et n'a pas été renouvelé.</p>

<div class="info-card" style="border-left-color: #ef4444; background-color: #fef2f2;">
    <table>
        <tr>
            <td class="label">Entreprise :</td>
            <td class="value">{{ $company['name'] }}</td>
        </tr>
        <tr>
            <td class="label">Statut Actuel :</td>
            <td class="value"><span class="badge badge-danger">EXPIRÉ / SUSPENDU</span></td>
        </tr>
        <tr>
            <td class="label">Date de Fin :</td>
            <td class="value" style="color: #dc2626;">{{ $expiredAt }}</td>
        </tr>
    </table>
</div>

<p>L'accès aux encaissements et aux paramètres de l'entreprise est restreint jusqu'à la régularisation de votre compte.</p>

<div class="btn-container">
    <a href="{{ $appUrl ?? 'http://localhost:5173' }}" class="btn" style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);">Réactiver immédiatement</a>
</div>
@endsection
