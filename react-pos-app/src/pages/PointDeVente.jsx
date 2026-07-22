import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { useCartStore } from '../store/useCartStore';
import { getImageUrl } from './Catalog';

export const PointDeVente = () => {
  const { user, token } = useApp();
  const { cart, globalDiscount, addItem, removeItem, updateQuantity, updateDiscount, setGlobalDiscount, clearCart, getTotals, setTaxSettings } = useCartStore();

  // Liste des produits et catégories
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  
  // Session active
  const [currentSession, setCurrentSession] = useState(null);

  // Recherche & Barcode
  const [searchQuery, setSearchQuery] = useState('');

  // Scanner de Code-Barres par Caméra
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [manualScanInput, setManualScanInput] = useState('');
  const [scanStatus, setScanStatus] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Modal de paiement
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  // Reçu thermique
  const [completedSale, setCompletedSale] = useState(null);

  // États génériques
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Charger les données
  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      // Charger la caisse ouverte
      const sessionRes = await axios.get('/v1/cash-sessions/current');
      if (sessionRes.data && sessionRes.data.id) {
        setCurrentSession(sessionRes.data);
      } else {
        setCurrentSession(null);
      }

      // Charger les produits et catégories
      const prodRes = await axios.get('/v1/products');
      setProducts(prodRes.data.data || []);

      const catRes = await axios.get('/v1/categories');
      setCategories(catRes.data || []);

      // Charger les clients pour la sélection
      const custRes = await axios.get('/v1/customers');
      setCustomers(custRes.data.data || []);

      // Charger les paramètres de TVA de l'entreprise
      try {
        const tenantRes = await axios.get('/v1/tenant-test');
        if (tenantRes.data?.company?.tax_settings) {
          setTaxSettings(tenantRes.data.company.tax_settings);
        }
      } catch {
        /* silencieux */
      }
    } catch (err) {
      setError('Impossible de charger les données du catalogue, des clients ou de caisse.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  // Recherche & Simulation Barcode Scanner (Touche Entrée dans l'input)
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchQuery.trim();
      if (!query) return;

      // Chercher par code-barres exact ou SKU exact d'abord
      const match = products.find(p => p.barcode === query || p.sku.toLowerCase() === query.toLowerCase());
      if (match) {
        addItem(match);
        setSuccess(`Ajouté : ${match.name}`);
        setSearchQuery('');
        setTimeout(() => setSuccess(null), 1500);
      } else {
        // Recherche floue si pas de match exact de scanner
        const fuzzyMatches = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
        if (fuzzyMatches.length === 1) {
          addItem(fuzzyMatches[0]);
          setSuccess(`Ajouté : ${fuzzyMatches[0].name}`);
          setSearchQuery('');
          setTimeout(() => setSuccess(null), 1500);
        } else if (fuzzyMatches.length > 1) {
          setError('Plusieurs produits correspondent. Veuillez sélectionner dans la grille.');
          setTimeout(() => setError(null), 2500);
        } else {
          setError('Aucun produit trouvé avec ce code-barres ou SKU.');
          setTimeout(() => setError(null), 2500);
        }
      }
    }
  };

  // Filtrer les produits pour la grille tactile
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory ? p.category_id === activeCategory : true;
    const matchesSearch = searchQuery 
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch && p.status === 'active';
  });

  const totals = getTotals();

  // Calcul monnaie à rendre
  const cashChange = paymentMethod === 'cash' && amountReceived 
    ? parseFloat(amountReceived) - totals.total 
    : 0;



  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (cart.length === 0) {
      setError('Le panier est vide.');
      return;
    }

    if (paymentMethod === 'cash' && parseFloat(amountReceived || '0') < totals.total) {
      setError('Le montant reçu est inférieur au montant total de la vente.');
      return;
    }

    if (paymentMethod === 'credit' && !selectedCustomerId) {
      setError('Un client enregistré est requis pour une vente à crédit.');
      return;
    }

    try {
      const payload = {
        cash_session_id: currentSession.id,
        payment_method: paymentMethod,
        customer_id: selectedCustomerId ? parseInt(selectedCustomerId) : null,
        amount_received: paymentMethod === 'credit' ? 0 : parseFloat(amountReceived || totals.total),
        client_name: clientName || 'Client Comptant',
        client_phone: clientPhone || null,
        global_discount: globalDiscount,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          selling_price: parseFloat(item.product.selling_price),
          discount: item.discount
        }))
      };

      // 1. Créer la vente
      const saleRes = await axios.post('/v1/sales', payload);
      const saleId = saleRes.data.sale?.id;

      // 2. Tous les paiements (cash, carte, geniuspay, crédit) → succès immédiat
      // Charger le détail complet avec les relations (products, user, branch, customer)
      try {
        const saleDetailRes = await axios.get(`/v1/sales/${saleId}`);
        setCompletedSale(saleDetailRes.data);
      } catch {
        setCompletedSale(saleRes.data.sale);
      }
      setSuccess('✅ Vente enregistrée avec succès !');
      clearCart();
      setShowPayModal(false);
      setAmountReceived('');
      setClientName('');
      setClientPhone('');
      setSelectedCustomerId('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la validation de la vente.');
    }
  };

  if (!token) {
    return (
      <div className="pos-container">
        <div className="alert-card card">
          <span className="alert-icon">🔒</span>
          <h3>Accès Réservé</h3>
          <p>Vous devez vous connecter à une session pour accéder au Terminal de Vente.</p>
        </div>
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div className="pos-container">
        <div className="alert-card card" style={{ borderColor: 'var(--color-error)' }}>
          <span className="alert-icon">⚠️</span>
          <h3>Session de Caisse Requise</h3>
          <p>Vous devez ouvrir une session de caisse dans l'onglet <strong>💸 Caisses</strong> avant de pouvoir enregistrer des ventes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pos-container">
      <div className="decorator-sphere sphere-1"></div>
      <div className="decorator-sphere sphere-2"></div>

      <div className="pos-layout card">
        {error && <div className="error-banner">⚠️ {error}</div>}
        {success && <div className="success-banner">✔️ {success}</div>}

        <div className="pos-grid-columns">
          {/* COLONNE GAUCHE: GRILLE DES PRODUITS TACTILE */}
          <div className="pos-left-panel">
            <div className="pos-search-box">
              <input 
                type="text" 
                className="form-control pos-search-input" 
                placeholder="🔍 Rechercher ou scanner un code-barres (Appuyez sur Entrée)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
            </div>

            {/* Filtres Catégories */}
            <div className="pos-categories-bar">
              <button 
                onClick={() => setActiveCategory(null)} 
                className={`pos-cat-btn ${activeCategory === null ? 'active' : ''}`}
              >
                Tout
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => setActiveCategory(cat.id)}
                  className={`pos-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Grille de Produits */}
            {filteredProducts.length === 0 ? (
              <div className="empty-state" style={{ marginTop: '40px' }}>
                Aucun produit trouvé dans cette catégorie.
              </div>
            ) : (
              <div className="pos-products-grid">
                {filteredProducts.map(p => (
                  <div key={p.id} onClick={() => addItem(p)} className="pos-product-card">
                    <div className="pos-prod-img-box">
                      {p.image_path ? (
                        <img 
                          src={getImageUrl(p.image_path)} 
                          alt={p.name} 
                          className="pos-prod-img"
                        />
                      ) : (
                        <div className="pos-prod-img-placeholder">
                          <i className="fa-solid fa-box"></i>
                        </div>
                      )}
                      <span className="pos-prod-price-badge">
                        {new Intl.NumberFormat('fr-FR').format(p.selling_price)} XOF
                      </span>
                    </div>
                    <div className="pos-prod-info">
                      <div className="pos-prod-name">{p.name}</div>
                      <div className="pos-prod-sku">{p.sku}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLONNE DROITE: PANIER / TOTAL */}
          <div className="pos-right-panel">
            <div className="pos-cart-header">
              <h3>🛒 Panier</h3>
              <button onClick={clearCart} className="btn-clear-cart">Vider</button>
            </div>

            <div className="pos-cart-list">
              {cart.length === 0 ? (
                <div className="pos-empty-cart">
                  <span className="cart-empty-icon">🛒</span>
                  <p>Panier vide. Cliquez sur un produit pour l'ajouter.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="pos-cart-item">
                    {item.product.image_path ? (
                      <img 
                        src={getImageUrl(item.product.image_path)} 
                        alt={item.product.name} 
                        style={{ 
                          width: '44px', 
                          height: '44px', 
                          objectFit: 'cover', 
                          borderRadius: '6px', 
                          border: '1px solid var(--border-color)',
                          flexShrink: 0,
                          marginRight: '10px'
                        }} 
                      />
                    ) : (
                      <div 
                        style={{ 
                          width: '44px', 
                          height: '44px', 
                          borderRadius: '6px', 
                          background: 'var(--bg-input)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justify: 'center', 
                          color: 'var(--text-muted)',
                          border: '1px dashed var(--border-color)',
                          flexShrink: 0,
                          marginRight: '10px'
                        }}
                      >
                        <i className="fa-solid fa-box" style={{ fontSize: '16px' }}></i>
                      </div>
                    )}
                    <div className="pos-item-info">
                      <div className="pos-item-name">{item.product.name}</div>
                      <div className="pos-item-price">{new Intl.NumberFormat('fr-FR').format(item.product.selling_price)} XOF</div>
                    </div>

                    <div className="pos-item-controls">
                      {/* Quantité */}
                      <div className="qty-picker">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="qty-btn">-</button>
                        <input 
                          type="number" 
                          className="qty-val" 
                          value={item.quantity} 
                          onChange={(e) => updateQuantity(item.product.id, e.target.value)}
                        />
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="qty-btn">+</button>
                      </div>

                      {/* Remise par ligne */}
                      <input 
                        type="number" 
                        placeholder="Remise XOF" 
                        className="form-control item-discount-input"
                        value={item.discount === 0 ? '' : item.discount}
                        onChange={(e) => updateDiscount(item.product.id, e.target.value)}
                      />

                      {/* Supprimer */}
                      <button onClick={() => removeItem(item.product.id)} className="btn-remove-item">🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Totaux & Remise Globale */}
            <div className="pos-cart-totals">
              <div className="totals-row">
                <span>Sous-total HT :</span>
                <span>{new Intl.NumberFormat('fr-FR').format(totals.subtotal)} XOF</span>
              </div>
              <div className="totals-row">
                <span>Remise Globale (XOF) :</span>
                <input 
                  type="number" 
                  className="global-discount-input"
                  value={globalDiscount === 0 ? '' : globalDiscount}
                  onChange={(e) => setGlobalDiscount(e.target.value)}
                />
              </div>
              <div className="totals-row">
                <span>TVA {totals.enableTax ? `(${totals.taxRate}%)` : '(Désactivée)'} :</span>
                <span>{new Intl.NumberFormat('fr-FR').format(totals.tax)} XOF</span>
              </div>
              <div className="totals-row grand-total-row">
                <span>Total TTC :</span>
                <span>{new Intl.NumberFormat('fr-FR').format(totals.total)} XOF</span>
              </div>

              <button 
                onClick={() => {
                  if (cart.length > 0) {
                    setAmountReceived(totals.total.toString());
                    setShowPayModal(true);
                  }
                }} 
                className="btn-checkout"
                disabled={cart.length === 0}
              >
                💵 Valider et Payer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE PAIEMENT */}
      {showPayModal && (
        <div className="modal-overlay">
          <div className="modal-card card" style={{ maxWidth: '440px' }}>
            <h3>💵 Enregistrer le Paiement</h3>
            
            <form onSubmit={handleCheckoutSubmit}>
              <div className="form-group">
                <label className="form-label">Méthode de Paiement *</label>
                <select 
                  className="form-control" 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="cash">Espèces (Cash)</option>
                  <option value="card">Carte Bancaire</option>
                  <option value="credit">Crédit Client</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Client enregistré {paymentMethod === 'credit' ? '*' : '(optionnel)'}</label>
                <select 
                  className="form-control"
                  value={selectedCustomerId}
                  onChange={(e) => {
                    setSelectedCustomerId(e.target.value);
                    const cust = customers.find(c => c.id === parseInt(e.target.value));
                    if (cust) {
                      setClientName(cust.name);
                      setClientPhone(cust.phone || '');
                    }
                  }}
                  required={paymentMethod === 'credit'}
                >
                  <option value="">-- Client de passage --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.phone ? `(${c.phone})` : ''} — Solde: {new Intl.NumberFormat('fr-FR').format(c.debt_balance)} XOF
                    </option>
                  ))}
                </select>
              </div>

              {paymentMethod === 'cash' && (
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Montant Reçu (XOF) *</span>
                    <span className="text-muted" style={{ fontSize: '12px' }}>
                      Total à payer : <strong style={{ color: 'var(--color-primary)' }}>{new Intl.NumberFormat('fr-FR').format(totals.total)} XOF</strong>
                    </span>
                  </label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    required
                    placeholder={`Ex: ${totals.total}`}
                  />
                  
                  {amountReceived !== '' && !isNaN(parseFloat(amountReceived)) && (
                    <>
                      {cashChange > 0 && (
                        <div className="change-due-banner">
                          <i className="fa-solid fa-circle-check" style={{ color: '#10b981', fontSize: '16px' }}></i>
                          <span>Monnaie à rendre : <strong style={{ fontSize: '14px' }}>{new Intl.NumberFormat('fr-FR').format(cashChange)} XOF</strong></span>
                        </div>
                      )}

                      {cashChange === 0 && (
                        <div className="change-due-banner" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#059669', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                          <i className="fa-solid fa-circle-check" style={{ color: '#10b981', fontSize: '16px' }}></i>
                          <span>Compte exact : <strong>0 XOF à rendre</strong></span>
                        </div>
                      )}

                      {cashChange < 0 && (
                        <div className="insufficient-amount-banner">
                          <i className="fa-solid fa-circle-xmark" style={{ color: '#e11d48', fontSize: '16px' }}></i>
                          <span>
                            Le montant est insuffisant : <strong style={{ fontSize: '14px' }}>-{new Intl.NumberFormat('fr-FR').format(Math.abs(cashChange))} XOF</strong> manquant(s)
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Nom du Client</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ex: Client de passage"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Téléphone Client</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ex: +221 77 123 45 67"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowPayModal(false)} className="btn btn-cancel">Annuler</button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={paymentMethod === 'cash' && (!amountReceived || parseFloat(amountReceived) < totals.total)}
                >
                  Confirmer &amp; Imprimer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL RECU IMPRIMABLE */}
      {completedSale && (
        <div className="modal-overlay">
          <div className="modal-card card" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h3 className="no-print">🧾 Ticket de Caisse</h3>
            <p className="no-print">Vente enregistrée avec succès. Vous pouvez imprimer le reçu ci-dessous.</p>

            {/* Reçu thermique réel */}
            <div id="thermal-receipt" className="thermal-receipt-container">
              <div className="receipt-header">
                <h2>{user?.company?.name || 'ApexPOS'}</h2>
                <p>{completedSale.branch?.name || 'Boutique Centrale'}</p>
                <p>{completedSale.branch?.address || 'Dakar Plateau'}</p>
                <p>Tél: {completedSale.branch?.phone || '+221 33 000 00 00'}</p>
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-details">
                <p><strong>N° Ticket:</strong> {completedSale.sale_number}</p>
                <p><strong>Date:</strong> {new Date(completedSale.created_at).toLocaleString('fr-FR')}</p>
                <p><strong>Caissier:</strong> {completedSale.user?.name || user?.name}</p>
                <p><strong>Client:</strong> {completedSale.client_name}</p>
                {completedSale.client_phone && <p><strong>Tél Client:</strong> {completedSale.client_phone}</p>}
              </div>

              <div className="receipt-divider"></div>

              <table className="receipt-items-table">
                <thead>
                  <tr>
                    <th>Article</th>
                    <th style={{ textAlign: 'center' }}>Qté</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {completedSale.details?.map(item => (
                    <tr key={item.id}>
                      <td>
                        {item.product?.name}
                        <br />
                        <span className="item-unit-price">
                          {item.quantity} x {new Intl.NumberFormat('fr-FR').format(item.selling_price)}
                          {parseFloat(item.discount) > 0 && ` (-${new Intl.NumberFormat('fr-FR').format(item.discount)})`}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right' }}>{new Intl.NumberFormat('fr-FR').format(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="receipt-divider"></div>

              <div className="receipt-totals">
                <div className="receipt-total-row">
                  <span>Sous-total HT :</span>
                  <span>{new Intl.NumberFormat('fr-FR').format(completedSale.subtotal)} XOF</span>
                </div>
                {parseFloat(completedSale.discount) > 0 && (
                  <div className="receipt-total-row">
                    <span>Remise :</span>
                    <span>-{new Intl.NumberFormat('fr-FR').format(completedSale.discount)} XOF</span>
                  </div>
                )}
                <div className="receipt-total-row">
                  <span>TVA {parseFloat(completedSale.tax) > 0 ? '' : '(Désactivée)'} :</span>
                  <span>{new Intl.NumberFormat('fr-FR').format(completedSale.tax)} XOF</span>
                </div>
                <div className="receipt-total-row grand-total">
                  <span>TOTAL TTC :</span>
                  <span>{new Intl.NumberFormat('fr-FR').format(completedSale.total)} XOF</span>
                </div>
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-payment-info">
                <p><strong>Mode de Paiement:</strong> {completedSale.payment_method === 'cash' ? 'Espèces' : completedSale.payment_method === 'credit' ? 'Crédit Client' : 'Carte Bancaire'}</p>
                {completedSale.payment_method === 'credit' && (
                  <p><strong>Statut:</strong> <span style={{ color: '#dc3545' }}>Impayé — À crédit</span></p>
                )}
                {completedSale.payment_method === 'cash' && (
                  <>
                    <p><strong>Montant Reçu:</strong> {new Intl.NumberFormat('fr-FR').format(completedSale.amount_received)} XOF</p>
                    <p><strong>Rendu:</strong> {new Intl.NumberFormat('fr-FR').format(completedSale.amount_change)} XOF</p>
                  </>
                )}
              </div>

              <div className="receipt-footer">
                <p>Merci de votre confiance !</p>
                <p>Retour ou échange sous 7 jours avec ce ticket.</p>
                <p>À bientôt !</p>
              </div>
            </div>

            <div className="modal-actions no-print" style={{ marginTop: '16px' }}>
              <button 
                type="button" 
                onClick={() => {
                  window.print();
                }} 
                className="btn btn-primary"
              >
                🖨️ Imprimer le reçu
              </button>
              <button 
                type="button" 
                onClick={() => setCompletedSale(null)} 
                className="btn btn-cancel"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .pos-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .pos-layout {
          width: 100%;
          max-width: 1200px;
          padding: 24px;
          margin-top: 100px;
        }

        .pos-grid-columns {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 24px;
          text-align: left;
        }

        /* Grille tactile gauche */
        .pos-search-box {
          margin-bottom: 16px;
        }

        .pos-search-input {
          font-size: 14px;
          padding: 12px;
        }

        .pos-categories-bar {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 8px;
          margin-bottom: 16px;
        }

        .pos-cat-btn {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 700;
          border-radius: 20px;
          cursor: pointer;
          white-space: nowrap;
          transition: all var(--transition-fast);
        }

        .pos-cat-btn.active, .pos-cat-btn:hover {
          background: var(--color-primary);
          color: #FFF;
          border-color: var(--color-primary);
        }

        .pos-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 12px;
          max-height: 500px;
          overflow-y: auto;
          padding-right: 8px;
        }

        .pos-product-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 8px;
          cursor: pointer;
          position: relative;
          display: flex;
          flex-direction: column;
          height: 155px;
          transition: all var(--transition-fast);
          overflow: hidden;
        }

        .pos-product-card:hover {
          border-color: var(--color-primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .pos-prod-img-box {
          position: relative;
          width: 100%;
          height: 85px;
          border-radius: 6px;
          overflow: hidden;
          background: var(--bg-input);
        }

        .pos-prod-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pos-prod-img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-size: 24px;
        }

        .pos-prod-price-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(16, 185, 129, 0.95);
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }

        .pos-prod-info {
          margin-top: 6px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
        }

        .pos-prod-name {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .pos-prod-sku {
          font-size: 10px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        /* Panier droit */
        .pos-right-panel {
          border-left: 1px solid var(--border-color);
          padding-left: 24px;
          display: flex;
          flex-direction: column;
          height: 600px;
          justify-content: space-between;
        }

        .pos-cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
        }

        .btn-clear-cart {
          background: transparent;
          border: none;
          color: var(--color-error);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .pos-cart-list {
          flex: 1;
          overflow-y: auto;
          margin: 16px 0;
          padding-right: 8px;
        }

        .pos-empty-cart {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-muted);
        }

        .cart-empty-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .pos-cart-item {
          display: flex;
          flex-direction: column;
          padding: 12px;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          margin-bottom: 8px;
          gap: 8px;
        }

        .pos-item-info {
          display: flex;
          justify-content: space-between;
        }

        .pos-item-name {
          font-weight: 700;
          font-size: 13px;
        }

        .pos-item-price {
          font-size: 13px;
          font-weight: 800;
        }

        .pos-item-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .qty-picker {
          display: flex;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          overflow: hidden;
        }

        .qty-btn {
          background: transparent;
          border: none;
          color: var(--text-main);
          width: 24px;
          height: 24px;
          cursor: pointer;
        }

        .qty-val {
          width: 32px;
          border: none;
          border-left: 1px solid var(--border-color);
          border-right: 1px solid var(--border-color);
          text-align: center;
          font-size: 12px;
          background: transparent;
          color: var(--text-main);
        }

        .item-discount-input {
          font-size: 11px;
          padding: 4px 6px;
          width: 80px;
          height: 26px;
        }

        .btn-remove-item {
          background: transparent;
          border: none;
          cursor: pointer;
        }

        /* Totaux */
        .pos-cart-totals {
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .totals-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          align-items: center;
        }

        .global-discount-input {
          width: 80px;
          text-align: right;
          font-size: 12px;
          padding: 4px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background: var(--bg-input);
          color: var(--text-main);
        }

        .grand-total-row {
          font-size: 18px;
          font-weight: 800;
          color: var(--color-success);
          border-top: 1px dashed var(--border-color);
          padding-top: 8px;
        }

        .btn-checkout {
          width: 100%;
          padding: 12px;
          font-family: var(--font-title);
          font-size: 14px;
          font-weight: 800;
          background: var(--color-success);
          color: #FFF;
          border: none;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
          margin-top: 8px;
        }

        .btn-checkout:hover {
          opacity: 0.9;
        }

        .change-due-banner {
          background: rgba(16, 185, 129, 0.12);
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 6px;
          padding: 10px 14px;
          margin-top: 10px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .insufficient-amount-banner {
          background: rgba(225, 29, 72, 0.12);
          color: #e11d48;
          border: 1px solid rgba(225, 29, 72, 0.3);
          border-radius: 6px;
          padding: 10px 14px;
          margin-top: 10px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .geniuspay-pending-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 165, 0, 0.1);
          color: #e68a00;
          border: 1px solid rgba(255, 165, 0, 0.3);
          border-radius: 6px;
          padding: 14px;
          margin-top: 12px;
          font-size: 13px;
          font-weight: 600;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 165, 0, 0.3);
          border-top-color: #e68a00;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Styles Reçu Thermique */
        .thermal-receipt-container {
          background: #FFF;
          color: #000;
          padding: 16px;
          font-family: 'Courier New', Courier, monospace;
          font-size: 12px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          max-height: 350px;
          overflow-y: auto;
          text-align: left;
        }

        .receipt-header {
          text-align: center;
          margin-bottom: 8px;
        }

        .receipt-header h2 {
          font-size: 16px;
          margin: 0 0 4px 0;
          color: #000;
        }

        .receipt-header p {
          margin: 2px 0;
          font-size: 11px;
          color: #000;
        }

        .receipt-divider {
          border-top: 1px dashed #000;
          margin: 8px 0;
        }

        .receipt-details p {
          margin: 4px 0;
          font-size: 11px;
          color: #000;
        }

        .receipt-items-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
          margin: 8px 0;
          color: #000;
        }

        .receipt-items-table th, .receipt-items-table td {
          padding: 4px 0;
          vertical-align: top;
          color: #000;
        }

        .receipt-items-table th {
          border-bottom: 1px solid #000;
          text-align: left;
        }

        .item-unit-price {
          font-size: 9px;
          color: #555;
        }

        .receipt-totals {
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: #000;
        }

        .receipt-total-row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #000;
        }

        .receipt-total-row.grand-total {
          font-weight: bold;
          font-size: 13px;
          border-top: 1px solid #000;
          padding-top: 4px;
          color: #000;
        }

        .receipt-payment-info p {
          margin: 4px 0;
          font-size: 11px;
          color: #000;
        }

        .receipt-footer {
          text-align: center;
          margin-top: 12px;
          font-size: 11px;
          color: #000;
        }

        /* L'impression utilise désormais les styles d'impression globaux de index.css */

        /* ══════════════════════════════════════
           RESPONSIVE — TABLETTE (≤ 1024px)
        ══════════════════════════════════════ */
        @media (max-width: 1024px) {
          .pos-layout {
            padding: 16px;
            margin-top: 80px;
          }
          .pos-grid-columns {
            grid-template-columns: 1.2fr 1fr;
            gap: 16px;
          }
          .pos-products-grid {
            grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          }
        }

        /* ══════════════════════════════════════
           RESPONSIVE — MOBILE (≤ 768px)
        ══════════════════════════════════════ */
        @media (max-width: 768px) {
          .pos-container {
            padding: 0;
          }

          .pos-layout {
            padding: 12px;
            margin-top: 68px;
            max-width: 100%;
          }

          /* Passe en colonne unique sur mobile */
          .pos-grid-columns {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          /* Barre de recherche pleine largeur */
          .pos-search-input {
            font-size: 15px;
            padding: 12px 14px;
          }

          /* Catégories scroll horizontal */
          .pos-categories-bar {
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            padding-bottom: 6px;
          }
          .pos-categories-bar::-webkit-scrollbar { display: none; }

          .pos-cat-btn {
            padding: 7px 14px;
            font-size: 13px;
            flex-shrink: 0;
          }

          /* Grille produits — 2 colonnes sur mobile */
          .pos-products-grid {
            grid-template-columns: repeat(2, 1fr);
            max-height: 320px;
            gap: 10px;
            padding-right: 0;
          }

          .pos-product-card {
            height: 100px;
            padding: 12px;
          }

          .pos-prod-price { font-size: 12px; }
          .pos-prod-name  { font-size: 12px; }
          .pos-prod-sku   { font-size: 10px; }

          /* Panier — sous les produits, hauteur auto */
          .pos-right-panel {
            border-left: none;
            border-top: 1px solid var(--border-color);
            padding-left: 0;
            padding-top: 16px;
            height: auto;
            min-height: 280px;
          }

          .pos-cart-list {
            max-height: 220px;
            margin: 12px 0;
          }

          /* Totaux compacts */
          .grand-total-row { font-size: 15px; }

          .btn-checkout {
            padding: 14px;
            font-size: 15px;
          }

          /* Modale plein écran sur mobile */
          .modal-card {
            max-width: 100% !important;
            width: 95vw !important;
            margin: 8px;
            max-height: 90vh;
            overflow-y: auto;
          }
          .modal-overlay {
            align-items: flex-end;
          }
        }

        /* ══════════════════════════════════════
           RESPONSIVE — TRÈS PETIT (≤ 400px)
        ══════════════════════════════════════ */
        @media (max-width: 400px) {
          .pos-products-grid {
            grid-template-columns: repeat(2, 1fr);
            max-height: 280px;
          }
          .pos-product-card { height: 90px; padding: 10px; }
          .pos-cat-btn { padding: 6px 10px; font-size: 12px; }
        }
      `}</style>
    </div>
  );
};
