<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>{{ $title }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 11px; color: #1e293b; margin: 0; padding: 20px; }
        .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 12px; }
        .header-table td { vertical-align: top; }
        .company-title { font-size: 18px; font-weight: bold; color: #1e3a8a; }
        .doc-title-banner { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px 16px; margin-bottom: 20px; border-radius: 4px; }
        .doc-title { font-size: 16px; font-weight: bold; color: #0f172a; margin: 0; }
        .doc-subtitle { font-size: 11px; color: #64748b; margin-top: 4px; }
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .data-table th { background: #1e293b; color: #ffffff; padding: 8px 10px; font-weight: bold; text-align: left; font-size: 10px; text-transform: uppercase; }
        .data-table td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-size: 10.5px; }
        .data-table tr:nth-child(even) td { background: #f8fafc; }
        .totals-table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; }
        .totals-table td { padding: 6px 12px; font-weight: bold; text-align: right; }
        .totals-row { background: #eff6ff; border-top: 2px solid #3b82f6; font-size: 12px; color: #1e3a8a; }
        .footer-table { width: 100%; border-collapse: collapse; margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 9px; color: #64748b; }
        .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; }
        .discrepancy-banner { background: #fffbebf8; border: 1px solid #f59e0b; color: #92400e; padding: 8px 12px; border-radius: 4px; font-size: 9.5px; margin-bottom: 15px; }
    </style>
</head>
<body>

    <!-- EN-TÊTE DU DOCUMENT -->
    <table className="header-table">
        <tr>
            <td style="width: 60%;">
                <div className="company-title">{{ $companyName }}</div>
                <div style="color: #64748b; margin-top: 3px;">Code Entreprise : <strong>{{ $companyCode }}</strong></div>
                <div style="color: #64748b; margin-top: 2px;">Boutique : <strong>{{ $branchName }}</strong></div>
            </td>
            <td style="width: 40%; text-align: right;">
                <div style="font-size: 14px; font-weight: bold; color: #3b82f6;">APEXPOS ENTERPRISE</div>
                <div style="color: #64748b; font-size: 9px; margin-top: 4px;">UUID: {{ $documentUuid }}</div>
                <div style="color: #64748b; font-size: 9px; margin-top: 2px;">Généré le : {{ $generatedAt }}</div>
                <div style="color: #64748b; font-size: 9px; margin-top: 2px;">Généré par : <strong>{{ $userName }}</strong></div>
            </td>
        </tr>
    </table>

    <!-- BANNIÈRE AVERTISSEMENT SI DONNÉES LOCALES HORS LIGNE -->
    @if (!empty($data['is_offline_local_data']))
        <div className="discrepancy-banner">
            ⚠️ <strong>AVERTISSEMENT :</strong> Document généré à partir des données locales — synchronisation serveur non confirmée.
        </div>
    @endif

    <!-- BANNIÈRE TITRE DU RAPPORT -->
    <div className="doc-title-banner">
        <h1 className="doc-title">{{ $title }}</h1>
        @if ($subtitle)
            <div className="doc-subtitle">{{ $subtitle }}</div>
        @endif
    </div>

    <!-- TABLEAU PRINCIPAL DE DONNÉES -->
    <table className="data-table">
        <thead>
            <tr>
                @foreach ($columns as $col)
                    <th style="text-align: {{ $col['align'] ?? 'left' }};">{{ $col['label'] }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @forelse ($rows as $row)
                <tr>
                    @foreach ($columns as $col)
                        @php
                            $val = $row[$col['key']] ?? '—';
                        @endphp
                        <td style="text-align: {{ $col['align'] ?? 'left' }};">
                            {{ is_array($val) ? json_encode($val) : $val }}
                        </td>
                    @endforeach
                </tr>
            @empty
                <tr>
                    <td colspan="{{ count($columns) }}" style="text-align: center; color: #94a3b8; padding: 20px;">
                        Aucune donnée enregistrée pour cette sélection.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- TOTAUX & SYNTHÈSE -->
    @if (!empty($totals))
        <table className="totals-table">
            @foreach ($totals as $label => $amount)
                <tr className="totals-row">
                    <td>{{ $label }} :</td>
                    <td style="width: 180px;">{{ is_numeric($amount) ? number_format($amount, 0, ',', ' ') . ' FCFA' : $amount }}</td>
                </tr>
            @endforeach
        </table>
    @endif

    <!-- PIED DE PAGE -->
    <table className="footer-table">
        <tr>
            <td>ApexPOS &bull; Logiciel de Gestion de Caisse Enterprise Multi-Boutiques</td>
            <td style="text-align: right;">Document certifié &bull; Page 1/1</td>
        </tr>
    </table>

</body>
</html>
