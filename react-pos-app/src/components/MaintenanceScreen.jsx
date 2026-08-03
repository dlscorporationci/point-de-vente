import React, { useState, useEffect } from 'react';
import axios from 'axios';

const formatDateSafe = (dateStr) => {
  if (!dateStr) return null;
  try {
    const cleanStr = typeof dateStr === 'string' ? dateStr.replace(' ', 'T') : dateStr;
    const d = new Date(cleanStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleString('fr-FR');
  } catch {
    return null;
  }
};

export const MaintenanceScreen = ({ maintenanceInfo: propMaintInfo }) => {
  const [maintInfo, setMaintInfo] = useState(propMaintInfo || null);

  useEffect(() => {
    if (propMaintInfo) {
      setMaintInfo(propMaintInfo);
      return;
    }
    const checkStatus = async () => {
      try {
        const res = await axios.get('/v1/maintenance/status');
        if (res.data && res.data.in_maintenance) {
          setMaintInfo(res.data.maintenance || { message: 'L\'application est temporairement en maintenance.' });
        }
      } catch (err) {
        /* silencieux */
      }
    };
    checkStatus();
  }, [propMaintInfo]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#0f172a',
      color: '#ffffff',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        padding: '40px 32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        border: '1px solid #334155'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          border: '2px solid #f59e0b'
        }}>
          <i className="fa-solid fa-screwdriver-wrench" style={{ fontSize: '36px', color: '#f59e0b' }}></i>
        </div>

        <h1 style={{ margin: '0 0 12px', fontSize: '26px', fontWeight: 'bold', color: '#ffffff' }}>
          APEXPOS EN MAINTENANCE
        </h1>

        <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 24px' }}>
          {maintInfo?.message || "L'application est temporairement indisponible pour une opération de maintenance programmée et d'optimisation des serveurs."}
        </p>

        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          textAlign: 'left',
          fontSize: '13px',
          border: '1px solid #334155'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#64748b' }}>Début :</span>
            <span style={{ fontWeight: 'bold', color: '#e2e8f0' }}>
              {formatDateSafe(maintInfo?.started_at) || 'En cours'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Fin estimée :</span>
            <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>
              {formatDateSafe(maintInfo?.estimated_end_at) || 'Prochainement'}
            </span>
          </div>
        </div>

        <div style={{
          padding: '12px',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '8px',
          border: '1px solid #3b82f6',
          fontSize: '12px',
          color: '#93c5fd',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <i className="fa-solid fa-shield-halved" style={{ fontSize: '18px' }}></i>
          <span style={{ textAlign: 'left' }}>
            <strong>Offline-First :</strong> Vos ventes locales en cours sont conservées en sécurité dans votre navigateur et seront synchronisées dès la réouverture.
          </span>
        </div>
      </div>
    </div>
  );
};
