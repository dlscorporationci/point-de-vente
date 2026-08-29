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

  // États Modal modification Code PIN
  const [showPinModal, setShowPinModal] = useState(false);
  const [targetPinUser, setTargetPinUser] = useState(null);
  const [newPinCode, setNewPinCode]     = useState('');
  const [pinSaving, setPinSaving]       = useState(false);
  
  const [userForm, setUserForm]       = useState({
    name: '', email: '', password: '', pin_code: '', role_id: '', branch_id: '', access_zone_id: '', status: 'active'
  });

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        axios.get('/v1/users'),
        axios.get('/v1/custom-roles'),
        axios.get('/v1/branches'),
        axios.get('/v1/access-zones'),
      ]);

      const [usersRes, rolesRes, branchesRes, zonesRes] = results;

      if (usersRes.status === 'fulfilled') {
        const d = usersRes.value.data;
        const list = Array.isArray(d) ? d : (d?.data || []);
        if (list.length === 0 && user) {
          setUsers([{
            id: user.id || 1,
            name: user.name || 'Administrateur',
            email: user.email,
            status: user.status || 'active',
            role: user.role || { name: 'Administrateur', slug: 'admin' },
            branch: user.branch || { name: 'Boutique Centrale' },
            created_at: new Date().toISOString()
          }]);
        } else {
          setUsers(list);
        }
      } else {
        if (user) {
          setUsers([{
            id: user.id || 1,
            name: user.name || 'Administrateur',
            email: user.email,
            status: user.status || 'active',
            role: user.role || { name: 'Administrateur', slug: 'admin' },
            branch: user.branch || { name: 'Boutique Centrale' },
            created_at: new Date().toISOString()
          }]);
        }
      }
      if (rolesRes.status === 'fulfilled') {
        const d = rolesRes.value.data;
        setRoles(Array.isArray(d) ? d : (d?.data || []));
      }
      if (branchesRes.status === 'fulfilled') {
        const d = branchesRes.value.data;
        setBranches(Array.isArray(d) ? d : (d?.data || []));
      }
      if (zonesRes.status === 'fulfilled') {
        const d = zonesRes.value.data;
        setAccessZones(Array.isArray(d) ? d : (d?.data || []));
      }
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
      payload.access_zone_id = payload.access_zone_id ? parseInt(payload.access_zone_id) : null;

      if (editingUser) {
        await axios.put(`/v1/users/${editingUser.id}`, payload);
        setSuccess('✅ Informations du membre du personnel mises à jour avec succès.');
      } else {
        await axios.post('/v1/users', payload);
        setSuccess('✅ Nouveau membre du personnel enregistré avec succès.');
      }
      window.dispatchEvent(new Event('access-zone-updated'));
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

  const openPinModal = (u) => {
    setTargetPinUser(u);
    setNewPinCode('');
    setShowPinModal(true);
    setError(null);
  };

  const handleSaveUserPinModal = async (e) => {
    e.preventDefault();
    if (!targetPinUser) return;
    if (!newPinCode || newPinCode.length !== 4) {
      setError("Le Code PIN doit comporter exactement 4 chiffres.");
      return;
    }
    setPinSaving(true);
    try {
      await axios.post(`/v1/users/${targetPinUser.id}/reset-pin`, { pin_code: newPinCode });
      setSuccess(`✅ Code PIN de ${targetPinUser.name} mis à jour avec succès !`);
      setShowPinModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de la mise à jour du PIN.');
    } finally {
      setPinSaving(false);
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
                      <button onClick={() => openPinModal(u)} className="btn btn-outline-primary btn-sm me-1" title="Modifier/Définir le Code PIN">
                        <i className="fa-solid fa-key me-1"></i> PIN
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

        {/* Modal de création / modification d'utilisateur */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-card card modal-large" style={{ maxWidth: '600px' }}>
              <h3>{editingUser ? '✏️ Modifier l\'utilisateur' : '➕ Nouveau compte personnel'}</h3>
              <form onSubmit={handleSave}>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label className="form-label">Nom complet *</label>
                    <input type="text" className="form-control" required value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="form-label">Adresse e-mail *</label>
                    <input type="email" className="form-control" required value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 form-group">
                    <label className="form-label">{editingUser ? 'Mot de passe (vide = inchangé)' : 'Mot de passe *'}</label>
                    <PasswordInput value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} placeholder="••••••••" required={!editingUser} />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="form-label">Code PIN (4 chiffres)</label>
                    <PasswordInput 
                      value={userForm.pin_code} 
                      onChange={(e) => setUserForm({ ...userForm, pin_code: e.target.value.replace(/[^0-9]/g, '').slice(0, 4) })} 
                      placeholder="Ex: 1234" 
                      maxLength="4" 
                      inputMode="numeric" 
                      pattern="[0-9]{4}"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 form-group">
                    <label className="form-label">Rôle *</label>
                    <select className="form-control" required value={userForm.role_id} onChange={(e) => setUserForm({ ...userForm, role_id: e.target.value })}>
                      <option value="">Sélectionner un rôle...</option>
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

        {/* Modal Définition / Modification du Code PIN */}
        {showPinModal && targetPinUser && (
          <div className="modal-overlay">
            <div className="modal-card card" style={{ maxWidth: '420px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>
                  <i className="fa-solid fa-key text-primary me-2"></i> Code PIN de Caisse
                </h3>
                <button type="button" onClick={() => setShowPinModal(false)} className="btn-close-modal" style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>×</button>
              </div>

              <div className="p-2 mb-3 rounded" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', fontSize: '13px' }}>
                <div><strong>Employé :</strong> {targetPinUser.name}</div>
                <div className="text-muted"><strong>Email :</strong> {targetPinUser.email}</div>
                <div className="mt-1">
                  <strong>Statut PIN : </strong>
                  {targetPinUser.has_pin ? (
                    <span className="badge bg-success" style={{ fontSize: '11px' }}>✅ Actif</span>
                  ) : (
                    <span className="badge bg-warning text-dark" style={{ fontSize: '11px' }}>⚠️ Non configuré</span>
                  )}
                </div>
              </div>

              <form onSubmit={handleSaveUserPinModal}>
                <div className="form-group mb-3">
                  <label className="form-label" style={{ fontWeight: 700 }}>Nouveau Code PIN (4 chiffres) *</label>
                  <PasswordInput
                    value={newPinCode}
                    onChange={(e) => setNewPinCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="Ex: 1234"
                    maxLength="4"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    required
                  />
                  <small className="text-muted mt-1 d-block" style={{ fontSize: '11px' }}>
                    💡 Cliquez sur l'œil 👁️ pour afficher ou vérifier votre saisie avant de valider.
                  </small>
                </div>

                <div className="modal-actions d-flex justify-content-end gap-2">
                  <button type="button" onClick={() => setShowPinModal(false)} className="btn btn-cancel">Annuler</button>
                  <button type="submit" disabled={pinSaving || newPinCode.length !== 4} className="btn btn-primary">
                    {pinSaving ? 'Enregistrement...' : 'Enregistrer le PIN'}
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
