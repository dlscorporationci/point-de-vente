import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

export const UsersManagement = () => {
  const { token, user } = useApp();

  const isAdmin = user?.role === 'admin' || user?.role?.slug === 'admin';

  const [users, setUsers]             = useState([]);
  const [roles, setRoles]             = useState([]);
  const [branches, setBranches]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [success, setSuccess]         = useState(null);
  const [showForm, setShowForm]       = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving]           = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole]   = useState('');
  const [userForm, setUserForm]       = useState({
    name: '', email: '', password: '', pin_code: '', role_id: '', branch_id: '', status: 'active'
  });

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [usersRes, rolesRes, branchesRes] = await Promise.all([
        axios.get('/v1/users'),
        axios.get('/v1/roles'),
        axios.get('/v1/branches'),
      ]);
      setUsers(usersRes.data || []);
      setRoles(rolesRes.data || []);
      setBranches(branchesRes.data || []);
    } catch {
      setError('Impossible de charger les données.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const openForm = (u = null) => {
    setEditingUser(u);
    setUserForm(u
      ? { name: u.name, email: u.email, password: '', pin_code: '', role_id: u.role?.id || '', branch_id: u.branch?.id || '', status: u.status }
      : { name: '', email: '', password: '', pin_code: '', role_id: '', branch_id: '', status: 'active' });
    setShowForm(true);
    setError(null); setSuccess(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      const payload = { ...userForm };
      if (!payload.password) delete payload.password;
      if (!payload.pin_code) delete payload.pin_code;
      if (!payload.branch_id) delete payload.branch_id;
      if (editingUser) {
        await axios.put(`/v1/users/${editingUser.id}`, payload);
        setSuccess('✅ Utilisateur mis à jour avec succès.');
      } else {
        await axios.post('/v1/users', payload);
        setSuccess('✅ Utilisateur créé avec succès.');
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (u) => {
    try {
      await axios.post(`/v1/users/${u.id}/toggle-status`);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de modification du statut.');
    }
  };

  const handleResetPin = async (u) => {
    const pin = window.prompt(`Saisir le nouveau code PIN pour ${u.name} :`);
    if (!pin || pin.length < 4 || !/^\d+$/.test(pin)) {
      alert('Code PIN invalide (au moins 4 chiffres requis).'); return;
    }
    try {
      await axios.post(`/v1/users/${u.id}/reset-pin`, { pin_code: pin });
      setSuccess(`✅ Code PIN de ${u.name} réinitialisé.`);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de réinitialisation du PIN.');
    }
  };

  // Filtrage local
  const filteredUsers = users.filter(u => {
    const matchSearch = !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = !filterRole || (u.role?.slug || u.role?.name || '') === filterRole;
    return matchSearch && matchRole;
  });

  const roleColors = {
    admin: '#1E3A8A', gerant: '#0D9488', caissier: '#7C3AED', comptable: '#B45309', default: '#64748B'
  };
  const getRoleColor = (slug) => roleColors[slug] || roleColors.default;

  if (!token) {
    return (
      <div className="customers-container">
        <div className="customers-layout card">
          <div className="empty-state text-center">
            <span style={{ fontSize: '48px' }}>🔒</span>
            <h3>Accès Réservé</h3>
            <p>Connectez-vous pour gérer les utilisateurs.</p>
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
            <p>Seuls les administrateurs peuvent gérer les utilisateurs.</p>
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
              <i className="fa-solid fa-users-gear me-2 text-primary"></i> Gestion du Personnel
            </h2>
            <p className="customers-subtitle">
              Gérez le personnel de votre entreprise, leurs rôles et leurs accès.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => openForm()}>
            <i className="fa-solid fa-user-plus me-1"></i> Nouvel Utilisateur
          </button>
        </div>

        {error   && <div className="error-banner"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}
        {success && <div className="success-banner"><i className="fa-solid fa-circle-check me-1"></i> {success}</div>}

        {/* ── FORMULAIRE ── */}
        {showForm && (
          <div className="inline-form-card" style={{ marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '16px', fontWeight: 700 }}>
              {editingUser ? "✏️ Modifier l'utilisateur" : '➕ Nouvel utilisateur'}
            </h4>
            <form onSubmit={handleSave}>
              <div className="row">
                <div className="col-md-6 form-group">
                  <label className="form-label">Nom complet *</label>
                  <input type="text" className="form-control" required
                    placeholder="Ex: Jean Dupont"
                    value={userForm.name}
                    onChange={e => setUserForm({ ...userForm, name: e.target.value })} />
                </div>
                <div className="col-md-6 form-group">
                  <label className="form-label">Adresse E-mail *</label>
                  <input type="email" className="form-control" required
                    placeholder="jean@exemple.com"
                    value={userForm.email}
                    onChange={e => setUserForm({ ...userForm, email: e.target.value })} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 form-group">
                  <label className="form-label">Mot de passe {editingUser ? '(vide = inchangé)' : '*'}</label>
                  <input type="password" className="form-control" required={!editingUser}
                    placeholder="Min. 8 caractères"
                    value={userForm.password}
                    onChange={e => setUserForm({ ...userForm, password: e.target.value })} />
                </div>
                <div className="col-md-4 form-group">
                  <label className="form-label">Code PIN {editingUser ? '(vide = inchangé)' : '*'}</label>
                  <input type="text" className="form-control" maxLength="6" required={!editingUser}
                    placeholder="Ex: 1234"
                    value={userForm.pin_code}
                    onChange={e => setUserForm({ ...userForm, pin_code: e.target.value.replace(/\D/g, '') })} />
                </div>
                <div className="col-md-4 form-group">
                  <label className="form-label">Statut</label>
                  <select className="form-control" value={userForm.status}
                    onChange={e => setUserForm({ ...userForm, status: e.target.value })}>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 form-group">
                  <label className="form-label">Rôle *</label>
                  <select className="form-control" required value={userForm.role_id}
                    onChange={e => setUserForm({ ...userForm, role_id: e.target.value })}>
                    <option value="">— Sélectionner un rôle —</option>
                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6 form-group">
                  <label className="form-label">Boutique rattachée</label>
                  <select className="form-control" value={userForm.branch_id}
                    onChange={e => setUserForm({ ...userForm, branch_id: e.target.value })}>
                    <option value="">— Toutes les boutiques —</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
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

        {/* ── BARRE DE RECHERCHE ET FILTRE ── */}
        <div className="search-bar" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              className="form-control search-input"
              placeholder="Rechercher par nom ou e-mail..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <select className="form-control" value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            style={{ minWidth: '200px' }}>
            <option value="">— Tous les rôles —</option>
            {roles.map(r => <option key={r.id} value={r.slug || r.name}>{r.name}</option>)}
          </select>
        </div>

        {/* ── LISTE DES UTILISATEURS ── */}
        {loading ? (
          <div className="loading-spinner" style={{ textAlign: 'center', padding: '40px' }}>
            Chargement des utilisateurs...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon"><i className="fa-solid fa-users-slash text-muted"></i></span>
            <h4>{searchQuery || filterRole ? 'Aucun résultat' : 'Aucun utilisateur enregistré'}</h4>
            <p>
              {searchQuery || filterRole
                ? 'Essayez de modifier vos critères de recherche.'
                : 'Créez le premier utilisateur en cliquant sur "+ Nouvel Utilisateur".'}
            </p>
          </div>
        ) : (
          <div className="management-table mt-3">
            <table className="table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>E-mail</th>
                  <th>Rôle</th>
                  <th>Boutique</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="user-avatar-mini">{u.name.charAt(0).toUpperCase()}</div>
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{u.email}</td>
                    <td>
                      <span style={{
                        background: `${getRoleColor(u.role?.slug)}22`,
                        color: getRoleColor(u.role?.slug),
                        border: `1px solid ${getRoleColor(u.role?.slug)}55`,
                        padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700
                      }}>
                        {u.role?.name || '—'}
                      </span>
                    </td>
                    <td>{u.branch?.name || <span className="text-muted">—</span>}</td>
                    <td>
                      <span className={`status-badge ${u.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                        {u.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-xs btn-secondary" onClick={() => openForm(u)} title="Modifier">
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button className="btn btn-xs btn-info" onClick={() => handleResetPin(u)} title="Réinitialiser le PIN">
                          <i className="fa-solid fa-key"></i>
                        </button>
                        <button className={`btn btn-xs ${u.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                          onClick={() => handleToggleStatus(u)} title="Activer/Désactiver">
                          <i className={`fa-solid ${u.status === 'active' ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '10px 16px', color: 'var(--text-muted)', fontSize: '13px', borderTop: '1px solid var(--border-color)' }}>
              {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} affiché{filteredUsers.length !== 1 ? 's' : ''}
              {(searchQuery || filterRole) && ` sur ${users.length} au total`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
