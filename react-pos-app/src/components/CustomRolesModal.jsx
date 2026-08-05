import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const CustomRolesModal = ({ isOpen, onClose, onSuccess }) => {
  const [roles, setRoles] = useState([]);
  const [permissionModules, setPermissionModules] = useState({});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rolesRes, permRes] = await Promise.all([
        axios.get('/v1/custom-roles'),
        axios.get('/v1/permissions'),
      ]);
      const rawRoles = Array.isArray(rolesRes.data) ? rolesRes.data : [];
      const cleanRoles = rawRoles.filter(r => !['super-admin', 'superadmin'].includes(r.slug));
      setRoles(cleanRoles);
      setPermissionModules(permRes.data.modules || {});
    } catch (err) {
      setError('Impossible de charger les rôles et permissions.');
    } finally {
      setLoading(false);
    }
  };

  const openForm = (r = null) => {
    setEditingRole(r);
    setRoleName(r ? r.name : '');
    const initialPerms = r && Array.isArray(r.permissions)
      ? r.permissions.map(p => (typeof p === 'string' ? p : (p.slug || p)))
      : [];
    setSelectedPermissions(initialPerms);
    setShowForm(true);
    setError(null);
  };

  const togglePermission = (slug) => {
    if (selectedPermissions.includes(slug)) {
      setSelectedPermissions(selectedPermissions.filter(s => s !== slug));
    } else {
      setSelectedPermissions([...selectedPermissions, slug]);
    }
  };

  const toggleModulePermissions = (modulePerms) => {
    const slugs = Object.keys(modulePerms);
    const allSelected = slugs.every(s => selectedPermissions.includes(s));
    if (allSelected) {
      setSelectedPermissions(selectedPermissions.filter(s => !slugs.includes(s)));
    } else {
      const combined = new Set([...selectedPermissions, ...slugs]);
      setSelectedPermissions(Array.from(combined));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingRole) {
        await axios.put(`/v1/custom-roles/${editingRole.id}`, {
          name: roleName,
          permissions: selectedPermissions
        });
      } else {
        await axios.post('/v1/custom-roles', {
          name: roleName,
          permissions: selectedPermissions
        });
      }
      // Attendre que la liste des rôles soit à jour avant de fermer
      await loadData();
      setShowForm(false);
      if (onSuccess) onSuccess('Rôle enregistré avec succès.');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de la sauvegarde du rôle.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (role) => {
    if (!window.confirm(`Supprimer le rôle "${role.name}" ?`)) return;
    setError(null);
    try {
      await axios.delete(`/v1/custom-roles/${role.id}`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Impossible de supprimer ce rôle.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px', width: '92%', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {!showForm ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 className="m-0"><i className="fa-solid fa-user-gear text-primary me-2"></i> Rôles Personnalisés & Permissions</h3>
                <p className="text-muted small m-0">Définissez les autorisations d'accès granulaires pour votre personnel.</p>
              </div>
              <button onClick={() => openForm(null)} className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                <i className="fa-solid fa-plus me-1"></i> Créer un Rôle Personnalisé
              </button>
            </div>

            {error && <div className="error-banner mb-3"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}

            {loading ? (
              <div className="loading-spinner">Chargement des rôles...</div>
            ) : (
              <div className="table-responsive">
                <table className="saas-table">
                  <thead>
                    <tr>
                      <th>Intitulé du Rôle</th>
                      <th>Type</th>
                      <th>Permissions Accordées</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map(r => {
                      const isSystem = !r.company_id;
                      return (
                        <tr key={r.id} className="hover-row">
                          <td><strong style={{ fontSize: '15px' }}>{r.name}</strong></td>
                          <td>
                            {isSystem ? (
                              <span className="badge badge-info">Système</span>
                            ) : (
                              <span className="badge bg-primary">Personnalisé</span>
                            )}
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {r.permissions?.length || 0} permission(s)
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button onClick={() => openForm(r)} className="btn btn-secondary btn-sm me-1">
                              <i className="fa-solid fa-pen me-1"></i> {isSystem ? 'Voir' : 'Modifier'}
                            </button>
                            {!isSystem && (
                              <button onClick={() => handleDelete(r)} className="btn btn-outline-danger btn-sm">
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="modal-actions d-flex justify-content-end mt-4">
              <button type="button" onClick={onClose} className="btn btn-cancel">Fermer</button>
            </div>
          </>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="m-0">{editingRole ? `Modifier le rôle "${editingRole.name}"` : 'Nouveau Rôle Personnalisé'}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary btn-sm">← Annuler</button>
            </div>

            {error && <div className="error-banner mb-3"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}

            <form onSubmit={handleSave}>
              <div className="form-group mb-4">
                <label className="form-label" style={{ fontWeight: 700 }}>Nom du Rôle *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="Ex: Responsable Stock, Assistant Comptable..."
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  disabled={editingRole && !editingRole.company_id}
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mb-1">
                <h4 className="m-0" style={{ fontWeight: 800 }}>Sélection des Permissions Granulaires</h4>
                {(!editingRole || editingRole.company_id) && (
                  <button 
                    type="button" 
                    className="btn btn-link btn-sm p-0 text-decoration-none fw-bold"
                    onClick={() => {
                      const allSlugs = Object.values(permissionModules).flatMap(m => Object.keys(m.permissions));
                      if (allSlugs.every(s => selectedPermissions.includes(s))) {
                        setSelectedPermissions([]);
                      } else {
                        setSelectedPermissions(Array.from(new Set(allSlugs)));
                      }
                    }}
                  >
                    {Object.values(permissionModules).flatMap(m => Object.keys(m.permissions)).every(s => selectedPermissions.includes(s))
                      ? '❌ Tout décocher (Global)' 
                      : '✅ Tout cocher (Global)'}
                  </button>
                )}
              </div>
              <p className="text-muted small mb-3">Cochez les modules et actions autorisés pour les utilisateurs ayant ce rôle.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                {Object.entries(permissionModules).map(([modKey, mod]) => {
                  const modPermSlugs = Object.keys(mod.permissions);
                  const isAllChecked = modPermSlugs.every(s => selectedPermissions.includes(s));

                  return (
                    <div key={modKey} className="card p-3" style={{ background: 'var(--bg-input, #f8fafc)', borderRadius: '10px' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <strong style={{ fontSize: '15px' }}>{mod.name}</strong>
                        {(!editingRole || editingRole.company_id) && (
                          <button
                            type="button"
                            onClick={() => toggleModulePermissions(mod.permissions)}
                            className="btn btn-sm btn-outline-primary"
                            style={{ fontSize: '11px', padding: '2px 8px' }}
                          >
                            {isAllChecked ? 'Tout décocher' : 'Tout cocher'}
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                        {Object.entries(mod.permissions).map(([permSlug, permLabel]) => {
                          const isChecked = selectedPermissions.includes(permSlug);
                          return (
                            <label 
                              key={permSlug} 
                              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => togglePermission(permSlug)}
                                disabled={editingRole && !editingRole.company_id}
                              />
                              <span>{permLabel}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {(!editingRole || editingRole.company_id) && (
                <div className="modal-actions d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-cancel">Annuler</button>
                  <button type="submit" disabled={saving} className="btn btn-primary" style={{ fontWeight: 700 }}>
                    {saving ? 'Enregistrement...' : 'Enregistrer le Rôle'}
                  </button>
                </div>
              )}
            </form>
          </>
        )}

      </div>
    </div>
  );
};
