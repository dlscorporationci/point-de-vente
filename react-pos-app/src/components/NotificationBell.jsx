import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';

export const NotificationBell = ({ onNavigate }) => {
  const { token, user } = useApp();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null); // Modal de détail
  const dropdownRef = useRef(null);
  const audioRef = useRef(null);

  // Charger le nombre de notifications non lues
  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get('/v1/notifications/unread-count');
      const count = res.data.unread_count || 0;
      
      // Alerte sonore discrète si alerte/critique non lue détectée
      if (count > unreadCount && (res.data.has_critical || res.data.has_warning)) {
        playAlertSound();
      }
      setUnreadCount(count);
    } catch {
      /* Silencieux */
    }
  }, [token, unreadCount]);

  // Charger les notifications pour le dropdown (dernières 6)
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get('/v1/notifications?limit=6');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unread_count || 0);
    } catch {
      /* Silencieux */
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 25000); // Polling 25s
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // Fermer le dropdown lors d'un clic extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const playAlertSound = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audioRef.current.volume = 0.3;
      }
      audioRef.current.play().catch(() => {});
    } catch {
      /* Silencieux */
    }
  };

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await axios.post(`/v1/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      /* Silencieux */
    }
  };

  const handleMarkAllAsRead = async (e) => {
    if (e) e.stopPropagation();
    try {
      await axios.post('/v1/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch {
      /* Silencieux */
    }
  };

  const handleNotificationClick = (notif) => {
    if (!notif.read_at) {
      handleMarkAsRead(notif.id);
    }
    setSelectedNotification(notif);
    setIsOpen(false);
  };

  const handleTargetNavigation = (route) => {
    if (route && onNavigate) {
      onNavigate(route);
    }
    setSelectedNotification(null);
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diffMs = new Date() - new Date(dateStr);
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

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
    <div className="notification-bell-container" ref={dropdownRef}>
      <button 
        className="notification-bell-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
        aria-label="Notifications"
      >
        <i className="fa-solid fa-bell"></i>
        {unreadCount > 0 && (
          <span className="bell-badge-count">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notif-dropdown-header">
            <div className="notif-header-title">
              <i className="fa-solid fa-bell text-primary me-2"></i>
              <strong>Notifications</strong>
              {unreadCount > 0 && <span className="unread-chip">{unreadCount} non lue(s)</span>}
            </div>

            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead} 
                className="btn-mark-all-read"
                title="Tout marquer comme lu"
              >
                <i className="fa-solid fa-check-double me-1"></i> Tout marquer lu
              </button>
            )}
          </div>

          <div className="notif-dropdown-body">
            {loading ? (
              <div className="notif-loading"><i className="fa-solid fa-circle-notch fa-spin me-2"></i> Chargement...</div>
            ) : notifications.length === 0 ? (
              <div className="notif-empty">
                <i className="fa-solid fa-bell-slash text-muted" style={{ fontSize: '24px' }}></i>
                <p>Aucune notification enregistrée</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`notif-item-card ${!notif.read_at ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div className="notif-item-top">
                    {getPriorityBadge(notif.priority)}
                    <span className="notif-item-time">{formatTimeAgo(notif.created_at)}</span>
                  </div>

                  <div className="notif-item-title">{notif.title}</div>
                  <div className="notif-item-message">{notif.message}</div>

                  {notif.branch?.name && (
                    <div className="notif-item-branch">
                      <i className="fa-solid fa-store me-1"></i> {notif.branch.name}
                    </div>
                  )}

                  {!notif.read_at && (
                    <button 
                      onClick={(e) => handleMarkAsRead(notif.id, e)} 
                      className="btn-mark-single-read" 
                      title="Marquer comme lu"
                    >
                      <i className="fa-solid fa-check"></i>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="notif-dropdown-footer">
            <button 
              onClick={() => {
                setIsOpen(false);
                if (onNavigate) onNavigate('notifications');
              }} 
              className="btn-view-all-notifs"
            >
              <i className="fa-solid fa-list me-1"></i> Voir tout l'historique
            </button>
          </div>
        </div>
      )}

      {/* MODAL DETAIL via PORTAL (hors navbar, niveau racine) */}
      {selectedNotification && ReactDOM.createPortal(
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-card card" style={{ maxWidth: '520px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {getPriorityBadge(selectedNotification.priority)}
                <span className="text-muted text-xs">{new Date(selectedNotification.created_at).toLocaleString('fr-FR')}</span>
              </div>
              <button 
                onClick={() => setSelectedNotification(null)} 
                className="btn-close-modal"
                style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 800 }}>
              {selectedNotification.title}
            </h3>

            <div style={{ 
              background: 'var(--bg-input)', 
              padding: '14px', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)',
              fontSize: '13px',
              lineHeight: '1.5',
              marginBottom: '16px',
              whiteSpace: 'pre-wrap'
            }}>
              {selectedNotification.message}
            </div>

            {selectedNotification.branch?.name && (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                <i className="fa-solid fa-store me-1 text-primary"></i> Boutique concernée : <strong>{selectedNotification.branch.name}</strong>
              </div>
            )}

            {selectedNotification.actor?.name && (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                <i className="fa-solid fa-user me-1 text-primary"></i> Initié par : <strong>{selectedNotification.actor.name}</strong>
              </div>
            )}

            <div className="modal-actions" style={{ justifyContent: 'flex-end', gap: '10px' }}>
              {selectedNotification.target_route && (
                <button 
                  onClick={() => handleTargetNavigation(selectedNotification.target_route)}
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
        </div>,
        document.body
      )}
    </div>
  );
};
