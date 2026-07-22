import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  // Si l'application tourne sur localhost avec le serveur Vite dev (port 5173)
  if (typeof window !== 'undefined') {
    if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port === '5173') {
      return `http://127.0.0.1:8000${cleanPath}`;
    }
    return `${window.location.origin}${cleanPath}`;
  }

  return cleanPath;
};

export const Catalog = () => {
  const { user, token } = useApp();

  // Liste des produits et catégories depuis l'API
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // États de recherche et filtres
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // États d'ouverture de formulaires
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = création, objet = édition
  
  // États de création de produit
  const [newProductName, setNewProductName] = useState('');
  const [newProductSku, setNewProductSku] = useState('');
  const [newProductBarcode, setNewProductBarcode] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductCategoryId, setNewProductCategoryId] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductAlertQty, setNewProductAlertQty] = useState('10');

  // Scanner de Code-Barres par Caméra
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [scanStatus, setScanStatus] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Générateur automatique de Code-Barres EAN13
  const generateEan13 = () => {
    let code = '200' + Math.floor(Math.random() * 1000000001).toString().padStart(9, '0');
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(code[i]) * (i % 2 === 0 ? 1 : 3);
    }
    let checkDigit = (10 - (sum % 10)) % 10;
    const fullEan = code + checkDigit;
    setNewProductBarcode(fullEan);
    if (!newProductSku) {
      setNewProductSku('SKU-' + fullEan.slice(-6));
    }
  };

  // Boucle de détection caméra pour scanner de code-barres
  useEffect(() => {
    let animationFrameId;
    let detector;

    if (showScannerModal) {
      if ('BarcodeDetector' in window) {
        try {
          detector = new window.BarcodeDetector({ formats: ['code_128', 'ean_13', 'ean_8', 'qr_code', 'upc_a', 'upc_e'] });
        } catch {
          detector = null;
        }
      }

      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }

          const detectLoop = async () => {
            if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
              if (detector) {
                try {
                  const barcodes = await detector.detect(videoRef.current);
                  if (barcodes && barcodes.length > 0) {
                    const rawValue = barcodes[0].rawValue;
                    setNewProductBarcode(rawValue);
                    setScanStatus(`✔️ Code-barres scanné : ${rawValue}`);
                    setTimeout(() => {
                      setShowScannerModal(false);
                      setScanStatus(null);
                    }, 1200);
                    return;
                  }
                } catch {
                  /* silencieux */
                }
              }
            }
            animationFrameId = requestAnimationFrame(detectLoop);
          };

          animationFrameId = requestAnimationFrame(detectLoop);
        })
        .catch(() => {
          setError("Impossible d'accéder à la caméra pour le scan. Vous pouvez utiliser une douchette USB.");
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [showScannerModal]);

  // États de création de catégorie
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newProductImage, setNewProductImage] = useState(null);
  const [newCategoryImage, setNewCategoryImage] = useState(null);

  // États génériques
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Charger les données initiales
  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Charger les catégories
      const catRes = await axios.get('/v1/categories');
      setCategories(catRes.data);

      // 2. Charger les produits (avec filtres optionnels)
      let url = '/v1/products';
      const params = [];
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (selectedCategory) params.push(`category_id=${selectedCategory}`);
      if (params.length > 0) url += `?${params.join('&')}`;

      const prodRes = await axios.get(url);
      setProducts(prodRes.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        'Impossible de charger le catalogue. Vérifiez les privilèges ou la configuration de l\'entreprise.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Recharger dès que les filtres ou le token changent
  useEffect(() => {
    loadData();
  }, [token, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      let res;
      if (newCategoryImage) {
        // Envoi Multipart si image présente
        const formData = new FormData();
        formData.append('name', newCategoryName);
        formData.append('image', newCategoryImage);

        res = await axios.post('/v1/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Envoi JSON standard sinon
        res = await axios.post('/v1/categories', {
          name: newCategoryName
        });
      }

      setSuccess(`Catégorie "${res.data.category.name}" créée avec succès !`);
      setNewCategoryName('');
      setNewCategoryImage(null);
      setShowCategoryForm(false);
      loadData();
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      let errorMsg = 'Erreur lors de la création de la catégorie.';
      if (apiErrors) {
        const messages = Object.values(apiErrors).flat();
        errorMsg = messages.join(' ');
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      setError(errorMsg);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      let res;
      if (newProductImage) {
        // Envoi Multipart si image présente
        const formData = new FormData();
        formData.append('name', newProductName);
        formData.append('sku', newProductSku);
        if (newProductBarcode) formData.append('barcode', newProductBarcode);
        formData.append('selling_price', newProductPrice);
        formData.append('category_id', newProductCategoryId);
        if (newProductDescription) formData.append('description', newProductDescription);
        if (newProductAlertQty) formData.append('alert_quantity', newProductAlertQty);
        formData.append('image', newProductImage);

        res = await axios.post('/v1/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Envoi JSON standard sinon
        res = await axios.post('/v1/products', {
          name: newProductName,
          sku: newProductSku,
          barcode: newProductBarcode || null,
          selling_price: parseFloat(newProductPrice),
          category_id: parseInt(newProductCategoryId),
          description: newProductDescription || null,
          alert_quantity: newProductAlertQty ? parseFloat(newProductAlertQty) : 10.00
        });
      }
      setSuccess(`Produit "${res.data.product.name}" ajouté avec succès !`);
      
      // Réinitialiser le formulaire
      setNewProductName('');
      setNewProductSku('');
      setNewProductBarcode('');
      setNewProductPrice('');
      setNewProductCategoryId('');
      setNewProductDescription('');
      setNewProductAlertQty('10');
      setNewProductImage(null);
      setShowProductForm(false);
      
      loadData();
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      let errorMsg = 'Erreur lors de la création du produit.';
      if (apiErrors) {
        const messages = Object.values(apiErrors).flat();
        errorMsg = messages.join(' ');
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      setError(errorMsg);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    setError(null);
    setSuccess(null);
    try {
      await axios.delete(`/v1/products/${id}`);
      setSuccess('Produit supprimé du catalogue.');
      loadData();
    } catch (err) {
      setError('Impossible de supprimer le produit. Permissions requises.');
    }
  };

  // Ouvrir le formulaire en mode édition
  const openEditForm = (product) => {
    setEditingProduct(product);
    setNewProductName(product.name);
    setNewProductSku(product.sku);
    setNewProductBarcode(product.barcode || '');
    setNewProductPrice(product.selling_price);
    setNewProductCategoryId(product.category?.id || '');
    setNewProductDescription(product.description || '');
    setNewProductAlertQty(product.alert_quantity || '10');
    setNewProductImage(null);
    setShowProductForm(true);
    setShowCategoryForm(false);
    setError(null); setSuccess(null);
  };

  // Mettre à jour un produit existant
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    try {
      let res;
      if (newProductImage) {
        const formData = new FormData();
        formData.append('name', newProductName);
        formData.append('sku', newProductSku);
        if (newProductBarcode) formData.append('barcode', newProductBarcode);
        formData.append('selling_price', newProductPrice);
        formData.append('category_id', newProductCategoryId);
        if (newProductDescription) formData.append('description', newProductDescription);
        if (newProductAlertQty) formData.append('alert_quantity', newProductAlertQty);
        formData.append('image', newProductImage);
        formData.append('_method', 'PUT');
        res = await axios.post(`/v1/products/${editingProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await axios.put(`/v1/products/${editingProduct.id}`, {
          name: newProductName,
          sku: newProductSku,
          barcode: newProductBarcode || null,
          selling_price: parseFloat(newProductPrice),
          category_id: parseInt(newProductCategoryId),
          description: newProductDescription || null,
          alert_quantity: newProductAlertQty ? parseFloat(newProductAlertQty) : 10.00
        });
      }
      setSuccess(`Produit "${res.data.product?.name || newProductName}" mis à jour avec succès !`);
      setShowProductForm(false);
      setEditingProduct(null);
      // Réinitialiser le formulaire
      setNewProductName(''); setNewProductSku(''); setNewProductBarcode('');
      setNewProductPrice(''); setNewProductCategoryId(''); setNewProductDescription('');
      setNewProductAlertQty('10'); setNewProductImage(null);
      loadData();
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      let errorMsg = 'Erreur lors de la mise à jour du produit.';
      if (apiErrors) { errorMsg = Object.values(apiErrors).flat().join(' '); }
      else if (err.response?.data?.error) { errorMsg = err.response.data.error; }
      else if (err.response?.data?.message) { errorMsg = err.response.data.message; }
      setError(errorMsg);
    }
  };


  if (!token) {
    return (
      <div className="catalog-container">
        <div className="alert-card card">
          <span className="alert-icon"><i className="fa-solid fa-lock text-muted"></i></span>
          <h3>Accès Réservé</h3>
          <p>Vous devez vous connecter à une session pour gérer le catalogue de produits.</p>
        </div>
      </div>
    );
  }

  const hasCreatePermission = user?.permissions?.includes('products.create') || user?.role === 'admin';

  return (
    <div className="catalog-container">
      {/* Sphères décoratives pour le Glassmorphism */}
      <div className="decorator-sphere sphere-1"></div>
      <div className="decorator-sphere sphere-2"></div>

      <div className="catalog-layout card">
        <div className="catalog-header">
          <div>
            <h2><i className="fa-solid fa-box me-2 text-primary"></i> Gestion du Catalogue Produits</h2>
            <p className="catalog-subtitle">Pilotez vos articles et catégories</p>
          </div>
          
          {hasCreatePermission && (
            <div className="action-buttons-group">
              <button onClick={() => { setShowCategoryForm(true); setShowProductForm(false); }} className="btn btn-secondary">
                <i className="fa-solid fa-folder-open me-1"></i> Nouvelle Catégorie
              </button>
              <button onClick={() => { setEditingProduct(null); setNewProductName(''); setNewProductSku(''); setNewProductBarcode(''); setNewProductPrice(''); setNewProductCategoryId(''); setNewProductDescription(''); setNewProductAlertQty('10'); setNewProductImage(null); setShowProductForm(true); setShowCategoryForm(false); }} className="btn btn-primary">
                <i className="fa-solid fa-plus me-1"></i> Ajouter un Produit
              </button>
            </div>
          )}
        </div>

        {error && <div className="error-banner"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}
        {success && <div className="success-banner"><i className="fa-solid fa-circle-check me-1"></i> {success}</div>}

        {/* Formulaire Modal 1 : Nouvelle Catégorie */}
        {showCategoryForm && (
          <div className="modal-overlay">
            <div className="modal-card card">
              <h3><i className="fa-solid fa-folder-open me-2 text-secondary"></i> Créer une nouvelle catégorie</h3>
              <form onSubmit={handleCreateCategory}>
                <div className="form-group">
                  <label className="form-label">Nom de la catégorie</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                    placeholder="Ex: Électricité, Plomberie..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Photo d'illustration de la catégorie</label>
                  {newCategoryImage && (
                    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={URL.createObjectURL(newCategoryImage)}
                        alt="Aperçu catégorie"
                        style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--color-primary)' }}
                      />
                      <small className="text-muted">Image de catégorie sélectionnée</small>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="form-control" 
                    accept="image/*"
                    onChange={(e) => setNewCategoryImage(e.target.files[0])}
                  />
                </div>

                {/* Liste des catégories existantes avec images */}
                <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <label className="form-label mb-2" style={{ fontWeight: 700 }}>Catégories existantes ({categories.length})</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                    {categories.map(c => (
                      <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'var(--bg-input)', borderRadius: '20px', fontSize: '13px', border: '1px solid var(--border-color)' }}>
                        {c.image_path ? (
                          <img src={getImageUrl(c.image_path)} alt={c.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <i className="fa-solid fa-folder text-primary" style={{ fontSize: '14px' }}></i>
                        )}
                        <span>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowCategoryForm(false)} className="btn btn-cancel">Annuler</button>
                  <button type="submit" className="btn btn-primary">Enregistrer la catégorie</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Formulaire Modal 2 : Nouveau Produit / Modifier Produit */}
        {showProductForm && (
          <div className="modal-overlay">
            <div className="modal-card card modal-large">
              <h3>
                {editingProduct
                  ? <><i className="fa-solid fa-pen me-2 text-warning"></i> Modifier le produit</>  
                  : <><i className="fa-solid fa-box me-2 text-primary"></i> Ajouter un produit au catalogue</>}
              </h3>
              <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}>
                <div className="form-row-grid">
                  <div className="form-group">
                    <label className="form-label">Nom de l'article *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Catégorie *</label>
                    <select 
                      className="form-control"
                      value={newProductCategoryId}
                      onChange={(e) => setNewProductCategoryId(e.target.value)}
                      required
                    >
                      <option value="">Sélectionner...</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row-grid">
                  <div className="form-group">
                    <label className="form-label">Référence unique SKU *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={newProductSku}
                      onChange={(e) => setNewProductSku(e.target.value)}
                      required
                      placeholder="Ex: SKU-XYZ-12"
                    />
                  </div>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label className="form-label mb-0">Code-barres EAN13</label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          type="button" 
                          onClick={() => setShowScannerModal(true)} 
                          className="btn-xs-scan"
                          style={{
                            padding: '3px 8px',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: 'var(--color-primary)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <i className="fa-solid fa-camera me-1"></i> Scanner
                        </button>
                        <button 
                          type="button" 
                          onClick={generateEan13} 
                          className="btn-xs-generate"
                          style={{
                            padding: '3px 8px',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: 'var(--bg-input)',
                            color: 'var(--text-main)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <i className="fa-solid fa-wand-magic-sparkles me-1"></i> Auto EAN
                        </button>
                      </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={newProductBarcode}
                        onChange={(e) => setNewProductBarcode(e.target.value)}
                        placeholder="Ex: 3700021300051 (ou scanner avec douchette USB / caméra)"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row-grid">
                  <div className="form-group">
                    <label className="form-label">Prix de vente unitaire (XOF) *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      required
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Seuil critique d'alerte stock</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={newProductAlertQty}
                      onChange={(e) => setNewProductAlertQty(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-control textarea-input" 
                    value={newProductDescription}
                    onChange={(e) => setNewProductDescription(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Photo du produit</label>
                  {(newProductImage || editingProduct?.image_path) && (
                    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={newProductImage ? URL.createObjectURL(newProductImage) : getImageUrl(editingProduct.image_path)}
                        alt="Aperçu du produit"
                        style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--color-primary)' }}
                      />
                      <small className="text-muted">
                        {newProductImage ? '📸 Nouvelle photo sélectionnée' : '🖼️ Photo actuelle du produit'}
                      </small>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="form-control" 
                    accept="image/*"
                    onChange={(e) => setNewProductImage(e.target.files[0])}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => { setShowProductForm(false); setEditingProduct(null); }} className="btn btn-cancel">Annuler</button>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Enregistrer les modifications' : 'Enregistrer le produit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Scanner de Code-Barres par Caméra */}
        {showScannerModal && (
          <div className="modal-overlay">
            <div className="modal-card card" style={{ maxWidth: '460px', textAlign: 'center' }}>
              <h3><i className="fa-solid fa-camera me-2 text-primary"></i> Scanner le Code-Barres de l'Article</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Pointez la caméra vers le code-barres sur l'emballage du produit.
              </p>

              {scanStatus && <div className="success-banner mb-3">{scanStatus}</div>}

              {/* Rendu Vidéo de la Caméra avec Viseur Laser */}
              <div className="scanner-video-wrapper" style={{
                position: 'relative',
                width: '100%',
                height: '240px',
                background: '#000000',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <video 
                  ref={videoRef} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  playsInline 
                  muted 
                />
                {/* Ligne Laser de Balayage */}
                <div className="scanner-laser" style={{
                  position: 'absolute',
                  top: '50%',
                  left: '10%',
                  right: '10%',
                  height: '2px',
                  background: '#00ff66',
                  boxShadow: '0 0 12px #00ff66',
                  animation: 'laserScan 2s infinite ease-in-out'
                }}></div>
              </div>

              {/* Saisie alternative directe par douchette USB */}
              <div style={{ marginTop: '16px', textAlign: 'left' }}>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 700 }}>
                  <i className="fa-solid fa-barcode me-1 text-primary"></i> Saisie directe ou Lecteur USB :
                </label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Scannez ici avec votre lecteur USB..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (e.target.value.trim()) {
                        setNewProductBarcode(e.target.value.trim());
                        setShowScannerModal(false);
                      }
                    }
                  }}
                />
              </div>

              <div className="modal-actions" style={{ marginTop: '16px' }}>
                <button type="button" onClick={() => setShowScannerModal(false)} className="btn btn-cancel">
                  Fermer le scanner
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Barre de Recherche et Filtres */}
        <form onSubmit={handleSearchSubmit} className="filters-bar">
          <input 
            type="text" 
            placeholder="Rechercher par nom, SKU, code-barres..." 
            className="form-control search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select 
            className="form-control category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary"><i className="fa-solid fa-magnifying-glass me-1"></i> Filtrer</button>
        </form>

        {/* Liste des produits sous forme de tableau */}
        {loading ? (
          <div className="loading-spinner">Chargement du catalogue...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon"><i className="fa-solid fa-inbox text-muted"></i></span>
            <h4>Aucun produit trouvé</h4>
            <p>Essayez de modifier vos critères de recherche ou d'ajouter de nouveaux articles.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="products-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Photo</th>
                  <th>SKU / Code-barres</th>
                  <th>Nom de l'article</th>
                  <th>Catégorie</th>
                  <th>Prix de Vente</th>
                  <th>Seuil d'Alerte (Min)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                      {product.image_path ? (
                        <img 
                          src={getImageUrl(product.image_path)} 
                          alt={product.name} 
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}
                        />
                      ) : (
                        <div 
                          style={{ 
                            width: '48px', height: '48px', borderRadius: '8px', 
                            background: 'var(--bg-input)', display: 'inline-flex', 
                            alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)',
                            border: '1px dashed var(--border-color)' 
                          }}
                        >
                          <i className="fa-solid fa-box" style={{ fontSize: '18px' }}></i>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="sku-cell">{product.sku}</div>
                      {product.barcode && <div className="barcode-sub">{product.barcode}</div>}
                    </td>
                    <td>
                      <div className="product-title-cell">{product.name}</div>
                      {product.description && <div className="desc-sub">{product.description}</div>}
                    </td>
                    <td>
                      <span className="category-tag">{product.category?.name || 'Inconnue'}</span>
                    </td>
                    <td className="price-cell">
                      {new Intl.NumberFormat('fr-FR').format(product.selling_price)} XOF
                    </td>
                    <td>
                      <span className="alert-qty-cell" title="Seuil minimal de déclenchement d'alerte stock">
                        <small className="text-muted d-block" style={{ fontSize: '10px' }}>Seuil min :</small>
                        {product.alert_quantity || product.min_stock_alert || 10}.00 unités
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {(user?.permissions?.includes('products.update') || user?.role === 'admin' || user?.role?.slug === 'admin' || user?.role?.slug === 'gerant') && (
                          <button
                            onClick={() => openEditForm(product)}
                            className="btn btn-xs btn-secondary"
                            title="Modifier"
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                        )}
                        {(user?.permissions?.includes('products.delete') || user?.role === 'admin' || user?.role?.slug === 'admin') ? (
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="btn-delete"
                            title="Supprimer"
                          >
                            <i className="fa-solid fa-trash-can text-danger"></i>
                          </button>
                        ) : (
                          <span className="text-lock"><i className="fa-solid fa-lock text-muted"></i></span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .catalog-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .alert-card {
          width: 100%;
          max-width: 460px;
          padding: 40px;
          text-align: center;
          margin-top: 100px;
        }

        .alert-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }

        .catalog-layout {
          width: 100%;
          max-width: 1080px;
          padding: 32px;
          margin-top: 100px; /* laisser place au theme selector */
        }

        .catalog-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
          text-align: left;
        }

        .catalog-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        .action-buttons-group {
          display: flex;
          gap: 12px;
        }

        .btn-secondary {
          background: var(--bg-input);
          color: var(--text-main);
          border: 1px solid var(--border-color);
        }

        .btn-secondary:hover {
          background: var(--border-color);
        }

        .filters-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .search-input {
          flex: 2;
        }

        .category-filter {
          flex: 1;
        }

        .loading-spinner {
          padding: 40px;
          text-align: center;
          color: var(--text-muted);
          font-weight: 500;
        }

        .empty-state {
          padding: 60px;
          text-align: center;
          background: var(--bg-input);
          border-radius: var(--border-radius-md);
          border: 1px dashed var(--border-color);
        }

        .empty-icon {
          font-size: 40px;
          display: block;
          margin-bottom: 12px;
        }

        /* Styles de la table */
        .table-responsive {
          width: 100%;
          overflow-x: auto;
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--border-color);
        }

        .category-tag {
          padding: 4px 8px;
          background: var(--primary-glow);
          color: var(--color-primary);
          font-size: 11px;
          font-weight: 700;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .alert-qty-cell {
          font-size: 13px;
          font-weight: 500;
        }

        .btn-delete {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          border-radius: 4px;
          transition: background var(--transition-fast);
        }

        .btn-delete:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        .text-lock {
          font-size: 12px;
          color: var(--text-muted);
        }

      `}</style>
    </div>
  );
};
