import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

export const Notifications = ({ setActiveTab }) => {
  const { token, user } = useApp();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Filtres
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal de détail
  const [selectedNotification, setSelectedNotification] = useState(null);

  const fetchNotifications = useCallback(async (isRetry = false) => {
    const currentToken = token || localStorage.getItem('token');
    if (!currentToken) return;
    if (!isRetry) setLoading(true);
    setError(null);
    try {
      let url = '/v1/notifications?limit=100';
      if (statusFilter === 'unread') url += '&unread_only=true';
      if (priorityFilter !== 'all') url += `&priority=${priorityFilter}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      const list = res.data.data || res.data.notifications || (Array.isArray(res.data) ? res.data : []);
      setNotifications(list);
      setError(null);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else if (!isRetry) {
        // Réessai automatique après 2 secondes en cas d'erreur réseau
        setTimeout(() => fetchNotifications(true), 2000);
      } else {
        setError("Impossible de charger les notifications. Vérifiez votre connexion.");
      }
    } finally {
      setLoading(false);
    }
  }, [token, priorityFilter, statusFilter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await axios.post(`/v1/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
      setSuccess("Notification marquée comme lue.");
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Erreur lors de la mise à jour de la notification.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.post('/v1/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
      setSuccess("Toutes vos notifications ont été marquées comme lues.");
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Erreur lors du traitement de l'action.");
    }
  };

  const handleOpenDetail = (notif) => {
    if (!notif.read_at) {
      handleMarkAsRead(notif.id);
    }
    setSelectedNotification(notif);
  };

  const handleNavigateToTarget = (route) => {
    if (route && setActiveTab) {
      setActiveTab(route);
    }
    setSelectedNotification(null);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (statusFilter === 'read' && !notif.read_at) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = notif.title?.toLowerCase().includes(q);
      const matchMsg = notif.message?.toLowerCase().includes(q);
      const matchBranch = notif.branch?.name?.toLowerCase().includes(q);
      return matchTitle || matchMsg || matchBranch;
    }
    return true;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical':
        return <span className="notif-badge-pill priority-critical"><i className="fa-solid fa-circle-exclamation me-1"></i> Critique</span>;
      case 'warning':
        return <span className="notif-badge-pill priority-warning"><i className="fa-solid fa-triangle-exclamation me-1"></i> Alerte</span>;
      case 'important':
        return <span className="notif-badge-pill priority-important"><i className="fa-solid fa-bell me-1"></i> Important</span>;
      default:
        return <span className="notif-badge-pill priority-info"><i className="fa-solid fa-circle-info me-1"></i> Info</span>;
    }
  };

  if (!user) return null;

  return (
    <div className="notifications-container">
      <div className="notifications-layout">
        {/* HEADER */}
        <div className="notifications-header">
          <div>
            <h2><i className="fa-solid fa-bell text-primary me-2"></i> Historique des Notifications</h2>
            <p className="notifications-subtitle">Consultez l'ensemble des événements et alertes système dédiés à votre compte et vos boutiques</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleMarkAllAsRead} className="btn btn-outline">
              <i className="fa-solid fa-check-double me-1"></i> Tout marquer comme lu
            </button>
            <button onClick={fetchNotifications} className="btn btn-secondary">
              <i className="fa-solid fa-rotate-right me-1"></i> Rafraîchir
            </button>
          </div>
        </div>

        {error && <div className="error-banner"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}
        {success && <div className="success-banner"><i className="fa-solid fa-circle-check me-1"></i> {success}</div>}

        {/* BARRE DE FILTRES */}
        <div className="filters-bar">
          <div className="filter-group">
            <label className="form-label">Priorité</label>
            <select className="form-control" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="all">Toutes les priorités</option>
              <option value="critical">🚨 Critique</option>
              <option value="warning">⚠️ Alerte</option>
              <option value="important">🔔 Important</option>
              <option value="info">ℹ️ Information</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="form-label">Statut</label>
            <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Tous les statuts</option>
              <option value="unread">Non lues uniquement</option>
              <option value="read">Lues uniquement</option>
            </select>
          </div>

          <div className="filter-group" style={{ flex: 2 }}>
            <label className="form-label">Rechercher</label>
            <div className="search-bar">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input 
                type="text" 
                className="form-control search-input" 
                placeholder="Rechercher par titre, message, boutique..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* LISTE DES NOTIFICATIONS */}
        {loading ? (
          <div className="loading-spinner"><i className="fa-solid fa-circle-notch fa-spin me-2"></i> Chargement des notifications...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon"><i className="fa-solid fa-bell-slash text-muted"></i></span>
            <h4>Aucune notification trouvée</h4>
            <p>Aucun événement ne correspond à vos critères de recherche actuels.</p>
          </div>
        ) : (
          <div className="notifications-list-grid">
            {filteredNotifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`notif-card-row ${!notif.read_at ? 'unread' : ''}`}
                onClick={() => handleOpenDetail(notif)}
              >
                <div className="notif-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getPriorityBadge(notif.priority)}
                    <span className="notif-date">{new Date(notif.created_at).toLocaleString('fr-FR')}</span>
                  </div>
                  {!notif.read_at && (
                    <button 
                      onClick={(e) => handleMarkAsRead(notif.id, e)} 
                      className="btn-mark-read-chip"
                      title="Marquer comme lu"
                    >
                      <i className="fa-solid fa-check me-1"></i> Marquer lu
                    </button>
                  )}
                </div>

                <h4 className="notif-card-title">{notif.title}</h4>
                <p className="notif-card-msg">{notif.message}</p>

                <div className="notif-card-footer">
                  {notif.branch?.name && (
                    <span className="notif-meta-pill">
                      <i className="fa-solid fa-store me-1"></i> {notif.branch.name}
                    </span>
                  )}
                  {notif.actor?.name && (
                    <span className="notif-meta-pill">
                      <i className="fa-solid fa-user me-1"></i> {notif.actor.name}
                    </span>
                  )}
                  {notif.target_route && (
                    <span className="notif-action-link" onClick={(e) => { e.stopPropagation(); handleNavigateToTarget(notif.target_route); }}>
                      Accéder à la section <i className="fa-solid fa-arrow-right ms-1"></i>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL DE DÉTAIL INTÉGRAL */}
        {selectedNotification && (
          <div className="modal-overlay">
            <div className="modal-card card" style={{ maxWidth: '560px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {getPriorityBadge(selectedNotification.priority)}
                  <span className="text-muted text-xs">{new Date(selectedNotification.created_at).toLocaleString('fr-FR')}</span>
                </div>
                <button 
                  onClick={() => setSelectedNotification(null)} 
                  className="btn-close-modal"
                  style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 800 }}>
                {selectedNotification.title}
              </h3>

              <div style={{ 
                background: 'var(--bg-input)', 
                padding: '16px', 
                borderRadius: '8px', 
                border: '1px solid var(--border-color)',
                fontSize: '14px',
                lineHeight: '1.6',
                marginBottom: '16px',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedNotification.message}
              </div>

              {selectedNotification.branch?.name && (
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <i className="fa-solid fa-store me-1 text-primary"></i> Boutique concernée : <strong>{selectedNotification.branch.name}</strong>
                </div>
              )}

              {selectedNotification.actor?.name && (
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  <i className="fa-solid fa-user me-1 text-primary"></i> Initié par : <strong>{selectedNotification.actor.name} ({selectedNotification.actor.email})</strong>
                </div>
              )}

              <div className="modal-actions" style={{ justifyContent: 'flex-end', gap: '10px' }}>
                {selectedNotification.target_route && (
                  <button 
                    onClick={() => handleNavigateToTarget(selectedNotification.target_route)}
                    className="btn btn-primary"
                  >
                    <i className="fa-solid fa-arrow-right-to-bracket me-1"></i> Ouvrir la section concernée
                  </button>
                )}
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className="btn btn-cancel"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
