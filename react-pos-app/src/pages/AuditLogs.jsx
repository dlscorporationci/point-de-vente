import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

export const AuditLogs = () => {
  const { token, user } = useApp();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination & filtres de base
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Nouveaux filtres avancés
  const [companyFilter, setCompanyFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateStartFilter, setDateStartFilter] = useState('');
  const [dateEndFilter, setDateEndFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  // Tranches de données de référence pour les sélecteurs
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [users, setUsers] = useState([]);

  // Détail sélectionné pour inspection
  const [selectedLog, setSelectedLog] = useState(null);

  // Charger les listes de référence (Entreprises, Boutiques, Utilisateurs)
  useEffect(() => {
    if (!token) return;
    
    const role = user?.role?.slug || user?.role?.name || user?.role;
    const isSuperAdmin = role === 'super-admin';

    // Charger les entreprises uniquement pour le Super-Administrateur
    if (isSuperAdmin) {
      axios.get('/v1/admin/companies')
        .then(res => setCompanies(res.data.data || res.data || []))
        .catch(() => {});
    }

    // Charger les boutiques (succursales) de l'entreprise courante
    axios.get('/v1/branches')
      .then(res => setBranches(res.data || []))
      .catch(() => {});

    // Charger les utilisateurs de manière conditionnelle
    if (isSuperAdmin) {
      axios.get('/v1/admin/users')
        .then(res => setUsers(res.data.data || res.data || []))
        .catch(() => {});
    } else {
      axios.get('/v1/users')
        .then(res => setUsers(res.data || []))
        .catch(() => {});
    }
  }, [token, user]);

  const fetchLogs = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/v1/audit-logs', {
        params: {
          page,
          action: actionFilter || undefined,
          auditable_type: typeFilter || undefined,
          company_id: companyFilter || undefined,
          branch_id: branchFilter || undefined,
          user_id: userFilter || undefined,
          date_start: dateStartFilter || undefined,
          date_end: dateEndFilter || undefined,
          search: searchFilter || undefined,
        }
      });
      setLogs(response.data.data || []);
      setLastPage(response.data.last_page || 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du chargement des journaux d\'audit.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [
    token, 
    page, 
    actionFilter, 
    typeFilter, 
    companyFilter, 
    branchFilter, 
    userFilter, 
    dateStartFilter, 
    dateEndFilter,
    searchFilter
  ]);

  const formatModelName = (fqcn) => {
    if (!fqcn) return 'Inconnu';
    const parts = fqcn.split('\\');
    const name = parts[parts.length - 1];
    switch (name) {
      case 'Product': return 'Produit';
      case 'Purchase': return 'Achat';
      case 'StockTransfer': return 'Transfert de Stock';
      case 'Sale': return 'Vente (POS)';
      case 'CashSession': return 'Session de Caisse';
      case 'CashSessionTransaction': return 'Mouvement de Caisse';
      case 'Customer': return 'Client';
      case 'Company': return 'Entreprise';
      case 'Branch': return 'Point de Vente';
      case 'User': return 'Utilisateur / Connexion';
      case 'Role': return 'Rôle & Permission';
      case 'Category': return 'Catégorie';
      case 'Supplier': return 'Fournisseur';
      case 'StockMovement': return 'Ajustement de Stock';
      default: return name;
    }
  };

  const getActionBadge = (action) => {
    switch (action) {
      case 'created':
        return <span className="badge badge-success">Création</span>;
      case 'updated':
        return <span className="badge badge-info">Modification</span>;
      case 'deleted':
        return <span className="badge badge-error">Suppression</span>;
      case 'login_success':
      case 'login_pin_success':
        return <span className="badge badge-success" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>🔑 Connexion</span>;
      case 'login_failed':
      case 'login_pin_failed':
        return <span className="badge badge-error" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>🚫 Échec Connexion</span>;
      case 'logout':
        return <span className="badge badge-info" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>🚪 Déconnexion</span>;
      default:
        return <span className="badge">{action}</span>;
    }
  };

  return (
    <div className="audit-container">
      <div className="decorator-sphere sphere-1"></div>
      <div className="decorator-sphere sphere-2"></div>

      <div className="audit-layout card">
        <h2 className="section-title"><i className="fa-solid fa-shield-halved me-2 text-primary"></i> Journal d'Audit & Sécurité</h2>
        <p className="section-subtitle">Consignez et inspectez l'historique complet des actions d'écritures sensibles effectuées sur la plateforme.</p>

        {error && <div className="error-banner"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}

        {/* Filtres Avancés */}
        <div className="filter-bar no-print" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Ligne 1 : Recherche & Période */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div className="filter-item" style={{ flex: '2 1 300px' }}>
              <label className="form-label">Recherche globale (IP, Caissier, Action...)</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: 192.168, gérant, login..."
                value={searchFilter}
                onChange={(e) => { setSearchFilter(e.target.value); setPage(1); }}
              />
            </div>
            
            <div className="filter-item" style={{ flex: '1 1 150px' }}>
              <label className="form-label">Date de début</label>
              <input 
                type="date" 
                className="form-control" 
                value={dateStartFilter}
                onChange={(e) => { setDateStartFilter(e.target.value); setPage(1); }}
              />
            </div>

            <div className="filter-item" style={{ flex: '1 1 150px' }}>
              <label className="form-label">Date de fin</label>
              <input 
                type="date" 
                className="form-control" 
                value={dateEndFilter}
                onChange={(e) => { setDateEndFilter(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          {/* Ligne 2 : Filtres d'organisations */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            
            {/* Filtre Entreprise (Uniquement pour Super-Admin) */}
            {(user?.role?.slug === 'super-admin' || user?.role === 'super-admin') && (
              <div className="filter-item" style={{ flex: '1 1 200px' }}>
                <label className="form-label">Entreprise (Multi-tenant)</label>
                <select 
                  className="form-control"
                  value={companyFilter}
                  onChange={(e) => { setCompanyFilter(e.target.value); setPage(1); }}
                >
                  <option value="">Toutes les entreprises</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="filter-item" style={{ flex: '1 1 200px' }}>
              <label className="form-label">Point de vente (Boutique)</label>
              <select 
                className="form-control"
                value={branchFilter}
                onChange={(e) => { setBranchFilter(e.target.value); setPage(1); }}
              >
                <option value="">Toutes les boutiques</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-item" style={{ flex: '1 1 200px' }}>
              <label className="form-label">Opérateur / Utilisateur</label>
              <select 
                className="form-control"
                value={userFilter}
                onChange={(e) => { setUserFilter(e.target.value); setPage(1); }}
              >
                <option value="">Tous les utilisateurs</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>

            <div className="filter-item" style={{ flex: '1 1 150px' }}>
              <label className="form-label">Action</label>
              <select 
                className="form-control"
                value={actionFilter}
                onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              >
                <option value="">Toutes les actions</option>
                <option value="created">Création</option>
                <option value="updated">Modification</option>
                <option value="deleted">Suppression</option>
                <option value="login_success">Connexion Réussie</option>
                <option value="login_failed">Échec Connexion</option>
                <option value="logout">Déconnexion</option>
              </select>
            </div>

            <div className="filter-item" style={{ flex: '1 1 150px' }}>
              <label className="form-label">Type d'entité</label>
              <select 
                className="form-control"
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              >
                <option value="">Tous les types</option>
                <option value="Product">Produits</option>
                <option value="Purchase">Achats</option>
                <option value="StockTransfer">Transferts de stocks</option>
                <option value="Sale">Ventes / POS</option>
                <option value="CashSession">Sessions de Caisse</option>
                <option value="User">Utilisateurs</option>
                <option value="Category">Catégories</option>
                <option value="Supplier">Fournisseurs</option>
              </select>
            </div>

            {/* Bouton d'exportation PDF / Impression */}
            <div style={{ marginLeft: 'auto' }}>
              <button 
                type="button" 
                onClick={() => window.print()}
                className="btn btn-primary"
                style={{ height: '42px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <i className="fa-solid fa-print"></i> Exporter PDF
              </button>
            </div>

          </div>
        </div>

        {/* Liste des logs */}
        {loading ? (
          <div className="empty-state">Chargement des traces d'audit...</div>
        ) : logs.length === 0 ? (
          <div className="empty-state">Aucun log d'audit ne correspond aux filtres.</div>
        ) : (
          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Date & Heure</th>
                  <th>Utilisateur</th>
                  <th>Type d'objet</th>
                  <th>ID</th>
                  <th>Action</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} className="hover-row">
                    <td>{new Date(log.created_at).toLocaleString('fr-FR')}</td>
                    <td>
                      <strong>{log.user?.name || 'Système'}</strong>
                      <br />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.user?.email || 'automatique'}</span>
                    </td>
                    <td>{formatModelName(log.auditable_type)}</td>
                    <td><code>#{log.auditable_id}</code></td>
                    <td>{getActionBadge(log.action)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => setSelectedLog(log)}
                        className="btn-details"
                      >
                        <i className="fa-solid fa-eye me-1"></i> Inspecter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="pagination-bar">
            <button 
              disabled={page <= 1} 
              onClick={() => setPage(page - 1)}
              className="btn btn-secondary"
            >
              Précédent
            </button>
            <span>Page {page} sur {lastPage}</span>
            <button 
              disabled={page >= lastPage} 
              onClick={() => setPage(page + 1)}
              className="btn btn-secondary"
            >
              Suivant
            </button>
          </div>
        )}
      </div>

      {/* MODAL D'INSPECTION DETAILLEE */}
      {selectedLog && (
        <div className="modal-overlay">
          <div className="modal-card card" style={{ maxWidth: '650px', textAlign: 'left' }}>
            <h3>🔍 Inspection de l'Événement #{selectedLog.id}</h3>
            
            <div className="details-grid">
              <div>
                <strong>Opérateur :</strong> {selectedLog.user?.name || 'Système'}
              </div>
              <div>
                <strong>Adresse IP :</strong> <code>{selectedLog.ip_address || 'Inconnue'}</code>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong>Navigateur / Agent :</strong> <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selectedLog.user_agent || 'Inconnu'}</span>
              </div>
            </div>

            <div className="values-comparison">
              {/* Création */}
              {selectedLog.action === 'created' && selectedLog.new_values && (
                <div>
                  <h4 style={{ color: 'var(--color-success)' }}>Données insérées</h4>
                  <pre className="json-block">
                    {JSON.stringify(selectedLog.new_values, null, 2)}
                  </pre>
                </div>
              )}

              {/* Suppression */}
              {selectedLog.action === 'deleted' && selectedLog.old_values && (
                <div>
                  <h4 style={{ color: 'var(--color-error)' }}>Données supprimées</h4>
                  <pre className="json-block">
                    {JSON.stringify(selectedLog.old_values, null, 2)}
                  </pre>
                </div>
              )}

              {/* Modification (comparatif avant/après) */}
              {selectedLog.action === 'updated' && (
                <div className="diff-panels">
                  <div className="diff-panel">
                    <h4 style={{ color: 'var(--text-muted)' }}>Avant (Ancien)</h4>
                    <pre className="json-block">
                      {JSON.stringify(selectedLog.old_values, null, 2)}
                    </pre>
                  </div>
                  <div className="diff-panel">
                    <h4 style={{ color: 'var(--color-info)' }}>Après (Nouveau)</h4>
                    <pre className="json-block">
                      {JSON.stringify(selectedLog.new_values, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                onClick={() => setSelectedLog(null)} 
                className="btn btn-primary"
              >
                Fermer l'inspection
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .audit-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .audit-layout {
          width: 100%;
          max-width: 1200px;
          padding: 24px;
          margin-top: 100px;
          text-align: left;
        }

        .filter-bar {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          background: rgba(255, 255, 255, 0.05);
          padding: 16px;
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--border-color);
        }

        .filter-item {
          flex: 1;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .app-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13.5px;
        }

        .app-table th {
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-main);
          font-weight: 700;
          padding: 14px 18px;
          border-bottom: 2px solid var(--border-color);
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.5px;
        }

        .app-table td {
          padding: 14px 18px;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-main);
          vertical-align: middle;
        }

        .hover-row {
          transition: background-color var(--transition-fast) ease;
        }

        .hover-row:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }

        .btn-details {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-details:hover {
          background: #3b82f6;
          color: #ffffff;
          border-color: #3b82f6;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
        }

        .badge {
          display: inline-block;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 6px;
        }

        .badge-success {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .badge-info {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .badge-error {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          background: rgba(255, 255, 255, 0.02);
          padding: 16px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          margin-bottom: 20px;
          font-size: 13.5px;
        }

        .values-comparison {
          margin-top: 20px;
        }

        .json-block {
          background: #111827 !important;
          color: #34d399 !important;
          padding: 14px;
          border-radius: 8px;
          font-family: 'Fira Code', Consolas, Monaco, monospace;
          font-size: 12px;
          max-height: 250px;
          overflow-y: auto;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .diff-panels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .diff-panel {
          flex: 1;
        }

        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 24px;
          padding: 12px 18px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }

        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .app-main-navbar,
          .filter-bar,
          .pagination-bar,
          .decorator-sphere,
          .js-bubbles-container,
          .btn-details {
            display: none !important;
          }
          .audit-layout {
            margin-top: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: none !important;
          }
          .table-responsive {
            border: none !important;
            box-shadow: none !important;
          }
          .app-table th {
            border-bottom: 2px solid #000000 !important;
            color: #000000 !important;
          }
          .app-table td {
            border-bottom: 1px solid #e2e8f0 !important;
            color: #000000 !important;
          }
        }
      `}</style>
    </div>
  );
};
