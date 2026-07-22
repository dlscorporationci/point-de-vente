import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

export const Sales = () => {
  const { token } = useApp();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Filtres
  const [search, setSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Détail d'une vente
  const [selectedSale, setSelectedSale] = useState(null);

  const loadSales = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const params = { page };
      if (search) params.search = search;
      if (paymentMethod) params.payment_method = paymentMethod;
      if (paymentStatus) params.payment_status = paymentStatus;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const res = await axios.get('/v1/sales', { params });
      setSales(res.data.data || []);
      setLastPage(res.data.last_page || 1);
    } catch (err) {
      setError('Erreur lors du chargement des ventes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSales(); }, [token, page, paymentMethod, paymentStatus, dateFrom, dateTo]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadSales();
  };

  const viewSaleDetail = async (sale) => {
    try {
      const res = await axios.get(`/v1/sales/${sale.id}`);
      setSelectedSale(res.data);
    } catch {
      setError('Impossible de charger le détail de cette vente.');
    }
  };

  const printReceipt = () => {
    window.print();
  };

  const payMethodLabel = (m) => {
    const map = { cash: 'Espèces', card: 'Carte', credit: 'Crédit' };
    return map[m] || m;
  };

  const payMethodIcon = (m) => {
    const map = { cash: 'fa-money-bill-wave', card: 'fa-credit-card', credit: 'fa-handshake' };
    return map[m] || 'fa-circle-question';
  };

  const statusBadge = (s) => {
    if (s === 'paid') return <span className="badge bg-success"><i className="fa-solid fa-circle-check me-1"></i>Payé</span>;
    if (s === 'unpaid') return <span className="badge bg-danger"><i className="fa-solid fa-clock me-1"></i>Impayé</span>;
    return <span className="badge bg-warning text-dark"><i className="fa-solid fa-hourglass-half me-1"></i>Partiel</span>;
  };

  if (!token) {
    return (
      <div className="sales-container">
        <div className="alert-card card">
          <span><i className="fa-solid fa-lock text-muted"></i></span>
          <h3>Accès Réservé</h3>
          <p>Connectez-vous pour accéder à l'historique des ventes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sales-container">
      <div className="decorator-sphere sphere-1"></div>
      <div className="decorator-sphere sphere-2"></div>

      <div className="sales-layout card">
        <div className="sales-header">
          <div>
            <h2><i className="fa-solid fa-receipt me-2 text-primary"></i> Historique des Ventes</h2>
            <p className="sales-subtitle">Consultez l'ensemble des transactions réalisées, filtrez par date, client ou moyen de paiement.</p>
          </div>
        </div>

        {error && <div className="error-banner"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}

        {/* Barre de filtres */}
        <form className="filters-bar" onSubmit={handleSearch}>
          <div className="filter-group">
            <label className="form-label">Recherche</label>
            <div className="search-bar">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                type="text"
                className="form-control search-input"
                placeholder="N° ticket, nom client, téléphone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label className="form-label">Paiement</label>
            <select className="form-control" value={paymentMethod} onChange={(e) => { setPaymentMethod(e.target.value); setPage(1); }}>
              <option value="">Tous</option>
              <option value="cash">Espèces</option>
              <option value="card">Carte</option>
              <option value="credit">Crédit</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="form-label">Statut</label>
            <select className="form-control" value={paymentStatus} onChange={(e) => { setPaymentStatus(e.target.value); setPage(1); }}>
              <option value="">Tous</option>
              <option value="paid">Payé</option>
              <option value="unpaid">Impayé</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="form-label">Du</label>
            <input type="date" className="form-control" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} />
          </div>

          <div className="filter-group">
            <label className="form-label">Au</label>
            <input type="date" className="form-control" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} />
          </div>

          <div className="filter-group filter-action">
            <button type="submit" className="btn btn-primary btn-sm">
              <i className="fa-solid fa-filter me-1"></i> Filtrer
            </button>
          </div>
        </form>

        {/* Tableau des ventes */}
        {loading ? (
          <div className="loading-spinner">Chargement des ventes...</div>
        ) : sales.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon"><i className="fa-solid fa-file-invoice text-muted" style={{ fontSize: '40px' }}></i></span>
            <h4>Aucune vente trouvée</h4>
            <p>Ajustez vos filtres ou réalisez votre première vente depuis le POS.</p>
          </div>
        ) : (
          <div className="table-responsive mt-3">
            <table className="table table-striped table-hover table-bordered align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>N° Ticket</th>
                  <th>Date & Heure</th>
                  <th>Client</th>
                  <th>Caissier</th>
                  <th>Paiement</th>
                  <th>Statut</th>
                  <th style={{ textAlign: 'right' }}>Total TTC</th>
                  <th style={{ textAlign: 'center', width: '80px' }}>Détail</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(sale => (
                  <tr key={sale.id}>
                    <td>
                      <code className="fw-bold text-primary">#{sale.sale_number}</code>
                    </td>
                    <td>
                      <div>{new Date(sale.created_at).toLocaleDateString('fr-FR')}</div>
                      <div className="text-muted small">{new Date(sale.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td>
                      <div className="fw-semibold">{sale.client_name || 'Client Comptant'}</div>
                      {sale.client_phone && <div className="text-muted small"><i className="fa-solid fa-phone me-1"></i>{sale.client_phone}</div>}
                    </td>
                    <td>
                      <div>{sale.user?.name || '-'}</div>
                      <div className="text-muted small">{sale.branch?.name || '-'}</div>
                    </td>
                    <td>
                      <span className="badge bg-secondary">
                        <i className={`fa-solid ${payMethodIcon(sale.payment_method)} me-1`}></i>
                        {payMethodLabel(sale.payment_method)}
                      </span>
                    </td>
                    <td>{statusBadge(sale.payment_status)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      {new Intl.NumberFormat('fr-FR').format(sale.total)} XOF
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => viewSaleDetail(sale)} className="btn btn-sm btn-info text-white" title="Voir le reçu">
                        <i className="fa-solid fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="pagination-bar mt-4 d-flex justify-content-between align-items-center">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn btn-secondary">
              <i className="fa-solid fa-chevron-left me-1"></i> Précédent
            </button>
            <span className="text-main">Page {page} sur {lastPage}</span>
            <button disabled={page >= lastPage} onClick={() => setPage(page + 1)} className="btn btn-secondary">
              Suivant <i className="fa-solid fa-chevron-right ms-1"></i>
            </button>
          </div>
        )}
      </div>

      {/* MODALE DE DÉTAIL / REÇU */}
      {selectedSale && (
        <div className="modal-overlay" onClick={() => setSelectedSale(null)}>
          <div className="modal-card card modal-large" onClick={(e) => e.stopPropagation()}>
            
            {/* Contenu du reçu imprimable */}
            <div className="receipt-print-zone" id="printable-receipt">
              <div className="receipt-header-block">
                <h3 className="receipt-title">
                  <i className="fa-solid fa-store me-2"></i> ApexPOS — Reçu de Vente
                </h3>
                <p className="receipt-meta">
                  <strong>N° Ticket :</strong> {selectedSale.sale_number}<br />
                  <strong>Date :</strong> {new Date(selectedSale.created_at).toLocaleDateString('fr-FR')} à {new Date(selectedSale.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}<br />
                  <strong>Caissier :</strong> {selectedSale.user?.name || '-'} — {selectedSale.branch?.name || '-'}<br />
                  <strong>Client :</strong> {selectedSale.client_name || 'Client Comptant'} {selectedSale.client_phone ? `(${selectedSale.client_phone})` : ''}
                </p>
              </div>

              <div className="receipt-divider"></div>

              {/* Tableau des articles */}
              <table className="receipt-items-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Article</th>
                    <th>Qté</th>
                    <th>PU</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSale.details?.map((d, idx) => (
                    <tr key={idx}>
                      <td style={{ textAlign: 'left' }}>{d.product?.name || `Produit #${d.product_id}`}</td>
                      <td>{d.quantity}</td>
                      <td>{new Intl.NumberFormat('fr-FR').format(d.selling_price)}</td>
                      <td style={{ textAlign: 'right' }}>{new Intl.NumberFormat('fr-FR').format(d.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="receipt-divider"></div>

              {/* Totaux */}
              <div className="receipt-totals">
                <div className="receipt-total-row">
                  <span>Sous-total HT</span>
                  <span>{new Intl.NumberFormat('fr-FR').format(selectedSale.subtotal)} XOF</span>
                </div>
                {parseFloat(selectedSale.discount) > 0 && (
                  <div className="receipt-total-row">
                    <span>Remise</span>
                    <span>-{new Intl.NumberFormat('fr-FR').format(selectedSale.discount)} XOF</span>
                  </div>
                )}
                <div className="receipt-total-row">
                  <span>TVA (18%)</span>
                  <span>{new Intl.NumberFormat('fr-FR').format(selectedSale.tax)} XOF</span>
                </div>
                <div className="receipt-total-row grand-total">
                  <span>TOTAL TTC</span>
                  <span>{new Intl.NumberFormat('fr-FR').format(selectedSale.total)} XOF</span>
                </div>
              </div>

              <div className="receipt-divider"></div>

              {/* Paiement */}
              <div className="receipt-payment-info">
                <p><strong>Mode :</strong> {payMethodLabel(selectedSale.payment_method)}</p>
                {selectedSale.payment_method === 'cash' && (
                  <>
                    <p><strong>Reçu :</strong> {new Intl.NumberFormat('fr-FR').format(selectedSale.amount_received)} XOF</p>
                    <p><strong>Monnaie rendue :</strong> {new Intl.NumberFormat('fr-FR').format(selectedSale.amount_change)} XOF</p>
                  </>
                )}
                <p><strong>Statut :</strong> {selectedSale.payment_status === 'paid' ? 'Payé' : 'Impayé (Crédit)'}</p>
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-footer">
                <p>Merci pour votre achat !</p>
                <p className="small">Retour ou échange sous 7 jours avec le ticket.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="modal-actions no-print">
              <button type="button" onClick={() => setSelectedSale(null)} className="btn btn-cancel">Fermer</button>
              <button type="button" onClick={printReceipt} className="btn btn-primary">
                <i className="fa-solid fa-print me-1"></i> Imprimer le Reçu
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .sales-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .sales-layout {
          width: 100%;
          max-width: 1200px;
          padding: 32px;
          margin-top: 100px;
        }

        .sales-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
          text-align: left;
        }

        .sales-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        /* Barre de filtres */
        .filters-bar {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: flex-end;
          margin-bottom: 20px;
          padding: 16px;
          background: var(--bg-input);
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--border-color);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          min-width: 140px;
        }

        .filter-group .form-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0;
        }

        .filter-action {
          flex: 0;
          min-width: auto;
          justify-content: flex-end;
        }

        .search-bar {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input {
          padding-left: 36px;
        }

        /* Reçu imprimable */
        .receipt-print-zone {
          text-align: center;
          padding: 24px;
        }

        .receipt-header-block {
          margin-bottom: 16px;
        }

        .receipt-title {
          font-size: 18px;
          font-weight: 800;
          margin-bottom: 12px;
          color: var(--text-main);
        }

        .receipt-meta {
          font-size: 13px;
          line-height: 1.8;
          color: var(--text-muted);
          text-align: left;
        }

        .receipt-divider {
          border-top: 1px dashed var(--border-color);
          margin: 16px 0;
        }

        .receipt-items-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          color: var(--text-main);
        }

        .receipt-items-table th {
          font-size: 11px;
          text-transform: uppercase;
          color: var(--text-muted);
          padding: 8px 4px;
          border-bottom: 1px solid var(--border-color);
          text-align: center;
        }

        .receipt-items-table td {
          padding: 8px 4px;
          text-align: center;
          color: var(--text-main);
        }

        .receipt-totals {
          text-align: right;
        }

        .receipt-total-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 13px;
          color: var(--text-main);
        }

        .receipt-total-row.grand-total {
          font-size: 16px;
          font-weight: 800;
          border-top: 2px solid var(--border-color);
          padding-top: 8px;
          margin-top: 8px;
          color: var(--color-success);
        }

        .receipt-payment-info p {
          font-size: 13px;
          margin-bottom: 4px;
          text-align: left;
          color: var(--text-main);
        }

        .receipt-footer {
          margin-top: 16px;
          color: var(--text-muted);
          font-size: 12px;
        }

        /* L'impression utilise désormais les styles d'impression globaux de index.css */
      `}</style>
    </div>
  );
};
