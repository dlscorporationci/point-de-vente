import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlobalDateRangeFilter from '../components/GlobalDateRangeFilter';
import { CountUp } from '../components/CountUp';

export const CompanyInspection = ({ companyId, onBack, onExportPdf }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [dateFilter, setDateFilter] = useState({ period: 'this_month', start_date: '', end_date: '' });

  // List States for Sub-tabs
  const [listData, setListData] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Load Overview Data
  const loadOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/v1/admin/companies/${companyId}/overview`, {
        params: {
          period: dateFilter.period,
          start_date: dateFilter.start_date,
          end_date: dateFilter.end_date,
        }
      });
      if (res.data.success) {
        setOverviewData(res.data);
      }
    } catch (err) {
      console.error("Error loading company inspection overview:", err);
      setError(err.response?.data?.message || "Erreur lors du chargement de l'inspection d'entreprise.");
    } finally {
      setLoading(false);
    }
  };

  // Load Subtab List Data
  const loadSubTabList = async (tabName, pageNum = 1, searchQuery = search, statusQuery = filterStatus) => {
    if (tabName === 'overview') return;
    setListLoading(true);
    try {
      const res = await axios.get(`/v1/admin/companies/${companyId}/${tabName}`, {
        params: {
          page: pageNum,
          search: searchQuery,
          status: statusQuery,
          period: dateFilter.period,
          start_date: dateFilter.start_date,
          end_date: dateFilter.end_date,
        }
      });
      if (res.data.success) {
        const paginatedKey = tabName === 'cash-sessions' ? 'cash_sessions' : tabName;
        const dataObj = res.data[paginatedKey];
        if (dataObj && dataObj.data) {
          setListData(dataObj.data);
          setPage(dataObj.current_page || 1);
          setTotalPages(dataObj.last_page || 1);
        } else {
          setListData([]);
        }
      }
    } catch (err) {
      console.error(`Error loading subtab ${tabName}:`, err);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, [companyId, dateFilter]);

  useEffect(() => {
    if (activeTab !== 'overview') {
      setPage(1);
      setSearch('');
      setFilterStatus('');
      loadSubTabList(activeTab, 1, '', '');
    }
  }, [activeTab, companyId, dateFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadSubTabList(activeTab, 1, search, filterStatus);
  };

  const company = overviewData?.company;
  const kpis = overviewData?.kpis;

  return (
    <div className="inspection-root" style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '10px' }}>
      
      {/* ── STYLES CSS AUTO-INCLUS DÉDIÉS À L'INSPECTION ── */}
      <style>{`
        .inspection-root {
          font-family: var(--font-text, 'Inter', sans-serif);
          color: var(--text-main, #1e293b);
        }
        .inspection-header-card {
          background: linear-gradient(135deg, #0F4A86 0%, #1e40af 50%, #0d9488 100%);
          color: #ffffff;
          padding: 24px 28px;
          border-radius: 16px;
          box-shadow: 0 10px 25px -5px rgba(15, 74, 134, 0.25);
          margin-bottom: 24px;
        }
        .inspection-header-card h2 {
          color: #ffffff !important;
          margin: 0;
          font-size: 24px;
          font-weight: 800;
        }
        .inspection-header-card .text-muted-light {
          color: rgba(255, 255, 255, 0.85);
          font-size: 13px;
        }
        .inspection-nav-tabs {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 12px;
          margin-bottom: 24px;
          border-bottom: 2px solid var(--border-color, #e2e8f0);
        }
        .inspection-nav-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 12px;
          border: 1px solid var(--border-color, #e2e8f0);
          background: var(--bg-card, #ffffff);
          color: var(--text-muted, #64748b);
          font-weight: 700;
          font-size: 13.5px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease-in-out;
        }
        .inspection-nav-btn:hover {
          background: rgba(15, 74, 134, 0.06);
          color: #0F4A86;
          border-color: #0F4A86;
          transform: translateY(-1px);
        }
        .inspection-nav-btn.active {
          background: #0F4A86 !important;
          color: #ffffff !important;
          border-color: #0F4A86 !important;
          box-shadow: 0 4px 12px rgba(15, 74, 134, 0.25);
        }
        .inspection-grid-kpis {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 18px;
          margin-bottom: 24px;
        }
        .inspection-kpi-card {
          background: var(--bg-card, #ffffff);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 14px;
          padding: 20px 22px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .inspection-kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
        }
        .inspection-kpi-title {
          font-size: 12px;
          font-weight: 800;
          color: var(--text-muted, #64748b);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .inspection-kpi-val {
          font-size: 26px;
          font-weight: 900;
          line-height: 1.2;
        }
        .inspection-kpi-sub {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted, #64748b);
        }
        .inspection-table-container {
          background: var(--bg-card, #ffffff);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 14px;
          padding: 20px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
        }
        .inspection-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .inspection-table th {
          background: var(--bg-input, #f8fafc);
          color: var(--text-muted, #475569);
          font-size: 11.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 14px 16px;
          border-bottom: 2px solid var(--border-color, #e2e8f0);
        }
        .inspection-table td {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-color, #f1f5f9);
          font-size: 13.5px;
          color: var(--text-main, #1e293b);
        }
        .inspection-table tr:hover td {
          background: var(--bg-hover, #f8fafc);
        }
      `}</style>

      {/* ── EN-TÊTE ULTRA-PREMIUM D'INSPECTION ── */}
      <div className="inspection-header-card">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={onBack}
              className="btn btn-light btn-sm shadow-sm"
              style={{ fontWeight: 800, borderRadius: '10px', padding: '10px 18px', color: '#0F4A86' }}
            >
              <i className="fa-solid fa-arrow-left me-1.5"></i> Retour
            </button>

            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <h2>
                  <i className="fa-solid fa-building me-2"></i>
                  {company?.name || 'Inspection Entreprise'}
                </h2>

                <span className="badge bg-white text-dark px-2.5 py-1 font-bold" style={{ fontSize: '11px', borderRadius: '6px' }}>
                  Code: {company?.code || 'N/A'}
                </span>

                <span className={`badge ${company?.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'} px-2.5 py-1 font-bold`} style={{ fontSize: '11px', borderRadius: '6px', backgroundColor: company?.status === 'active' ? '#10b981' : '#ef4444' }}>
                  {company?.status === 'active' ? '🟢 Actif' : '🔴 Suspendu'}
                </span>

                <span className="badge bg-warning text-dark px-2.5 py-1 font-bold" style={{ fontSize: '11px', borderRadius: '6px' }}>
                  Formule: {(company?.plan || 'starter').toUpperCase()}
                </span>
              </div>

              <div className="inspection-header-card text-muted-light d-flex align-items-center gap-3 flex-wrap mt-2" style={{ padding: 0, background: 'transparent', boxShadow: 'none', margin: 0 }}>
                <span><i className="fa-solid fa-user-shield me-1"></i> Admin: <strong>{company?.admin_user?.name || 'N/A'}</strong> ({company?.admin_user?.email || 'N/A'})</span>
                <span><i className="fa-solid fa-store me-1"></i> <strong>{company?.branches_count || 0}</strong> Boutique(s)</span>
                <span><i className="fa-solid fa-users me-1"></i> <strong>{company?.users_count || 0}</strong> Utilisateur(s)</span>
                <span><i className="fa-solid fa-calendar me-1"></i> Créé le: <strong>{company?.created_at ? new Date(company.created_at).toLocaleDateString('fr-FR') : 'N/A'}</strong></span>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="badge bg-dark text-warning px-3 py-2 border border-warning font-bold" style={{ fontSize: '11px', borderRadius: '8px' }}>
              <i className="fa-solid fa-lock me-1.5"></i> LECTURE SEULE — SUPER ADMIN
            </span>

            <GlobalDateRangeFilter onFilterChange={setDateFilter} />

            {onExportPdf && (
              <button
                onClick={() => onExportPdf(companyId, company?.name)}
                className="btn btn-success btn-sm font-bold shadow-sm"
                style={{ padding: '9px 16px', backgroundColor: '#10b981', borderColor: '#10b981', color: '#fff', borderRadius: '8px' }}
              >
                <i className="fa-solid fa-file-pdf me-1.5"></i> Exporter Rapport PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── BARRE DE NAVIGATION ONGLET DESIGN ÉLÉGANTE ── */}
      <div className="inspection-nav-tabs">
        {[
          { id: 'overview', label: 'Vue Générale', icon: 'fa-chart-pie' },
          { id: 'sales', label: 'Ventes', icon: 'fa-shopping-cart' },
          { id: 'customers', label: 'Clients', icon: 'fa-user-tag' },
          { id: 'suppliers', label: 'Fournisseurs', icon: 'fa-truck-loading' },
          { id: 'products', label: 'Produits & Stocks', icon: 'fa-boxes-stacked' },
          { id: 'purchases', label: 'Achats', icon: 'fa-file-invoice-dollar' },
          { id: 'cash-sessions', label: 'Caisses', icon: 'fa-cash-register' },
          { id: 'transfers', label: 'Transferts', icon: 'fa-arrow-right-arrow-left' },
          { id: 'users', label: 'Utilisateurs', icon: 'fa-users-gear' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inspection-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chargement Général */}
      {loading ? (
        <div className="py-5 text-center">
          <div className="spinner-border text-primary mb-2" role="status" style={{ width: '2.5rem', height: '2.5rem' }}></div>
          <p className="text-muted small font-medium">Chargement des données d'inspection d'entreprise...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger p-3 rounded-3 mb-4">
          <i className="fa-solid fa-triangle-exclamation me-2"></i> {error}
        </div>
      ) : (
        <>
          {/* TAB 1: VUE GÉNÉRALE & KPIS */}
          {activeTab === 'overview' && (
            <div>
              {/* Grille Cartes KPI Stylisées */}
              <div className="inspection-grid-kpis">
                <div className="inspection-kpi-card" style={{ borderLeft: '4px solid #10b981' }}>
                  <span className="inspection-kpi-title">CA Période ({kpis?.period_label || 'Période'})</span>
                  <span className="inspection-kpi-val" style={{ color: '#10b981' }}>
                    <CountUp end={kpis?.period_ca || 0} format={true} /> FCFA
                  </span>
                  <span className="inspection-kpi-sub">Total historique: <strong>{(kpis?.total_ca || 0).toLocaleString('fr-FR')} FCFA</strong></span>
                </div>

                <div className="inspection-kpi-card" style={{ borderLeft: '4px solid #3b82f6' }}>
                  <span className="inspection-kpi-title">Ventes Période</span>
                  <span className="inspection-kpi-val" style={{ color: '#3b82f6' }}>
                    <CountUp end={kpis?.period_sales || 0} format={false} /> Vente(s)
                  </span>
                  <span className="inspection-kpi-sub">Panier Moyen: <strong>{(kpis?.average_cart || 0).toLocaleString('fr-FR')} FCFA</strong></span>
                </div>

                <div className="inspection-kpi-card" style={{ borderLeft: '4px solid #06b6d4' }}>
                  <span className="inspection-kpi-title">Valeur du Stock</span>
                  <span className="inspection-kpi-val" style={{ color: '#06b6d4' }}>
                    <CountUp end={kpis?.stock_value || 0} format={true} /> FCFA
                  </span>
                  <span className="inspection-kpi-sub"><strong>{kpis?.products_count || 0}</strong> Réf ({kpis?.low_stock_count || 0} alertes)</span>
                </div>

                <div className="inspection-kpi-card" style={{ borderLeft: '4px solid #a855f7' }}>
                  <span className="inspection-kpi-title">Portefeuille Clients</span>
                  <span className="inspection-kpi-val" style={{ color: '#a855f7' }}>
                    <CountUp end={kpis?.customers_count || 0} format={false} /> Client(s)
                  </span>
                  <span className="inspection-kpi-sub"><strong>{kpis?.suppliers_count || 0}</strong> Fournisseurs enregistrés</span>
                </div>
              </div>

              {/* Boutiques & Dernières Ventes */}
              <div className="row g-4">
                {/* Liste des boutiques */}
                <div className="col-lg-4">
                  <div className="inspection-table-container h-100">
                    <h5 className="font-bold mb-3 d-flex align-items-center" style={{ fontSize: '16px' }}>
                      <i className="fa-solid fa-store text-primary me-2"></i> Boutiques ({overviewData?.branches?.length || 0})
                    </h5>
                    <div className="d-flex flex-column gap-2.5">
                      {overviewData?.branches?.map((b) => (
                        <div key={b.id} className="p-3 rounded border d-flex justify-content-between align-items-center" style={{ background: 'var(--bg-input, #f8fafc)', borderRadius: '10px' }}>
                          <div>
                            <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>{b.name}</strong>
                            <div className="text-muted small mt-0.5" style={{ fontSize: '11.5px' }}>{b.city || b.address || 'Boutique Principale'}</div>
                          </div>
                          <span className={`badge ${b.is_main ? 'bg-success' : 'bg-secondary'} px-2.5 py-1`} style={{ fontSize: '10.5px' }}>
                            {b.is_main ? 'Principale' : 'Secondaire'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dernières transactions */}
                <div className="col-lg-8">
                  <div className="inspection-table-container h-100">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="font-bold m-0 d-flex align-items-center" style={{ fontSize: '16px' }}>
                        <i className="fa-solid fa-receipt text-primary me-2"></i> Dernières Ventes Enregistrées
                      </h5>
                      <button onClick={() => setActiveTab('sales')} className="btn btn-link btn-sm p-0 text-primary font-bold">Voir tout ➔</button>
                    </div>

                    <div className="table-responsive">
                      <table className="inspection-table">
                        <thead>
                          <tr>
                            <th>Date & Heure</th>
                            <th>N° Ticket</th>
                            <th>Client</th>
                            <th>Boutique</th>
                            <th style={{ textAlign: 'right' }}>Montant</th>
                          </tr>
                        </thead>
                        <tbody>
                          {overviewData?.recent_sales?.map((s) => (
                            <tr key={s.id}>
                              <td className="text-muted small">{new Date(s.created_at).toLocaleString('fr-FR')}</td>
                              <td><strong>{s.sale_number}</strong></td>
                              <td>{s.client_name || s.customer?.name || 'Client de passage'}</td>
                              <td>{s.branch?.name || '-'}</td>
                              <td style={{ textAlign: 'right', fontWeight: 900, color: '#10b981' }}>{s.total?.toLocaleString('fr-FR')} FCFA</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB LIST TEMPLATE (Sales, Customers, Suppliers, Products, Purchases, CashSessions, Transfers, Users) */}
          {activeTab !== 'overview' && (
            <div className="inspection-table-container">
              {/* Barre de Recherche et Filtres */}
              <form onSubmit={handleSearchSubmit} className="d-flex justify-content-between align-items-center gap-3 mb-4 flex-wrap">
                <div style={{ maxWidth: '360px', flex: 1 }}>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={`Rechercher dans ${activeTab}...`}
                    className="form-control"
                    style={{ borderRadius: '8px' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-sm font-bold px-3 py-2"
                >
                  <i className="fa-solid fa-filter me-1.5"></i> Filtrer
                </button>
              </form>

              {/* Tableau Dynamique */}
              {listLoading ? (
                <div className="py-5 text-center text-muted small">
                  <i className="fa-solid fa-spinner fa-spin me-2 text-primary"></i> Chargement des données...
                </div>
              ) : listData.length === 0 ? (
                <div className="empty-state p-5 text-center">
                  <p className="text-muted m-0">Aucun enregistrement trouvé pour cet onglet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="inspection-table">
                    <thead>
                      {activeTab === 'sales' && (
                        <tr>
                          <th>Date</th>
                          <th>Référence</th>
                          <th>Client</th>
                          <th>Boutique</th>
                          <th>Paiement</th>
                          <th style={{ textAlign: 'right' }}>Montant Total</th>
                        </tr>
                      )}
                      {activeTab === 'customers' && (
                        <tr>
                          <th>Nom Client</th>
                          <th>Téléphone</th>
                          <th>Email</th>
                          <th style={{ textAlign: 'right' }}>Dette Due</th>
                          <th>Date Inscription</th>
                        </tr>
                      )}
                      {activeTab === 'suppliers' && (
                        <tr>
                          <th>Nom Fournisseur</th>
                          <th>Téléphone</th>
                          <th>Email</th>
                          <th>Contact</th>
                        </tr>
                      )}
                      {activeTab === 'products' && (
                        <tr>
                          <th>Nom Produit</th>
                          <th>SKU / Code</th>
                          <th>Catégorie</th>
                          <th style={{ textAlign: 'right' }}>Prix Achat</th>
                          <th style={{ textAlign: 'right' }}>Prix Vente</th>
                          <th style={{ textAlign: 'center' }}>Seuil Alerte</th>
                        </tr>
                      )}
                      {activeTab === 'purchases' && (
                        <tr>
                          <th>Date</th>
                          <th>N° Achat</th>
                          <th>Fournisseur</th>
                          <th>Boutique</th>
                          <th>Statut</th>
                          <th style={{ textAlign: 'right' }}>Montant</th>
                        </tr>
                      )}
                      {activeTab === 'cash-sessions' && (
                        <tr>
                          <th>Boutique</th>
                          <th>Caissier</th>
                          <th>Ouverture</th>
                          <th>Fermeture</th>
                          <th style={{ textAlign: 'right' }}>Fond Caisse</th>
                          <th style={{ textAlign: 'right' }}>Solde Clôture</th>
                          <th>Statut</th>
                        </tr>
                      )}
                      {activeTab === 'transfers' && (
                        <tr>
                          <th>N° Transfert</th>
                          <th>Boutique Source</th>
                          <th>Boutique Destination</th>
                          <th>Date</th>
                          <th>Statut</th>
                        </tr>
                      )}
                      {activeTab === 'users' && (
                        <tr>
                          <th>Nom Utilisateur</th>
                          <th>Email</th>
                          <th>Rôle</th>
                          <th>Boutique</th>
                          <th>Dernière Connexion</th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {listData.map((item) => (
                        <tr key={item.id}>
                          {activeTab === 'sales' && (
                            <>
                              <td className="text-muted small">{new Date(item.created_at).toLocaleString('fr-FR')}</td>
                              <td><strong>{item.sale_number}</strong></td>
                              <td>{item.client_name || item.customer?.name || 'Client de passage'}</td>
                              <td>{item.branch?.name || '-'}</td>
                              <td><span className="badge bg-info text-dark uppercase">{item.payment_method}</span></td>
                              <td style={{ textAlign: 'right', fontWeight: 900, color: '#10b981' }}>{item.total?.toLocaleString('fr-FR')} FCFA</td>
                            </>
                          )}
                          {activeTab === 'customers' && (
                            <>
                              <td><strong>{item.name}</strong></td>
                              <td>{item.phone || '-'}</td>
                              <td className="text-muted">{item.email || '-'}</td>
                              <td style={{ textAlign: 'right', fontWeight: 800, color: '#ef4444' }}>{(item.debt || item.balance || 0).toLocaleString('fr-FR')} FCFA</td>
                              <td className="text-muted small">{new Date(item.created_at).toLocaleDateString('fr-FR')}</td>
                            </>
                          )}
                          {activeTab === 'suppliers' && (
                            <>
                              <td><strong>{item.name}</strong></td>
                              <td>{item.phone || '-'}</td>
                              <td className="text-muted">{item.email || '-'}</td>
                              <td>{item.contact_name || '-'}</td>
                            </>
                          )}
                          {activeTab === 'products' && (
                            <>
                              <td><strong>{item.name}</strong></td>
                              <td><code>{item.sku || item.barcode || '-'}</code></td>
                              <td>{item.category?.name || 'Général'}</td>
                              <td style={{ textAlign: 'right' }}>{item.cost_price?.toLocaleString('fr-FR')} FCFA</td>
                              <td style={{ textAlign: 'right', fontWeight: 900, color: '#10b981' }}>{item.selling_price?.toLocaleString('fr-FR')} FCFA</td>
                              <td style={{ textAlign: 'center', fontWeight: 800, color: '#f59e0b' }}>{item.alert_quantity || 5}</td>
                            </>
                          )}
                          {activeTab === 'purchases' && (
                            <>
                              <td className="text-muted small">{new Date(item.created_at).toLocaleDateString('fr-FR')}</td>
                              <td><strong>{item.purchase_number}</strong></td>
                              <td>{item.supplier?.name || '-'}</td>
                              <td>{item.branch?.name || '-'}</td>
                              <td><span className="badge bg-success uppercase">{item.status}</span></td>
                              <td style={{ textAlign: 'right', fontWeight: 900 }}>{item.total_amount?.toLocaleString('fr-FR')} FCFA</td>
                            </>
                          )}
                          {activeTab === 'cash-sessions' && (
                            <>
                              <td><strong>{item.branch?.name || '-'}</strong></td>
                              <td>{item.user?.name || '-'}</td>
                              <td className="text-muted small">{item.opened_at ? new Date(item.opened_at).toLocaleString('fr-FR') : '-'}</td>
                              <td className="text-muted small">{item.closed_at ? new Date(item.closed_at).toLocaleString('fr-FR') : 'En cours'}</td>
                              <td style={{ textAlign: 'right' }}>{item.opening_balance?.toLocaleString('fr-FR')} FCFA</td>
                              <td style={{ textAlign: 'right', fontWeight: 800, color: '#10b981' }}>{(item.closing_balance || 0).toLocaleString('fr-FR')} FCFA</td>
                              <td>
                                <span className={`badge ${item.status === 'open' ? 'bg-success' : 'bg-secondary'}`}>
                                  {item.status === 'open' ? 'Ouverte' : 'Fermée'}
                                </span>
                              </td>
                            </>
                          )}
                          {activeTab === 'transfers' && (
                            <>
                              <td><strong>{item.transfer_number}</strong></td>
                              <td>{item.from_branch?.name || item.fromBranch?.name || '-'}</td>
                              <td>{item.to_branch?.name || item.toBranch?.name || '-'}</td>
                              <td className="text-muted small">{new Date(item.created_at).toLocaleDateString('fr-FR')}</td>
                              <td><span className="badge bg-primary uppercase">{item.status}</span></td>
                            </>
                          )}
                          {activeTab === 'users' && (
                            <>
                              <td><strong>{item.name}</strong></td>
                              <td className="text-muted">{item.email}</td>
                              <td><span className="badge bg-primary uppercase">{item.role?.name || item.role?.slug || 'User'}</span></td>
                              <td>{item.branch?.name || 'Toutes'}</td>
                              <td className="text-muted small">{item.last_login_at ? new Date(item.last_login_at).toLocaleString('fr-FR') : 'Jamais'}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center pt-3 mt-3 border-top">
                  <span className="text-muted small">Page {page} sur {totalPages}</span>
                  <div className="d-flex gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => loadSubTabList(activeTab, page - 1)}
                      className="btn btn-secondary btn-sm"
                    >
                      Précédent
                    </button>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => loadSubTabList(activeTab, page + 1)}
                      className="btn btn-secondary btn-sm"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompanyInspection;
