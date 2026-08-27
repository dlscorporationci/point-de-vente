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
    products_count: 24,
    categories: [
      {
        id: 101,
        name: 'Matériaux de construction',
        icon: 'fa-cubes',
        products: [
          { name: 'Ciment CPJ 42.5 (Sac 50kg)', unit: 'sac', selling_price: 4800, cost_price: 4300, alert_quantity: 20 },
          { name: 'Fer à béton Ø10 (Barre 12m)', unit: 'barre', selling_price: 3800, cost_price: 3400, alert_quantity: 50 },
          { name: 'Fer à béton Ø12 (Barre 12m)', unit: 'barre', selling_price: 5400, cost_price: 4900, alert_quantity: 40 },
          { name: 'Clous à charpente 100mm (Carton 25kg)', unit: 'carton', selling_price: 22000, cost_price: 18500, alert_quantity: 5 },
          { name: 'Gravier Concassé 15/25 (Tonne)', unit: 'tonne', selling_price: 14000, cost_price: 11000, alert_quantity: 10 }
        ]
      },
      {
        id: 102,
        name: 'Peinture & Solvants',
        icon: 'fa-paint-roller',
        products: [
          { name: 'Peinture Latex Blanc 20L', unit: 'seau', selling_price: 18500, cost_price: 14000, alert_quantity: 10 },
          { name: 'Peinture Huile Glycéro 5L Blanc', unit: 'pot', selling_price: 12000, cost_price: 9500, alert_quantity: 8 },
          { name: 'Diluant Cellulosique 5L', unit: 'bidon', selling_price: 6500, cost_price: 4800, alert_quantity: 12 },
          { name: 'Rouleau de peinture 220mm complet', unit: 'unité', selling_price: 2500, cost_price: 1600, alert_quantity: 15 },
          { name: 'Pinceau Plat Professionnel 50mm', unit: 'unité', selling_price: 1200, cost_price: 700, alert_quantity: 20 }
        ]
      },
      {
        id: 103,
        name: 'Plomberie & Sanitaires',
        icon: 'fa-faucet',
        products: [
          { name: 'Tuyau PVC Ø110 4m', unit: 'barre', selling_price: 4500, cost_price: 3200, alert_quantity: 25 },
          { name: 'Tuyau PVC Ø40 4m', unit: 'barre', selling_price: 1800, cost_price: 1200, alert_quantity: 30 },
          { name: 'Robinet Mélangeur Inox Lavabo', unit: 'unité', selling_price: 14500, cost_price: 9800, alert_quantity: 6 },
          { name: 'Colle PVC Pinceau 500g', unit: 'pot', selling_price: 3200, cost_price: 2100, alert_quantity: 15 }
        ]
      },
      {
        id: 104,
        name: 'Électricité & Éclairage',
        icon: 'fa-bolt',
        products: [
          { name: 'Câble TH 1.5mm² (Rouleau 100m)', unit: 'rouleau', selling_price: 16500, cost_price: 12800, alert_quantity: 5 },
          { name: 'Câble TH 2.5mm² (Rouleau 100m)', unit: 'rouleau', selling_price: 24500, cost_price: 19500, alert_quantity: 5 },
          { name: 'Disjoncteur Différentiel 16A Mono', unit: 'unité', selling_price: 4500, cost_price: 2900, alert_quantity: 10 },
          { name: 'Ampoule LED E27 12W Blanc Froid', unit: 'unité', selling_price: 1000, cost_price: 600, alert_quantity: 50 }
        ]
      },
      {
        id: 105,
        name: 'Outillage & Équipement',
        icon: 'fa-screwdriver-wrench',
        products: [
          { name: 'Marteau d\'arrache 500g Manche Fibre', unit: 'unité', selling_price: 4200, cost_price: 2600, alert_quantity: 10 },
          { name: 'Meuleuse d\'angle 115mm 850W', unit: 'unité', selling_price: 26500, cost_price: 19000, alert_quantity: 4 },
          { name: 'Perceuse à percussion 710W', unit: 'unité', selling_price: 24000, cost_price: 17500, alert_quantity: 5 },
          { name: 'Niveau à bulle Aluminium 60cm', unit: 'unité', selling_price: 3500, cost_price: 2200, alert_quantity: 12 }
        ]
      }
    ]
  },
  {
    id: 2,
    name: '🛒 Supermarché & Alimentation',
    domain: 'Alimentation',
    icon: 'fa-cart-shopping',
    description: 'Produits frais, boissons, épicerie sèche et entretien ménager.',
    categories_count: 5,
    products_count: 22,
    categories: [
      {
        id: 201,
        name: 'Riz & Céréales',
        icon: 'fa-bowl-rice',
        products: [
          { name: 'Riz Parfumé Uncle Sam 25kg', unit: 'sac', selling_price: 18500, cost_price: 16200, alert_quantity: 10 },
          { name: 'Riz Oncle Sam 5kg', unit: 'sac', selling_price: 4200, cost_price: 3650, alert_quantity: 15 },
          { name: 'Spaghetti Panzani 500g', unit: 'paquet', selling_price: 600, cost_price: 480, alert_quantity: 50 },
          { name: 'Macaroni Maman 500g', unit: 'paquet', selling_price: 500, cost_price: 390, alert_quantity: 40 }
        ]
      },
      {
        id: 202,
        name: 'Huiles & Condiments',
        icon: 'fa-bottle-droplet',
        products: [
          { name: 'Huile de Tournesol Dinor 5L', unit: 'bidon', selling_price: 7500, cost_price: 6400, alert_quantity: 12 },
          { name: 'Huile de Palme Raffinée 1L', unit: 'bouteille', selling_price: 1200, cost_price: 980, alert_quantity: 20 },
          { name: 'Concentré de Tomate 400g', unit: 'boîte', selling_price: 650, cost_price: 520, alert_quantity: 30 },
          { name: 'Cube d\'Assaisonnement Maggi (Pack 60)', unit: 'paquet', selling_price: 1500, cost_price: 1200, alert_quantity: 15 }
        ]
      },
      {
        id: 203,
        name: 'Boissons & Rafraîchissements',
        icon: 'fa-wine-bottle',
        products: [
          { name: 'Eau Minérale Awa 1.5L (Pack de 6)', unit: 'pack', selling_price: 2400, cost_price: 1900, alert_quantity: 20 },
          { name: 'Coca-Cola Canette 33cl (Pack 24)', unit: 'carton', selling_price: 9600, cost_price: 8000, alert_quantity: 10 },
          { name: 'Jus d\'Orange Ceres 1L', unit: 'brique', selling_price: 1400, cost_price: 1100, alert_quantity: 15 }
        ]
      },
      {
        id: 204,
        name: 'Produits Laitiers & Petit Déjeuner',
        icon: 'fa-mug-hot',
        products: [
          { name: 'Lait Concentré Sucré Nestlé 397g', unit: 'boîte', selling_price: 850, cost_price: 700, alert_quantity: 25 },
          { name: 'Lait en Poudre Nido 400g', unit: 'boîte', selling_price: 2800, cost_price: 2350, alert_quantity: 15 },
          { name: 'Chocolat en Poudre Milo 400g', unit: 'boîte', selling_price: 2200, cost_price: 1800, alert_quantity: 12 },
          { name: 'Café Nescafé Classic 100g', unit: 'bocal', selling_price: 1950, cost_price: 1600, alert_quantity: 15 }
        ]
      },
      {
        id: 205,
        name: 'Hygiène & Entretien',
        icon: 'fa-soap',
        products: [
          { name: 'Savon de Marseille 400g', unit: 'morceau', selling_price: 450, cost_price: 320, alert_quantity: 40 },
          { name: 'Lessive en Poudre Omo 1kg', unit: 'sachet', selling_price: 1400, cost_price: 1100, alert_quantity: 20 },
          { name: 'Eau de Javel Lacroix 1L', unit: 'bouteille', selling_price: 750, cost_price: 550, alert_quantity: 25 }
        ]
      }
    ]
  },
  {
    id: 3,
    name: '💊 Pharmacie & Santé',
    domain: 'Pharmacie',
    icon: 'fa-prescription-bottle-medical',
    description: 'Médicaments courants, parapharmacie, hygiène et soins.',
    categories_count: 4,
    products_count: 17,
    categories: [
      {
        id: 301,
        name: 'Analgésiques & Anti-douleurs',
        icon: 'fa-pills',
        products: [
          { name: 'Paracétamol 500mg (Boîte de 16)', unit: 'boîte', selling_price: 500, cost_price: 320, alert_quantity: 50 },
          { name: 'Ibuprofène 400mg (Boîte de 20)', unit: 'boîte', selling_price: 1200, cost_price: 850, alert_quantity: 30 },
          { name: 'Doliprane 1000mg Effervescent', unit: 'boîte', selling_price: 1500, cost_price: 1100, alert_quantity: 25 },
          { name: 'Aspirine 500mg', unit: 'boîte', selling_price: 800, cost_price: 550, alert_quantity: 20 }
        ]
      },
      {
        id: 302,
        name: 'Hygiène & Parapharmacie',
        icon: 'fa-pump-medical',
        products: [
          { name: 'Gel Hydroalcoolique 250ml', unit: 'flacon', selling_price: 1200, cost_price: 800, alert_quantity: 30 },
          { name: 'Dentifrice Signal Protection 75ml', unit: 'tube', selling_price: 900, cost_price: 650, alert_quantity: 25 },
          { name: 'Savon Antiseptique Dettol 100g', unit: 'pain', selling_price: 600, cost_price: 420, alert_quantity: 35 },
          { name: 'Brosse à dents Médium', unit: 'unité', selling_price: 500, cost_price: 300, alert_quantity: 30 }
        ]
      },
      {
        id: 303,
        name: 'Premiers Secours & Matériel',
        icon: 'fa-kit-medical',
        products: [
          { name: 'Compresses Stériles 10x10 (Boîte de 10)', unit: 'boîte', selling_price: 800, cost_price: 500, alert_quantity: 20 },
          { name: 'Alcool à 70° 250ml', unit: 'flacon', selling_price: 1000, cost_price: 700, alert_quantity: 20 },
          { name: 'Pansements Assortis (Boîte de 20)', unit: 'boîte', selling_price: 700, cost_price: 450, alert_quantity: 30 },
          { name: 'Spadadrap Sparaplast 5m', unit: 'rouleau', selling_price: 600, cost_price: 380, alert_quantity: 25 }
        ]
      },
      {
        id: 304,
        name: 'Soins Bébé & Maternité',
        icon: 'fa-baby',
        products: [
          { name: 'Couches Bébé Taille 3 (Pack 40)', unit: 'paquet', selling_price: 6500, cost_price: 5200, alert_quantity: 10 },
          { name: 'Lingettes Bébé Douceur (Pack 72)', unit: 'paquet', selling_price: 1500, cost_price: 1100, alert_quantity: 20 },
          { name: 'Biberon Anticolique 250ml', unit: 'unité', selling_price: 3200, cost_price: 2300, alert_quantity: 8 },
          { name: 'Lait de Toilette Bébé 500ml', unit: 'flacon', selling_price: 2800, cost_price: 2000, alert_quantity: 10 }
        ]
      }
    ]
  },
  {
    id: 4,
    name: '📱 Électronique & High-Tech',
    domain: 'High-Tech',
    icon: 'fa-mobile-screen-button',
    description: 'Smartphones, câbles, écouteurs, accessoires informatiques et électroménager.',
    categories_count: 3,
    products_count: 12,
    categories: [
      {
        id: 401,
        name: 'Téléphonie & Accessoires',
        icon: 'fa-mobile-screen-button',
        products: [
          { name: 'Câble USB-C Vers USB-C Rapide 1m', unit: 'unité', selling_price: 2500, cost_price: 1400, alert_quantity: 20 },
          { name: 'Chargeur Rapide 20W Type-C', unit: 'unité', selling_price: 5500, cost_price: 3500, alert_quantity: 15 },
          { name: 'Écouteurs Sans Fil Bluetooth TWS', unit: 'unité', selling_price: 9500, cost_price: 6200, alert_quantity: 10 },
          { name: 'Verre Trempé Universel 6.5"', unit: 'unité', selling_price: 1500, cost_price: 600, alert_quantity: 30 }
        ]
      },
      {
        id: 402,
        name: 'Informatique & Périphériques',
        icon: 'fa-laptop',
        products: [
          { name: 'Clé USB 3.0 32Go SanDisk', unit: 'unité', selling_price: 4500, cost_price: 3100, alert_quantity: 15 },
          { name: 'Souris Sans Fil Optique USB', unit: 'unité', selling_price: 3500, cost_price: 2200, alert_quantity: 12 },
          { name: 'Tapis de Souris Ergonomique', unit: 'unité', selling_price: 1800, cost_price: 1000, alert_quantity: 20 },
          { name: 'Casque Audio Filaire avec Micro', unit: 'unité', selling_price: 6500, cost_price: 4200, alert_quantity: 8 }
        ]
      },
      {
        id: 403,
        name: 'Énergie & Éclairage',
        icon: 'fa-battery-full',
        products: [
          { name: 'Multiprise 4 Prises avec Interrupteur 3m', unit: 'unité', selling_price: 4500, cost_price: 2900, alert_quantity: 15 },
          { name: 'Piles Alcalines AA LR6 (Pack de 4)', unit: 'pack', selling_price: 1800, cost_price: 1200, alert_quantity: 25 },
          { name: 'Powerbank 10000mAh Dual USB', unit: 'unité', selling_price: 8500, cost_price: 5800, alert_quantity: 10 },
          { name: 'Lampe Torche LED Rechargeable USB', unit: 'unité', selling_price: 3500, cost_price: 2200, alert_quantity: 12 }
        ]
      }
    ]
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
