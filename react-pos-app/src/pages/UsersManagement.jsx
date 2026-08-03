import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { PasswordInput } from '../components/PasswordInput';

export const UsersManagement = () => {
  const { token, user } = useApp();

  const userRole = user?.role?.slug || user?.role?.name || user?.role || '';
  const canManageStaff = userRole === 'admin' || userRole === 'super-admin' || user?.permissions?.includes('users.create') || user?.permissions?.includes('staff.create') || user?.email === 'superadmin@dls.com';

  const [users, setUsers]             = useState([]);
  const [roles, setRoles]             = useState([]);
  const [accessZones, setAccessZones] = useState([]);
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
    name: '', email: '', password: '', pin_code: '', role_id: '', branch_id: '', access_zone_id: '', status: 'active'
  });

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [usersRes, rolesRes, branchesRes, zonesRes] = await Promise.all([
        axios.get('/v1/users'),
        axios.get('/v1/custom-roles'),
        axios.get('/v1/branches'),
        axios.get('/v1/access-zones'),
      ]);
      setUsers(usersRes.data || []);
      setRoles(rolesRes.data || []);
      setBranches(branchesRes.data || []);
      setAccessZones(zonesRes.data || []);
    } catch {
      setError('Impossible de charger la liste du personnel.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const openForm = (u = null) => {
    setEditingUser(u);
    setUserForm(u
      ? {
          name: u.name,
          email: u.email,
          password: '',
          pin_code: '',
          role_id: u.role?.id || u.role_id || '',
          branch_id: u.branch?.id || u.branch_id || '',
          access_zone_id: u.access_zone_id || '',
          status: u.status || 'active'
        }
      : {
          name: '',
          email: '',
          password: '',
          pin_code: '',
          role_id: roles[0]?.id || '',
          branch_id: branches[0]?.id || '',
          access_zone_id: '',
          status: 'active'
        }
    );
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...userForm };
      if (!payload.password) delete payload.password;
      if (!payload.pin_code) delete payload.pin_code;
      if (!payload.branch_id) delete payload.branch_id;
      if (!payload.access_zone_id) delete payload.access_zone_id;

      if (editingUser) {
        await axios.put(`/v1/users/${editingUser.id}`, payload);
        setSuccess('✅ Informations du membre du personnel mises à jour avec succès.');
      } else {
        await axios.post('/v1/users', payload);
        setSuccess('✅ Nouveau membre du personnel enregistré avec succès.');
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de l\'enregistrement du personnel.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (u) => {
    try {
      await axios.post(`/v1/users/${u.id}/toggle-status`);
      setSuccess(`Statut de ${u.name} mis à jour.`);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de modification du statut.');
    }
  };

  const handleResetPin = async (u) => {
    const pin = window.prompt(`Saisir le nouveau code PIN (4 chiffres) pour ${u.name} :`);
    if (!pin || pin.length < 4 || !/^\d+$/.test(pin)) {
      alert('Code PIN invalide (4 chiffres requis).'); return;
    }
    try {
      await axios.post(`/v1/users/${u.id}/reset-pin`, { pin_code: pin });
      setSuccess(`✅ Code PIN de ${u.name} réinitialisé.`);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de réinitialisation du PIN.');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = !filterRole || String(u.role?.id || u.role_id) === filterRole;
    return matchSearch && matchRole;
  });

  if (!token) {
    return (
      <div className="customers-container">
        <div className="customers-layout card">
          <div className="empty-state text-center">
            <span style={{ fontSize: '48px' }}>🔒</span>
            <h3>Accès Réservé</h3>
            <p>Connectez-vous pour accéder à la gestion du personnel.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!canManageStaff) {
    return (
      <div className="customers-container">
        <div className="customers-layout card">
          <div className="empty-state text-center">
            <span style={{ fontSize: '48px' }}>🚫</span>
            <h3>Accès non autorisé</h3>
            <p>Seuls les administrateurs et responsables habilités peuvent gérer le personnel.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="customers-container">
      <div className="customers-layout card">
        
        {/* En-tête */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap" style={{ gap: '16px' }}>
          <div>
            <h2 className="m-0" style={{ fontWeight: 800 }}>👥 Gestion du Personnel</h2>
            <p className="text-muted small m-0">Créez et gérez les comptes des opérateurs, caissiers, gérants et responsables.</p>
          </div>
          <button onClick={() => openForm(null)} className="btn btn-primary" style={{ fontWeight: 700 }}>
            <i className="fa-solid fa-user-plus me-1"></i> Créer un Membre du Personnel
          </button>
        </div>

        {error && <div className="error-banner mb-3"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}
        {success && <div className="success-banner mb-3"><i className="fa-solid fa-circle-check me-1"></i> {success}</div>}

        {/* Barre de filtres */}
        <div className="filters-bar mb-4" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher par nom ou e-mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ minWidth: '180px' }}>
            <select className="form-control" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="">Tous les rôles</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tableau du personnel */}
        {loading ? (
          <div className="loading-spinner">Chargement des comptes du personnel...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state text-center my-4">
            <span style={{ fontSize: '40px' }}>👤</span>
            <h4>Aucun membre du personnel trouvé</h4>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Membre du Personnel</th>
                  <th>Identifiant / E-mail</th>
                  <th>Rôle</th>
                  <th>Boutique Affectée</th>
                  <th>Zone d'Accès</th>
                  <th>Statut</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover-row">
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span className="badge bg-primary" style={{ fontSize: '11px', padding: '4px 10px' }}>
                        {u.role?.name || 'Opérateur'}
                      </span>
                    </td>
                    <td>{u.branch?.name || 'Toutes les boutiques'}</td>
                    <td>
                      {accessZones.find(z => z.id === u.access_zone_id)?.name || <span className="text-muted small">Zone Globale</span>}
                    </td>
                    <td>
                      {u.status === 'active' ? (
                        <span className="badge badge-success">Actif</span>
                      ) : (
                        <span className="badge badge-error">Bloqué</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => openForm(u)} className="btn btn-secondary btn-sm me-1">
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button onClick={() => handleResetPin(u)} className="btn btn-outline-primary btn-sm me-1" title="Réinitialiser PIN">
                        <i className="fa-solid fa-key"></i>
                      </button>
                      {u.id !== user.id && (
                        <button onClick={() => handleToggleStatus(u)} className={`btn btn-sm ${u.status === 'active' ? 'btn-danger' : 'btn-success'}`}>
                          {u.status === 'active' ? 'Bloquer' : 'Débloquer'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de création / modification */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-card card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', textAlign: 'left' }}>
              <h3>{editingUser ? `Modifier ${editingUser.name}` : 'Créer un nouveau membre du personnel'}</h3>
              <form onSubmit={handleSave} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Nom complet *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="Ex: Kouassi Jean"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Adresse E-mail / Identifiant *</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    placeholder="ex: kouassi@entreprise.com"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 form-group">
                    <label className="form-label">{editingUser ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe *'}</label>
                    <PasswordInput
                      required={!editingUser}
                      placeholder="Min 6 caractères"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="form-label">{editingUser ? 'Nouveau PIN (optionnel)' : 'Code PIN (4 chiffres) *'}</label>
                    <input
                      type="password"
                      maxLength="4"
                      className="form-control"
                      required={!editingUser}
                      placeholder="Ex: 1234"
                      value={userForm.pin_code}
                      onChange={(e) => setUserForm({ ...userForm, pin_code: e.target.value })}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 form-group">
                    <label className="form-label">Rôle attribué *</label>
                    <select className="form-control" required value={userForm.role_id} onChange={(e) => setUserForm({ ...userForm, role_id: e.target.value })}>
                      <option value="">Sélectionner un rôle</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="form-label">Boutique Affectée</label>
                    <select className="form-control" value={userForm.branch_id} onChange={(e) => setUserForm({ ...userForm, branch_id: e.target.value })}>
                      <option value="">Toutes les boutiques</option>
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Zone d'Accès restreinte (Optionnel)</label>
                  <select className="form-control" value={userForm.access_zone_id} onChange={(e) => setUserForm({ ...userForm, access_zone_id: e.target.value })}>
                    <option value="">Aucune zone restreinte (Accès complet au rôle)</option>
                    {accessZones.map(z => (
                      <option key={z.id} value={z.id}>{z.name}</option>
                    ))}
                  </select>
                </div>

                <div className="modal-actions d-flex justify-content-end gap-2 mt-3">
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-cancel">Annuler</button>
                  <button type="submit" disabled={saving} className="btn btn-primary">
                    {saving ? 'Enregistrement...' : (editingUser ? 'Enregistrer' : 'Créer le compte')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
