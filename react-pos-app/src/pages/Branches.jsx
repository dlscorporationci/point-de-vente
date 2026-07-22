import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

export const Branches = () => {
  const { token, user } = useApp();

  const isAdmin = user?.role === 'admin' || user?.role?.slug === 'admin' ||
                  user?.role === 'gerant' || user?.role?.slug === 'gerant';

  const [branches, setBranches]           = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [success, setSuccess]             = useState(null);
  const [showForm, setShowForm]           = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [branchForm, setBranchForm]       = useState({ name: '', address: '', phone: '' });
  const [saving, setSaving]               = useState(false);

  const loadBranches = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get('/v1/branches');
      setBranches(res.data || []);
    } catch {
      setError('Impossible de charger les boutiques.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadBranches(); }, [loadBranches]);

  const openForm = (branch = null) => {
    setEditingBranch(branch);
    setBranchForm(branch
      ? { name: branch.name, address: branch.address || '', phone: branch.phone || '' }
      : { name: '', address: '', phone: '' });
    setShowForm(true);
    setError(null); setSuccess(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      if (editingBranch) {
        await axios.put(`/v1/branches/${editingBranch.id}`, branchForm);
        setSuccess('✅ Boutique mise à jour avec succès.');
      } else {
        await axios.post('/v1/branches', branchForm);
        setSuccess('✅ Boutique créée avec succès.');
      }
      setShowForm(false);
      loadBranches();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (branch) => {
    try {
      await axios.post(`/v1/branches/${branch.id}/toggle-status`);
      loadBranches();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de modification du statut.');
    }
  };

  const handleDelete = async (branch) => {
    if (!window.confirm(`Supprimer la boutique "${branch.name}" ? Cette action est irréversible.`)) return;
    try {
      await axios.delete(`/v1/branches/${branch.id}`);
      setSuccess('✅ Boutique supprimée.');
      loadBranches();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de suppression.');
    }
  };

  if (!token) {
    return (
      <div className="customers-container">
        <div className="customers-layout card">
          <div className="empty-state text-center">
            <span style={{ fontSize: '48px' }}>🔒</span>
            <h3>Accès Réservé</h3>
            <p>Connectez-vous pour gérer les boutiques.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="customers-container">
        <div className="customers-layout card">
          <div className="empty-state text-center">
            <span style={{ fontSize: '48px' }}>🚫</span>
            <h3>Accès non autorisé</h3>
            <p>Seuls les administrateurs peuvent gérer les boutiques.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="customers-container">
      <div className="decorator-sphere sphere-1"></div>
      <div className="decorator-sphere sphere-2"></div>

      <div className="customers-layout card">
        {/* ── EN-TÊTE ── */}
        <div className="customers-header">
          <div>
            <h2 className="section-title">
              <i className="fa-solid fa-store me-2 text-primary"></i> Gestion des Boutiques
            </h2>
            <p className="customers-subtitle">
              Créez, modifiez et gérez les points de vente de votre entreprise.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => openForm()}>
            <i className="fa-solid fa-plus me-1"></i> Nouvelle Boutique
          </button>
        </div>

        {error   && <div className="error-banner"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}
        {success && <div className="success-banner"><i className="fa-solid fa-circle-check me-1"></i> {success}</div>}

        {/* ── FORMULAIRE ── */}
        {showForm && (
          <div className="inline-form-card" style={{ marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '16px', fontWeight: 700 }}>
              {editingBranch ? '✏️ Modifier la boutique' : '➕ Nouvelle boutique'}
            </h4>
            <form onSubmit={handleSave}>
              <div className="row">
                <div className="col-md-6 form-group">
                  <label className="form-label">Nom de la boutique *</label>
                  <input type="text" className="form-control" required
                    placeholder="Ex: Boutique Centre-ville"
                    value={branchForm.name}
                    onChange={e => setBranchForm({ ...branchForm, name: e.target.value })} />
                </div>
                <div className="col-md-6 form-group">
                  <label className="form-label">Téléphone</label>
                  <input type="text" className="form-control"
                    placeholder="Ex: +225 07 00 00 00"
                    value={branchForm.phone}
                    onChange={e => setBranchForm({ ...branchForm, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Adresse</label>
                <input type="text" className="form-control"
                  placeholder="Ex: Rue des Palmiers, Plateau"
                  value={branchForm.address}
                  onChange={e => setBranchForm({ ...branchForm, address: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── LISTE DES BOUTIQUES ── */}
        {loading ? (
          <div className="loading-spinner" style={{ textAlign: 'center', padding: '40px' }}>
            Chargement des boutiques...
          </div>
        ) : branches.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon"><i className="fa-solid fa-store text-muted"></i></span>
            <h4>Aucune boutique enregistrée</h4>
            <p>Créez votre première boutique en cliquant sur "+ Nouvelle Boutique".</p>
          </div>
        ) : (
          <div className="management-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Boutique</th>
                  <th>Adresse</th>
                  <th>Téléphone</th>
                  <th>Utilisateurs</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {branches.map(b => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '8px',
                          background: 'var(--color-primary)', opacity: 0.9,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff'
                        }}>
                          <i className="fa-solid fa-store" style={{ fontSize: '14px' }}></i>
                        </div>
                        <strong>{b.name}</strong>
                      </div>
                    </td>
                    <td>{b.address || <span className="text-muted">—</span>}</td>
                    <td>{b.phone || <span className="text-muted">—</span>}</td>
                    <td><span className="badge-count">{b.users_count ?? 0} utilisateur{(b.users_count ?? 0) !== 1 ? 's' : ''}</span></td>
                    <td>
                      {(() => {
                        const st = b.status || 'open';
                        const isOpen = st === 'open' || st === 'active';
                        return (
                          <span className={`status-badge ${isOpen ? 'status-active' : 'status-inactive'}`}>
                            {st === 'open' || st === 'active' ? 'Ouverte' :
                             st === 'maintenance' ? 'Maintenance' :
                             st === 'suspended' ? 'Suspendue' : 'Fermée'}
                          </span>
                        );
                      })()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-xs btn-secondary" onClick={() => openForm(b)} title="Modifier">
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button className={`btn btn-xs ${(b.status === 'open' || b.status === 'active') ? 'btn-warning' : 'btn-success'}`}
                          onClick={() => handleToggleStatus(b)} title="Ouvrir/Fermer la boutique">
                          <i className={`fa-solid ${(b.status === 'open' || b.status === 'active') ? 'fa-pause' : 'fa-play'}`}></i>
                        </button>
                        <button className="btn btn-xs btn-danger" onClick={() => handleDelete(b)} title="Supprimer">
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
      </div>
    </div>
  );
};
