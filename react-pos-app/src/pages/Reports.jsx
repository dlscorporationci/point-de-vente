import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

export const Reports = () => {
  const { token } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtres
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1); // Début du mois
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const fetchReport = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/v1/reports/summary', {
        params: {
          start_date: startDate,
          end_date: endDate,
        }
      });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du calcul du rapport analytique.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [token, startDate, endDate]);

  if (!data && loading) {
    return <div className="reports-container"><div className="empty-state">Génération des rapports...</div></div>;
  }

  const sales = data?.sales || { count: 0, total_ttc: 0, total_ht: 0, tax: 0, discount: 0, breakdown: { cash: 0, card: 0 } };
  const margins = data?.margins || { revenue_ht: 0, cogs: 0, margin: 0, margin_percentage: 0 };
  const agedBalance = data?.aged_balance || { days_0_30: 0, days_31_60: 0, days_61_90: 0, days_90_plus: 0, total_debt: 0 };
  const stockValuation = data?.stock_valuation || { value_at_cost: 0, value_at_selling: 0, potential_profit: 0 };
  const topProducts = data?.top_products || [];

  return (
    <div className="reports-container">
      <div className="decorator-sphere sphere-1"></div>
      <div className="decorator-sphere sphere-2"></div>

      <div className="reports-layout card">
        <div className="reports-header no-print">
          <div>
            <h2 className="section-title"><i className="fa-solid fa-chart-line me-2 text-primary"></i> Rapports de Clôture & Marges</h2>
            <p className="section-subtitle">Analysez les ventes, la TVA collectée, les marges sur PAMP et la balance âgée.</p>
          </div>
          <div className="actions-header">
            <button onClick={() => window.print()} className="btn btn-primary">
              <i className="fa-solid fa-print me-1"></i> Exporter le Rapport (PDF)
            </button>
          </div>
        </div>

        {/* Section imprimable uniquement (titre officiel) */}
        <div className="print-only-header">
          <h1>APEXPOS - RAPPORT DE CLÔTURE ET FINANCIER</h1>
          <p>Période du : <strong>{new Date(startDate).toLocaleDateString('fr-FR')}</strong> au <strong>{new Date(endDate).toLocaleDateString('fr-FR')}</strong></p>
          <hr />
        </div>

        {error && <div className="error-banner"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}

        {/* Filtres de Date */}
        <div className="filter-bar no-print">
          <div className="filter-item">
            <label className="form-label">Date de début</label>
            <input 
              type="date" 
              className="form-control" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="filter-item">
            <label className="form-label">Date de fin</label>
            <input 
              type="date" 
              className="form-control" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="filter-item btn-refresh-item">
            <button onClick={fetchReport} className="btn btn-secondary" style={{ width: '100%' }}><i className="fa-solid fa-arrows-rotate me-1"></i> Rafraîchir</button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-icon"><i className="fa-solid fa-coins text-success"></i></span>
            <div className="kpi-info">
              <span className="kpi-label">Volume Ventes TTC</span>
              <span className="kpi-val">{new Intl.NumberFormat('fr-FR').format(sales.total_ttc)} XOF</span>
              <span className="kpi-subtext">{sales.count} transaction(s) effectuée(s)</span>
            </div>
          </div>

          <div className="kpi-card">
            <span className="kpi-icon"><i className="fa-solid fa-landmark text-info"></i></span>
            <div className="kpi-info">
              <span className="kpi-label">TVA Collectée (18%)</span>
              <span className="kpi-val">{new Intl.NumberFormat('fr-FR').format(sales.tax)} XOF</span>
              <span className="kpi-subtext">Basée sur le montant net HT</span>
            </div>
          </div>

          <div className="kpi-card">
            <span className="kpi-icon"><i className="fa-solid fa-chart-line text-warning"></i></span>
            <div className="kpi-info">
              <span className="kpi-label">Marge Brute</span>
              <span className="kpi-val">{new Intl.NumberFormat('fr-FR').format(margins.margin)} XOF</span>
              <span className="kpi-subtext">Taux moyen de {margins.margin_percentage}% sur PAMP</span>
            </div>
          </div>

          <div className="kpi-card">
            <span className="kpi-icon"><i className="fa-solid fa-box text-primary"></i></span>
            <div className="kpi-info">
              <span className="kpi-label">Valeur du Stock (Achat)</span>
              <span className="kpi-val">{new Intl.NumberFormat('fr-FR').format(stockValuation.value_at_cost)} XOF</span>
              <span className="kpi-subtext">Valeur de vente potentielle : {new Intl.NumberFormat('fr-FR').format(stockValuation.value_at_selling)} XOF</span>
            </div>
          </div>
        </div>

        {/* Double panneau : Répartition & Top Produits */}
        <div className="report-sections-grid">
          {/* Panneau Répartition Mode de Paiement */}
          <div className="card-panel">
            <h3><i className="fa-solid fa-credit-card me-2 text-primary"></i> Répartition des Règlements</h3>
            <div className="payment-breakdown-list">
              <div className="payment-item">
                <div className="payment-label-row">
                  <span><i className="fa-solid fa-money-bill-1 me-1 text-success"></i> Espèces</span>
                  <span>{new Intl.NumberFormat('fr-FR').format(sales.breakdown.cash)} XOF</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill progress-cash" 
                    style={{ width: `${sales.total_ttc > 0 ? (sales.breakdown.cash / sales.total_ttc) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="payment-item">
                <div className="payment-label-row">
                  <span><i className="fa-solid fa-credit-card me-1 text-warning"></i> Carte Bancaire</span>
                  <span>{new Intl.NumberFormat('fr-FR').format(sales.breakdown.card)} XOF</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill progress-card" 
                    style={{ width: `${sales.total_ttc > 0 ? (sales.breakdown.card / sales.total_ttc) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Panneau Top 5 Produits */}
          <div className="card-panel">
            <h3><i className="fa-solid fa-trophy me-2 text-warning"></i> Top 5 Articles les plus vendus</h3>
            {topProducts.length === 0 ? (
              <div className="empty-state" style={{ padding: '24px 0' }}>Aucune vente enregistrée sur cette période.</div>
            ) : (
              <table className="top-products-table">
                <thead>
                  <tr>
                    <th>Article</th>
                    <th style={{ textAlign: 'center' }}>Quantité</th>
                    <th style={{ textAlign: 'right' }}>Chiffre d'Affaires</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, idx) => (
                    <tr key={idx}>
                      <td><strong>{p.name}</strong></td>
                      <td style={{ textAlign: 'center' }}>{parseFloat(p.qty_sold)}</td>
                      <td style={{ textAlign: 'right' }}>{new Intl.NumberFormat('fr-FR').format(p.revenue_generated)} XOF</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Section Balance Âgée Fournisseurs */}
        <div className="card-panel" style={{ marginTop: '24px' }}>
          <h3><i className="fa-solid fa-handshake me-2 text-info"></i> Balance Âgée Fournisseurs</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Encours de dettes échues groupées par intervalles de jours depuis l'émission du bon d'achat.
          </p>
          <div className="aged-balance-grid">
            <div className="aged-card">
              <span className="aged-interval">0 - 30 Jours</span>
              <span className="aged-val">{new Intl.NumberFormat('fr-FR').format(agedBalance.days_0_30)} XOF</span>
            </div>
            <div className="aged-card">
              <span className="aged-interval">31 - 60 Jours</span>
              <span className="aged-val">{new Intl.NumberFormat('fr-FR').format(agedBalance.days_31_60)} XOF</span>
            </div>
            <div className="aged-card">
              <span className="aged-interval">61 - 90 Jours</span>
              <span className="aged-val">{new Intl.NumberFormat('fr-FR').format(agedBalance.days_61_90)} XOF</span>
            </div>
            <div className="aged-card danger-interval">
              <span className="aged-interval">Plus de 90 Jours</span>
              <span className="aged-val">{new Intl.NumberFormat('fr-FR').format(agedBalance.days_90_plus)} XOF</span>
            </div>
          </div>

          <div className="aged-total-summary">
            <span>Encours total de crédit fournisseur :</span>
            <strong>{new Intl.NumberFormat('fr-FR').format(agedBalance.total_debt)} XOF</strong>
          </div>
        </div>
      </div>

      <style>{`
        .reports-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .reports-layout {
          width: 100%;
          max-width: 1200px;
          padding: 24px;
          margin-top: 100px;
          text-align: left;
        }

        .reports-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
          margin-bottom: 24px;
        }

        .filter-bar {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          align-items: flex-end;
          background: rgba(255, 255, 255, 0.03);
          padding: 16px;
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--border-color);
        }

        .filter-item {
          flex: 1;
        }

        .btn-refresh-item {
          flex: 0 0 140px;
        }

        /* KPI */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .kpi-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          backdrop-filter: var(--backdrop-blur);
        }

        .kpi-icon {
          font-size: 32px;
        }

        .kpi-info {
          display: flex;
          flex-direction: column;
        }

        .kpi-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .kpi-val {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-main);
          margin: 4px 0;
        }

        .kpi-subtext {
          font-size: 11px;
          color: var(--text-muted);
        }

        /* Grid sections */
        .report-sections-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .card-panel {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 20px;
        }

        .card-panel h3 {
          font-size: 16px;
          margin-bottom: 16px;
          font-family: var(--font-title);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 8px;
        }

        /* Pay breakdown */
        .payment-breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .payment-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 6px;
        }

        .progress-bar-bg {
          width: 100%;
          height: 8px;
          background: var(--border-color);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 4px;
        }

        .progress-cash { background: var(--color-success); }
        .progress-geniuspay { background: var(--color-info); }
        .progress-card { background: #9b59b6; }

        /* Top products table */
        .top-products-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .top-products-table th, .top-products-table td {
          padding: 10px;
          border-bottom: 1px solid var(--border-color);
        }

        .top-products-table th {
          text-align: left;
          color: var(--text-muted);
        }

        /* Aged balance */
        .aged-balance-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .aged-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .aged-interval {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 700;
        }

        .aged-val {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-main);
        }

        .danger-interval {
          border-color: rgba(237, 28, 36, 0.4);
          background: rgba(237, 28, 36, 0.05);
        }

        .danger-interval .aged-val {
          color: var(--color-error);
        }

        .aged-total-summary {
          margin-top: 16px;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          background: rgba(255, 255, 255, 0.05);
          padding: 12px 20px;
          border-radius: 6px;
        }

        .print-only-header {
          display: none;
        }

        /* Print styling */
        @media print {
          body {
            background: #FFF !important;
            color: #000 !important;
          }
          .reports-layout {
            margin-top: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only-header {
            display: block;
            text-align: center;
            color: #000;
          }
          .print-only-header h1 {
            font-size: 22px;
            margin-bottom: 4px;
          }
          .kpi-card, .card-panel, .aged-card {
            background: transparent !important;
            border: 1px solid #000 !important;
            color: #000 !important;
          }
          .kpi-val, .aged-val, .aged-total-summary strong {
            color: #000 !important;
          }
          .progress-bar-bg {
            border: 1px solid #000 !important;
            background: transparent !important;
          }
          .progress-bar-fill {
            background: #000 !important;
          }
        }
      `}</style>
    </div>
  );
};
