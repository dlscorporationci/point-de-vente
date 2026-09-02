import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { db } from '../services/db';
import { ExportModal } from '../components/ExportModal';
import { SlidePanel } from '../components/SlidePanel';
import { ConfirmDialog } from '../components/ConfirmDialog';

const getCustomerInitials = (name) => {
  if (!name) return 'CL';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const avatarGradients = [
  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  'linear-gradient(135deg, #10b981 0%, #047857 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
  'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
];

const getAvatarBg = (id) => {
  const num = typeof id === 'number' ? id : (String(id).charCodeAt(0) || 0);
  return avatarGradients[num % avatarGradients.length];
};

export const Customers = () => {
  const { token, user } = useApp();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Pagination & recherche
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState('');

  // Panneau glissant d'ajout/édition
  const [showModal, setShowModal] = useState(false);
  // Dialog de confirmation de suppression
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, name }
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
      const companyId = parseInt(localStorage.getItem('company-id') || 1);
      let custData = [];
      try {
        const response = await axios.get('/v1/customers', {
          params: { page, search: search || undefined }
        });
        custData = response.data.data || [];
        setLastPage(response.data.last_page || 1);
      } catch (netErr) {
        console.warn('Mode hors-ligne, chargement des clients Dexie:', netErr);
        custData = await db.customers.where('company_id').equals(companyId).toArray();
        if (search) {
          const s = search.toLowerCase();
          custData = custData.filter(c => c.name?.toLowerCase().includes(s) || c.phone?.includes(s));
        }
      }
      setCustomers(custData);
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
      loyalty_points: '0',
      is_global: true
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
      loyalty_points: cust.loyalty_points,
      is_global: !cust.branch_id && (!cust.branches || cust.branches.length === 0)
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

    const cleanName = formData.name ? formData.name.trim() : '';
    if (cleanName.length < 2) {
      setError("⚠️ Le nom complet du client doit comporter au moins 2 caractères.");
      return;
    }

    if (!/^(?=.*[a-zA-ZÀ-ÿ])[a-zA-ZÀ-ÿ0-9\s'._-]{2,100}$/u.test(cleanName)) {
      setError("⚠️ Le nom doit contenir au moins une lettre (ex: Koffi Manassé) et ne peut pas être composé uniquement de chiffres (ex: 0000).");
      return;
    }

    if (formData.phone && !/^[0-9+\s-]{8,20}$/.test(formData.phone)) {
      setError("⚠️ Le numéro de téléphone doit comporter entre 8 et 20 chiffres (ex: +225 0700000000).");
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("⚠️ Veuillez entrer une adresse e-mail valide (ex: client@exemple.com).");
      return;
    }

    try {
      const payload = {
        ...formData,
        name: cleanName,
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
      const apiErrs = err.response?.data?.errors;
      if (apiErrs) {
        const msgs = Object.values(apiErrs).flat();
        setError(msgs.join(' '));
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de l\'enregistrement du client.');
      }
    }
  };

  const handleDeleteCustomer = async () => {
    if (!confirmDelete) return;
    setError(null);
    setSuccess(null);
    try {
      await axios.delete(`/v1/customers/${confirmDelete.id}`);
      setSuccess('Client supprimé avec succès.');
      setConfirmDelete(null);
      loadCustomers();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la suppression.');
      setConfirmDelete(null);
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
          <div className="header-actions">
            <button onClick={() => setShowExportModal(true)} className="btn btn-outline-secondary" style={{ fontWeight: 700 }}>
              <i className="fa-solid fa-file-export me-1"></i> Exporter
            </button>
            <button onClick={openAddModal} className="btn btn-primary">
              <i className="fa-solid fa-user-plus me-1"></i> Nouveau Client
            </button>
          </div>
        </div>

        {error && <div className="error-banner mb-3"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}
        {success && <div className="success-banner mb-3"><i className="fa-solid fa-circle-check me-1"></i> {success}</div>}

        {/* Résumé KPI Synthétique */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="p-3 border rounded shadow-sm d-flex align-items-center gap-3" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <i className="fa-solid fa-users"></i>
              </div>
              <div>
                <div className="text-muted small fw-bold">TOTAL CLIENTS</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>{customers.length}</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 border rounded shadow-sm d-flex align-items-center gap-3" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <i className="fa-solid fa-circle-exclamation"></i>
              </div>
              <div>
                <div className="text-muted small fw-bold">DETTES EN COURS</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: customers.reduce((sum, c) => sum + (parseFloat(c.debt_balance) || 0), 0) > 0 ? '#ef4444' : 'var(--text-main)' }}>
                  {new Intl.NumberFormat('fr-FR').format(customers.reduce((sum, c) => sum + (parseFloat(c.debt_balance) || 0), 0))} XOF
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 border rounded shadow-sm d-flex align-items-center gap-3" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(234, 179, 8, 0.12)', color: '#ca8a04', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <i className="fa-solid fa-star"></i>
              </div>
              <div>
                <div className="text-muted small fw-bold">POINTS FIDÉLITÉ CUMULÉS</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#ca8a04' }}>
                  {new Intl.NumberFormat('fr-FR').format(customers.reduce((sum, c) => sum + (parseInt(c.loyalty_points) || 0), 0))} Pts
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="search-bar mb-4">
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
          <div className="table-responsive rounded border shadow-sm">
            <table className="table table-hover align-middle mb-0" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
              <thead style={{ background: 'var(--bg-input)', borderBottom: '2px solid var(--border-color)' }}>
                <tr>
                  <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Client & Contact</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Adresse</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fidélité</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Crédit & Solde</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center', width: '160px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(cust => {
                  const debtVal = parseFloat(cust.debt_balance || 0);
                  const isGlobal = !cust.branch_id && (!cust.branches || cust.branches.length === 0);
                  return (
                    <tr key={cust.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div className="d-flex align-items-center gap-3">
                          <div 
                            style={{ 
                              width: '42px', height: '42px', borderRadius: '50%', 
                              background: getAvatarBg(cust.id), color: '#ffffff', 
                              display: 'flex', alignItems: 'center', justifyContent: 'center', 
                              fontWeight: 800, fontSize: '15px', flexShrink: 0,
                              boxShadow: '0 2px 6px rgba(0,0,0,0.15)' 
                            }}
                          >
                            {getCustomerInitials(cust.name)}
                          </div>
                          <div>
                            <div className="fw-bold" style={{ fontSize: '15px', color: 'var(--text-main)' }}>{cust.name}</div>
                            <div className="d-flex flex-wrap gap-2 mt-1 align-items-center small">
                              {cust.phone && (
                                <span className="text-muted" style={{ fontSize: '12px' }}>
                                  <i className="fa-solid fa-phone me-1 text-primary"></i>{cust.phone}
                                </span>
                              )}
                              {cust.email && (
                                <span className="text-muted" style={{ fontSize: '12px' }}>
                                  <i className="fa-solid fa-envelope me-1 text-secondary"></i>{cust.email}
                                </span>
                              )}
                            </div>
                            <div className="mt-1">
                              {isGlobal ? (
                                <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle" style={{ fontSize: '10px', padding: '3px 8px' }}>
                                  <i className="fa-solid fa-globe me-1"></i>Client Global
                                </span>
                              ) : (
                                <span className="badge rounded-pill bg-info-subtle text-info border border-info-subtle" style={{ fontSize: '10px', padding: '3px 8px' }}>
                                  <i className="fa-solid fa-shop me-1"></i>{cust.branch?.name || 'Boutique'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                        {cust.address ? (
                          <span><i className="fa-solid fa-location-dot me-1 text-danger"></i>{cust.address}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div 
                          style={{ 
                            display: 'inline-flex', alignItems: 'center', gap: '6px', 
                            padding: '4px 10px', borderRadius: '20px', 
                            background: 'rgba(234, 179, 8, 0.12)', border: '1px solid rgba(234, 179, 8, 0.3)', 
                            color: '#ca8a04', fontWeight: 700, fontSize: '12px' 
                          }}
                        >
                          <i className="fa-solid fa-star"></i> {cust.loyalty_points || 0} Pts
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {debtVal > 0 ? (
                          <div className="p-2 rounded border border-danger-subtle bg-danger-subtle text-danger" style={{ fontSize: '12px' }}>
                            <div className="fw-bold"><i className="fa-solid fa-circle-exclamation me-1"></i>Dette: {new Intl.NumberFormat('fr-FR').format(debtVal)} XOF</div>
                            <div className="text-muted" style={{ fontSize: '11px' }}>Limite: {new Intl.NumberFormat('fr-FR').format(cust.credit_limit || 0)} XOF</div>
                          </div>
                        ) : (
                          <div>
                            <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '11px', padding: '4px 8px' }}>
                              <i className="fa-solid fa-circle-check me-1"></i>Solde à jour
                            </span>
                            <div className="text-muted small mt-1" style={{ fontSize: '11px' }}>
                              Limite: {new Intl.NumberFormat('fr-FR').format(cust.credit_limit || 0)} XOF
                            </div>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div className="d-flex justify-content-center gap-1">
                          <button 
                            onClick={() => viewDetails(cust)} 
                            className="btn btn-sm btn-outline-info" 
                            title="Historique des ventes & dettes"
                            style={{ width: '32px', height: '32px', padding: 0, borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <i className="fa-solid fa-clock-rotate-left"></i>
                          </button>
                          <button 
                            onClick={() => openEditModal(cust)} 
                            className="btn btn-sm btn-outline-warning" 
                            title="Modifier la fiche client"
                            style={{ width: '32px', height: '32px', padding: 0, borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button 
                            onClick={() => setConfirmDelete({ id: cust.id, name: cust.name })} 
                            className="btn btn-sm btn-outline-danger" 
                            title="Supprimer le client"
                            style={{ width: '32px', height: '32px', padding: 0, borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      {/* ConfirmDialog Suppression Client */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Supprimer le client ?"
        message={confirmDelete ? `Vous êtes sur le point de supprimer définitivement le client "${confirmDelete.name}". Cette action est irréversible.` : ''}
        confirmLabel="Supprimer le client"
        type="danger"
        onConfirm={handleDeleteCustomer}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* Interface / Page Plein Écran d'AJOUT / MODIFICATION */}
      <SlidePanel
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCustomer ? 'Modifier la fiche client' : 'Nouveau client'}
        subtitle={editingCustomer ? "Modifiez le nom, les coordonnées et le plafond de crédit du client" : "Enregistrez les coordonnées d'un nouveau client et définissez son solde ou sa limite de crédit"}
        icon={editingCustomer ? 'fa-solid fa-user-pen' : 'fa-solid fa-user-plus'}
        iconColor={editingCustomer ? '#f59e0b' : 'var(--color-primary)'}
        footer={
          <>
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-cancel">
              <i className="fa-solid fa-xmark me-1"></i> Annuler
            </button>
            <button type="submit" form="customer-form" className="btn btn-primary">
              <i className="fa-solid fa-floppy-disk me-1"></i> {editingCustomer ? 'Mettre à jour le client' : 'Enregistrer le client'}
            </button>
          </>
        }
      >
        {/* Erreur / Succès dans le panneau */}
        {error && <div className="error-banner mb-3"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}
        {success && <div className="success-banner mb-3"><i className="fa-solid fa-circle-check me-1"></i> {success}</div>}

        <form id="customer-form" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Nom Complet *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                  minLength={2}
                  maxLength={100}
                  placeholder="Ex: Koffi Manassé"
                />
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/[^0-9+\s-]/g, '')})} 
                    inputMode="tel"
                    placeholder="Ex: +225 0700000000"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    placeholder="Ex: client@exemple.com"
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

              <div className="form-group my-3 p-3 border rounded bg-input">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isGlobalCheck"
                    checked={formData.is_global}
                    onChange={(e) => setFormData({...formData, is_global: e.target.checked})}
                  />
                  <label className="form-check-label fw-bold text-main ms-2" htmlFor="isGlobalCheck">
                    <i className="fa-solid fa-globe me-1 text-primary"></i> Client Global (Disponible dans toutes les boutiques)
                  </label>
                </div>
                <div className="text-muted small mt-1">
                  {formData.is_global 
                    ? "Ce client sera visible et utilisable sur le POS de toutes les boutiques de l'entreprise."
                    : "Ce client sera strictement réservé et visible dans la boutique actuelle uniquement."}
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label className="form-label">Limite de Crédit (XOF) *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={formData.credit_limit} 
                    onChange={(e) => setFormData({...formData, credit_limit: e.target.value})} 
                    onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                    required 
                    min="0"
                    step="any"
                    inputMode="decimal"
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Solde de dette initial (XOF)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={formData.debt_balance} 
                    onChange={(e) => setFormData({...formData, debt_balance: e.target.value})} 
                    onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                    min="0"
                    step="any"
                    inputMode="decimal"
                    placeholder="0"
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
                  onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                  min="0"
                  step="1"
                  inputMode="numeric"
                  placeholder="0"
                />
              </div>

        </form>
      </SlidePanel>

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

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        documentType="customers_list"
        documentTitle="Liste des Clients & Crédits"
      />

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
