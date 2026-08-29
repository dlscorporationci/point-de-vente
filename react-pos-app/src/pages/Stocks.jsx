import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { db } from '../services/db';
import { ExportModal } from '../components/ExportModal';
import { useRealtime } from '../hooks/useRealtime';

export const Stocks = () => {
  const { user, token } = useApp();

  // Liste des états de stock et journal des mouvements
  const [currentStocks, setCurrentStocks] = useState([]);
  const [movements, setMovements] = useState([]);
  
  // États d'ouverture de formulaire
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Subtabs et Filtres
  const [activeTab, setActiveTab] = useState('stocks'); // 'stocks' | 'movements'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'low' | 'out' | 'normal'
  
  // Modale d'ajustement à 3 modes (Partie 14)
  const [adjustType, setAdjustType] = useState('addition'); // 'addition' | 'withdrawal' | 'correction'
  const [reasonCode, setReasonCode] = useState('entry_error');
  const [comment, setComment] = useState('');
  const [adjustQty, setAdjustQty] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Formulaire d'ajustement
  const triggerAdjust = (stockItem) => {
    setSelectedStockItem(stockItem);
    setAdjustType('addition');
    setReasonCode('entry_error');
    setComment('');
    setAdjustQty('');
    setShowAdjustModal(true);
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    if (reasonCode === 'other' && !comment.trim()) {
      setError('Le champ commentaire est obligatoire pour le motif "Autre".');
      setSubmitting(false);
      return;
    }

    try {
      const branchId = selectedStockItem.branch_id || user?.branch_id || 1;
      await axios.post('/v1/stock/adjust', {
        branch_id: branchId,
        product_id: selectedStockItem.product_id || selectedStockItem.id,
        type: adjustType,
        quantity: parseFloat(adjustQty || '0'),
        reason_code: reasonCode,
        comment: comment.trim() || null
      });

      setSuccess('Ajustement de stock enregistré avec succès.');
      setShowAdjustModal(false);
      setSelectedStockItem(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de l\'ajustement du stock.');
    } finally {
      setSubmitting(false);
    }
  };

  // États génériques
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Charger les stocks et mouvements
  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const companyId = parseInt(localStorage.getItem('company-id') || 1);
      let stocksData = [];
      let movementsData = [];

      try {
        const stockRes = await axios.get('/v1/stock/current');
        stocksData = stockRes.data || [];

        const movRes = await axios.get('/v1/stock/movements');
        movementsData = movRes.data.data || [];
      } catch (netErr) {
        console.warn('Mode hors-ligne, affichage des stocks depuis Dexie:', netErr);
        
        const localProducts = await db.products
          .where('company_id').equals(companyId)
          .toArray();

        stocksData = localProducts.map(p => ({
          id: p.id,
          product_id: p.id,
          product: p,
          quantity: p.stock_quantity ?? p.quantity ?? 0,
          stock_quantity: p.stock_quantity ?? p.quantity ?? 0,
          branch: { name: 'Ma Boutique' }
        }));
      }

      setCurrentStocks(stocksData);
      setMovements(movementsData);
    } catch (err) {
      setError('Impossible de charger les données d\'inventaire.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Abonnement temps réel (SSE) : mise à jour automatique sans F5 de la vue Stock
  useRealtime(
    [
      'stock_updated',
      'stock_adjusted',
      'stock_low',
      'sale_created',
      'purchase_received',
      'transfer_received',
      'transfer_shipped'
    ],
    useCallback(() => {
      loadData();
    }, [loadData]),
    { pullOnEvent: true }
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!token) {
    return (
      <div className="stocks-container">
        <div className="alert-card card">
          <span className="alert-icon"><i className="fa-solid fa-lock text-muted"></i></span>
          <h3>Accès Réservé</h3>
          <p>Vous devez vous connecter à une session pour gérer les stocks et inventaires.</p>
          <ExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            documentType="stock_status"
            documentTitle="État Global des Stocks & Inventaires"
          />
        </div>
      </div>
    );
  }

  const userRoleSlug = String(user?.role?.slug || user?.role?.name || (typeof user?.role === 'string' ? user.role : '') || '').toLowerCase();
  const hasAdjustPermission = 
    user?.permissions?.includes('stock.adjust') || 
    user?.permissions?.includes('products.update') || 
    userRoleSlug.includes('admin') || 
    userRoleSlug.includes('gerant') || 
    userRoleSlug.includes('magasinier');

  return (
    <>
      <div className="stocks-container">
      <div className="decorator-sphere sphere-1"></div>
      <div className="decorator-sphere sphere-2"></div>

      <div className="stocks-layout card">
        <div className="stocks-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2><i className="fa-solid fa-layer-group me-2 text-success"></i> Niveaux de Stocks & Outil d'Inventaire</h2>
            <p className="stocks-subtitle">Ajustez manuellement les stocks de votre boutique centrale et consultez l'historique</p>
          </div>
          <div>
            <button onClick={() => setShowExportModal(true)} className="btn btn-outline-secondary" style={{ fontWeight: 700 }}>
              <i className="fa-solid fa-file-export me-1"></i> Exporter État du Stock
            </button>
          </div>
        </div>

        {error && <div className="error-banner"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}
        {success && <div className="success-banner"><i className="fa-solid fa-circle-check me-1"></i> {success}</div>}

        {/* Modal d'ajustement à 3 modes (Partie 14) */}
        {showAdjustModal && selectedStockItem && (
          <div className="modal-overlay">
            <div className="modal-card card" style={{ maxWidth: '520px' }}>
              <h3><i className="fa-solid fa-screwdriver-wrench me-2 text-warning"></i> Ajustement de Stock Physique</h3>
              <div style={{ padding: '12px', backgroundColor: '#0f172a', borderRadius: '8px', marginBottom: '16px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#38bdf8' }}>{selectedStockItem.product?.name}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Boutique: {selectedStockItem.branch?.name} • Stock système actuel: <strong style={{ color: '#f59e0b' }}>{selectedStockItem.quantity} unités</strong>
                </div>
              </div>

              <form onSubmit={handleAdjustSubmit}>
                {/* Sélecteur du Mode d'Ajustement */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Type d'opération *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    <button 
                      type="button" 
                      className={`btn btn-sm ${adjustType === 'addition' ? 'btn-success' : 'btn-outline-secondary'}`}
                      onClick={() => setAdjustType('addition')}
                    >
                      ➕ Ajout (+)
                    </button>
                    <button 
                      type="button" 
                      className={`btn btn-sm ${adjustType === 'withdrawal' ? 'btn-danger' : 'btn-outline-secondary'}`}
                      onClick={() => setAdjustType('withdrawal')}
                    >
                      ➖ Retrait (-)
                    </button>
                    <button 
                      type="button" 
                      className={`btn btn-sm ${adjustType === 'correction' ? 'btn-warning' : 'btn-outline-secondary'}`}
                      onClick={() => setAdjustType('correction')}
                    >
                      📋 Correction
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">
                    {adjustType === 'addition' && 'Quantité à ajouter (+)'}
                    {adjustType === 'withdrawal' && 'Quantité à retirer (-)'}
                    {adjustType === 'correction' && 'Quantité physique réellement comptée en rayon'}
                    *
                  </label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder={adjustType === 'correction' ? 'Ex: 17' : 'Ex: 5'}
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(e.target.value)}
                    required
                    step="0.01"
                    min="0"
                  />
                  {adjustType === 'correction' && adjustQty !== '' && (
                    <div style={{ marginTop: '8px', fontSize: '13px', fontWeight: 'bold', color: (parseFloat(adjustQty) - parseFloat(selectedStockItem.quantity)) >= 0 ? '#10b981' : '#ef4444' }}>
                      Écart calculé : {(parseFloat(adjustQty) - parseFloat(selectedStockItem.quantity)) > 0 ? '+' : ''}
                      {(parseFloat(adjustQty) - parseFloat(selectedStockItem.quantity))} unités
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Motif de l'ajustement *</label>
                  <select 
                    className="form-control"
                    value={reasonCode}
                    onChange={(e) => setReasonCode(e.target.value)}
                    required
                  >
                    <option value="entry_error">Erreur de saisie</option>
                    <option value="counting_error">Erreur de comptage / inventaire</option>
                    <option value="loss">Perte</option>
                    <option value="breakage">Casse / Endommagé</option>
                    <option value="theft">Vol / Disparition</option>
                    <option value="deteriorated">Produit détérioré / Périmé</option>
                    <option value="other">Autre (préciser dans les remarques)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Commentaire / Remarques {reasonCode === 'other' ? '*' : '(optionnel)'}</label>
                  <textarea 
                    className="form-control" 
                    rows={2}
                    placeholder="Précisez la raison détaillée de cet ajustement..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required={reasonCode === 'other'}
                  />
                </div>

                <div className="modal-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowAdjustModal(false)} className="btn btn-secondary">Annuler</button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? 'Validation...' : 'Valider l\'ajustement'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CARTES KPI (Partie 13) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div className="card" style={{ padding: '16px', borderLeft: '4px solid #3b82f6' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Articles en Stock</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#38bdf8' }}>{currentStocks.length}</div>
          </div>
          <div className="card" style={{ padding: '16px', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Stock Faible</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#f59e0b' }}>
              {currentStocks.filter(s => parseFloat(s.quantity) > 0 && parseFloat(s.quantity) <= parseFloat(s.product?.alert_quantity || 10)).length}
            </div>
          </div>
          <div className="card" style={{ padding: '16px', borderLeft: '4px solid #ef4444' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Ruptures de Stock</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#ef4444' }}>
              {currentStocks.filter(s => parseFloat(s.quantity) <= 0).length}
            </div>
          </div>
          <div className="card" style={{ padding: '16px', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Valeur Estimée (FCFA)</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#10b981' }}>
              {new Intl.NumberFormat('fr-FR').format(
                currentStocks.reduce((sum, item) => sum + (parseFloat(item.quantity || 0) * parseFloat(item.product?.cost_price || item.product?.selling_price || 0)), 0)
              )}
            </div>
          </div>
        </div>

        <div className="stocks-sections-grid">
          {/* Section A: Stock par article */}
          <div className="stocks-section-block">
            <h3><i className="fa-solid fa-chart-simple me-2 text-success"></i> Niveaux de Stock Actuels</h3>
            {loading ? (
              <div className="loading-spinner">Chargement des niveaux de stock...</div>
            ) : currentStocks.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon"><i className="fa-solid fa-inbox text-muted"></i></span>
                <h4>Aucun stock actif</h4>
                <p>Réceptionnez un approvisionnement pour garnir votre stock.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Article</th>
                      <th>Boutique</th>
                      <th>Qté en Stock</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStocks.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="product-title-cell">{item.product?.name}</div>
                          <div className="barcode-sub">SKU : {item.product?.sku}</div>
                        </td>
                        <td>
                          <div className="desc-sub">{item.branch?.name}</div>
                        </td>
                        <td className="price-cell" style={{ color: parseFloat(item.quantity) <= parseFloat(item.product?.alert_quantity || 10) ? 'var(--color-error)' : 'var(--color-success)' }}>
                          {new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(parseFloat(item.quantity) || 0)} unités
                          {parseFloat(item.quantity) <= parseFloat(item.product?.alert_quantity || 10) && (
                            <div className="alert-qty-cell" style={{ color: 'var(--color-error)', fontSize: '10px', fontWeight: '700' }}><i className="fa-solid fa-triangle-exclamation text-danger me-1"></i> SEUIL ALERTE</div>
                          )}
                        </td>
                        <td>
                          {hasAdjustPermission ? (
                            <button 
                              onClick={() => triggerAdjust(item)}
                              className="btn-receive-action"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                            >
                              <i className="fa-solid fa-screwdriver-wrench me-1"></i> Ajuster
                            </button>
                          ) : (
                            <span className="text-lock"><i className="fa-solid fa-lock text-muted"></i></span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section B: Log movements */}
          <div className="stocks-section-block">
            <h3><i className="fa-solid fa-clock-rotate-left me-2 text-info"></i> Journal des Mouvements de Stock</h3>
            {loading ? (
              <div className="loading-spinner">Chargement de l'historique...</div>
            ) : movements.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon"><i className="fa-solid fa-receipt text-muted"></i></span>
                <h4>Historique vide</h4>
                <p>Les mouvements d'entrées et sorties s'afficheront ici.</p>
              </div>
            ) : (
              <div className="movements-log-list">
                {movements.map((mov) => (
                  <div key={mov.id} className="movement-log-item">
                    <div className="mov-left">
                      <span className={`mov-badge-qty ${parseFloat(mov.quantity) > 0 ? 'qty-pos' : 'qty-neg'}`}>
                        {parseFloat(mov.quantity) > 0 
                          ? `+${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(parseFloat(mov.quantity))}` 
                          : new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(parseFloat(mov.quantity))}
                      </span>
                    </div>
                    <div className="mov-middle">
                      <div className="mov-product-name">{mov.product?.name}</div>
                      <div className="mov-details">
                        <span>Boutique : {mov.branch?.name}</span> • <span>Type : {mov.type === 'purchase' ? (
                          <><i className="fa-solid fa-download me-1"></i> Achat</>
                        ) : mov.type === 'sale' ? (
                          <><i className="fa-solid fa-upload me-1"></i> Vente</>
                        ) : (
                          <><i className="fa-solid fa-screwdriver-wrench me-1"></i> Ajustement</>
                        )}</span>
                      </div>
                      {mov.description && <div className="mov-desc">Motif : {mov.description}</div>}
                    </div>
                    <div className="mov-right">
                      <div className="mov-time">{new Date(mov.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

      <style>{`
        .stocks-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .stocks-layout {
          width: 100%;
          max-width: 1080px;
          padding: 32px;
          margin-top: 100px;
        }

        .stocks-header {
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
          text-align: left;
        }

        .stocks-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        .stocks-sections-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 28px;
          text-align: left;
        }

        .stocks-section-block h3 {
          font-size: 16px;
          margin-bottom: 16px;
          border-left: 3px solid var(--color-primary);
          padding-left: 10px;
        }

        /* Styles des logs de mouvements */
        .movements-log-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 500px;
          overflow-y: auto;
          padding-right: 8px;
        }

        .movement-log-item {
          display: flex;
          align-items: center;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 12px;
          gap: 12px;
          transition: all var(--transition-fast);
        }

        .movement-log-item:hover {
          border-color: var(--text-muted);
        }

        .mov-badge-qty {
          display: inline-block;
          width: 64px;
          text-align: center;
          padding: 6px 0;
          border-radius: 4px;
          font-weight: 800;
          font-size: 13px;
        }

        .qty-pos {
          background: rgba(0, 166, 81, 0.1);
          color: var(--color-success);
          border: 1px solid rgba(0, 166, 81, 0.2);
        }

        .qty-neg {
          background: rgba(239, 68, 68, 0.1);
          color: var(--color-error);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .mov-middle {
          flex: 1;
        }

        .mov-product-name {
          font-weight: 700;
          font-size: 13px;
          color: var(--text-main);
        }

        .mov-details {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .mov-desc {
          font-size: 11px;
          color: var(--text-main);
          font-style: italic;
          margin-top: 4px;
        }

        .mov-right {
          text-align: right;
        }

        .mov-time {
          font-size: 11px;
          color: var(--text-muted);
        }
      `}</style>

        {/* Modal d'exportation */}
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          documentType="stock_status"
          documentTitle="État Global des Stocks & Inventaires"
        />
      </>
    );
  };
