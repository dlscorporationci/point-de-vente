import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { offlineStorage } from '../services/offlineStorage';
import { useRealtime } from '../hooks/useRealtime';

export const Dashboard = ({ setActiveTab }) => {
  const { user, activeBranch, assignedBranches, logout } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (navigator.onLine) {
        const res = await axios.get('/v1/dashboard/stats');
        const pendingSales = offlineStorage.getPendingSales();
        const pendingTotal = pendingSales.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0);
        const pendingCount = pendingSales.length;

        const serverData = res.data || {};
        const combinedData = {
          ...serverData,
          today_ca: (parseFloat(serverData.today_ca) || 0) + pendingTotal,
          today_transactions: (parseInt(serverData.today_transactions) || 0) + pendingCount
        };

        setData(combinedData);
        localStorage.setItem('apexpos_cached_dashboard_stats', JSON.stringify(serverData));
      } else {
        const cached = localStorage.getItem('apexpos_cached_dashboard_stats');
        const baseStats = cached ? JSON.parse(cached) : {
          today_ca: 0,
          today_transactions: 0,
          cash_session: { status: 'open' },
          stock_alerts: 0,
          incoming_transfers: 0
        };

        const pendingSales = offlineStorage.getPendingSales();
        const pendingTotal = pendingSales.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0);
        const pendingCount = pendingSales.length;

        setData({
          ...baseStats,
          today_ca: (parseFloat(baseStats.today_ca) || 0) + pendingTotal,
          today_transactions: (parseInt(baseStats.today_transactions) || 0) + pendingCount,
          cash_session: baseStats.cash_session || { status: 'open' }
        });
      }
    } catch (err) {
      const cached = localStorage.getItem('apexpos_cached_dashboard_stats');
      const baseStats = cached ? JSON.parse(cached) : {
        today_ca: 0,
        today_transactions: 0,
        cash_session: { status: 'open' },
        stock_alerts: 0,
        incoming_transfers: 0
      };

      const pendingSales = offlineStorage.getPendingSales();
      const pendingTotal = pendingSales.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0);
      const pendingCount = pendingSales.length;

      setData({
        ...baseStats,
        today_ca: (parseFloat(baseStats.today_ca) || 0) + pendingTotal,
        today_transactions: (parseInt(baseStats.today_transactions) || 0) + pendingCount,
        cash_session: baseStats.cash_session || { status: 'open' }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Abonnement temps réel pour actualiser les métriques du tableau de bord sans F5
  useRealtime(
    [
      'sale_created',
      'sale_cancelled',
      'stock_updated',
      'cash_session_opened',
      'cash_session_closed',
      'transfer_created',
      'transfer_received'
    ],
    useCallback(() => {
      fetchDashboardStats();
    }, [fetchDashboardStats]),
    { pullOnEvent: true }
  );

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats, activeBranch?.id]);

  const role = user?.role?.slug || user?.role?.name || user?.role;
  const isSuperAdmin = role === 'super-admin';
  const isAdmin = role === 'admin' || isSuperAdmin;
  const isGerant = role === 'gerant';
  const isCashierOrSeller = role === 'caissier' || role === 'vendeur';
  const isStockKeeper = role === 'magasinier';

  const allowedModulesList = user?.access_zone?.allowed_modules;
  const canAccessModule = (tabKey) => {
    if (isAdmin) return true;
    if (!allowedModulesList || !Array.isArray(allowedModulesList) || allowedModulesList.length === 0) return true;
    const alwaysAllowed = ['home', 'dashboard', 'auth', 'userguide', 'notifications', 'sync-center', 'select-branch'];
    if (alwaysAllowed.includes(tabKey)) return true;
    return allowedModulesList.includes(tabKey);
  };

  const formatMoney = (amount) => {
    return (amount || 0).toLocaleString('fr-FR') + ' XOF';
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="dashboard-container">
      {/* ── HEADER D'ESPACE DE TRAVAIL ── */}
      <div className="dashboard-welcome-banner card">
        <div className="welcome-left">
          <div className="welcome-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="welcome-greeting">
              Bonjour, <strong>{user?.name}</strong> 👋
              <span className="role-chip badge">{user?.role?.name || role || 'Opérateur'}</span>
            </div>
            <div className="welcome-sub">
              <span><i className="fa-solid fa-building me-1 text-primary"></i> <strong>{user?.company?.name || 'ApexPOS'}</strong></span>
              <span className="mx-2">•</span>
              <span><i className="fa-solid fa-shop me-1 text-success"></i> Boutique Active : <strong>{activeBranch?.name || user?.branch?.name || 'Toutes les boutiques'}</strong></span>
            </div>
          </div>
        </div>

        <div className="welcome-actions">
          {assignedBranches && assignedBranches.length > 1 && (
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={() => setActiveTab('select-branch')}
            >
              <i className="fa-solid fa-right-left me-1"></i> Changer d'espace
            </button>
          )}
          {canAccessModule('pos') && (
            <button 
              className="btn btn-primary btn-sm ms-2"
              onClick={() => setActiveTab('pos')}
            >
              <i className="fa-solid fa-cash-register me-1"></i> Ouvrir le POS
            </button>
          )}
          <button 
            className="btn btn-outline-danger btn-sm ms-2"
            onClick={() => {
              logout();
              if (setActiveTab) setActiveTab('auth');
            }}
            title="Se déconnecter de la session"
          >
            <i className="fa-solid fa-right-from-bracket me-1"></i> Déconnexion
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mb-4 d-flex align-items-center justify-content-between">
          <div><i className="fa-solid fa-triangle-exclamation me-2"></i> {error}</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(error.includes('Session expirée') || error.includes('re-connecter')) && (
              <button className="btn btn-sm btn-primary" onClick={() => setActiveTab && setActiveTab('auth')}>
                <i className="fa-solid fa-key me-1"></i> Se Reconnecter
              </button>
            )}
            <button className="btn btn-sm btn-outline-danger" onClick={fetchDashboardStats}>Réessayer</button>
          </div>
        </div>
      )}

      {/* ── GRILLE DES KPIS ── */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2 text-muted">Chargement des données de la boutique...</p>
        </div>
      ) : (
        <>
          <div className="kpi-grid">
            {/* KPI 1 : CA du Jour */}
            <div className="kpi-card card">
              <div className="kpi-icon-box" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <div className="kpi-info">
                <span className="kpi-label">CA du Jour</span>
                <h3 className="kpi-value" style={{ color: '#3b82f6' }}>
                  {formatMoney(data?.stats?.today_ca)}
                </h3>
                <span className="kpi-subtext">Ventes encaissées aujourd'hui</span>
              </div>
            </div>

            {/* KPI 2 : Ventes du Jour */}
            <div className="kpi-card card">
              <div className="kpi-icon-box" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                <i className="fa-solid fa-receipt"></i>
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Transactions</span>
                <h3 className="kpi-value" style={{ color: '#10b981' }}>
                  {data?.stats?.today_sales_count || 0}
                </h3>
                <span className="kpi-subtext">Tickets de caisse validés</span>
              </div>
            </div>

            {/* KPI 3 : Session Caisse */}
            <div className="kpi-card card" onClick={() => setActiveTab('cash-sessions')} style={{ cursor: 'pointer' }}>
              <div className="kpi-icon-box" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                <i className="fa-solid fa-money-bill-wave"></i>
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Session Caisse</span>
                <h3 className="kpi-value" style={{ fontSize: '18px', marginTop: '4px' }}>
                  {data?.active_cash_session ? (
                    <span className="text-success"><i className="fa-solid fa-circle-check me-1"></i> Ouverte</span>
                  ) : (
                    <span className="text-danger"><i className="fa-solid fa-lock me-1"></i> Fermée</span>
                  )}
                </h3>
                <span className="kpi-subtext">
                  {data?.active_cash_session 
                    ? `Fond : ${formatMoney(data.active_cash_session.opening_amount)}`
                    : 'Cliquer pour ouvrir'}
                </span>
              </div>
            </div>

            {/* KPI 4 : Stock & Alertes */}
            <div className="kpi-card card" onClick={() => setActiveTab('stocks')} style={{ cursor: 'pointer' }}>
              <div className="kpi-icon-box" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
                <i className="fa-solid fa-layer-group"></i>
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Alertes Stock</span>
                <h3 className="kpi-value" style={{ color: data?.stats?.low_stock_count > 0 ? '#ef4444' : 'var(--text-main)' }}>
                  {data?.stats?.low_stock_count || 0}
                </h3>
                <span className="kpi-subtext">Articles sous le seuil critique</span>
              </div>
            </div>

            {/* KPI 5 : Transferts en attente */}
            <div className="kpi-card card" onClick={() => setActiveTab('transfers')} style={{ cursor: 'pointer' }}>
              <div className="kpi-icon-box" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
                <i className="fa-solid fa-right-left"></i>
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Transferts Entrants</span>
                <h3 className="kpi-value" style={{ color: '#8b5cf6' }}>
                  {data?.stats?.pending_transfers_count || 0}
                </h3>
                <span className="kpi-subtext">À réceptionner ou valider</span>
              </div>
            </div>
          </div>

          {/* ── ACCÈS RAPIDES SELON RÔLE ET ZONE D'ACCÈS ── */}
          <div className="quick-actions-bar card mb-4">
            <h4 className="quick-title">
              <i className="fa-solid fa-bolt text-warning me-2"></i> Raccourcis Opérationnels
            </h4>
            <div className="quick-buttons">
              {canAccessModule('pos') && (
                <button className="quick-btn" onClick={() => setActiveTab('pos')}>
                  <i className="fa-solid fa-cash-register text-primary"></i>
                  <span>Caisse Tactile</span>
                </button>
              )}
              {canAccessModule('catalog') && (
                <button className="quick-btn" onClick={() => setActiveTab('catalog')}>
                  <i className="fa-solid fa-box text-success"></i>
                  <span>Catalogue</span>
                </button>
              )}
              {canAccessModule('stocks') && (
                <>
                  <button className="quick-btn" onClick={() => setActiveTab('stocks')}>
                    <i className="fa-solid fa-boxes-stacked text-warning"></i>
                    <span>Gestion Stocks</span>
                  </button>
                  <button className="quick-btn" onClick={() => setActiveTab('stocks')}>
                    <i className="fa-solid fa-screwdriver-wrench text-danger"></i>
                    <span>Ajuster le Stock</span>
                  </button>
                </>
              )}
              {canAccessModule('transfers') && (
                <button className="quick-btn" onClick={() => setActiveTab('transfers')}>
                  <i className="fa-solid fa-right-left text-info"></i>
                  <span>Transferts Stocks</span>
                </button>
              )}
              {canAccessModule('sales') && (
                <button className="quick-btn" onClick={() => setActiveTab('sales')}>
                  <i className="fa-solid fa-receipt text-purple"></i>
                  <span>Historique Ventes</span>
                </button>
              )}
              {(isAdmin || isGerant) && canAccessModule('reports') && (
                <button className="quick-btn" onClick={() => setActiveTab('reports')}>
                  <i className="fa-solid fa-chart-pie text-danger"></i>
                  <span>Rapports CA</span>
                </button>
              )}
            </div>
          </div>

          {/* ── VENTES RÉCENTES DE LA BOUTIQUE ACTIVE ── */}
          <div className="recent-sales-section card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="section-title m-0">
                <i className="fa-solid fa-clock-rotate-left me-2 text-primary"></i>
                Dernières Ventes de la boutique ({activeBranch?.name || 'Active'})
              </h4>
              <button className="btn btn-link btn-sm p-0" onClick={() => setActiveTab('sales')}>
                Voir l'historique complet <i className="fa-solid fa-arrow-right ms-1"></i>
              </button>
            </div>

            {!data?.recent_sales || data.recent_sales.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <i className="fa-solid fa-receipt mb-2" style={{ fontSize: '32px' }}></i>
                <p className="m-0">Aucune vente enregistrée aujourd'hui pour cet espace de travail.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle m-0">
                  <thead>
                    <tr>
                      <th>N° Ticket</th>
                      <th>Client</th>
                      <th>Opérateur</th>
                      <th>Heure</th>
                      <th>Paiement</th>
                      <th className="text-end">Montant Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent_sales.map((sale) => (
                      <tr key={sale.id}>
                        <td>
                          <strong>{sale.sale_number}</strong>
                        </td>
                        <td>{sale.client_name}</td>
                        <td>
                          <span className="badge bg-light text-dark">
                            <i className="fa-solid fa-user me-1 text-muted"></i> {sale.user_name}
                          </span>
                        </td>
                        <td>{formatTime(sale.created_at)}</td>
                        <td>
                          <span className="badge bg-info text-dark">
                            {sale.payment_method === 'cash' ? 'Espèces' : sale.payment_method === 'card' ? 'Carte' : sale.payment_method}
                          </span>
                        </td>
                        <td className="text-end">
                          <strong className="text-primary">{formatMoney(sale.total)}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        .dashboard-container {
          padding: 24px 0;
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-welcome-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 30px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
          background: linear-gradient(135deg, var(--bg-card), var(--bg-input));
        }

        .welcome-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .welcome-avatar {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--color-primary), #10b981);
          color: white;
          font-size: 24px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .welcome-greeting {
          font-size: 20px;
          font-family: var(--font-title);
          margin-bottom: 4px;
        }

        .role-chip {
          margin-left: 10px;
          background: rgba(59, 130, 246, 0.15);
          color: var(--color-primary);
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 20px;
          font-weight: 700;
        }

        .welcome-sub {
          font-size: 13px;
          color: var(--text-muted);
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .kpi-card {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .kpi-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }

        .kpi-icon-box {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }

        .kpi-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .kpi-value {
          font-family: var(--font-title);
          font-weight: 900;
          font-size: 22px;
          margin: 2px 0;
        }

        .kpi-subtext {
          font-size: 11px;
          color: var(--text-muted);
        }

        .quick-actions-bar {
          padding: 20px 24px;
        }

        .quick-title {
          font-size: 15px;
          font-family: var(--font-title);
          font-weight: 800;
          margin-bottom: 16px;
        }

        .quick-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 12px;
        }

        .quick-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 12px;
          border-radius: 12px;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-btn i {
          font-size: 24px;
        }

        .quick-btn:hover {
          background: var(--bg-card);
          border-color: var(--color-primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .recent-sales-section {
          padding: 24px;
        }

        .section-title {
          font-family: var(--font-title);
          font-size: 16px;
          font-weight: 800;
        }
      `}</style>
    </div>
  );
};
