import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

export const Transfers = () => {
  const { user, token } = useApp();

  // Liste des transferts et référentiels
  const [transfers, setTransfers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  
  // États d'ouverture de formulaires/modals
  const [showForm, setShowForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [confirmAction, setConfirmAction] = useState(''); // 'ship' or 'receive'

  // Formulaire de transfert
  const [fromBranchId, setFromBranchId] = useState('');
  const [toBranchId, setToBranchId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([{ product_id: '', quantity: '1' }]);

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
      const transRes = await axios.get('/v1/transfers');
      setTransfers(transRes.data.data || []);

      const branchesRes = await axios.get('/v1/branches');
      setBranches(branchesRes.data || []);

      const prodRes = await axios.get('/v1/products');
      setProducts(prodRes.data.data || []);
    } catch (err) {
      setError('Impossible de charger le module de transfert inter-boutique.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleAddItem = () => {
    setItems([...items, { product_id: '', quantity: '1' }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length > 0 ? newItems : [{ product_id: '', quantity: '1' }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleCreateTransfer = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanedItems = items.filter(item => item.product_id && item.quantity > 0);
    if (cleanedItems.length === 0) {
      setError('Vous devez ajouter au moins un produit valide.');
      return;
    }

    try {
      await axios.post('/v1/transfers', {
        from_branch_id: parseInt(fromBranchId),
        to_branch_id: parseInt(toBranchId),
        notes,
        items: cleanedItems.map(item => ({
          product_id: parseInt(item.product_id),
          quantity: parseFloat(item.quantity)
        }))
      });

      setSuccess('Demande de transfert créée avec succès.');
      setFromBranchId('');
      setToBranchId('');
      setNotes('');
      setItems([{ product_id: '', quantity: '1' }]);
      setShowForm(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création de la demande.');
    }
  };

  const triggerConfirmAction = (transfer, action) => {
    setSelectedTransfer(transfer);
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const handleCommitAction = async () => {
    setError(null);
    setSuccess(null);
    try {
      const endpoint = `/v1/transfers/${selectedTransfer.id}/${confirmAction}`;
      const res = await axios.post(endpoint);

      setSuccess(confirmAction === 'ship' ? 'Marchandises expédiées et en transit !' : 'Transfert validé et reçu en stock.');
      setShowConfirmModal(false);
      setSelectedTransfer(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du traitement de l\'expédition/réception.');
      setShowConfirmModal(false);
    }
  };

  if (!token) {
    return (
      <div className="transfers-container">
        <div className="alert-card card">
          <span className="alert-icon"><i className="fa-solid fa-lock text-muted"></i></span>
          <h3>Accès Réservé</h3>
          <p>Vous devez vous connecter à une session pour gérer les transferts inter-boutiques.</p>
        </div>
      </div>
    );
  }

  const hasWritePermission = user?.permissions?.includes('products.update') || user?.role === 'admin';

  return (
    <div className="transfers-container">
      <div className="decorator-sphere sphere-1"></div>
      <div className="decorator-sphere sphere-2"></div>

      <div className="transfers-layout card">
        <div className="transfers-header">
          <div>
            <h2><i className="fa-solid fa-right-left me-2 text-warning"></i> Transferts Inter-Boutiques</h2>
            <p className="transfers-subtitle">Transférez vos stocks en toute sécurité entre vos points de vente</p>
          </div>
          
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <i className="fa-solid fa-plus me-1"></i> Demander un Transfert
          </button>
        </div>

        {error && <div className="error-banner"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}
        {success && <div className="success-banner"><i className="fa-solid fa-circle-check me-1"></i> {success}</div>}

        {/* Modal de création */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-card card modal-large" style={{ maxWidth: '640px' }}>
              <h3><i className="fa-solid fa-right-left me-2 text-warning"></i> Demande de transfert inter-boutique</h3>
              
              <form onSubmit={handleCreateTransfer}>
                <div className="form-row-grid">
                  <div className="form-group">
                    <label className="form-label">Boutique d'origine (Source) *</label>
                    <select 
                      className="form-control" 
                      value={fromBranchId}
                      onChange={(e) => setFromBranchId(e.target.value)}
                      required
                    >
                      <option value="">Sélectionner...</option>
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Boutique de destination (Cible) *</label>
                    <select 
                      className="form-control" 
                      value={toBranchId}
                      onChange={(e) => setToBranchId(e.target.value)}
                      required
                    >
                      <option value="">Sélectionner...</option>
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Saisie d'articles dynamique */}
                <div className="items-section">
                  <div className="items-section-header">
                    <h4>Produits à transférer</h4>
                    <button type="button" onClick={handleAddItem} className="btn-add-item">➕ Ajouter</button>
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

                      <button type="button" onClick={() => handleRemoveItem(index)} className="btn-remove-row"><i className="fa-solid fa-trash-can text-danger"></i></button>
                    </div>
                  ))}
                </div>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label className="form-label">Notes / Instructions logistiques</label>
                  <textarea 
                    className="form-control textarea-input"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-cancel">Annuler</button>
                  <button type="submit" className="btn btn-primary">Créer la demande</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Confirmation d'action */}
        {showConfirmModal && selectedTransfer && (
          <div className="modal-overlay">
            <div className="modal-card card">
              <h3>
                {confirmAction === 'ship' ? (
                  <><i className="fa-solid fa-truck me-2 text-warning"></i> Confirmer l'expédition</>
                ) : (
                  <><i className="fa-solid fa-box-open me-2 text-primary"></i> Valider la réception</>
                )}
              </h3>
              
              <p style={{ fontSize: '13px', textAlign: 'left', marginBottom: '12px' }}>
                Bon : <strong>{selectedTransfer.transfer_number}</strong> <br />
                Origine : {selectedTransfer.from_branch?.name} <br />
                Destination : {selectedTransfer.to_branch?.name}
              </p>

              <ul style={{ margin: '12px 0', fontSize: '12px', textAlign: 'left', paddingLeft: '20px' }}>
                {selectedTransfer.details?.map((d, i) => (
                  <li key={i}>{d.product?.name} (Qté : {d.quantity} unités)</li>
                ))}
              </ul>

              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {confirmAction === 'ship' 
                  ? 'Cette action débitera immédiatement le stock de la boutique d\'origine.' 
                  : 'Cette action créditera immédiatement le stock de la boutique de destination.'}
              </p>

              <div className="modal-actions">
                <button onClick={() => setShowConfirmModal(false)} className="btn btn-cancel">Annuler</button>
                <button onClick={handleCommitAction} className="btn btn-primary">
                  <i className="fa-solid fa-circle-check me-1"></i> Confirmer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tableau des Bons de Transfert */}
        {loading ? (
          <div className="loading-spinner">Chargement des transferts...</div>
        ) : transfers.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon"><i className="fa-solid fa-right-left text-muted"></i></span>
            <h4>Aucun transfert enregistré</h4>
            <p>Cliquez sur "Demander un Transfert" pour transférer des marchandises d'une boutique à une autre.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="products-table">
              <thead>
                <tr>
                  <th>N° Transfert</th>
                  <th>Origine / Destination</th>
                  <th>Détails Articles</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((trsf) => (
                  <tr key={trsf.id}>
                    <td>
                      <div className="sku-cell">{trsf.transfer_number}</div>
                      <div className="barcode-sub">{new Date(trsf.created_at).toLocaleDateString()}</div>
                    </td>
                    <td>
                      <div className="product-title-cell">De : {trsf.from_branch?.name}</div>
                      <div className="desc-sub">Vers : {trsf.to_branch?.name}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '11px', textAlign: 'left' }}>
                        {trsf.details?.map((d, idx) => (
                          <div key={idx}>• {d.product?.name} ({d.quantity} u.)</div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`badge-status status-${trsf.status}`}>
                        {trsf.status === 'pending' ? (
                          <><i className="fa-solid fa-clock me-1"></i> En attente</>
                        ) : trsf.status === 'transit' ? (
                          <><i className="fa-solid fa-truck me-1"></i> En transit</>
                        ) : (
                          <><i className="fa-solid fa-circle-check me-1"></i> Terminé</>
                        )}
                      </span>
                    </td>
                    <td>
                      {(() => {
                        const role = user?.role?.slug || user?.role?.name || user?.role;
                        const isAdmin = role === 'super-admin' || role === 'admin';
                        const isFromBranch = user?.branch_id === trsf.from_branch_id;
                        const isToBranch = user?.branch_id === trsf.to_branch_id;

                        return (
                          <>
                            {hasWritePermission && trsf.status === 'pending' && (isAdmin || isFromBranch) && (
                              <button 
                                onClick={() => triggerConfirmAction(trsf, 'ship')}
                                className="btn-receive-action"
                              >
                                <i className="fa-solid fa-truck me-1"></i> Expédier
                              </button>
                            )}
                            {hasWritePermission && trsf.status === 'pending' && !isAdmin && !isFromBranch && (
                              <span className="text-muted text-xs" style={{ fontSize: '11px' }}>
                                <i className="fa-solid fa-hourglass me-1"></i> En attente d'expédition par la source
                              </span>
                            )}
                            {hasWritePermission && trsf.status === 'transit' && (isAdmin || isToBranch) && (
                              <button 
                                onClick={() => triggerConfirmAction(trsf, 'receive')}
                                className="btn-receive-action"
                                style={{ background: '#3b82f6' }}
                              >
                                <i className="fa-solid fa-box-open me-1"></i> Réceptionner
                              </button>
                            )}
                            {hasWritePermission && trsf.status === 'transit' && !isAdmin && !isToBranch && (
                              <span className="text-muted text-xs" style={{ fontSize: '11px' }}>
                                <i className="fa-solid fa-truck-ramp-box me-1"></i> En cours de transit...
                              </span>
                            )}
                          </>
                        );
                      })()}
                      {trsf.status === 'completed' && (
                        <span className="text-lock"><i className="fa-solid fa-circle-check text-success me-1"></i> Livré</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .transfers-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .transfers-layout {
          width: 100%;
          max-width: 1080px;
          padding: 32px;
          margin-top: 100px;
        }

        .transfers-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
          text-align: left;
        }

        .transfers-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        /* Statuses */
        .status-transit {
          background: rgba(59, 130, 246, 0.1);
          color: var(--color-primary);
        }

        .status-pending {
          background: rgba(245, 158, 11, 0.1);
          color: #F59E0B;
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
          opacity: 0.9;
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
          width: 100px;
        }

        .btn-remove-row {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};
