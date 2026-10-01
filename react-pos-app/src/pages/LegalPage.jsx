import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/logo.jpg';
import { DEFAULT_LEGAL_PAGES } from '../data/defaultLegalPages';

/**
 * Composant central officiel des pages Légales DLS POS :
 * - CGU (Conditions Générales d'Utilisation)
 * - CGV (Conditions Générales de Vente)
 * - Politique de Livraison et d'Activation
 * - Politique de Remboursement
 * - Politique de Confidentialité
 */
export const LegalPage = ({ type = 'cgu', onNavigate }) => {
  const [activeType, setActiveType] = useState(type);
  const [apiContent, setApiContent] = useState({});
  const [loadingApi, setLoadingApi] = useState(true);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  // Mapping des types frontend vers les clés API
  const typeToApiKey = { cgu: 'cgu', cgv: 'cgv', delivery: 'delivery_policy', refund: 'refund_policy', privacy: 'privacy_policy' };

  // Charger le contenu dynamique depuis l'API
  useEffect(() => {
    const fetchLegalPages = async () => {
      try {
        const res = await axios.get('/v1/public/legal-pages');
        if (res.data) setApiContent(res.data);
      } catch (e) {
        console.warn('Pages légales API non disponible, utilisation du contenu par défaut.');
      } finally {
        setLoadingApi(false);
      }
    };
    fetchLegalPages();
  }, []);

  const currentApiKey = typeToApiKey[activeType] || 'cgu';
  const currentHtml = apiContent[currentApiKey] || DEFAULT_LEGAL_PAGES[currentApiKey];
  const currentPdfUrl = apiContent[currentApiKey + '_pdf'];

  return (
    <div className="customers-container" style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* ── EN-TÊTE DE PAGE ── */}
      <div className="card shadow-sm p-4 mb-4" style={{ borderRadius: '16px', background: 'var(--color-surface, #ffffff)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src={logo} alt="DLS POS Logo" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--color-text, #1e293b)' }}>
                Informations & Mentions Légales Officielles
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
                DLS POS — Solution Globale de Gestion Commerciale & Points de Vente Multi-Entreprises (DLS CORPORATION)
              </p>
            </div>
          </div>
          <div className="d-flex gap-2">
            {currentPdfUrl ? (
              <a
                href={currentPdfUrl}
                target="_blank"
                rel="noreferrer"
                download={`document_${currentApiKey}.pdf`}
                className="btn btn-primary btn-sm px-3 fw-bold"
                style={{ borderRadius: '8px', fontSize: '13px' }}
              >
                <i className="fa-solid fa-file-pdf me-1"></i> Télécharger le PDF Officiel
              </a>
            ) : (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => window.print()}
                style={{ borderRadius: '8px', fontSize: '13px' }}
              >
                <i className="fa-solid fa-print me-1"></i> Imprimer / Exporter PDF
              </button>
            )}
          </div>
        </div>

        {/* ── BARRE D'ONGLETS DE NAVIGATION LÉGALE (5 ONGLETS OFFICIELS) ── */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', borderBottom: '1px solid var(--color-border, #e2e8f0)', paddingBottom: '12px', overflowX: 'auto' }}>
          <button
            className={`btn btn-sm ${activeType === 'cgu' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => { setActiveType('cgu'); setShowPdfViewer(false); }}
            style={{ borderRadius: '8px', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            📜 CGU (Utilisation)
          </button>
          <button
            className={`btn btn-sm ${activeType === 'cgv' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => { setActiveType('cgv'); setShowPdfViewer(false); }}
            style={{ borderRadius: '8px', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            🛍️ CGV (Vente)
          </button>
          <button
            className={`btn btn-sm ${activeType === 'delivery' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => { setActiveType('delivery'); setShowPdfViewer(false); }}
            style={{ borderRadius: '8px', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            🚚 Politique de Livraison
          </button>
          <button
            className={`btn btn-sm ${activeType === 'refund' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => { setActiveType('refund'); setShowPdfViewer(false); }}
            style={{ borderRadius: '8px', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            💳 Remboursement
          </button>
          <button
            className={`btn btn-sm ${activeType === 'privacy' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => { setActiveType('privacy'); setShowPdfViewer(false); }}
            style={{ borderRadius: '8px', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            🔒 Confidentialité
          </button>
        </div>
      </div>

      {/* ── CONTENU DU DOCUMENT SÉLECTIONNÉ ── */}
      <div className="card shadow-sm p-4 p-md-5" style={{ borderRadius: '16px', background: 'var(--color-surface, #ffffff)', minHeight: '450px' }}>
        {loadingApi ? (
          <div className="text-center py-5">
            <i className="fa-solid fa-spinner fa-spin fa-2x text-primary mb-3" style={{ display: 'block' }}></i>
            <p className="text-muted">Chargement du document...</p>
          </div>
        ) : (
          <>
            {/* Bannière d'accès au PDF officiel si présent */}
            {currentPdfUrl && (
              <div className="p-3 mb-4 rounded-3 border border-primary-subtle bg-primary-subtle d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#dc2626', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    <i className="fa-solid fa-file-pdf"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold m-0 text-primary" style={{ fontSize: '15px' }}>Document Officiel PDF Certifié</h5>
                    <p className="text-muted m-0" style={{ fontSize: '12.5px' }}>Une version officielle au format PDF est disponible au téléchargement et à la lecture directe.</p>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className={`btn btn-sm ${showPdfViewer ? 'btn-primary' : 'btn-outline-primary'} fw-bold px-3`}
                    onClick={() => setShowPdfViewer(!showPdfViewer)}
                    style={{ borderRadius: '8px' }}
                  >
                    <i className={`fa-solid ${showPdfViewer ? 'fa-align-left' : 'fa-eye'} me-1`}></i>
                    {showPdfViewer ? 'Lire le Texte HTML' : '👁️ Visualiser le PDF'}
                  </button>
                  <a
                    href={currentPdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    download={`document_${currentApiKey}.pdf`}
                    className="btn btn-danger btn-sm px-3 fw-bold"
                    style={{ borderRadius: '8px' }}
                  >
                    <i className="fa-solid fa-download me-1"></i> Télécharger le PDF
                  </a>
                </div>
              </div>
            )}

            {/* Affichage du Lecteur PDF ou du Texte HTML */}
            {showPdfViewer && currentPdfUrl ? (
              <div className="rounded-3 border overflow-hidden" style={{ minHeight: '650px' }}>
                <iframe
                  src={currentPdfUrl}
                  title={`Document PDF ${activeType}`}
                  width="100%"
                  height="650px"
                  style={{ border: 'none' }}
                />
              </div>
            ) : (
              <article className="legal-document" dangerouslySetInnerHTML={{ __html: currentHtml }} />
            )}
          </>
        )}

        <hr style={{ margin: '30px 0 20px', borderColor: 'var(--color-border, #e2e8f0)' }} />

        {/* Pied de page du document */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#64748b' }}>
          <div>
            <strong>DLS CORPORATION CI</strong> — Éditeur de solutions logicielles et d'intégration Monétique.
          </div>
          <div>
            E-mail : <strong>infos@dlscorporation.ci</strong> | Tél : <strong>+225 07 08 74 41 15 / +225 05 66 28 93 94</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
