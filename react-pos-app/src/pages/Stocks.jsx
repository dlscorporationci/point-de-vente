import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

export const Stocks = () => {
  const { user, token } = useApp();

  // Liste des états de stock et journal des mouvements
  const [currentStocks, setCurrentStocks] = useState([]);
  const [movements, setMovements] = useState([]);
  
  // États d'ouverture de formulaire
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState(null);

  // Formulaire d'ajustement
  const [adjustQty, setAdjustQty] = useState('');
  const [description, setDescription] = useState('');

  // États génériques
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Charger les stocks et mouvements
  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const stockRes = await axios.get('/v1/stock/current');
      setCurrentStocks(stockRes.data);

      const movRes = await axios.get('/v1/stock/movements');
      setMovements(movRes.data.data || []);
    } catch (err) {
      setError('Impossible de charger les données d\'inventaire.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const triggerAdjust = (stockItem) => {
    setSelectedStockItem(stockItem);
    setAdjustQty('');
    setDescription('');
    setShowAdjustModal(true);
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post('/v1/stock/adjust', {
        branch_id: selectedStockItem.branch_id,
        product_id: selectedStockItem.product_id,
        quantity: parseFloat(adjustQty),
        description
      });

      setSuccess('Ajustement de stock enregistré.');
      setShowAdjustModal(false);
      setSelectedStockItem(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'ajustement du stock.');
    }
  };

  if (!token) {
    return (
      <div className="stocks-container">
        <div className="alert-card card">
          <span className="alert-icon"><i className="fa-solid fa-lock text-muted"></i></span>
          <h3>Accès Réservé</h3>
          <p>Vous devez vous connecter à une session pour gérer les stocks et inventaires.</p>
        </div>
      </div>
    );
  }

  const hasAdjustPermission = user?.permissions?.includes('products.update') || user?.role === 'admin';

  return (
    <div className="stocks-container">
      <div className="decorator-sphere sphere-1"></div>
      <div className="decorator-sphere sphere-2"></div>

      <div className="stocks-layout card">
        <div className="stocks-header">
          <div>
            <h2><i className="fa-solid fa-layer-group me-2 text-success"></i> Niveaux de Stocks & Outil d'Inventaire</h2>
            <p className="stocks-subtitle">Ajustez manuellement les stocks de votre boutique centrale et consultez l'historique</p>
          </div>
        </div>

        {error && <div className="error-banner"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}
        {success && <div className="success-banner"><i className="fa-solid fa-circle-check me-1"></i> {success}</div>}

        {/* Modal d'ajustement */}
        {showAdjustModal && selectedStockItem && (
          <div className="modal-overlay">
            <div className="modal-card card">
              <h3><i className="fa-solid fa-screwdriver-wrench me-2 text-warning"></i> Ajuster le stock physique</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Article : <strong>{selectedStockItem.product?.name}</strong> <br />
                Stock actuel : <strong>{selectedStockItem.quantity} unités</strong> dans <strong>{selectedStockItem.branch?.name}</strong>
              </p>

              <form onSubmit={handleAdjustSubmit}>
                <div className="form-group">
                  <label className="form-label">Quantité à ajuster (Saisir négatif pour perte/casse) *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Ex: -5 pour retirer 5 unités, ou 10 pour ajouter"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(e.target.value)}
                    required
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Motif / Description *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ex: Perte humidité, Casse de chantier, Inventaire correctif"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowAdjustModal(false)} className="btn btn-cancel">Annuler</button>
                  <button type="submit" className="btn btn-primary">Valider l'ajustement</button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                          {item.quantity} unités
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
                        {parseFloat(mov.quantity) > 0 ? `+${mov.quantity}` : mov.quantity}
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
    </div>
  );
};
