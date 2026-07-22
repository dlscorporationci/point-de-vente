import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { CountUp } from '../components/CountUp';
import { RevenueLineChart, PaymentMethodsBarChart } from '../components/SaaSCharts';

export const BackOffice = () => {
  const { token, user } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('dashboard');
  const [metrics, setMetrics] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  
  // Entreprises
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [searchCompany, setSearchCompany] = useState('');
  const [filterCompanyStatus, setFilterCompanyStatus] = useState('');
  
  // Modales & Formulaires Entreprise
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  const [companyName, setCompanyName] = useState('');
  const [companyStatus, setCompanyStatus] = useState('active');

  // Utilisateurs
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedUserToReset, setSelectedUserToReset] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  // Maintenance & Système
  const [systemInfo, setSystemInfo] = useState(null);
  const [systemLoading, setSystemLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);

  // Messages
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const isSuperAdmin = user?.role === 'super-admin' || user?.role?.slug === 'super-admin' || user?.role?.name === 'super-admin';

  // 1. Charger le Dashboard SaaS
  const loadDashboard = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/v1/admin/dashboard');
      setMetrics(res.data.metrics);
      setRecentActivities(res.data.recent_activities || []);
    } catch (err) {
      setError("Erreur de chargement des métriques du dashboard SaaS.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Charger les entreprises
  const loadCompanies = async () => {
    if (!token) return;
    setCompaniesLoading(true);
    setError(null);
    try {
      const res = await axios.get('/v1/admin/companies');
      setCompanies(res.data.data || []);
    } catch (err) {
      setError("Erreur de chargement de la liste des entreprises.");
    } finally {
      setCompaniesLoading(false);
    }
  };

  // 3. Charger les utilisateurs
  const loadUsers = async () => {
    if (!token) return;
    setUsersLoading(true);
    setError(null);
    try {
      const res = await axios.get('/v1/admin/users');
      setUsers(res.data.data || []);
    } catch (err) {
      setError("Erreur de chargement des utilisateurs.");
    } finally {
      setUsersLoading(false);
    }
  };

  // 4. Charger l'état système
  const loadSystemInfo = async () => {
    if (!token) return;
    setSystemLoading(true);
    setError(null);
    try {
      const res = await axios.get('/v1/admin/system/status');
      setSystemInfo(res.data);
    } catch (err) {
      setError("Erreur de chargement des indicateurs système.");
    } finally {
      setSystemLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !isSuperAdmin) return;
    loadCompanies();
    if (activeSubTab === 'dashboard') loadDashboard();
    if (activeSubTab === 'companies') loadCompanies();
    if (activeSubTab === 'users') loadUsers();
    if (activeSubTab === 'system') loadSystemInfo();
  }, [token, activeSubTab]);

  // Actions Entreprise
  const handleCreateCompany = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.post('/v1/admin/companies', {
        name: companyName,
        status: companyStatus
      });
      setSuccess(`L'entreprise "${companyName}" a été enregistrée avec succès.`);
      setShowCreateCompanyModal(false);
      resetCompanyForm();
      loadCompanies();
      loadDashboard();
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de création de l'entreprise.");
    }
  };

  const handleEditCompany = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.post(`/v1/admin/companies/${selectedCompany.id}`, {
        name: companyName,
        status: companyStatus
      });
      setSuccess(`L'entreprise "${companyName}" a été mise à jour.`);
      setShowEditCompanyModal(false);
      resetCompanyForm();
      loadCompanies();
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'entreprise.");
    }
  };

  const openEditModal = (company) => {
    setSelectedCompany(company);
    setCompanyName(company.name);
    setCompanyStatus(company.status || 'active');
    setShowEditCompanyModal(true);
  };

  const toggleCompanyStatus = async (company) => {
    const nextStatus = company.status === 'active' ? 'inactive' : 'active';
    setError(null);
    setSuccess(null);
    try {
      await axios.post(`/v1/admin/companies/${company.id}`, { status: nextStatus });
      setSuccess(`Statut de l'entreprise "${company.name}" basculé vers "${nextStatus}".`);
      loadCompanies();
    } catch (err) {
      setError("Impossible de modifier le statut de l'entreprise.");
    }
  };

  const resetCompanyForm = () => {
    setCompanyName('');
    setCompanyPlan('basic');
    setCompanyExpiresAt('');
    setCompanyStatus('active');
    setSelectedCompany(null);
  };

  // Actions Utilisateurs
  const toggleUserStatus = async (userToToggle) => {
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post(`/v1/admin/users/${userToToggle.id}/toggle-status`);
      setSuccess(res.data.message);
      loadUsers();
    } catch (err) {
      setError("Impossible de modifier le statut de l'utilisateur.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== newPasswordConfirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await axios.post(`/v1/admin/users/${selectedUserToReset.id}/reset-password`, {
        password: newPassword,
        password_confirmation: newPasswordConfirm
      });
      setSuccess(`Le mot de passe de l'utilisateur ${selectedUserToReset.name} a été réinitialisé.`);
      setSelectedUserToReset(null);
      setNewPassword('');
      setNewPasswordConfirm('');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de réinitialisation.");
    }
  };

  // Maintenance & Backup
  const triggerBackup = async () => {
    setBackupLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post('/v1/admin/system/backup');
      setSuccess(`Sauvegarde réussie : Fichier ${res.data.backup_file} créé.`);
    } catch (err) {
      setError("Erreur de sauvegarde.");
    } finally {
      setBackupLoading(false);
    }
  };

  // Filtrage local des entreprises
  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchCompany.toLowerCase());
    const matchesStatus = filterCompanyStatus === '' || c.status === filterCompanyStatus;
    return matchesSearch && matchesStatus;
  });

  if (!token || !isSuperAdmin) {
    return (
      <div className="admin-container">
        <div className="alert-card card">
          <span style={{ fontSize: '40px' }}>🔒</span>
          <h3>Accès Réservé</h3>
          <p>Vous devez posséder les droits Super-Administrateur SaaS pour accéder à ce portail.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-layout card">
        
        {/* Header */}
        <div className="admin-header">
          <div>
            <h2><i className="fa-solid fa-gears text-primary me-2"></i> Console SaaS & Plateforme</h2>
            <p className="admin-subtitle">Portail de supervision, d'abonnements et de maintenance multi-entreprises.</p>
          </div>
          <div className="admin-subtabs">
            <button className={`subtab-btn ${activeSubTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveSubTab('dashboard')}>
              📊 Supervision
            </button>
            <button className={`subtab-btn ${activeSubTab === 'companies' ? 'active' : ''}`} onClick={() => setActiveSubTab('companies')}>
              🏢 Entreprises ({companies.length})
            </button>
            <button className={`subtab-btn ${activeSubTab === 'users' ? 'active' : ''}`} onClick={() => setActiveSubTab('users')}>
              👥 Utilisateurs
            </button>
            <button className={`subtab-btn ${activeSubTab === 'system' ? 'active' : ''}`} onClick={() => setActiveSubTab('system')}>
              ⚙️ Maintenance
            </button>
          </div>
        </div>

        {error && <div className="error-banner mb-3"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}
        {success && <div className="success-banner mb-3"><i className="fa-solid fa-circle-check me-1"></i> {success}</div>}

        {/* 1. TABLEAU DE BORD SUPERVISION */}
        {activeSubTab === 'dashboard' && (
          <div>
            {loading ? (
              <div className="loading-spinner">Calcul des indicateurs SaaS en cours...</div>
            ) : (
              <>
                <div className="admin-metrics-grid animate-fade-in">
                  <div className="metric-box">
                    <span className="metric-title">Entreprises Enregistrées</span>
                    <span className="metric-number">
                      <CountUp end={metrics?.companies_count || 0} format={false} />
                    </span>
                    <span className="kpi-badge up">
                      +{metrics?.new_signups_count || 0} ce mois-ci
                    </span>
                  </div>

                  <div className="metric-box">
                    <span className="metric-title">Entreprises Actives</span>
                    <span className="metric-number">
                      <CountUp end={metrics?.companies_active || 0} format={false} />
                    </span>
                    <span className="kpi-info-label" style={{ color: '#ef4444' }}>
                      {metrics?.companies_suspended || 0} suspendues
                    </span>
                  </div>

                  <div className="metric-box">
                    <span className="metric-title">Utilisateurs Globaux</span>
                    <span className="metric-number">
                      <CountUp end={metrics?.users_count || 0} format={false} />
                    </span>
                    <span className="kpi-info-label">
                      {metrics?.admins_count || 0} Administrateurs d'entreprises • {metrics?.employees_count || 0} Employés
                    </span>
                  </div>
                </div>

                {/* Timeline d'activité globale du SaaS */}
                <div className="admin-activity-grid mt-4">
                  <div className="activity-card card" style={{ gridColumn: 'span 2' }}>
                    <h3><i className="fa-solid fa-history text-primary me-2"></i> Journal d'activité globale de la plateforme</h3>
                    <div className="activity-timeline mt-3">
                      {recentActivities.length === 0 ? (
                        <p className="text-muted">Aucune activité enregistrée.</p>
                      ) : (
                        recentActivities.map((log) => (
                          <div className="timeline-item" key={log.id}>
                            <div className="timeline-icon bg-primary-light">
                              <i className="fa-solid fa-shield-halved text-primary"></i>
                            </div>
                            <div className="timeline-content">
                              <p className="timeline-text">
                                <strong>{log.user?.name || 'Système'}</strong> (Tenant ID: {log.company_id || 'Global'}) a effectué l'action <code>{log.action}</code> sur le module <code>{log.auditable_type.replace('App\\Models\\', '')}</code>
                              </p>
                              <span className="timeline-time">{new Date(log.created_at).toLocaleString('fr-FR')} • IP: {log.ip_address}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 2. GESTION DES ENTREPRISES */}
        {activeSubTab === 'companies' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="filters-bar" style={{ flexGrow: 1, marginRight: '20px' }}>
                <div className="filter-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher une entreprise..."
                    value={searchCompany}
                    onChange={(e) => setSearchCompany(e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <select className="form-control" value={filterCompanyStatus} onChange={(e) => setFilterCompanyStatus(e.target.value)}>
                    <option value="">Tous les statuts</option>
                    <option value="active">Actives</option>
                    <option value="inactive">Suspendues</option>
                  </select>
                </div>
              </div>
              <button onClick={() => { resetCompanyForm(); setShowCreateCompanyModal(true); }} className="btn btn-primary" style={{ height: '42px' }}>
                <i className="fa-solid fa-plus me-1"></i> Créer Entreprise
              </button>
            </div>

            {companiesLoading ? (
              <div className="loading-spinner">Chargement des entreprises...</div>
            ) : filteredCompanies.length === 0 ? (
              <div className="empty-state">
                <h4>Aucune entreprise trouvée</h4>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Entreprise</th>
                      <th>Points de Vente</th>
                      <th>Utilisateurs</th>
                      <th>Statut</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.map(c => (
                      <tr key={c.id} className="hover-row">
                        <td><strong>{c.name}</strong></td>
                        <td>{c.branches_count} boutiques</td>
                        <td>{c.users_count} comptes</td>
                        <td>
                          {c.status === 'active' ? (
                            <span className="badge badge-success">Actif</span>
                          ) : (
                            <span className="badge badge-error">Suspendu</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button onClick={() => openEditModal(c)} className="btn btn-secondary me-2 btn-sm">
                            <i className="fa-solid fa-pen"></i> Gérer
                          </button>
                          <button onClick={() => toggleCompanyStatus(c)} className={`btn btn-sm ${c.status === 'active' ? 'btn-danger' : 'btn-success'}`}>
                            {c.status === 'active' ? 'Suspendre' : 'Activer'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}



        {/* 4. GESTION DES UTILISATEURS */}
        {activeSubTab === 'users' && (
          <div>
            {usersLoading ? (
              <div className="loading-spinner">Chargement des utilisateurs de la plateforme...</div>
            ) : (
              <div className="table-responsive">
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Opérateur</th>
                      <th>Adresse E-mail</th>
                      <th>Entreprise</th>
                      <th>Rôle</th>
                      <th>Statut du compte</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="hover-row">
                        <td><strong>{u.name}</strong></td>
                        <td>{u.email}</td>
                        <td>{u.company?.name || <span className="badge badge-info">PLATEFORME SAAS</span>}</td>
                        <td>
                          <span className="badge bg-secondary">{u.role?.name || u.role?.slug || 'Utilisateur'}</span>
                        </td>
                        <td>
                          {u.status === 'active' ? (
                            <span className="badge badge-success">Actif</span>
                          ) : (
                            <span className="badge badge-error">Bloqué</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button onClick={() => setSelectedUserToReset(u)} className="btn btn-secondary me-2 btn-sm">
                            <i className="fa-solid fa-key me-1"></i> Mot de passe
                          </button>
                          {u.id !== user.id && (
                            <button onClick={() => toggleUserStatus(u)} className={`btn btn-sm ${u.status === 'active' ? 'btn-danger' : 'btn-success'}`}>
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
          </div>
        )}

        {/* 5. MAINTENANCE & SYSTEME */}
        {activeSubTab === 'system' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              <div className="card" style={{ padding: '24px' }}>
                <h3><i className="fa-solid fa-database text-primary me-2"></i> Outil de sauvegarde globale</h3>
                <p className="text-muted small mt-2">Générez un fichier compressé contenant un export SQL complet de l'application et les médias importés.</p>
                <div style={{ marginTop: '24px' }}>
                  <button onClick={triggerBackup} disabled={backupLoading} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    {backupLoading ? 'Création de la sauvegarde en cours...' : '🚀 Lancer une sauvegarde manuelle'}
                  </button>
                </div>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <h3><i className="fa-solid fa-server text-success me-2"></i> Indicateurs techniques réels</h3>
                {systemLoading || !systemInfo ? (
                  <p className="text-muted">Chargement de la santé du serveur...</p>
                ) : (
                  <div className="server-health-stats mt-3" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="d-flex justify-content-between">
                      <span>Espace Disque : <strong>{systemInfo.disk.used_gb} GB</strong> / {systemInfo.disk.total_gb} GB</span>
                      <strong>{systemInfo.disk.used_percent}%</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ '--target-width': `${systemInfo.disk.used_percent}%`, backgroundColor: '#f59e0b' }} />
                    </div>

                    <div className="d-flex justify-content-between">
                      <span>Processeur (CPU)</span>
                      <strong>{systemInfo.performance.cpu_load_percent}%</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ '--target-width': `${systemInfo.performance.cpu_load_percent}%`, backgroundColor: '#10b981' }} />
                    </div>

                    <div className="d-flex justify-content-between">
                      <span>Mémoire RAM</span>
                      <strong>{systemInfo.performance.memory_usage_percent}%</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ '--target-width': `${systemInfo.performance.memory_usage_percent}%`, backgroundColor: '#3b82f6' }} />
                    </div>

                    <div style={{ marginTop: '10px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div><strong>Version API Core :</strong> {systemInfo.core_version}</div>
                      <div><strong>Laravel :</strong> {systemInfo.laravel_version}</div>
                      <div><strong>PHP :</strong> {systemInfo.php_version}</div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>

      {/* MODALE : CREATION D'UNE ENTREPRISE */}
      {showCreateCompanyModal && (
        <div className="modal-overlay" onClick={() => setShowCreateCompanyModal(false)}>
          <div className="modal-card card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', textAlign: 'left' }}>
            <h3>Créer une entreprise sur la plateforme</h3>
            <form onSubmit={handleCreateCompany} style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">Nom de l'entreprise</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="Ex: Sunu Commerce"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              


              <div className="form-group">
                <label className="form-label">Statut Initial</label>
                <select className="form-control" value={companyStatus} onChange={(e) => setCompanyStatus(e.target.value)}>
                  <option value="active">Actif</option>
                  <option value="inactive">Suspendu</option>
                </select>
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                <button type="button" onClick={() => setShowCreateCompanyModal(false)} className="btn btn-cancel">Annuler</button>
                <button type="submit" className="btn btn-primary">Créer l'entreprise</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE : MODIFICATION D'UNE ENTREPRISE */}
      {showEditCompanyModal && (
        <div className="modal-overlay" onClick={() => setShowEditCompanyModal(false)}>
          <div className="modal-card card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', textAlign: 'left' }}>
            <h3>Gérer l'entreprise : {selectedCompany?.name}</h3>
            <form onSubmit={handleEditCompany} style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">Nom de l'entreprise</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              


              <div className="form-group">
                <label className="form-label">Statut</label>
                <select className="form-control" value={companyStatus} onChange={(e) => setCompanyStatus(e.target.value)}>
                  <option value="active">Actif (Accès autorisé)</option>
                  <option value="inactive">Suspendu (Accès bloqué)</option>
                </select>
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                <button type="button" onClick={() => setShowEditCompanyModal(false)} className="btn btn-cancel">Annuler</button>
                <button type="submit" className="btn btn-primary">Enregistrer les modifications</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE DE REINITIALISATION DE MOT DE PASSE UTILISATEUR */}
      {selectedUserToReset && (
        <div className="modal-overlay" onClick={() => setSelectedUserToReset(null)}>
          <div className="modal-card card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'left' }}>
            <h3>Réinitialiser le mot de passe</h3>
            <p className="text-muted small">Modification forcée du mot de passe pour <strong>{selectedUserToReset.name}</strong>.</p>
            <form onSubmit={handleResetPassword} style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">Nouveau mot de passe</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  placeholder="Min. 8 caractères"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirmer le mot de passe</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  placeholder="Confirmer"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                />
              </div>
              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                <button type="button" onClick={() => setSelectedUserToReset(null)} className="btn btn-cancel">Annuler</button>
                <button type="submit" className="btn btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .admin-layout {
          width: 100%;
          max-width: 1200px;
          padding: 32px;
          margin-top: 100px;
          text-align: left;
        }

        .admin-header {
          display: flex;
          flex-direction: column;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
        }

        .admin-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        .admin-subtabs {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          flex-wrap: wrap;
        }

        .subtab-btn {
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-muted);
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .subtab-btn:hover, .subtab-btn.active {
          color: var(--text-main);
          background: var(--bg-input);
          border-color: var(--text-main);
        }

        .admin-metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .metric-box {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .metric-title {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }

        .metric-number {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-main);
        }

        .kpi-badge {
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          align-self: flex-start;
        }

        .kpi-badge.up {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .kpi-info-label {
          font-size: 11px;
          color: var(--text-muted);
        }

        .admin-charts-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .admin-charts-grid {
            grid-template-columns: 1fr;
          }
        }

        .admin-activity-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .activity-timeline {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .timeline-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .timeline-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        .bg-primary-light { background: rgba(59, 130, 246, 0.15); }

        .timeline-content {
          text-align: left;
        }

        .timeline-text {
          font-size: 13px;
          color: var(--text-main);
          margin-bottom: 2px;
        }

        .timeline-time {
          font-size: 11px;
          color: var(--text-muted);
        }

        .server-health-stats {
          text-align: left;
        }

        .server-health-stats span {
          font-size: 13px;
          color: var(--text-muted);
        }

        .server-health-stats strong {
          color: var(--text-main);
        }
      `}</style>
    </div>
  );
};
