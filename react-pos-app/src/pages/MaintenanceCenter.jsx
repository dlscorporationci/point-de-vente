import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

export const MaintenanceCenter = () => {
  const { user, checkMaintenanceStatus } = useApp();
  const [modes, setModes] = useState([]);
  const [activeGlobal, setActiveGlobal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [message, setMessage] = useState("L'application est temporairement en maintenance pour optimisation des serveurs.");
  const [estimatedEnd, setEstimatedEnd] = useState('');

  const fetchMaintenance = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/v1/maintenance');
      setModes(res.data.modes || []);
      setActiveGlobal(res.data.active_global || null);
      if (res.data.active_global?.message) {
        setMessage(res.data.active_global.message);
      }
      if (checkMaintenanceStatus) {
        checkMaintenanceStatus();
      }
    } catch (err) {
      console.error("Fetch Maintenance Error:", err);
      setError(err.response?.data?.error || "Erreur lors du chargement des modes de maintenance.");
    } finally {
      setLoading(false);
    }
  }, [checkMaintenanceStatus]);

  useEffect(() => {
    fetchMaintenance();
  }, [fetchMaintenance]);

  const handleToggleMaintenance = async (enabled) => {
    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post('/v1/maintenance/toggle', {
        enabled: enabled,
        type: 'global',
        message: message,
        estimated_end_at: estimatedEnd || null,
      });

      setSuccess(res.data.message);
      fetchMaintenance();
      if (checkMaintenanceStatus) {
        checkMaintenanceStatus();
      }
    } catch (err) {
      console.error("Toggle Maintenance Error:", err);
      const serverErr = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(serverErr || "Erreur lors de la modification du mode maintenance.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="maint-center-root" style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '16px' }}>
      
      {/* ── STYLES AUTONOMES HIGH-END ── */}
      <style>{`
        .maint-center-root {
          font-family: var(--font-text, 'Inter', sans-serif);
          color: var(--text-main, #1e293b);
        }
        .maint-banner {
          background: linear-gradient(135deg, #0F4A86 0%, #1e40af 50%, #475569 100%);
          color: #ffffff;
          padding: 26px 30px;
          border-radius: 16px;
          box-shadow: 0 10px 25px -5px rgba(15, 74, 134, 0.25);
          margin-bottom: 24px;
        }
        .maint-banner h1 {
          color: #ffffff !important;
          margin: 0;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .maint-banner p {
          color: rgba(255, 255, 255, 0.85) !important;
          margin: 4px 0 0;
          font-size: 13.5px;
        }
        .maint-card {
          background: var(--bg-card, #ffffff);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
          margin-bottom: 24px;
        }
        .maint-status-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          padding: 24px;
          border-radius: 14px;
          border: 1px solid var(--border-color, #e2e8f0);
          background: var(--bg-input, #f8fafc);
        }
        .maint-status-box.active {
          background: rgba(239, 68, 68, 0.04);
          border-color: rgba(239, 68, 68, 0.3);
        }
        .maint-status-box.online {
          background: rgba(16, 185, 129, 0.04);
          border-color: rgba(16, 185, 129, 0.3);
        }
        .pulse-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
          animation: pulse 2s infinite;
        }
        .pulse-icon.online {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 2px solid #10b981;
        }
        .pulse-icon.active {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 2px solid #ef4444;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .maint-form-label {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--text-muted, #64748b);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          display: block;
        }
        .maint-form-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid var(--border-input, #cbd5e1);
          background: var(--bg-input, #f8fafc);
          color: var(--text-main, #0f172a);
          font-size: 14px;
          font-weight: 600;
          outline: none;
          transition: all 0.2s;
        }
        .maint-form-input:focus {
          border-color: #0F4A86;
          box-shadow: 0 0 0 3px rgba(15, 74, 134, 0.15);
          background: #ffffff;
        }
      `}</style>

      {/* ── BANNIÈRE D'EN-TÊTE ── */}
      <div className="maint-banner">
        <h1><i className="fa-solid fa-screwdriver-wrench me-2"></i> Console de Maintenance Globale</h1>
        <p>Activez ou désactivez la maintenance globale du système pour effectuer des migrations ou opérations techniques</p>
      </div>

      {error && (
        <div className="alert alert-danger p-3 mb-4 rounded-3">
          <i className="fa-solid fa-triangle-exclamation me-2"></i> {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success p-3 mb-4 rounded-3 font-semibold">
          <i className="fa-solid fa-circle-check me-2"></i> {success}
        </div>
      )}

      {/* ── BLOC PRINCIPAL DE STATUT ET ACTIONS ── */}
      <div className="maint-card">
        <div className={`maint-status-box ${activeGlobal ? 'active' : 'online'}`}>
          <div className="d-flex align-items-center gap-3">
            <div className={`pulse-icon ${activeGlobal ? 'active' : 'online'}`}>
              <i className={`fa-solid ${activeGlobal ? 'fa-triangle-exclamation' : 'fa-circle-check'}`}></i>
            </div>

            <div>
              <h3 className="m-0 font-extrabold" style={{ fontSize: '20px', color: activeGlobal ? '#ef4444' : '#10b981' }}>
                Statut Système : {activeGlobal ? '🔴 MAINTENANCE ACTIVÉE' : '🟢 APPLICATIF EN LIGNE'}
              </h3>
              <p className="text-muted small m-0 mt-1" style={{ fontSize: '13.5px' }}>
                {activeGlobal ? 'Les utilisateurs standard sont bloqués. Seul le SuperAdmin a accès à l\'administration.' : 'Toutes les boutiques et terminaux POS opèrent normalement sans restriction.'}
              </p>
            </div>
          </div>

          <div>
            {activeGlobal ? (
              <button
                className="btn btn-success font-bold shadow-sm"
                onClick={() => handleToggleMaintenance(false)}
                disabled={updating}
                style={{ padding: '12px 26px', fontSize: '14px', borderRadius: '10px', backgroundColor: '#10b981', borderColor: '#10b981', color: '#fff' }}
              >
                {updating ? <i className="fa-solid fa-spinner fa-spin me-2"></i> : <i className="fa-solid fa-play me-2"></i>}
                🟢 DÉSACTIVER LA MAINTENANCE
              </button>
            ) : (
              <button
                className="btn btn-danger font-bold shadow-sm"
                onClick={() => handleToggleMaintenance(true)}
                disabled={updating}
                style={{ padding: '12px 26px', fontSize: '14px', borderRadius: '10px', backgroundColor: '#ef4444', borderColor: '#dc2626', color: '#fff' }}
              >
                {updating ? <i className="fa-solid fa-spinner fa-spin me-2"></i> : <i className="fa-solid fa-pause me-2"></i>}
                🔴 ACTIVER LA MAINTENANCE GLOBALE
              </button>
            )}
          </div>
        </div>

        {/* Formulaire de Configuration de la Maintenance */}
        <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid var(--border-color, #e2e8f0)' }}>
          <h5 className="font-bold mb-3 text-primary">
            <i className="fa-solid fa-sliders me-2"></i> Configuration du Message & Durée
          </h5>

          <div className="row g-4">
            <div className="col-lg-7">
              <label className="maint-form-label">Message d'information aux utilisateurs :</label>
              <textarea
                className="maint-form-input"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Rédigez le message affiché sur l'écran de maintenance..."
              ></textarea>
              <span className="text-muted small mt-1 d-block" style={{ fontSize: '11.5px' }}>
                Ce message sera affiché en temps réel sur tous les terminaux caisses et smartphones.
              </span>
            </div>

            <div className="col-lg-5">
              <label className="maint-form-label">Heure de Fin Estimée (Optionnelle) :</label>
              <input
                type="datetime-local"
                className="maint-form-input"
                value={estimatedEnd}
                onChange={(e) => setEstimatedEnd(e.target.value)}
              />
              <span className="text-muted small mt-1 d-block" style={{ fontSize: '11.5px' }}>
                Permet d'afficher un compte à rebours aux utilisateurs bloqués.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCenter;
