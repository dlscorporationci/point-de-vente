import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { db } from '../services/db';
import { ExportModal } from '../components/ExportModal';

export const Purchases = () => {
  const { user, token } = useApp();

  // Liste des achats et référentiels
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  
  // États génériques
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modales et sélections
  const [showForm, setShowForm] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // État de modification d'achat
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editPaymentStatus, setEditPaymentStatus] = useState('unpaid');
  const [editAmountPaid, setEditAmountPaid] = useState('0');
  const [editSaving, setEditSaving] = useState(false);

  const openEditModal = (purchase) => {
    setEditingPurchase(purchase);
    setEditNotes(purchase.notes || '');
    setEditPaymentStatus(purchase.payment_status || 'unpaid');
    setEditAmountPaid(purchase.amount_paid?.toString() || '0');
    setShowEditModal(true);
    setError(null);
    setSuccess(null);
  };

  const handleUpdatePurchase = async (e) => {
    e.preventDefault();
    setEditSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.put(`/v1/purchases/${editingPurchase.id}`, {
        notes: editNotes,
        payment_status: editPaymentStatus,
        amount_paid: parseFloat(editAmountPaid || '0')
      });

      setSuccess(`Bon d'achat #${editingPurchase.purchase_number} mis à jour avec succès.`);
      setShowEditModal(false);
      setEditingPurchase(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de la mise à jour de l\'achat.');
    } finally {
      setEditSaving(false);
    }
  };

  // Formulaire d'achat
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [status, setStatus] = useState('received');
  const [paymentStatus, setPaymentStatus] = useState('unpaid');
  const [amountPaid, setAmountPaid] = useState('0');
  const [taxRate, setTaxRate] = useState('18');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([{ product_id: '', quantity: '1', cost_price: '' }]);

  // Charger les données
  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const companyId = parseInt(localStorage.getItem('company-id') || 1);
      let purData = [];
      let supData = [];
      let prodData = [];

      try {
        const purRes = await axios.get('/v1/purchases');
        purData = purRes.data.data || [];

        const supRes = await axios.get('/v1/suppliers');
        supData = supRes.data.data || [];

        const prodRes = await axios.get('/v1/products');
        prodData = prodRes.data.data || [];

        const bRes = await axios.get('/v1/branches');
        const loadedBranches = bRes.data?.data || bRes.data || [];
        setBranches(loadedBranches);
        if (user?.branch_id) {
          setSelectedBranchId(user.branch_id.toString());
        } else if (loadedBranches.length > 0) {
          setSelectedBranchId(loadedBranches[0].id.toString());
        }
      } catch (netErr) {
        console.warn('Mode hors-ligne, chargement des achats Dexie:', netErr);
        purData = await db.purchases.where('company_id').equals(companyId).toArray();
        supData = await db.suppliers.where('company_id').equals(companyId).toArray();
        prodData = await db.products.where('company_id').equals(companyId).toArray();
      }

      setPurchases(purData);
      setSuppliers(supData);
      setProducts(prodData);
    } catch (err) {
      setError('Impossible de charger le module des approvisionnements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleAddItem = () => {
    setItems([...items, { product_id: '', quantity: '1', cost_price: '' }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length > 0 ? newItems : [{ product_id: '', quantity: '1', cost_price: '' }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Calculer le total estimé de la saisie
  const calculateDraftTotals = () => {
    let subtotal = 0;
    items.forEach(item => {
      const qty = parseFloat(item.quantity || '0');
      const price = parseFloat(item.cost_price || '0');
      subtotal += qty * price;
    });
    const rate = parseFloat(taxRate || '0');
    const tax = subtotal * (rate / 100);
    return { subtotal, tax, total: subtotal + tax, taxRate: rate };
  };

  const handleCreatePurchase = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Vérifier les lignes
    const cleanedItems = items.filter(item => item.product_id && item.quantity > 0 && item.cost_price >= 0);
    if (cleanedItems.length === 0) {
      setError('Vous devez ajouter au moins un produit valide.');
      return;
    }

    try {
      const activeBranchId = parseInt(selectedBranchId || user?.branch_id || (branches[0] && branches[0].id) || '1');
      await axios.post('/v1/purchases', {
        branch_id: activeBranchId,
        supplier_id: supplierId ? parseInt(supplierId) : null,
        status,
        payment_status: paymentStatus === 'partially_paid' ? 'partial' : paymentStatus,
        amount_paid: parseFloat(amountPaid || '0'),
        tax_rate: parseFloat(taxRate || '0'),
        notes,
        items: cleanedItems.map(item => ({
          product_id: parseInt(item.product_id),
          quantity: parseFloat(item.quantity),
          cost_price: parseFloat(item.cost_price)
        }))
      });

      setSuccess('Bon d\'approvisionnement enregistré et stocks mis à jour.');
      
      // Réinitialiser
      setSupplierId('');
      setStatus('received');
      setPaymentStatus('unpaid');
      setAmountPaid('0');
      setNotes('');
      setItems([{ product_id: '', quantity: '1', cost_price: '' }]);
      setShowForm(false);

      loadData();
    } catch (err) {
      const errData = err.response?.data;
      let errorMsg = errData?.error || errData?.message;
      if (errData?.errors) {
        errorMsg = Object.values(errData.errors).flat().join(' ');
      }
      setError(errorMsg || 'Erreur lors de l\'enregistrement de l\'achat.');
    }
  };

  const triggerReceive = async (purchase) => {
    setError(null);
    try {
      // Charger les détails complets du bon d'achat depuis l'API
      const res = await axios.get(`/v1/purchases/${purchase.id}`);
      setSelectedPurchase(res.data);
      setShowReceiveModal(true);
    } catch (err) {
      setError('Impossible de charger les détails de ce bon d\'achat.');
    }
  };

  const handleCommitReceive = async () => {
    setError(null);
    setSuccess(null);
    try {
      const details = selectedPurchase.details || [];
      if (details.length === 0) {
        setError('Aucun article à réceptionner dans ce bon d\'achat.');
        return;
      }

      const itemsPayload = details.map(d => ({
        product_id: d.product_id,
        quantity_received: d.quantity // réceptionner la totalité commandée
      }));

      await axios.post(`/v1/purchases/${selectedPurchase.id}/receive`, {
        items: itemsPayload
      });

      setSuccess(`Commande #${selectedPurchase.purchase_number} réceptionnée en stock !`);
      setShowReceiveModal(false);
      setSelectedPurchase(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de la validation de la livraison.');
    }
  };

  if (!token) {
    return (
      <div className="purchases-container">
        <div className="alert-card card">
          <span className="alert-icon"><i className="fa-solid fa-lock text-muted"></i></span>
          <h3>Accès Réservé</h3>
          <p>Vous devez vous connecter à une session pour gérer les approvisionnements.</p>
        </div>
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          documentType="purchases_list"
          documentTitle="Historique des Achats & Approvisionnements"
        />
      </div>
    );
  }

  const totals = calculateDraftTotals();

  return (
    <div className="purchases-container">
      <div className="decorator-sphere sphere-1"></div>
      <div className="decorator-sphere sphere-2"></div>

      <div className="purchases-layout card">
        <div className="purchases-header">
          <div>
            <h2><i className="fa-solid fa-truck-ramp-box me-2 text-primary"></i> Gestion des Approvisionnements & Stocks</h2>
            <p className="purchases-subtitle">Suivez vos commandes d'achats et réceptions en stock</p>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setShowExportModal(true)} className="btn btn-outline-secondary" style={{ fontWeight: 700 }}>
              <i className="fa-solid fa-file-export me-1"></i> Exporter Achats
            </button>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              <i className="fa-solid fa-plus me-1"></i> Nouvel Approvisionnement
            </button>
          </div>
        </div>

        {error && <div className="error-banner mb-3"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}
        {success && <div className="success-banner mb-3"><i className="fa-solid fa-circle-check me-1"></i> {success}</div>}

        {/* Résumé KPI Synthétique */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="p-3 border rounded shadow-sm d-flex align-items-center gap-3" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <i className="fa-solid fa-truck-ramp-box"></i>
              </div>
              <div>
                <div className="text-muted small fw-bold">TOTAL COMMANDES</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>{purchases.length}</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 border rounded shadow-sm d-flex align-items-center gap-3" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <i className="fa-solid fa-receipt"></i>
              </div>
              <div>
                <div className="text-muted small fw-bold">CUMUL ACHATS TTC</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
                  {new Intl.NumberFormat('fr-FR').format(purchases.reduce((sum, p) => sum + (parseFloat(p.total_amount) || 0), 0))} XOF
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 border rounded shadow-sm d-flex align-items-center gap-3" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <i className="fa-solid fa-file-invoice-dollar"></i>
              </div>
              <div>
                <div className="text-muted small fw-bold">COMMANDES IMPAYÉES</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: purchases.filter(p => p.payment_status !== 'paid').length > 0 ? '#ef4444' : 'var(--text-main)' }}>
                  {purchases.filter(p => p.payment_status !== 'paid').length} Commandes
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de création */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-card card modal-large" style={{ maxWidth: '720px' }}>
              <h3><i className="fa-solid fa-truck-ramp-box me-2 text-primary"></i> Nouvel Approvisionnement</h3>
              
              <form onSubmit={handleCreatePurchase}>
                <div className="form-row-grid">
                  {branches.length > 0 && (
                    <div className="form-group">
                      <label className="form-label">Boutique de réception *</label>
                      <select 
                        className="form-control"
                        value={selectedBranchId}
                        onChange={(e) => setSelectedBranchId(e.target.value)}
                        required
                      >
                        {branches.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="form-group">
                    <label className="form-label">Fournisseur (Optionnel)</label>
                    <select 
                      className="form-control" 
                      value={supplierId}
                      onChange={(e) => setSupplierId(e.target.value)}
                    >
                      <option value="">[ Aucun fournisseur ]</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name} (Solde : {s.debt_balance} XOF)</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Statut livraison *</label>
                    <select 
                      className="form-control" 
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                    >
                      <option value="received">Réception directe immédiate</option>
                      <option value="ordered">Commandé (En attente de livraison)</option>
                      <option value="draft">Brouillon</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-grid">
                  <div className="form-group">
                    <label className="form-label">Statut Paiement *</label>
                    <select 
                      className="form-control" 
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      required
                    >
                      <option value="unpaid">Non payé (Crédit total)</option>
                      <option value="partially_paid">Payé partiellement</option>
                      <option value="paid">Payé en totalité</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Acompte payé (XOF)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>

                {/* Saisie d'articles dynamique */}
                <div className="items-section">
                  <div className="items-section-header">
                    <h4>Lignes d'articles</h4>
                    <button type="button" onClick={handleAddItem} className="btn-add-item"><i className="fa-solid fa-plus me-1"></i> Ajouter</button>
                  </div>

                  {items.map((item, index) => (
                    <div key={index} className="item-row">
                      <select 
                        className="form-control item-select"
                        value={item.product_id}
                        onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                        required
                      >
                        <option value="">Sélectionner produit...</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                        ))}
                      </select>

                      <input 
                        type="number" 
                        placeholder="Qté" 
                        className="form-control qty-input"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        required
                        min="0.01"
                        step="0.01"
                      />

                      <input 
                        type="number" 
                        placeholder="Prix Achat Unitaire" 
                        className="form-control price-input"
                        value={item.cost_price}
                        onChange={(e) => handleItemChange(index, 'cost_price', e.target.value)}
                        required
                        min="0"
                      />

                      <button type="button" onClick={() => handleRemoveItem(index)} className="btn-remove-row"><i className="fa-solid fa-trash-can text-danger"></i></button>
                    </div>
                  ))}
                </div>

                {/* Total récapitulatif */}
                <div className="purchase-totals-summary">
                  <div className="summary-row">
                    <span>Sous-total HT :</span>
                    <strong>{new Intl.NumberFormat('fr-FR').format(totals.subtotal)} XOF</strong>
                  </div>
                  <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                    <label className="form-label mb-0" style={{ fontSize: '13px', fontWeight: 600 }}>Taux de TVA (%) :</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input 
                        type="number" 
                        className="form-control" 
                        style={{ width: '85px', textAlign: 'right', padding: '4px 8px' }}
                        value={taxRate}
                        onChange={(e) => setTaxRate(e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                      />
                      <span style={{ fontSize: '13px', fontWeight: 700 }}>%</span>
                    </div>
                  </div>
                  <div className="summary-row">
                    <span>Montant TVA ({totals.taxRate}%) :</span>
                    <strong>{new Intl.NumberFormat('fr-FR').format(totals.tax)} XOF</strong>
                  </div>
                  <div className="summary-row grand-total">
                    <span>Montant total TTC :</span>
                    <strong>{new Intl.NumberFormat('fr-FR').format(totals.total)} XOF</strong>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label className="form-label">Notes / Remarques</label>
                  <textarea 
                    className="form-control textarea-input"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-cancel">Annuler</button>
                  <button type="submit" className="btn btn-primary">Enregistrer l'Approvisionnement</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Modification d'Achat */}
        {showEditModal && editingPurchase && (
          <div className="modal-overlay">
            <div className="modal-card card" style={{ maxWidth: '520px' }}>
              <h3>✏️ Modifier le Bon d'Achat {editingPurchase.purchase_number}</h3>
              <p className="text-muted" style={{ fontSize: '13px', marginBottom: '16px' }}>
                Fournisseur : <strong>{editingPurchase.supplier?.name}</strong> | Montant total : <strong>{new Intl.NumberFormat('fr-FR').format(editingPurchase.total_amount)} XOF</strong>
              </p>

              <form onSubmit={handleUpdatePurchase}>
                <div className="form-group mb-3">
                  <label className="form-label">Statut du Paiement *</label>
                  <select 
                    className="form-control"
                    value={editPaymentStatus}
                    onChange={(e) => setEditPaymentStatus(e.target.value)}
                    required
                  >
                    <option value="unpaid">Non payé (Crédit total)</option>
                    <option value="partially_paid">Payé partiellement (Acompte)</option>
                    <option value="paid">Payé en totalité</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Montant Réglé / Acompte (XOF)</label>
                  <input 
                    type="number"
                    className="form-control"
                    value={editAmountPaid}
                    onChange={(e) => setEditAmountPaid(e.target.value)}
                    min="0"
                    max={editingPurchase.total_amount}
                  />
                  <small className="text-muted">Reste à payer : {new Intl.NumberFormat('fr-FR').format(Math.max(0, editingPurchase.total_amount - parseFloat(editAmountPaid || '0')))} XOF</small>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Notes &amp; Remarques</label>
                  <textarea 
                    className="form-control textarea-input"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Saisissez vos remarques ou corrections..."
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-cancel">Annuler</button>
                  <button type="submit" className="btn btn-primary" disabled={editSaving}>
                    {editSaving ? 'Mise à jour...' : 'Enregistrer les modifications'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Réception confirmation */}
        {showReceiveModal && selectedPurchase && (
          <div className="modal-overlay">
            <div className="modal-card card">
              <h3>📦 Valider la Réception en Stock</h3>
              <p>Confirmez-vous la livraison et l'intégration en stock des articles du bon <strong>{selectedPurchase.purchase_number}</strong> ?</p>
              
              <ul style={{ margin: '16px 0', fontSize: '13px', textAlign: 'left', paddingLeft: '20px' }}>
                {(selectedPurchase.details || []).map((d, i) => (
                  <li key={i}>{d.product?.name || `Produit #${d.product_id}`} (Qté : {d.quantity} unités, Prix Achat : {Number(d.cost_price).toLocaleString()} XOF)</li>
                ))}
              </ul>

              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Le stock sera mis à jour et la dette fournisseur sera réévaluée de {selectedPurchase.total_amount - selectedPurchase.amount_paid} XOF.</p>

              <div className="modal-actions">
                <button onClick={() => setShowReceiveModal(false)} className="btn btn-cancel">Annuler</button>
                <button onClick={handleCommitReceive} className="btn btn-primary">✔️ Confirmer la livraison</button>
              </div>
            </div>
          </div>
        )}

        {/* Tableau des Bons */}
        {loading ? (
          <div className="loading-spinner">Chargement des approvisionnements...</div>
        ) : purchases.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon"><i className="fa-solid fa-truck-ramp-box text-muted"></i></span>
            <h4>Aucun approvisionnement enregistré</h4>
            <p>Cliquez sur "Nouvel Approvisionnement" pour commander ou réceptionner des marchandises.</p>
          </div>
        ) : (
          <div className="table-responsive rounded border shadow-sm">
            <table className="table table-hover align-middle mb-0" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
              <thead style={{ background: 'var(--bg-input)', borderBottom: '2px solid var(--border-color)' }}>
                <tr>
                  <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>N° Bon d'Achat & Date</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fournisseur / Boutique</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Montant TTC</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Livraison</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Statut Règlement</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center', width: '160px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((pur) => (
                  <tr key={pur.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="fw-bold text-primary" style={{ fontSize: '14px' }}>{pur.purchase_number}</div>
                      <div className="text-muted small" style={{ fontSize: '12px' }}>
                        <i className="fa-regular fa-calendar me-1"></i>{pur.created_at ? new Date(pur.created_at).toLocaleDateString('fr-FR') : '—'}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="fw-bold" style={{ fontSize: '14px', color: 'var(--text-main)' }}>{pur.supplier?.name || 'Fournisseur Général'}</div>
                      <div className="text-muted small" style={{ fontSize: '12px' }}>
                        <i className="fa-solid fa-shop me-1 text-info"></i>{pur.branch?.name || 'Boutique'}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="fw-bold text-success" style={{ fontSize: '15px' }}>
                        {new Intl.NumberFormat('fr-FR').format(pur.total_amount || 0)} XOF
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {pur.status === 'received' ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '11px', padding: '5px 10px' }}>
                          <i className="fa-solid fa-circle-check me-1"></i>Réceptionné
                        </span>
                      ) : pur.status === 'ordered' ? (
                        <span className="badge bg-warning-subtle text-warning border border-warning-subtle" style={{ fontSize: '11px', padding: '5px 10px' }}>
                          <i className="fa-solid fa-clock me-1"></i>Commandé
                        </span>
                      ) : (
                        <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle" style={{ fontSize: '11px', padding: '5px 10px' }}>
                          <i className="fa-solid fa-pen-clip me-1"></i>Brouillon
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {pur.payment_status === 'paid' ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '11px', padding: '5px 10px' }}>
                          <i className="fa-solid fa-circle-dollar-to-slot me-1"></i>Payé intégralement
                        </span>
                      ) : pur.payment_status === 'partially_paid' || pur.payment_status === 'partial' ? (
                        <span className="badge bg-info-subtle text-info border border-info-subtle" style={{ fontSize: '11px', padding: '5px 10px' }}>
                          <i className="fa-solid fa-wallet me-1"></i>Acompte versé
                        </span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle" style={{ fontSize: '11px', padding: '5px 10px' }}>
                          <i className="fa-solid fa-xmark me-1"></i>Non payé
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div className="d-flex justify-content-center gap-1">
                        {pur.status === 'ordered' && (
                          <button 
                            onClick={() => triggerReceive(pur)}
                            className="btn btn-sm btn-success fw-bold"
                            title="Réceptionner la marchandise en stock"
                            style={{ fontSize: '11px', padding: '4px 8px' }}
                          >
                            <i className="fa-solid fa-box-open me-1"></i> Réceptionner
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(pur)}
                          className="btn btn-sm btn-outline-warning"
                          title="Modifier le statut ou les notes de l'achat"
                          style={{ width: '32px', height: '32px', padding: 0, borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
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

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        documentType="purchases_list"
        documentTitle="Historique des Achats & Approvisionnements"
      />

      <style>{`
        .purchases-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .purchases-layout {
          width: 100%;
          max-width: 1080px;
          padding: 32px;
          margin-top: 100px;
        }

        .purchases-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
          text-align: left;
        }

        .purchases-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        /* Statuses */
        .badge-status {
          display: inline-block;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .status-received {
          background: rgba(0, 166, 81, 0.1);
          color: var(--color-success);
        }

        .status-ordered {
          background: rgba(245, 158, 11, 0.1);
          color: #F59E0B;
        }

        .status-draft {
          background: rgba(107, 114, 128, 0.1);
          color: var(--text-muted);
        }

        .payment-paid {
          background: rgba(0, 166, 81, 0.1);
          color: var(--color-success);
        }

        .payment-partially_paid {
          background: rgba(59, 130, 246, 0.1);
          color: var(--color-primary);
        }

        .payment-unpaid {
          background: rgba(239, 68, 68, 0.1);
          color: var(--color-error);
        }

        .btn-receive-action {
          padding: 6px 12px;
          font-family: var(--font-title);
          font-size: 12px;
          font-weight: 700;
          background: var(--color-primary);
          color: #FFFFFF;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-receive-action:hover {
          background: #008f43;
          transform: translateY(-1px);
        }

        /* Formulaire dynamique */
        .items-section {
          margin: 24px 0 16px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 16px;
          background: var(--bg-input);
        }

        .items-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .items-section-header h4 {
          margin: 0;
          font-size: 14px;
          color: var(--text-main);
        }

        .btn-add-item {
          background: transparent;
          border: 1px solid var(--color-primary);
          color: var(--color-primary);
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-add-item:hover {
          background: var(--primary-glow);
        }

        .item-row {
          display: flex;
          gap: 12px;
          margin-bottom: 10px;
        }

        .item-select {
          flex: 2;
        }

        .qty-input {
          width: 80px;
        }

        .price-input {
          width: 140px;
        }

        .btn-remove-row {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }

        .purchase-totals-summary {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          padding: 16px;
          border-top: 1px dashed var(--border-color);
          margin-top: 12px;
        }

        .summary-row {
          font-size: 13px;
          display: flex;
          width: 240px;
          justify-content: space-between;
        }

        .summary-row span {
          color: var(--text-muted);
        }

        .grand-total {
          font-size: 15px;
          border-top: 1px solid var(--border-color);
          padding-top: 8px;
          color: var(--color-success);
        }
      `}</style>
    </div>
  );
};
