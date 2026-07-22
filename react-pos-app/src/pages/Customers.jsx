import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

export const Customers = () => {
  const { token, user } = useApp();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Pagination & recherche
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState('');

  // Modale d'ajout/édition
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    credit_limit: '0',
    debt_balance: '0',
    loyalty_points: '0'
  });

  // Modale de détails
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const loadCustomers = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/v1/customers', {
        params: {
          page,
          search: search || undefined
        }
      });
      setCustomers(response.data.data || []);
      setLastPage(response.data.last_page || 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du chargement des clients.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [token, page, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      credit_limit: '500000',
      debt_balance: '0',
      loyalty_points: '0'
    });
    setError(null);
    setShowModal(true);
  };

  const openEditModal = (cust) => {
    setEditingCustomer(cust);
    setFormData({
      name: cust.name,
      email: cust.email || '',
      phone: cust.phone || '',
      address: cust.address || '',
      credit_limit: cust.credit_limit,
      debt_balance: cust.debt_balance,
      loyalty_points: cust.loyalty_points
    });
    setError(null);
    setShowModal(true);
  };

  const viewDetails = async (cust) => {
    try {
      const response = await axios.get(`/v1/customers/${cust.id}`);
      setSelectedCustomer(response.data);
    } catch (err) {
      setError('Impossible de charger les détails du client.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        ...formData,
        credit_limit: parseFloat(formData.credit_limit || 0),
        debt_balance: parseFloat(formData.debt_balance || 0),
        loyalty_points: parseInt(formData.loyalty_points || 0)
      };

      if (editingCustomer) {
        await axios.put(`/v1/customers/${editingCustomer.id}`, payload);
        setSuccess('Client mis à jour avec succès.');
      } else {
        await axios.post('/v1/customers', payload);
        setSuccess('Client créé avec succès.');
      }
      setShowModal(false);
      loadCustomers();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'enregistrement du client.');
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce client ?')) return;
    setError(null);
    setSuccess(null);
    try {
      await axios.delete(`/v1/customers/${id}`);
      setSuccess('Client supprimé avec succès.');
      loadCustomers();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la suppression.');
    }
  };

  return (
    <div className="customers-container">
      <div className="decorator-sphere sphere-1"></div>
      <div className="decorator-sphere sphere-2"></div>

      <div className="customers-layout card">
        <div className="customers-header">
          <div>
            <h2 className="section-title"><i className="fa-solid fa-users me-2 text-primary"></i> Gestion des Clients</h2>
            <p className="customers-subtitle">Pilotez votre portefeuille client, le crédit compte courant et les points de fidélité.</p>
          </div>
          <button onClick={openAddModal} className="btn btn-primary">
            <i className="fa-solid fa-user-plus me-1"></i> Nouveau Client
          </button>
        </div>

        {error && <div className="error-banner"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}
        {success && <div className="success-banner"><i className="fa-solid fa-circle-check me-1"></i> {success}</div>}

        {/* Barre de recherche */}
        <div className="search-bar">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input 
            type="text" 
            placeholder="Rechercher par nom, téléphone, email..." 
            className="form-control search-input"
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Tableau des clients */}
        {loading ? (
          <div className="loading-spinner">Chargement des clients...</div>
        ) : customers.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon"><i className="fa-solid fa-users-slash text-muted"></i></span>
            <h4>Aucun client trouvé</h4>
            <p>Cliquez sur "Nouveau Client" pour enregistrer votre premier client.</p>
          </div>
        ) : (
          <div className="table-responsive mt-3">
            <table className="table table-striped table-hover table-bordered align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Nom & Contact</th>
                  <th>Adresse</th>
                  <th>Points Fidélité</th>
                  <th>Crédit & Limite</th>
                  <th style={{ width: '150px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(cust => (
                  <tr key={cust.id}>
                    <td>
                      <div className="fw-bold text-main">{cust.name}</div>
                      <div className="text-muted small">
                        {cust.phone && <><i className="fa-solid fa-phone me-1"></i>{cust.phone}</>}
                        {cust.email && <><i className="fa-solid fa-envelope ms-2 me-1"></i>{cust.email}</>}
                      </div>
                    </td>
                    <td className="text-main">{cust.address || '-'}</td>
                    <td>
                      <span className="badge bg-success">
                        <i className="fa-solid fa-star me-1 text-warning"></i> {cust.loyalty_points} Pts
                      </span>
                    </td>
                    <td>
                      {parseFloat(cust.debt_balance) > 0 ? (
                        <div className="text-danger fw-bold">
                          <i className="fa-solid fa-circle-exclamation me-1"></i>
                          Dette : {new Intl.NumberFormat('fr-FR').format(cust.debt_balance)} XOF
                        </div>
                      ) : (
                        <div className="text-success small"><i className="fa-solid fa-circle-check me-1"></i> Solde à jour</div>
                      )}
                      <div className="text-muted small">Limite autorisée : {new Intl.NumberFormat('fr-FR').format(cust.credit_limit)} XOF</div>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button onClick={() => viewDetails(cust)} className="btn btn-sm btn-info text-white" title="Historique">
                          <i className="fa-solid fa-clock-history"></i>
                        </button>
                        <button onClick={() => openEditModal(cust)} className="btn btn-sm btn-warning text-white" title="Modifier">
                          <i className="fa-solid fa-pencil"></i>
                        </button>
                        <button onClick={() => handleDeleteCustomer(cust.id)} className="btn btn-sm btn-danger" title="Supprimer">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
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
            <button 
              disabled={page <= 1} 
              onClick={() => setPage(page - 1)}
              className="btn btn-secondary"
            >
              <i className="fa-solid fa-chevron-left me-1"></i> Précédent
            </button>
            <span className="text-main">Page {page} sur {lastPage}</span>
            <button 
              disabled={page >= lastPage} 
              onClick={() => setPage(page + 1)}
              className="btn btn-secondary"
            >
              Suivant <i className="fa-solid fa-chevron-right ms-1"></i>
            </button>
          </div>
        )}
      </div>

      {/* MODALE D'AJOUT / MODIFICATION */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card card">
            <h3>{editingCustomer ? 'Modifier le Client' : 'Nouveau Client'}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Nom Complet *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Adresse</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})} 
                />
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label className="form-label">Limite de Crédit (XOF) *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={formData.credit_limit} 
                    onChange={(e) => setFormData({...formData, credit_limit: e.target.value})} 
                    required 
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Solde de dette initial (XOF)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={formData.debt_balance} 
                    onChange={(e) => setFormData({...formData, debt_balance: e.target.value})} 
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Points de fidélité initiaux</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={formData.loyalty_points} 
                  onChange={(e) => setFormData({...formData, loyalty_points: e.target.value})} 
                  min="0"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-cancel">Annuler</button>
                <button type="submit" className="btn btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE DE DÉTAILS / HISTORIQUE */}
      {selectedCustomer && (
        <div className="modal-overlay">
          <div className="modal-card card modal-large">
            <h3>Historique & Détails : {selectedCustomer.name}</h3>
            
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="p-3 border rounded text-center bg-light">
                  <div className="text-muted small">Points Fidélité</div>
                  <div className="fs-4 fw-bold text-success"><i className="fa-solid fa-star text-warning"></i> {selectedCustomer.loyalty_points}</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 border rounded text-center bg-light">
                  <div className="text-muted small">Encours de dette</div>
                  <div className="fs-4 fw-bold text-danger">{new Intl.NumberFormat('fr-FR').format(selectedCustomer.debt_balance)} XOF</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 border rounded text-center bg-light">
                  <div className="text-muted small">Limite autorisée</div>
                  <div className="fs-4 fw-bold text-primary">{new Intl.NumberFormat('fr-FR').format(selectedCustomer.credit_limit)} XOF</div>
                </div>
              </div>
            </div>

            <h5 className="mb-3 text-main"><i className="fa-solid fa-receipt me-1"></i> Achats récents</h5>
            
            <div className="table-responsive" style={{ maxHeight: '300px' }}>
              {!selectedCustomer.sales || selectedCustomer.sales.length === 0 ? (
                <div className="p-3 text-center text-muted">Aucun achat enregistré.</div>
              ) : (
                <table className="table table-sm table-striped">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>N° Ticket</th>
                      <th>Mode Paiement</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCustomer.sales.map(sale => (
                      <tr key={sale.id}>
                        <td>{new Date(sale.created_at).toLocaleDateString('fr-FR')}</td>
                        <td><code>#{sale.sale_number}</code></td>
                        <td>
                          <span className="badge bg-secondary">{sale.payment_method}</span>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                          {new Intl.NumberFormat('fr-FR').format(sale.total)} XOF
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="modal-actions">
              <button type="button" onClick={() => setSelectedCustomer(null)} className="btn btn-primary">Fermer</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .customers-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .customers-layout {
          width: 100%;
          max-width: 1080px;
          padding: 32px;
          margin-top: 100px;
        }

        .customers-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
          text-align: left;
        }

        .customers-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        .search-bar {
          position: relative;
          width: 100%;
          margin-bottom: 20px;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input {
          padding-left: 44px;
          height: 48px;
        }
      `}</style>
    </div>
  );
};
