@extends('emails.layouts.apexpos')

@section('content')
<h1>Confirmation de modification du mot de passe ✅</h1>

<p>Bonjour <strong>{{ $user['name'] }}</strong>,</p>

<p>Nous vous confirmons que le mot de passe de votre compte ApexPOS (<strong>{{ $user['email'] }}</strong>) a été modifié avec succès.</p>

<div class="info-card" style="border-left-color: #22c55e;">
    <table>
        <tr>
            <td class="label">Compte :</td>
            <td class="value">{{ $user['email'] }}</td>
        </tr>
        <tr>
            <td class="label">Date de modification :</td>
            <td class="value">{{ now()->format('d/m/Y à H:i') }} GMT</td>
        </tr>
    </table>
</div>

<p>Si vous êtes bien à l'origine de cette action, aucune démarche supplémentaire n'est requise.</p>

<div class="info-card" style="border-left-color: #ef4444; background-color: #fef2f2;">
    <p style="margin: 0; font-size: 13px; color: #991b1b;">
        🚨 <strong>Alerte Sécurité :</strong> Si vous n'avez pas demandé ce changement, veuillez contacter immédiatement votre administrateur ou le support ApexPOS à <a href="mailto:infos@dlscorporation.ci" style="color: #b91c1c;">infos@dlscorporation.ci</a> pour sécuriser votre compte.
    </p>
</div>
@endsection
