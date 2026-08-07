@extends('emails.layouts.apexpos')

@section('content')
<h1>Notification de Maintenance Système 🛠️</h1>

<p>Bonjour,</p>

<p>Le département technique de DLS POS vous informe d'une intervention de maintenance sur la plateforme SaaS.</p>

<div class="info-card" style="border-left-color: {{ $status === 'started' ? '#ef4444' : ($status === 'completed' ? '#22c55e' : '#3b82f6') }};">
    <table>
        <tr>
            <td class="label">Sujet / Motif :</td>
            <td class="value"><strong>{{ $title }}</strong></td>
        </tr>
        <tr>
            <td class="label">Statut Intervention :</td>
            <td class="value">
                @if($status === 'scheduled')
                    <span class="badge badge-info">PROGRAMMÉE</span>
                @elseif($status === 'started')
                    <span class="badge badge-danger">EN COURS</span>
                @else
                    <span class="badge badge-success">TERMINÉE</span>
                @endif
            </td>
        </tr>
        @if(!empty($startsAt))
        <tr>
            <td class="label">Début Prévu :</td>
            <td class="value">{{ $startsAt }}</td>
        </tr>
        @endif
        @if(!empty($endsAt))
        <tr>
            <td class="label">Fin Prévue / Effective :</td>
            <td class="value">{{ $endsAt }}</td>
        </tr>
        @endif
    </table>
</div>

<p>{{ $messageBody }}</p>

<p style="font-size: 13px; color: #64748b;">Nous vous remercions pour votre compréhension pendant cette intervention visant à améliorer les performances et la sécurité de DLS POS.</p>
@endsection
