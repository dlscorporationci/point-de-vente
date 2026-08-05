import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { ExportModal } from '../components/ExportModal';
import { getAssetUrl } from '../utils/urlHelper';

export const DocumentCenter = () => {
  const { user } = useApp();
  const [documents, setDocuments] = useState([]);
  const [contracts, setContracts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [formatFilter, setFormatFilter] = useState('');
  const [error, setError] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('sales_report');

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/v1/documents', {
        params: {
          search: search,
          document_type: typeFilter,
          format: formatFilter,
        }
      });
      const rawDocs = res.data.documents;
      const list = Array.isArray(rawDocs) ? rawDocs : (rawDocs?.data || res.data.data || []);
      setDocuments(list);
      setContracts(res.data.contracts || {});
    } catch (err) {
      console.error("Fetch Documents Error:", err);
      setError(err.response?.data?.error || "Erreur lors du chargement du centre de documents.");
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, formatFilter]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce document archivé ?")) return;
    try {
      await axios.delete(`/v1/documents/${id}`);
      fetchDocuments();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de la suppression.");
    }
  };

  const handleDownload = (filePath) => {
    const url = getAssetUrl(filePath);
    window.open(url, '_blank');
  };

  const triggerExportModal = (typeKey) => {
    setSelectedDocType(typeKey);
    setIsExportModalOpen(true);
  };

  return (
    <div className="doc-center-root" style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '16px' }}>
      
      {/* ── STYLES AUTONOMES HIGH-END ── */}
      <style>{`
        .doc-center-root {
          font-family: var(--font-text, 'Inter', sans-serif);
          color: var(--text-main, #1e293b);
        }
        .doc-banner {
          background: linear-gradient(135deg, #0F4A86 0%, #1e40af 50%, #0d9488 100%);
          color: #ffffff;
          padding: 26px 30px;
          border-radius: 16px;
          box-shadow: 0 10px 25px -5px rgba(15, 74, 134, 0.25);
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .doc-banner h1 {
          color: #ffffff !important;
          margin: 0;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .doc-banner p {
          color: rgba(255, 255, 255, 0.85) !important;
          margin: 4px 0 0;
          font-size: 13.5px;
        }
        .doc-filter-card {
          background: var(--bg-card, #ffffff);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 14px;
          padding: 20px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
          margin-bottom: 24px;
        }
        .doc-form-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted, #64748b);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
          display: block;
        }
        .doc-form-control {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid var(--border-input, #cbd5e1);
          background: var(--bg-input, #f8fafc);
          color: var(--text-main, #0f172a);
          font-size: 13.5px;
          font-weight: 600;
          outline: none;
          transition: all 0.2s;
        }
        .doc-form-control:focus {
          border-color: #0F4A86;
          box-shadow: 0 0 0 3px rgba(15, 74, 134, 0.15);
          background: #ffffff;
        }
        .doc-table-card {
          background: var(--bg-card, #ffffff);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }
        .doc-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .doc-table th {
          background: var(--bg-input, #f8fafc);
          color: var(--text-muted, #475569);
          font-size: 11.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 16px;
          border-bottom: 2px solid var(--border-color, #e2e8f0);
        }
        .doc-table td {
          padding: 16px;
          border-bottom: 1px solid var(--border-color, #f1f5f9);
          font-size: 13.5px;
        }
        .doc-table tr:hover td {
          background: var(--bg-hover, #f8fafc);
        }
        .format-badge-pdf {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
          border: 1px solid rgba(239, 68, 68, 0.3);
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
        }
        .format-badge-xlsx {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.3);
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
        }
        .action-btn-circle {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color, #e2e8f0);
          background: var(--bg-card, #ffffff);
          color: var(--text-main, #334155);
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-btn-circle:hover {
          background: #0F4A86;
          color: #ffffff;
          border-color: #0F4A86;
        }
        .action-btn-circle.danger:hover {
          background: #ef4444;
          color: #ffffff;
          border-color: #ef4444;
        }
      `}</style>

      {/* ── BANNIÈRE D'EN-TÊTE ── */}
      <div className="doc-banner">
        <div>
          <h1><i className="fa-solid fa-folder-open me-2"></i> Centre de Documents & Archives</h1>
          <p>Gestion centralisée, archivage et historique de tous les rapports PDF et Excel générés</p>
        </div>

        <button 
          className="btn btn-light font-bold shadow-sm"
          onClick={() => triggerExportModal('sales_report')}
          style={{ padding: '10px 20px', borderRadius: '10px', color: '#0F4A86', fontSize: '13.5px' }}
        >
          <i className="fa-solid fa-plus me-1.5"></i> Nouveau Rapport
        </button>
      </div>

      {error && (
        <div className="alert alert-danger p-3 mb-4 rounded-3">
          <i className="fa-solid fa-triangle-exclamation me-2"></i> {error}
        </div>
      )}

      {/* ── CARTES DE FILTRES ET RECHERCHE ── */}
      <div className="doc-filter-card">
        <div className="row g-3 align-items-end">
          <div className="col-lg-4 col-md-6">
            <label className="doc-form-label"><i className="fa-solid fa-magnifying-glass me-1"></i> Rechercher un document :</label>
            <input
              type="text"
              className="doc-form-control"
              placeholder="Titre, UUID, nom de fichier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-lg-3 col-md-6">
            <label className="doc-form-label"><i className="fa-solid fa-file-contract me-1"></i> Type de Document :</label>
            <select className="doc-form-control" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">Tous les types</option>
              {Object.keys(contracts).map((key) => (
                <option key={key} value={key}>{contracts[key].title}</option>
              ))}
            </select>
          </div>

          <div className="col-lg-3 col-md-6">
            <label className="doc-form-label"><i className="fa-solid fa-file-export me-1"></i> Format :</label>
            <select className="doc-form-control" value={formatFilter} onChange={(e) => setFormatFilter(e.target.value)}>
              <option value="">Tous les formats</option>
              <option value="pdf">📄 PDF (.pdf)</option>
              <option value="xlsx">📊 Excel (.xlsx)</option>
            </select>
          </div>

          <div className="col-lg-2 col-md-6">
            <button className="btn btn-outline-secondary font-bold w-100" onClick={fetchDocuments} style={{ padding: '10px 14px', borderRadius: '10px' }}>
              <i className="fa-solid fa-rotate me-1.5"></i> Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* ── TABLEAU DES DOCUMENTS ARCHIVÉS ── */}
      <div className="doc-table-card">
        {loading ? (
          <div className="py-5 text-center text-muted">
            <i className="fa-solid fa-circle-notch fa-spin fa-2x mb-3 text-primary"></i>
            <p className="m-0 font-medium">Chargement des documents archivés...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="py-5 text-center text-muted">
            <i className="fa-solid fa-box-archive fa-3x mb-3 text-muted" style={{ opacity: 0.5 }}></i>
            <h4 className="font-bold text-dark mb-1">Aucun document archivé</h4>
            <p className="small m-0">Cliquez sur "Nouveau Rapport" ou exportez des données depuis les modules métiers.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Document & UUID</th>
                  <th>Type & Catégorie</th>
                  <th style={{ textAlign: 'center' }}>Format</th>
                  <th>Boutique</th>
                  <th>Généré par</th>
                  <th>Date & Heure</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <strong style={{ fontSize: '14px', color: 'var(--text-main, #0f172a)' }}>{doc.title || doc.file_name}</strong>
                      <div className="text-muted small" style={{ fontSize: '11px', fontFamily: 'monospace', marginTop: '2px' }}>
                        UUID: <code>{doc.uuid}</code>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-primary-light text-primary px-2.5 py-1" style={{ fontSize: '11px', fontWeight: 700 }}>
                        {doc.document_type}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={doc.format === 'pdf' ? 'format-badge-pdf' : 'format-badge-xlsx'}>
                        <i className={`fa-solid ${doc.format === 'pdf' ? 'fa-file-pdf' : 'fa-file-excel'} me-1`}></i>
                        {doc.format?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className="text-muted small">{doc.branch?.name || 'Toutes les boutiques'}</span>
                    </td>
                    <td>
                      <span className="font-semibold" style={{ fontSize: '13px' }}>{doc.user?.name || 'Système'}</span>
                    </td>
                    <td>
                      <span className="text-muted small">{new Date(doc.created_at).toLocaleString('fr-FR')}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="action-btn-circle"
                          onClick={() => handleDownload(doc.file_path)}
                          title="Télécharger / Ouvrir"
                        >
                          <i className="fa-solid fa-download"></i>
                        </button>
                        <button
                          className="action-btn-circle danger"
                          onClick={() => handleDelete(doc.id)}
                          title="Supprimer l'archive"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Universel d'Exportation */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        documentType={selectedDocType}
        documentTitle={contracts[selectedDocType]?.title || 'Exportation de document'}
      />
    </div>
  );
};

export default DocumentCenter;
