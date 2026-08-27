import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DEFAULT_TEMPLATES = [
  {
    id: 1,
    name: '🛠️ Quincaillerie & Matériaux',
    domain: 'Quincaillerie',
    icon: 'fa-screwdriver-wrench',
    description: 'Pack complet d\'outillage, ciment, peinture, boulonnerie et matériel de construction.',
    categories_count: 5,
    products_count: 24
  },
  {
    id: 2,
    name: '🛒 Supermarché & Alimentation',
    domain: 'Alimentation',
    icon: 'fa-cart-shopping',
    description: 'Produits frais, boissons, épicerie sèche et entretien ménager.',
    categories_count: 6,
    products_count: 30
  },
  {
    id: 3,
    name: '💊 Pharmacie & Santé',
    domain: 'Pharmacie',
    icon: 'fa-prescription-bottle-medical',
    description: 'Médicaments courants, parapharmacie, hygiène et soins.',
    categories_count: 4,
    products_count: 20
  },
  {
    id: 4,
    name: '📱 Électronique & High-Tech',
    domain: 'High-Tech',
    icon: 'fa-mobile-screen-button',
    description: 'Smartphones, câbles, écouteurs, accessoires informatiques et électroménager.',
    categories_count: 4,
    products_count: 18
  }
];

export const CatalogTemplatesModal = ({ isOpen, onClose, onSuccess }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateDetails, setTemplateDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/v1/catalog-templates');
      const data = res.data?.data || res.data || [];
      const list = Array.isArray(data) ? data : [];
      setTemplates(list.length > 0 ? list : DEFAULT_TEMPLATES);
    } catch (err) {
      console.warn('Chargement des modèles de catalogue indisponible:', err);
      setTemplates(DEFAULT_TEMPLATES);
    } finally {
      setLoading(false);
    }
  };

  const openPreview = async (tmpl) => {
    setSelectedTemplate(tmpl);
    setDetailsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/v1/catalog-templates/${tmpl.id}`);
      setTemplateDetails(res.data);
      if (res.data && res.data.categories) {
        setSelectedCategories(res.data.categories.map(c => c.id));
      } else if (tmpl.categories) {
        setSelectedCategories(tmpl.categories.map(c => c.id));
      }
    } catch (err) {
      console.warn('Erreur chargement détails modèle API, utilisation du modèle local:', err);
      setTemplateDetails(tmpl);
      if (tmpl && tmpl.categories && Array.isArray(tmpl.categories)) {
        setSelectedCategories(tmpl.categories.map(c => c.id));
      } else {
        setSelectedCategories([]);
      }
    } finally {
      setDetailsLoading(false);
    }
  };

  const toggleCategory = (catId) => {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const selectAllCategories = () => {
    if (templateDetails?.categories) {
      setSelectedCategories(templateDetails.categories.map(c => c.id));
    }
  };

  const deselectAllCategories = () => {
    setSelectedCategories([]);
  };

  const handleInstall = async () => {
    if (!selectedTemplate) return;
    setInstalling(true);
    setError(null);
    try {
      const res = await axios.post(`/v1/catalog-templates/${selectedTemplate.id}/install`, {
        category_ids: selectedCategories
      });
      onSuccess(res.data.message);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de l\'installation du modèle.');
    } finally {
      setInstalling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px', width: '92%', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {!templateDetails ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 className="m-0"><i className="fa-solid fa-boxes-packing text-primary me-2"></i> Modèles de Catalogue Prédéfinis</h3>
                <p className="text-muted small m-0">Choisissez un pack de produits adapté à votre secteur d'activité pour démarrer en 1 clic.</p>
              </div>
              <button onClick={onClose} className="btn-close-modal" style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>

            {error && <div className="error-banner mb-3"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}

            {loading ? (
              <div className="loading-spinner p-4 text-center text-muted">
                <i className="fa-solid fa-spinner fa-spin me-2 text-primary"></i> Chargement des packs de catalogues...
              </div>
            ) : templates.length === 0 ? (
              <div className="p-4 text-center rounded bg-light my-3" style={{ border: '1px dashed var(--border-color)' }}>
                <i className="fa-solid fa-boxes-stacked text-muted mb-2" style={{ fontSize: '32px' }}></i>
                <p className="text-muted mb-3" style={{ fontSize: '14px' }}>Aucun pack de catalogue n'est actuellement disponible ou la base de données est en cours d'initialisation.</p>
                <button onClick={loadTemplates} className="btn btn-outline-primary btn-sm" style={{ fontWeight: 700 }}>
                  <i className="fa-solid fa-rotate me-1"></i> Réessayer / Charger les modèles
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '16px' }}>
                {templates.map(tmpl => (
                  <div key={tmpl.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-input, #f8fafc)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        <i className={`fa-solid ${tmpl.icon || 'fa-box'}`}></i>
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>{tmpl.name}</h4>
                        <span className="badge bg-secondary" style={{ fontSize: '11px' }}>{tmpl.domain}</span>
                      </div>
                    </div>

                    <p className="text-muted" style={{ fontSize: '13px', margin: 0, flex: 1, minHeight: '40px' }}>{tmpl.description}</p>

                    <div className="d-flex justify-content-between text-muted small py-2" style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                      <span>📂 {tmpl.categories_count || 0} catégories</span>
                      <span>📦 {tmpl.products_count || 0} produits</span>
                    </div>

                    <button onClick={() => openPreview(tmpl)} className="btn btn-primary btn-sm" style={{ fontWeight: 700, marginTop: '4px' }}>
                      <i className="fa-solid fa-eye me-1"></i> Voir le contenu & Installer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 className="m-0"><i className="fa-solid fa-boxes-packing text-primary me-2"></i> Aperçu : {selectedTemplate.name}</h3>
                <p className="text-muted small m-0">Sélectionnez les catégories à importer dans votre boutique.</p>
              </div>
              <button onClick={() => setTemplateDetails(null)} className="btn btn-secondary btn-sm">
                <i className="fa-solid fa-arrow-left me-1"></i> Retour aux packs
              </button>
            </div>

            {error && <div className="error-banner mb-3"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}

            {detailsLoading ? (
              <div className="loading-spinner">Chargement du contenu...</div>
            ) : (
              <div>
                <div className="d-flex justify-content-between align-items-center my-3 bg-light p-3 rounded" style={{ border: '1px solid var(--border-color)' }}>
                  <div>
                    <strong>{selectedCategories.length} / {templateDetails.categories?.length || 0}</strong> catégorie(s) sélectionnée(s)
                  </div>
                  <div className="d-flex gap-2">
                    <button type="button" onClick={selectAllCategories} className="btn btn-sm btn-outline-primary">Tout sélectionner</button>
                    <button type="button" onClick={deselectAllCategories} className="btn btn-sm btn-outline-secondary">Tout désélectionner</button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                  {templateDetails.categories?.map(cat => {
                    const catProducts = templateDetails.products?.filter(p => p.category_name === cat.name) || [];
                    const isChecked = selectedCategories.includes(cat.id);
                    return (
                      <div 
                        key={cat.id} 
                        onClick={() => toggleCategory(cat.id)} 
                        style={{ 
                          padding: '14px', 
                          borderRadius: '12px', 
                          border: isChecked ? '2px solid var(--color-primary)' : '1px solid var(--border-color)', 
                          background: isChecked ? 'rgba(59, 130, 246, 0.06)' : 'var(--bg-input)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input type="checkbox" checked={isChecked} onChange={() => {}} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                          {cat.image_url ? (
                            <img 
                              src={cat.image_url} 
                              alt={cat.name} 
                              style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                            />
                          ) : (
                            <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className={`fa-solid ${cat.icon || 'fa-folder'}`}></i>
                            </div>
                          )}
                          <div style={{ flex: 1 }}>
                            <strong style={{ fontSize: '14px', display: 'block', color: 'var(--text-main)' }}>{cat.name}</strong>
                            <span className="text-muted small">{catProducts.length} articles avec visuels & prix</span>
                          </div>
                        </div>

                        {/* Aperçu rapide des 3 premiers produits avec image */}
                        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', pt: 1 }}>
                          {catProducts.slice(0, 3).map(p => (
                            <div key={p.id} style={{ fontSize: '10px', background: '#fff', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {p.image_url && <img src={p.image_url} style={{ width: '16px', height: '16px', borderRadius: '3px', objectFit: 'cover' }} alt="" />}
                              <span>{p.name}</span>
                              <strong style={{ color: 'var(--color-primary)' }}>{Number(p.selling_price).toLocaleString()} F</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="modal-actions d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <button type="button" onClick={() => setTemplateDetails(null)} className="btn btn-cancel">Annuler</button>
                  <button 
                    type="button" 
                    onClick={handleInstall} 
                    disabled={installing || selectedCategories.length === 0} 
                    className="btn btn-primary"
                    style={{ fontWeight: 700 }}
                  >
                    {installing ? 'Importation en cours...' : `🚀 Importer la sélection (${selectedCategories.length} cat.)`}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};
