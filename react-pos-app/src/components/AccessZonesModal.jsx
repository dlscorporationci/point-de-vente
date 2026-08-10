import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const AccessZonesModal = ({ isOpen, onClose }) => {
  const [zones, setZones] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingZone, setEditingZone] = useState(null);

  const [zoneName, setZoneName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [schedules, setSchedules] = useState([
    { day_of_week: 1, day_name: 'Lundi', start_time: '08:00', end_time: '18:00', is_active: true },
    { day_of_week: 2, day_name: 'Mardi', start_time: '08:00', end_time: '18:00', is_active: true },
    { day_of_week: 3, day_name: 'Mercredi', start_time: '08:00', end_time: '18:00', is_active: true },
    { day_of_week: 4, day_name: 'Jeudi', start_time: '08:00', end_time: '18:00', is_active: true },
    { day_of_week: 5, day_name: 'Vendredi', start_time: '08:00', end_time: '18:00', is_active: true },
    { day_of_week: 6, day_name: 'Samedi', start_time: '08:00', end_time: '18:00', is_active: true },
    { day_of_week: 7, day_name: 'Dimanche', start_time: '08:00', end_time: '18:00', is_active: false },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const availableModules = [
    { key: 'pos',           name: '🛒 Caisse Tactile (POS)' },
    { key: 'sales',         name: '🧾 Historique des Ventes' },
    { key: 'cash-sessions', name: '💵 Sessions de Caisse' },
    { key: 'catalog',       name: '📦 Catalogue Produits' },
    { key: 'stocks',        name: '📊 Stocks & Inventaire' },
    { key: 'purchases',     name: '🛍️ Achats & Approvisionnements' },
    { key: 'suppliers',     name: '🤝 Fournisseurs' },
    { key: 'customers',     name: '👥 Clients & Créances' },
    { key: 'transfers',     name: '🔄 Transferts Inter-Boutiques' },
    { key: 'reports',       name: '📈 Rapports & Statistiques' },
    { key: 'branches',      name: '🏪 Gestion des Boutiques' },
    { key: 'users-mgmt',    name: '🛡️ Personnel & Rôles' },
    { key: 'settings',      name: '⚙️ Paramètres système' },
  ];

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled([
        axios.get('/v1/access-zones'),
        axios.get('/v1/branches'),
      ]);
      const [zonesRes, branchesRes] = results;

      if (zonesRes.status === 'fulfilled') {
        const d = Array.isArray(zonesRes.value.data) ? zonesRes.value.data : (zonesRes.value.data?.data || []);
        setZones(d.length > 0 ? d : [
          { id: 1, name: 'Zone Totale Entreprise', description: 'Accès complet à toutes les boutiques et tous les modules', allowed_modules: ['*'] }
        ]);
      } else {
        setZones([
          { id: 1, name: 'Zone Totale Entreprise', description: 'Accès complet à toutes les boutiques et tous les modules', allowed_modules: ['*'] }
        ]);
      }

      if (branchesRes.status === 'fulfilled') {
        setBranches(Array.isArray(branchesRes.value.data) ? branchesRes.value.data : (branchesRes.value.data?.data || []));
      }
    } catch (err) {
      setError('Impossible de charger les zones d\'accès.');
    } finally {
      setLoading(false);
    }
  };

  const openForm = (z = null) => {
    setEditingZone(z);
    setZoneName(z ? z.name : '');
    setDescription(z ? z.description || '' : '');
    const savedBranches = (z && Array.isArray(z.branch_ids)) ? z.branch_ids.map(Number) : [];
    
    let savedModules = [];
    if (z && Array.isArray(z.allowed_modules)) {
      savedModules = [...z.allowed_modules];
      // Si la zone contient des anciens alias (ex: catalog sans stocks, pos sans sales/cash-sessions),
      // on étend les permissions automatiquement pour ne pas les verrouiller par inadvertance
      if (savedModules.includes('catalog') && !savedModules.includes('stocks')) savedModules.push('stocks');
      if (savedModules.includes('stocks') && !savedModules.includes('catalog')) savedModules.push('catalog');
      if (savedModules.includes('pos')) {
        if (!savedModules.includes('sales')) savedModules.push('sales');
        if (!savedModules.includes('cash-sessions')) savedModules.push('cash-sessions');
      }
    } else {
      // Par défaut pour une nouvelle zone, tout est coché
      savedModules = availableModules.map(m => m.key);
    }
    
    setSelectedBranches(savedBranches);
    setSelectedModules(savedModules);
    setShowForm(true);
    setError(null);
  };

  const toggleBranch = (bId) => {
    // Forcer la comparaison en nombre pour éviter les faux négatifs string vs int
    const numId = Number(bId);
    if (selectedBranches.map(Number).includes(numId)) {
      setSelectedBranches(selectedBranches.filter(id => Number(id) !== numId));
    } else {
      setSelectedBranches([...selectedBranches, numId]);
    }
  };

  const toggleModule = (modKey) => {
    if (selectedModules.includes(modKey)) {
      setSelectedModules(selectedModules.filter(k => k !== modKey));
    } else {
      setSelectedModules([...selectedModules, modKey]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: zoneName,
        description: description,
        branch_ids: selectedBranches.map(Number),
        allowed_modules: selectedModules,
        schedules: schedules.map(s => ({
          day_of_week: s.day_of_week,
          start_time: s.start_time.length === 5 ? `${s.start_time}:00` : s.start_time,
          end_time: s.end_time.length === 5 ? `${s.end_time}:00` : s.end_time,
          is_active: s.is_active,
        })),
      };

      if (editingZone) {
        await axios.put(`/v1/access-zones/${editingZone.id}`, payload);
      } else {
        await axios.post('/v1/access-zones', payload);
      }
      // ⚠️ IMPORTANT : on attend que loadData() ait TERMINÉ avant de fermer
      // le formulaire — sans ce await, l'utilisateur rouvrirait le formulaire
      // avec les ANCIENNES données (race condition).
      await loadData();
      window.dispatchEvent(new Event('access-zone-updated'));
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Erreur de sauvegarde de la zone d\'accès.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (z) => {
    if (!window.confirm(`Supprimer la zone d'accès "${z.name}" ?`)) return;
    setError(null);
    try {
      await axios.delete(`/v1/access-zones/${z.id}`);
      // Notifier l'app que les zones ont changé → force le refresh user
      window.dispatchEvent(new Event('access-zone-updated'));
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Impossible de supprimer cette zone.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px', width: '92%', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {!showForm ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 className="m-0"><i className="fa-solid fa-layer-group text-primary me-2"></i> Zones d'Accès du Personnel</h3>
                <p className="text-muted small m-0">Définissez les boutiques et périmètres fonctionnels où l'employé peut agir.</p>
              </div>
              <button onClick={() => openForm(null)} className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                <i className="fa-solid fa-plus me-1"></i> Créer une Zone d'Accès
              </button>
            </div>

            {error && <div className="error-banner mb-3"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}

            {loading ? (
              <div className="loading-spinner">Chargement des zones...</div>
            ) : (
              <div className="table-responsive">
                <table className="saas-table">
                  <thead>
                    <tr>
                      <th>Intitulé de la Zone</th>
                      <th>Boutiques Autorisées</th>
                      <th>Effectif</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zones.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-4">Aucune zone restreinte configurée (accès par défaut au rôle).</td>
                      </tr>
                    ) : (
                      zones.map(z => (
                        <tr key={z.id} className="hover-row">
                          <td>
                            <strong>{z.name}</strong>
                            <div className="text-muted small">{z.description || 'Aucune description'}</div>
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {z.branch_ids?.length || 0} boutique(s)
                            </span>
                          </td>
                          <td><strong>{z.users_count || 0} employé(s)</strong></td>
                          <td style={{ textAlign: 'right' }}>
                            <button onClick={() => openForm(z)} className="btn btn-secondary btn-sm me-1">
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button onClick={() => handleDelete(z)} className="btn btn-outline-danger btn-sm">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
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
              <h3 className="m-0">{editingZone ? `Modifier "${editingZone.name}"` : 'Nouvelle Zone d\'Accès'}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary btn-sm">← Annuler</button>
            </div>

            {error && <div className="error-banner mb-3"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}

            <form onSubmit={handleSave}>
              <div className="form-group mb-3">
                <label className="form-label" style={{ fontWeight: 700 }}>Nom de la Zone *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="Ex: Zone Caisse Cocody, Zone Magasinier Abidjan..."
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Précisez le périmètre d'action..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="m-0" style={{ fontWeight: 800 }}>Boutiques autorisées dans cette zone</h4>
                <button 
                  type="button" 
                  className="btn btn-link btn-sm p-0 text-decoration-none"
                  onClick={() => {
                    if (selectedBranches.length === branches.length) {
                      setSelectedBranches([]);
                    } else {
                      setSelectedBranches(branches.map(b => Number(b.id)));
                    }
                  }}
                >
                  {selectedBranches.length === branches.length ? '❌ Tout décocher' : '✅ Tout cocher'}
                </button>
              </div>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {branches.map(b => {
                  const isChecked = selectedBranches.map(Number).includes(Number(b.id));
                  return (
                    <label 
                      key={b.id}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: '8px 14px', 
                        borderRadius: '8px', 
                        border: isChecked ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                        background: isChecked ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-input)',
                        cursor: 'pointer' 
                      }}
                    >
                      <input type="checkbox" checked={isChecked} onChange={() => toggleBranch(b.id)} />
                      <strong style={{ fontSize: '13px' }}>{b.name}</strong>
                    </label>
                  );
                })}
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="m-0" style={{ fontWeight: 800 }}>Espaces fonctionnels autorisés</h4>
                <button 
                  type="button" 
                  className="btn btn-link btn-sm p-0 text-decoration-none"
                  onClick={() => {
                    if (selectedModules.length === availableModules.length) {
                      setSelectedModules([]);
                    } else {
                      setSelectedModules(availableModules.map(m => m.key));
                    }
                  }}
                >
                  {selectedModules.length === availableModules.length ? '❌ Tout décocher' : '✅ Tout cocher'}
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }} className="mb-4">
                {availableModules.map(mod => {
                  const isChecked = selectedModules.includes(mod.key);
                  return (
                    <label 
                      key={mod.key}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: '8px 12px', 
                        borderRadius: '8px', 
                        border: isChecked ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                        background: isChecked ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-input)',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      <input type="checkbox" checked={isChecked} onChange={() => toggleModule(mod.key)} />
                      <span>{mod.name}</span>
                    </label>
                  );
                })}
              </div>

              <div className="modal-actions d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-cancel">Annuler</button>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ fontWeight: 700 }}>
                  {saving ? 'Enregistrement...' : 'Enregistrer la Zone'}
                </button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
};
