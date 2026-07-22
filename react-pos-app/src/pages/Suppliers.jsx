import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

export const Suppliers = () => {
  const { user, token } = useApp();

  // Liste des fournisseurs
  const [suppliers, setSuppliers] = useState([]);
  
  // États de recherche
  const [search, setSearch] = useState('');
  
  // États d'ouverture et d'édition de formulaires
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  
  // États du formulaire fournisseur
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [debtBalance, setDebtBalance] = useState('0');

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
      let url = '/v1/suppliers';
      if (search) {
        url += `?search=${encodeURIComponent(search)}`;
      }
      const res = await axios.get(url);
      setSuppliers(res.data.data || []);
    } catch (err) {
      setError('Impossible de charger le référentiel des fournisseurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const openForm = (supplier = null) => {
    setEditingSupplier(supplier);
    if (supplier) {
      setName(supplier.name || '');
      setEmail(supplier.email || '');
      setPhone(supplier.phone || '');
      setAddress(supplier.address || '');
      setDebtBalance(supplier.debt_balance?.toString() || '0');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setDebtBalance('0');
    }
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  const handleSaveSupplier = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
        debt_balance: parseFloat(debtBalance || '0')
      };

      if (editingSupplier) {
        const res = await axios.put(`/v1/suppliers/${editingSupplier.id}`, payload);
        setSuccess(`Fournisseur "${res.data.supplier?.name || name}" mis à jour avec succès !`);
      } else {
        const res = await axios.post('/v1/suppliers', payload);
        setSuccess(`Fournisseur "${res.data.supplier.name}" enregistré avec succès !`);
      }
      
      setShowForm(false);
      setEditingSupplier(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de la sauvegarde du fournisseur.');
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce fournisseur ?')) return;
    setError(null);
    setSuccess(null);
    try {
      await axios.delete(`/v1/suppliers/${id}`);
      setSuccess('Fournisseur supprimé avec succès.');
      loadData();
    } catch (err) {
      setError('Impossible de supprimer le fournisseur. Permissions requises.');
    }
  };

  if (!token) {
    return (
      <div className="suppliers-container">
        <div className="alert-card card">
          <span className="alert-icon">🔒</span>
          <h3>Accès Réservé</h3>
          <p>Vous devez vous connecter à une session pour gérer le référentiel des fournisseurs.</p>
        </div>
      </div>
    );
  }

  const hasCreatePermission = user?.permissions?.includes('suppliers.create') || user?.role === 'admin' || user?.role?.slug === 'admin';
  const hasUpdatePermission = user?.permissions?.includes('suppliers.update') || user?.role === 'admin' || user?.role?.slug === 'admin' || user?.role?.slug === 'gerant';

  return (
    <div className="suppliers-container">
      <div className="decorator-sphere sphere-1"></div>
      <div className="decorator-sphere sphere-2"></div>

      <div className="suppliers-layout card">
        <div className="suppliers-header">
          <div>
            <h2><i className="fa-solid fa-handshake me-2"></i> Référentiel des Fournisseurs</h2>
            <p className="suppliers-subtitle">Comptes courants & Coordonnées d'achats</p>
          </div>
          
          {hasCreatePermission && (
            <button onClick={() => openForm(null)} className="btn btn-primary">
              <i className="fa-solid fa-plus me-1"></i> Nouveau Fournisseur
            </button>
          )}
        </div>

        {error && <div className="error-banner"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}
        {success && <div className="success-banner"><i className="fa-solid fa-circle-check me-1"></i> {success}</div>}

        {/* Modal de création et édition */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-card card modal-large">
              <h3><i className="fa-solid fa-handshake me-2"></i> {editingSupplier ? '✏️ Modifier le partenaire' : '➕ Enregistrer un nouveau fournisseur'}</h3>
              <form onSubmit={handleSaveSupplier}>
                <div className="form-row-grid">
                  <div className="form-group">
                    <label className="form-label">Nom du Fournisseur *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: +221 33..."
                    />
                  </div>
                </div>

                <div className="form-row-grid">
                  <div className="form-group">
                    <label className="form-label">Adresse E-mail</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact@fournisseur.sn"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Solde initial débiteur (Dette XOF)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={debtBalance}
                      onChange={(e) => setDebtBalance(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Adresse Physique</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Rue 10, Dakar"
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-cancel">Annuler</button>
                  <button type="submit" className="btn btn-primary">{editingSupplier ? 'Mettre à jour le fournisseur' : 'Enregistrer le fournisseur'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Recherche */}
        <form onSubmit={handleSearchSubmit} className="filters-bar">
          <input 
            type="text" 
            placeholder="Rechercher par nom, email, téléphone..." 
            className="form-control search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">🔍 Rechercher</button>
        </form>

        {/* Tableau */}
        {loading ? (
          <div className="loading-spinner">Chargement des fournisseurs...</div>
        ) : suppliers.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <h4>Aucun fournisseur enregistré</h4>
            <p>Commencez par ajouter votre premier partenaire d'approvisionnement.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Nom du Partenaire</th>
                  <th>Téléphone</th>
                  <th>Adresse E-mail</th>
                  <th>Compte Courant Crédit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((sup) => (
                  <tr key={sup.id}>
                    <td>
                      <div className="product-title-cell">{sup.name}</div>
                      {sup.address && <div className="desc-sub">{sup.address}</div>}
                    </td>
                    <td>
                      <div className="sku-cell">{sup.phone || 'Non renseigné'}</div>
                    </td>
                    <td>
                      <div className="desc-sub">{sup.email || '-'}</div>
                    </td>
                    <td>
                      {parseFloat(sup.debt_balance) > 0 ? (
                        <span className="badge-debt-danger">
                          🔴 Dette : {new Intl.NumberFormat('fr-FR').format(sup.debt_balance)} XOF
                        </span>
                      ) : (
                        <span className="badge-debt-success">
                          🟢 Solde à jour (0 XOF)
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {hasUpdatePermission && (
                          <button 
                            onClick={() => openForm(sup)} 
                            className="btn btn-xs btn-secondary" 
                            title="Modifier ce fournisseur"
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                        )}
                        {(user?.permissions?.includes('suppliers.delete') || user?.role === 'admin' || user?.role?.slug === 'admin') && (
                          <button 
                            onClick={() => handleDeleteSupplier(sup.id)}
                            className="btn-delete"
                            title="Supprimer ce fournisseur"
                          >
                            🗑️
                          </button>
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
        .suppliers-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .suppliers-layout {
          width: 100%;
          max-width: 1080px;
          padding: 32px;
          margin-top: 100px;
        }

        .suppliers-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
          text-align: left;
        }

        .suppliers-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        .badge-debt-danger {
          display: inline-block;
          padding: 6px 12px;
          background: rgba(239, 68, 68, 0.1);
          color: var(--color-error);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
        }

        .badge-debt-success {
          display: inline-block;
          padding: 6px 12px;
          background: rgba(0, 166, 81, 0.1);
          color: var(--color-success);
          border: 1px solid rgba(0, 166, 81, 0.2);
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};
