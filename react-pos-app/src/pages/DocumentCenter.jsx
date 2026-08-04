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
    <div className="page-container" style={{ padding: '24px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
            📁 Centre de Documents & Archives
          </h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
            Gestion centralisée, archivage et historique de tous les rapports PDF et Excel générés
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary" onClick={() => triggerExportModal('sales_report')}>
            <i className="fa-solid fa-plus" style={{ marginRight: '6px' }}></i> Nouveau Rapport
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }}></i> {error}
        </div>
      )}

      {/* Barre de Recherche & Filtres */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div className="form-group">
            <label className="form-label">Rechercher un document :</label>
            <input
              type="text"
              className="form-input"
              placeholder="Titre, UUID, nom de fichier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Type de Document :</label>
            <select className="form-input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">Tous les types</option>
              {Object.keys(contracts).map((key) => (
                <option key={key} value={key}>{contracts[key].title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Format :</label>
            <select className="form-input" value={formatFilter} onChange={(e) => setFormatFilter(e.target.value)}>
              <option value="">Tous les formats</option>
              <option value="pdf">PDF (.pdf)</option>
              <option value="xlsx">Excel (.xlsx)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-outline" onClick={fetchDocuments} style={{ flex: 1 }}>
              <i className="fa-solid fa-arrows-rotate" style={{ marginRight: '6px' }}></i> Rafraîchir
            </button>
          </div>
        </div>
      </div>

      {/* Tableau des Documents Archivés */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ marginBottom: '12px', display: 'block' }}></i>
            Chargement des documents archivés...
          </div>
        ) : documents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#94a3b8' }}>
            <i className="fa-solid fa-folder-open fa-3x" style={{ marginBottom: '16px', display: 'block' }}></i>
            <h3>Aucun document archivé</h3>
            <p>Cliquez sur "Nouveau Rapport" ou exportez des données depuis les pages métiers pour archiver vos documents.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table" style={{ width: '100%', margin: 0 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px' }}>Document & UUID</th>
                  <th style={{ padding: '12px 16px' }}>Type & Catégorie</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Format</th>
                  <th style={{ padding: '12px 16px' }}>Boutique</th>
                  <th style={{ padding: '12px 16px' }}>Généré par</th>
                  <th style={{ padding: '12px 16px' }}>Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{doc.title}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>{doc.uuid}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge" style={{ background: '#eff6ff', color: '#1e40af', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}>
                        {doc.document_type}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {doc.format === 'pdf' ? (
                        <span className="badge" style={{ background: '#fef2f2', color: '#dc2626', fontWeight: 'bold' }}>
                          <i className="fa-solid fa-file-pdf" style={{ marginRight: '4px' }}></i> PDF
                        </span>
                      ) : (
                        <span className="badge" style={{ background: '#f0fdf4', color: '#16a34a', fontWeight: 'bold' }}>
                          <i className="fa-solid fa-file-excel" style={{ marginRight: '4px' }}></i> XLSX
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {doc.branch ? doc.branch.name : 'Toutes les boutiques'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {doc.user ? doc.user.name : (doc.metadata?.generated_by || 'Système')}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>
                      {doc.created_at ? new Date(doc.created_at).toLocaleString('fr-FR') : ''}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          className="btn btn-outline"
                          onClick={() => handleDownload(doc.file_path)}
                          title="Télécharger"
                          style={{ padding: '6px 10px', fontSize: '12px' }}
                        >
                          <i className="fa-solid fa-download"></i>
                        </button>
                        <button
                          className="btn btn-outline"
                          onClick={() => triggerExportModal(doc.document_type)}
                          title="Régénérer"
                          style={{ padding: '6px 10px', fontSize: '12px' }}
                        >
                          <i className="fa-solid fa-rotate-right"></i>
                        </button>
                        <button
                          className="btn btn-outline"
                          onClick={() => handleDelete(doc.id)}
                          title="Supprimer"
                          style={{ padding: '6px 10px', fontSize: '12px', color: '#dc2626', borderColor: '#fca5a5' }}
                        >
                          <i className="fa-solid fa-trash"></i>
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
        onClose={() => {
          setIsExportModalOpen(false);
          fetchDocuments();
        }}
        documentType={selectedDocType}
        documentTitle={contracts[selectedDocType]?.title || 'Rapport Documentaire'}
      />
    </div>
  );
};
