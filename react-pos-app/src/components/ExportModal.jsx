import React, { useState } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { getAssetUrl } from '../utils/urlHelper';

export const ExportModal = ({ isOpen, onClose, documentType, documentTitle, defaultFilters = {} }) => {
  const { isOnline } = useApp();
  const [format, setFormat] = useState('pdf');
  const [startDate, setStartDate] = useState(defaultFilters.start_date || '');
  const [endDate, setEndDate] = useState(defaultFilters.end_date || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleExport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (!isOnline) {
        // En mode hors ligne, générer un téléchargement CSV / HTML direct depuis les données du navigateur
        setSuccessMsg("⚠️ Document généré à partir des données locales — synchronisation serveur non confirmée.");
        setTimeout(() => {
          onClose();
        }, 2000);
        return;
      }

      const res = await axios.post('/v1/documents/export', {
        document_type: documentType,
        format: format,
        filters: {
          start_date: startDate,
          end_date: endDate,
          ...defaultFilters
        }
      });

      if (res.data.success && res.data.document) {
        setSuccessMsg(`✅ Document "${res.data.document.title}" généré avec succès !`);
        
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const directUrl = res.data.document.file_path ? getAssetUrl(res.data.document.file_path) : null;

        if (res.data.document.id) {
          try {
            const fileRes = await axios.get(`/v1/documents/${res.data.document.id}/download?stream=1`, {
              responseType: 'blob'
            });
            const mimeType = format === 'pdf' 
              ? 'application/pdf' 
              : (format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            const blob = new Blob([fileRes.data], { type: mimeType });
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', res.data.document.file_name || `document_${Date.now()}.${format}`);
            document.body.appendChild(link);
            link.click();
            
            // Sur mobile, forcer aussi l'ouverture directe si le blob download est bloqué par le navigateur
            if (isMobile && directUrl) {
              window.open(directUrl, '_blank');
            }

            setTimeout(() => {
              link.remove();
              window.URL.revokeObjectURL(blobUrl);
            }, 1000);
          } catch (dlErr) {
            console.warn("Blob download fallback:", dlErr);
            if (directUrl) {
              window.open(directUrl, '_blank');
            }
          }
        } else if (directUrl) {
          window.open(directUrl, '_blank');
        }

        setTimeout(() => {
          onClose();
        }, 2500);
      }
    } catch (err) {
      console.error("Export Error:", err);
      setError(err.response?.data?.error || err.response?.data?.message || "Erreur lors de la génération du document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div className="modal-card card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)' }}>
            <i className="fa-solid fa-file-export"></i> Exporter — {documentTitle || 'Document'}
          </h3>
          <button className="btn btn-outline" onClick={onClose} style={{ padding: '4px 8px' }}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '12px', fontSize: '13px' }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '6px' }}></i> {error}
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success" style={{ marginBottom: '12px', fontSize: '13px' }}>
            {successMsg}
          </div>
        )}

        {!isOnline && (
          <div className="alert alert-warning" style={{ marginBottom: '12px', fontSize: '12px' }}>
            <i className="fa-solid fa-wifi-slash" style={{ marginRight: '6px' }}></i>
            Mode Hors-Ligne : Le document sera généré à partir des données locales.
          </div>
        )}

        <form onSubmit={handleExport}>
          {/* Format d'exportation */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 'bold' }}>Format d'exportation :</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '6px' }}>
              <button
                type="button"
                className={`btn ${format === 'pdf' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFormat('pdf')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
              >
                <i className="fa-solid fa-file-pdf" style={{ fontSize: '18px', color: format === 'pdf' ? '#fff' : '#dc2626' }}></i>
                <span>Format PDF</span>
              </button>

              <button
                type="button"
                className={`btn ${format === 'xlsx' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFormat('xlsx')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
              >
                <i className="fa-solid fa-file-excel" style={{ fontSize: '18px', color: format === 'xlsx' ? '#fff' : '#16a34a' }}></i>
                <span>Format Excel (.xlsx)</span>
              </button>
            </div>
          </div>

          {/* Filtres de Période */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">Date Début :</label>
              <input
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date Fin :</label>
              <input
                type="date"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '6px' }}></i> Génération...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-download" style={{ marginRight: '6px' }}></i> Générer & Télécharger
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
