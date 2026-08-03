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
    setError(null);
    try {
      const res = await axios.get('/v1/maintenance');
      setModes(res.data.modes || []);
      setActiveGlobal(res.data.active_global || null);
      if (res.data.active_global?.message) {
        setMessage(res.data.active_global.message);
      }
    } catch (err) {
      console.error("Fetch Maintenance Error:", err);
      setError(err.response?.data?.error || "Erreur lors du chargement des modes de maintenance.");
    } finally {
      setLoading(false);
    }
  }, []);

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
      setError(err.response?.data?.error || "Erreur lors de la modification du mode maintenance.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
          🔧 Console de Maintenance Globale
        </h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
          Activez ou désactivez la maintenance globale du système pour effectuer des migrations ou opérations techniques
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }}></i> {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" style={{ marginBottom: '16px' }}>
          {success}
        </div>
      )}

      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: activeGlobal ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${activeGlobal ? '#ef4444' : '#22c55e'}`
            }}>
              <i className={`fa-solid ${activeGlobal ? 'fa-triangle-exclamation' : 'fa-circle-check'}`} style={{ fontSize: '24px', color: activeGlobal ? '#ef4444' : '#22c55e' }}></i>
            </div>

            <div>
              <h3 style={{ margin: 0, color: '#0f172a' }}>
                Statut Système : {activeGlobal ? '🔴 MAINTENANCE ACTIVÉE' : '🟢 APPLICATIF EN LIGNE'}
              </h3>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                {activeGlobal ? 'Les utilisateurs standard sont bloqués. Seul le SuperAdmin a accès à l\'administration.' : 'Toutes les boutiques et terminaux POS opèrent normalement.'}
              </p>
            </div>
          </div>

          <div>
            {activeGlobal ? (
              <button
                className="btn btn-success"
                onClick={() => handleToggleMaintenance(false)}
                disabled={updating}
                style={{ padding: '12px 24px', fontWeight: 'bold' }}
              >
                {updating ? 'Désactivation...' : '🟢 DÉSACTIVER LA MAINTENANCE'}
              </button>
            ) : (
              <button
                className="btn btn-danger"
                onClick={() => handleToggleMaintenance(true)}
                disabled={updating}
                style={{ padding: '12px 24px', fontWeight: 'bold', backgroundColor: '#dc2626', borderColor: '#b91c1c', color: '#fff' }}
              >
                {updating ? 'Activation...' : '🔴 ACTIVER LA MAINTENANCE GLOBALE'}
              </button>
            )}
          </div>
        </div>

        {/* Formulaire de Configuration de la Maintenance */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 'bold' }}>Message d'information aux utilisateurs :</label>
              <textarea
                className="form-input"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Rédigez le message affiché sur l'écran de maintenance..."
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 'bold' }}>Heure de Fin Estimée (Optionnelle) :</label>
              <input
                type="datetime-local"
                className="form-input"
                value={estimatedEnd}
                onChange={(e) => setEstimatedEnd(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
