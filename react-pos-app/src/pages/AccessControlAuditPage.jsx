import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

export const AccessControlAuditPage = () => {
  const { user } = useApp();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [actionFilter, setActionFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAuditLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/v1/access-control-logs', {
        params: {
          page,
          action: actionFilter || undefined,
          date_from: dateFrom || undefined,
          date_to: dateTo || undefined,
        }
      });

      setLogs(res.data.data || []);
      setTotalPages(res.data.last_page || 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Impossible de charger l\'historique d\'audit de sécurité.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [page]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAuditLogs();
  };

  return (
    <div className="audit-page-container">
      <div className="card mb-4 p-4" style={{ borderRadius: '16px', background: 'var(--bg-card, #ffffff)' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="m-0"><i className="fa-solid fa-shield-halved text-primary me-2"></i> Historique d'Audit & Sécurité RBAC/ABAC</h2>
            <p className="text-muted m-0">Traçabilité complète des modifications de rôles, permissions, zones d'accès et tentatives de blocage.</p>
          </div>
          <button className="btn btn-outline-primary btn-sm" onClick={fetchAuditLogs}>
            <i className="fa-solid fa-arrows-rotate me-1"></i> Rafraîchir
          </button>
        </div>

        {/* Filtres de recherche */}
        <form onSubmit={handleFilterSubmit} className="row g-2 align-items-end mb-4">
          <div className="col-md-3">
            <label className="form-label small fw-bold">Type d'action</label>
            <input 
              type="text" 
              className="form-control form-control-sm" 
              placeholder="Ex: role.created, user.updated"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-bold">Du</label>
            <input 
              type="date" 
              className="form-control form-control-sm"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-bold">Au</label>
            <input 
              type="date" 
              className="form-control form-control-sm"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button type="submit" className="btn btn-primary btn-sm w-100">
              <i className="fa-solid fa-filter me-1"></i> Filtrer
            </button>
          </div>
        </form>

        {error && <div className="alert alert-danger"><i className="fa-solid fa-triangle-exclamation me-2"></i> {error}</div>}

        {loading ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Chargement des événements de sécurité...</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Horodatage</th>
                    <th>Auteur (Qui)</th>
                    <th>Action</th>
                    <th>Cible (Sur qui)</th>
                    <th>Détails & Modifications</th>
                    <th>Adresse IP</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">Aucun événement d'audit enregistré.</td>
                    </tr>
                  ) : (
                    logs.map(log => (
                      <tr key={log.id}>
                        <td>
                          <small className="fw-bold d-block">{new Date(log.created_at).toLocaleDateString('fr-FR')}</small>
                          <small className="text-muted">{new Date(log.created_at).toLocaleTimeString('fr-FR')}</small>
                        </td>
                        <td>
                          <strong>{log.actor ? log.actor.name : 'Système'}</strong>
                          {log.actor && <small className="d-block text-muted">{log.actor.email}</small>}
                        </td>
                        <td>
                          <span className={`badge ${log.action.includes('rejected') ? 'bg-danger' : 'bg-primary'}`}>
                            {log.action}
                          </span>
                        </td>
                        <td>
                          {log.target ? (
                            <>
                              <strong>{log.target.name}</strong>
                              <small className="d-block text-muted">{log.target.email}</small>
                            </>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          {log.new_role_id && (
                            <div className="small">Rôle : {log.old_role_id ? `Rôle #${log.old_role_id} ➔ ` : ''}<strong>Rôle #{log.new_role_id}</strong></div>
                          )}
                          {log.new_access_zone_id && (
                            <div className="small">Zone : {log.old_access_zone_id ? `Zone #${log.old_access_zone_id} ➔ ` : ''}<strong>Zone #{log.new_access_zone_id}</strong></div>
                          )}
                          {log.new_permissions && Array.isArray(log.new_permissions) && (
                            <div className="small text-muted">{log.new_permissions.length} permission(s) configurée(s)</div>
                          )}
                        </td>
                        <td>
                          <code className="small">{log.ip_address || '127.0.0.1'}</code>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <button 
                  className="btn btn-sm btn-outline-secondary" 
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  <i className="fa-solid fa-chevron-left me-1"></i> Précédent
                </button>
                <span className="small text-muted">Page {page} / {totalPages}</span>
                <button 
                  className="btn btn-sm btn-outline-secondary" 
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Suivant <i className="fa-solid fa-chevron-right ms-1"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
