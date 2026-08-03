import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { PasswordInput } from '../components/PasswordInput';
import { CountUp } from '../components/CountUp';
import { AuditLogs } from './AuditLogs';
import { ExportModal } from '../components/ExportModal';

export const BackOffice = () => {
  const { token, user } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('dashboard');
  const [metrics, setMetrics] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  
  // ── FORMULES & OFFRES D'ABONNEMENT (PLANS) ──
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [planName, setPlanName] = useState('');
  const [planSlug, setPlanSlug] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [planPriceMonthly, setPlanPriceMonthly] = useState(0);
  const [planPriceYearly, setPlanPriceYearly] = useState(0);
  const [planMaxBranches, setPlanMaxBranches] = useState(1);
  const [planMaxUsers, setPlanMaxUsers] = useState(3);
  const [planMaxProducts, setPlanMaxProducts] = useState(1000);
  const [planFeaturesText, setPlanFeaturesText] = useState('');
  const [planIsActive, setPlanIsActive] = useState(true);
  const [planIsPopular, setPlanIsPopular] = useState(false);

  // ── ENTREPRISES ──
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [searchCompany, setSearchCompany] = useState('');
  const [filterCompanyStatus, setFilterCompanyStatus] = useState('');
  const [filterCompanyPlan, setFilterCompanyPlan] = useState('');
  
  // Modales & Formulaires Entreprise
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  const [companyName, setCompanyName] = useState('');
  const [companyPlan, setCompanyPlan] = useState('pro');
  const [companyExpiresAt, setCompanyExpiresAt] = useState('');
  const [companyStatus, setCompanyStatus] = useState('active');

  // ── UTILISATEURS GLOBATION ──
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedUserToReset, setSelectedUserToReset] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  // ── MAINTENANCE & SYSTÈME ──
  const [systemInfo, setSystemInfo] = useState(null);
  const [systemLoading, setSystemLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);

  // ── MESSAGES ET ÉTATS ──
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // ── EXPORTS DOCUMENTAIRES SAAS ──
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState('saas_metrics');
  const [exportTitle, setExportTitle] = useState('Supervision SaaS');

  const isSuperAdmin = user?.role === 'super-admin' || user?.role?.slug === 'super-admin' || user?.role?.name === 'super-admin' || user?.email === 'superadmin@dls.com';

  // 1. Charger le Dashboard SaaS
  const loadDashboard = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get('/v1/admin/dashboard');
      if (res.data && res.data.metrics) {
        setMetrics(res.data.metrics);
        setRecentActivities(res.data.recent_activities || []);
      }
    } catch (err) {
      console.error("Dashboard SaaS error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Charger les Formules d'Abonnement (Plans)
  const loadPlans = async () => {
    if (!token) return;
    setPlansLoading(true);
    try {
      const res = await axios.get('/v1/admin/plans');
      setPlans(res.data || []);
    } catch (err) {
      console.error("Plans load error:", err);
    } finally {
      setPlansLoading(false);
    }
  };

  // 3. Charger les Entreprises (Tenants)
  const loadCompanies = async () => {
    if (!token) return;
    setCompaniesLoading(true);
    try {
      let res;
      try {
        res = await axios.get('/v1/admin/companies');
      } catch (e) {
        res = await axios.get('/v1/auth/companies');
      }
      const list = Array.isArray(res.data) ? res.data : (res.data.data || res.data.companies || res.data || []);
      setCompanies(list);
      setError(null);
    } catch (err) {
      console.error("Companies load error:", err);
    } finally {
      setCompaniesLoading(false);
    }
  };

  // 4. Charger les Utilisateurs Globaux
  const loadUsers = async () => {
    if (!token) return;
    setUsersLoading(true);
    try {
      const res = await axios.get('/v1/admin/users');
      const list = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setUsers(list);
    } catch (err) {
      console.error("Users load error:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  // 5. Charger l'état système
  const loadSystemInfo = async () => {
    if (!token) return;
    setSystemLoading(true);
    try {
      const res = await axios.get('/v1/admin/system/status');
      setSystemInfo(res.data);
    } catch (err) {
      console.error("System info error:", err);
    } finally {
      setSystemLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !isSuperAdmin) return;
    loadPlans();
    loadCompanies();
    if (activeSubTab === 'dashboard') loadDashboard();
    if (activeSubTab === 'plans') loadPlans();
    if (activeSubTab === 'companies') loadCompanies();
    if (activeSubTab === 'users') loadUsers();
    if (activeSubTab === 'system') loadSystemInfo();
  }, [token, activeSubTab]);

  // ── GESTION DES FORMULES (PLANS) ──
  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const featuresArray = planFeaturesText.split('\n').map(f => f.trim()).filter(Boolean);
      await axios.post('/v1/admin/plans', {
        name: planName,
        slug: planSlug || planName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        description: planDescription,
        price_monthly: parseFloat(planPriceMonthly) || 0,
        price_yearly: parseFloat(planPriceYearly) || 0,
        max_branches: parseInt(planMaxBranches) || 1,
        max_users: parseInt(planMaxUsers) || 3,
        max_products: parseInt(planMaxProducts) || 1000,
        features: featuresArray,
        is_active: planIsActive,
        is_popular: planIsPopular
      });
      setSuccess(`La formule "${planName}" a été créée avec succès.`);
      setShowCreatePlanModal(false);
      resetPlanForm();
      loadPlans();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Erreur de création de la formule.");
    }
  };

  const handleEditPlan = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const featuresArray = planFeaturesText.split('\n').map(f => f.trim()).filter(Boolean);
      await axios.put(`/v1/admin/plans/${selectedPlan.id}`, {
        name: planName,
        slug: planSlug,
        description: planDescription,
        price_monthly: parseFloat(planPriceMonthly) || 0,
        price_yearly: parseFloat(planPriceYearly) || 0,
        max_branches: parseInt(planMaxBranches) || 1,
        max_users: parseInt(planMaxUsers) || 3,
        max_products: parseInt(planMaxProducts) || 1000,
        features: featuresArray,
        is_active: planIsActive,
        is_popular: planIsPopular
      });
      setSuccess(`La formule "${planName}" a été mise à jour.`);
      setShowEditPlanModal(false);
      resetPlanForm();
      loadPlans();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Erreur de modification de la formule.");
    }
  };

  const handleDeletePlan = async (plan) => {
    if (!window.confirm(`Supprimer la formule "${plan.name}" ?Cette action est irréversible.`)) return;
    setError(null);
    setSuccess(null);
    try {
      await axios.delete(`/v1/admin/plans/${plan.id}`);
      setSuccess(`Formule "${plan.name}" supprimée.`);
      loadPlans();
    } catch (err) {
      setError("Impossible de supprimer cette formule d'abonnement.");
    }
  };

  const openEditPlanModal = (p) => {
    setSelectedPlan(p);
    setPlanName(p.name);
    setPlanSlug(p.slug);
    setPlanDescription(p.description || '');
    setPlanPriceMonthly(p.price_monthly || 0);
    setPlanPriceYearly(p.price_yearly || 0);
    setPlanMaxBranches(p.max_branches || 1);
    setPlanMaxUsers(p.max_users || 3);
    setPlanMaxProducts(p.max_products || 1000);
    setPlanFeaturesText(Array.isArray(p.features) ? p.features.join('\n') : '');
    setPlanIsActive(p.is_active !== false);
    setPlanIsPopular(!!p.is_popular);
    setShowEditPlanModal(true);
  };

  const resetPlanForm = () => {
    setPlanName('');
    setPlanSlug('');
    setPlanDescription('');
    setPlanPriceMonthly(0);
    setPlanPriceYearly(0);
    setPlanMaxBranches(1);
    setPlanMaxUsers(3);
    setPlanMaxProducts(1000);
    setPlanFeaturesText('');
    setPlanIsActive(true);
    setPlanIsPopular(false);
    setSelectedPlan(null);
  };

  // ── GESTION DES ENTREPRISES (TENANTS) ──
  const handleCreateCompany = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.post('/v1/admin/companies', {
        name: companyName,
        status: companyStatus,
        subscription_plan: companyPlan,
        subscription_expires_at: companyExpiresAt || null
      });
      setSuccess(`L'entreprise "${companyName}" a été enregistrée sous la formule ${companyPlan.toUpperCase()}.`);
      setShowCreateCompanyModal(false);
      resetCompanyForm();
      loadCompanies();
      loadDashboard();
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création de l'entreprise.");
    }
  };

  const handleEditCompany = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.post(`/v1/admin/companies/${selectedCompany.id}`, {
        name: companyName,
        status: companyStatus,
        subscription_plan: companyPlan,
        subscription_expires_at: companyExpiresAt || null
      });
      setSuccess(`L'entreprise "${companyName}" a été mise à jour avec succès.`);
      setShowEditCompanyModal(false);
      resetCompanyForm();
      loadCompanies();
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'entreprise.");
    }
  };

  const openEditCompanyModal = (company) => {
    setSelectedCompany(company);
    setCompanyName(company.name);
    setCompanyStatus(company.status || 'active');
    setCompanyPlan(company.subscription_plan || 'pro');
    setCompanyExpiresAt(company.subscription_expires_at ? company.subscription_expires_at.split('T')[0] : '');
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
    setCompanyPlan('pro');
    setCompanyExpiresAt('');
    setCompanyStatus('active');
    setSelectedCompany(null);
  };

  // ── GESTION DES MOTS DE PASSE & MAINTENANCE ──
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== newPasswordConfirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setError(null);
    setSuccess(null);
    try {
      await axios.post(`/v1/admin/users/${selectedUserToReset.id}/reset-password`, {
        password: newPassword,
        password_confirmation: newPasswordConfirm
      });
      setSuccess(`Mot de passe réinitialisé pour l'utilisateur ${selectedUserToReset.name}.`);
      setSelectedUserToReset(null);
      setNewPassword('');
      setNewPasswordConfirm('');
    } catch (err) {
      setError("Erreur lors de la réinitialisation du mot de passe.");
    }
  };

  const toggleUserStatus = async (targetUser) => {
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post(`/v1/admin/users/${targetUser.id}/toggle-status`);
      setSuccess(res.data.message);
      loadUsers();
    } catch (err) {
      setError("Impossible de modifier le statut de l'utilisateur.");
    }
  };

  const triggerBackup = async () => {
    setBackupLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post('/v1/admin/backups/generate');
      setSuccess(`Sauvegarde réussie : Fichier ${res.data.backup_file} créé (${res.data.size}).`);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Erreur de sauvegarde.");
    } finally {
      setBackupLoading(false);
    }
  };

  // Filtrage local des entreprises
  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchCompany.toLowerCase()) || (c.code && c.code.toLowerCase().includes(searchCompany.toLowerCase()));
    const matchesStatus = filterCompanyStatus === '' || c.status === filterCompanyStatus;
    const plan = c.subscription_plan || 'starter';
    const matchesPlan = filterCompanyPlan === '' || plan === filterCompanyPlan;
    return matchesSearch && matchesStatus && matchesPlan;
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
        
        {/* Header Backoffice */}
        <div className="admin-header">
          <div>
            <h2><i className="fa-solid fa-gears text-primary me-2"></i> Console SaaS & Offres</h2>
            <p className="admin-subtitle">Portail de supervision, d'abonnements et de gestion des entreprises de la plateforme.</p>
          </div>
          <div className="admin-subtabs">
            <button className={`subtab-btn ${activeSubTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveSubTab('dashboard')}>
              📊 Supervision
            </button>
            <button className={`subtab-btn ${activeSubTab === 'companies' ? 'active' : ''}`} onClick={() => setActiveSubTab('companies')}>
              🏢 Entreprises ({companies.length})
            </button>
            <button className={`subtab-btn ${activeSubTab === 'plans' ? 'active' : ''}`} onClick={() => setActiveSubTab('plans')}>
              💎 Formules & Offres ({plans.length})
            </button>
            <button className={`subtab-btn ${activeSubTab === 'users' ? 'active' : ''}`} onClick={() => setActiveSubTab('users')}>
              👥 Utilisateurs
            </button>
            <button className={`subtab-btn ${activeSubTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveSubTab('audit')}>
              🛡️ Journal d'Audit
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
                <div className="d-flex justify-content-end mb-3">
                  <button onClick={() => { setExportType('saas_metrics'); setExportTitle('Supervision & Bilan SaaS'); setShowExportModal(true); }} className="btn btn-outline-secondary btn-sm" style={{ fontWeight: 700 }}>
                    <i className="fa-solid fa-file-export me-1"></i> Exporter Bilan Supervision
                  </button>
                </div>
                <div className="admin-metrics-grid animate-fade-in">
                  <div className="metric-box">
                    <span className="metric-title">Entreprises Enregistrées</span>
                    <span className="metric-number">
                      <CountUp end={metrics?.companies_count || 0} format={false} />
                    </span>
                    <span className="kpi-badge up">{metrics?.companies_active || 0} actives</span>
                  </div>

                  <div className="metric-box">
                    <span className="metric-title">Comptes Opérateurs</span>
                    <span className="metric-number">
                      <CountUp end={metrics?.users_count || 0} format={false} />
                    </span>
                    <span className="kpi-badge neutral">{metrics?.admins_count || 0} admins</span>
                  </div>

                  <div className="metric-box">
                    <span className="metric-title">Inscriptions du Mois</span>
                    <span className="metric-number">
                      <CountUp end={metrics?.new_signups_count || 0} format={false} />
                    </span>
                    <span className="kpi-badge up">+ Ce mois</span>
                  </div>

                  <div className="metric-box">
                    <span className="metric-title">Formules Actives</span>
                    <span className="metric-number">
                      <CountUp end={plans.length} format={false} />
                    </span>
                    <span className="kpi-badge up">Offres SaaS</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="card" style={{ padding: '20px' }}>
                    <h4><i className="fa-solid fa-clock-rotate-left text-primary me-2"></i> Activités système récentes</h4>
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
                                <strong>{log.user?.name || 'Système'}</strong> (Tenant ID: {log.company_id || 'Global'}) a effectué <code>{log.action}</code>
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
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap" style={{ gap: '16px' }}>
              <div className="filters-bar" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
                <div className="filter-group" style={{ minWidth: '220px', flex: '1 1 220px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher par nom ou code entreprise..."
                    value={searchCompany}
                    onChange={(e) => setSearchCompany(e.target.value)}
                  />
                </div>
                <div className="filter-group" style={{ minWidth: '160px' }}>
                  <select className="form-control" value={filterCompanyStatus} onChange={(e) => setFilterCompanyStatus(e.target.value)}>
                    <option value="">Tous les statuts</option>
                    <option value="active">Actives</option>
                    <option value="inactive">Suspendues</option>
                  </select>
                </div>
                <div className="filter-group" style={{ minWidth: '180px' }}>
                  <select className="form-control" value={filterCompanyPlan} onChange={(e) => setFilterCompanyPlan(e.target.value)}>
                    <option value="">Toutes les formules</option>
                    {plans.map(p => (
                      <option key={p.id} value={p.slug}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setExportType('companies_list'); setExportTitle('Répertoire des Entreprises'); setShowExportModal(true); }} className="btn btn-outline-secondary" style={{ height: '42px', whiteSpace: 'nowrap', fontWeight: 700 }}>
                  <i className="fa-solid fa-file-export me-1"></i> Exporter Entreprises
                </button>
                <button onClick={() => { resetCompanyForm(); setShowCreateCompanyModal(true); }} className="btn btn-primary" style={{ height: '42px', whiteSpace: 'nowrap' }}>
                  <i className="fa-solid fa-plus me-1"></i> Créer Entreprise
                </button>
              </div>
            </div>

            {companiesLoading ? (
              <div className="loading-spinner">Chargement des entreprises...</div>
            ) : filteredCompanies.length === 0 ? (
              <div className="empty-state">
                <h4>Aucune entreprise trouvée</h4>
              </div>
            ) : (
              <div className="table-responsive" style={{ paddingBottom: '10px' }}>
                <table className="saas-table">
                  <thead>
                    <tr>
                      <th>Entreprise & Code POS</th>
                      <th>Formule d'Abonnement</th>
                      <th>Boutiques</th>
                      <th>Comptes</th>
                      <th>Statut</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.map(c => {
                      const matchedPlan = plans.find(p => p.slug === c.subscription_plan);
                      return (
                        <tr key={c.id} className="hover-row">
                          <td>
                            <strong style={{ fontSize: '15px' }}>{c.name}</strong>
                            <div className="text-muted" style={{ fontSize: '12px', marginTop: '2px', fontFamily: 'monospace' }}>
                              🔑 Code: <strong>{c.code}</strong>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-primary" style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px' }}>
                              {matchedPlan ? matchedPlan.name : (c.subscription_plan || 'Starter').toUpperCase()}
                            </span>
                            {c.subscription_expires_at && (
                              <div className="text-muted small mt-1">
                                Expire le: {new Date(c.subscription_expires_at).toLocaleDateString('fr-FR')}
                              </div>
                            )}
                          </td>
                          <td style={{ fontWeight: 600 }}>{c.branches_count} boutiques</td>
                          <td style={{ fontWeight: 600 }}>{c.users_count} utilisateurs</td>
                          <td>
                            {c.status === 'active' ? (
                              <span className="badge badge-success" style={{ padding: '6px 12px' }}>Actif</span>
                            ) : (
                              <span className="badge badge-error" style={{ padding: '6px 12px' }}>Suspendu</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button onClick={() => openEditCompanyModal(c)} className="btn btn-secondary me-2 btn-sm" style={{ padding: '8px 14px' }}>
                              <i className="fa-solid fa-pen me-1"></i> Gérer
                            </button>
                            <button onClick={() => toggleCompanyStatus(c)} className={`btn btn-sm ${c.status === 'active' ? 'btn-danger' : 'btn-success'}`} style={{ padding: '8px 14px' }}>
                              {c.status === 'active' ? 'Suspendre' : 'Activer'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 3. GESTION DYNAMIQUE DES FORMULES & OFFRES D'ABONNEMENT */}
        {activeSubTab === 'plans' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap" style={{ gap: '16px' }}>
              <div>
                <h3 className="m-0" style={{ fontWeight: 800 }}>Formules & Offres d'Abonnement SaaS</h3>
                <p className="text-muted small m-0">Créez et personnalisez les détails de chaque formule (prix, nombre de boutiques autorisées, limites et fonctionnalités).</p>
              </div>
              <button 
                onClick={() => { resetPlanForm(); setShowCreatePlanModal(true); }} 
                className="btn btn-primary"
                style={{ height: '42px', fontWeight: 700 }}
              >
                <i className="fa-solid fa-plus me-1"></i> Nouvelle Formule d'Abonnement
              </button>
            </div>

            {plansLoading ? (
              <div className="loading-spinner">Chargement des formules d'abonnement...</div>
            ) : (
              <div className="plans-grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {plans.map(p => (
                  <div key={p.id} className={`plan-card card ${p.is_popular ? 'border-primary' : ''}`} style={{ padding: '24px', position: 'relative', background: 'var(--bg-card)', borderRadius: '16px', border: p.is_popular ? '2px solid var(--color-primary)' : '1px solid var(--border-color)' }}>
                    {p.is_popular && (
                      <span className="badge bg-primary" style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '11px', padding: '4px 10px' }}>
                        POPULAIRE
                      </span>
                    )}

                    <h4 style={{ fontWeight: 800, fontSize: '20px', marginBottom: '6px' }}>{p.name}</h4>
                    <span className="text-muted small d-block mb-3" style={{ fontFamily: 'monospace' }}>Slug: {p.slug}</span>
                    <p className="text-muted" style={{ fontSize: '13px', minHeight: '38px' }}>{p.description || 'Aucune description spécifiée.'}</p>

                    <div className="plan-price-box my-3" style={{ background: 'var(--bg-input, #f8fafc)', padding: '14px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)' }}>
                        {(p.price_monthly || 0).toLocaleString('fr-FR')} XOF <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>/ mois</span>
                      </div>
                      <div className="text-muted small mt-1">
                        Ou {(p.price_yearly || 0).toLocaleString('fr-FR')} XOF / an
                      </div>
                    </div>

                    <div className="plan-quotas-list mb-3" style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="d-flex justify-content-between">
                        <span>🏬 Boutiques autorisées :</span>
                        <strong>{p.max_branches >= 999 ? 'Illimité' : `${p.max_branches} boutique(s)`}</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>👤 Comptes utilisateurs :</span>
                        <strong>{p.max_users >= 999 ? 'Illimité' : `${p.max_users} comptes`}</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>📦 Produits au catalogue :</span>
                        <strong>{p.max_products >= 999999 ? 'Illimité' : `${p.max_products} articles`}</strong>
                      </div>
                    </div>

                    {Array.isArray(p.features) && p.features.length > 0 && (
                      <div className="plan-features-box mb-4">
                        <strong className="d-block mb-2 text-muted" style={{ fontSize: '11px', uppercase: 'uppercase' }}>Inclus dans l'offre :</strong>
                        <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: 'var(--text-main)' }}>
                          {p.features.map((feat, idx) => (
                            <li key={idx} style={{ marginBottom: '4px' }}>{feat}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="d-flex gap-2 mt-auto">
                      <button 
                        onClick={() => openEditPlanModal(p)} 
                        className="btn btn-outline-primary flex-1 btn-sm"
                        style={{ fontWeight: 700 }}
                      >
                        <i className="fa-solid fa-pen me-1"></i> Modifier
                      </button>
                      <button 
                        onClick={() => handleDeletePlan(p)} 
                        className="btn btn-outline-danger btn-sm"
                        style={{ fontWeight: 700 }}
                      >
                        <i className="fa-solid fa-trash me-1"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. GESTION DES UTILISATEURS */}
        {activeSubTab === 'users' && (
          <div>
            <div className="d-flex justify-content-end mb-3">
              <button onClick={() => { setExportType('users_list'); setExportTitle('Répertoire des Utilisateurs'); setShowExportModal(true); }} className="btn btn-outline-secondary" style={{ fontWeight: 700 }}>
                <i className="fa-solid fa-file-export me-1"></i> Exporter Utilisateurs
              </button>
            </div>
            {usersLoading ? (
              <div className="loading-spinner">Chargement des utilisateurs de la plateforme...</div>
            ) : (
              <div className="table-responsive" style={{ paddingBottom: '10px' }}>
                <table className="saas-table">
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

        {/* 5. MAINTENANCE & SYSTÈME */}
        {activeSubTab === 'system' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <h3><i className="fa-solid fa-database text-primary me-2"></i> Sauvegarde globale SQL</h3>
                <p className="text-muted small mt-2">Générez un export SQL complet de l'ensemble de la base de données multi-entreprises.</p>
                <div style={{ marginTop: '24px' }}>
                  <button onClick={triggerBackup} disabled={backupLoading} className="btn btn-primary">
                    {backupLoading ? 'Création de la sauvegarde en cours...' : '🚀 Lancer une sauvegarde manuelle'}
                  </button>
                </div>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <h3><i className="fa-solid fa-server text-success me-2"></i> Santé de l'infrastructure</h3>
                {systemLoading || !systemInfo ? (
                  <p className="text-muted">Chargement de la santé du serveur...</p>
                ) : (
                  <div className="server-health-stats mt-3" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="d-flex justify-content-between">
                      <span>Espace Disque : <strong>{systemInfo.disk.used_gb} GB</strong> / {systemInfo.disk.total_gb} GB</span>
                      <strong>{systemInfo.disk.used_percent}%</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Processeur (CPU)</span>
                      <strong>{systemInfo.performance.cpu_load_percent}%</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Mémoire RAM</span>
                      <strong>{systemInfo.performance.memory_usage_percent}%</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 6. LOGS D'AUDIT GLOBAL */}
        {activeSubTab === 'audit' && (
          <div className="mt-3">
            <AuditLogs />
          </div>
        )}

      </div>

      {/* ── MODALE : CRÉER UNE FORMULE D'ABONNEMENT ── */}
      {showCreatePlanModal && (
        <div className="modal-overlay" onClick={() => setShowCreatePlanModal(false)}>
          <div className="modal-card card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px', textAlign: 'left' }}>
            <h3>Créer une nouvelle Formule d'Abonnement</h3>
            <form onSubmit={handleCreatePlan} style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="row">
                <div className="col-md-6 form-group">
                  <label className="form-label">Nom de la formule *</label>
                  <input type="text" className="form-control" required placeholder="Ex: Offre Franchise Pro" value={planName} onChange={e => setPlanName(e.target.value)} />
                </div>
                <div className="col-md-6 form-group">
                  <label className="form-label">Identifiant (Slug) *</label>
                  <input type="text" className="form-control" required placeholder="Ex: pro_franchise" value={planSlug} onChange={e => setPlanSlug(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description de l'offre</label>
                <textarea className="form-control" rows="2" placeholder="Description affichée sur la tarification..." value={planDescription} onChange={e => setPlanDescription(e.target.value)}></textarea>
              </div>

              <div className="row">
                <div className="col-md-6 form-group">
                  <label className="form-label">Prix Mensuel (XOF) *</label>
                  <input type="number" className="form-control" min="0" required value={planPriceMonthly} onChange={e => setPlanPriceMonthly(e.target.value)} />
                </div>
                <div className="col-md-6 form-group">
                  <label className="form-label">Prix Annuel (XOF) *</label>
                  <input type="number" className="form-control" min="0" required value={planPriceYearly} onChange={e => setPlanPriceYearly(e.target.value)} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 form-group">
                  <label className="form-label">Max Boutiques *</label>
                  <input type="number" className="form-control" min="1" required value={planMaxBranches} onChange={e => setPlanMaxBranches(e.target.value)} title="Saisir 999 pour illimité" />
                </div>
                <div className="col-md-4 form-group">
                  <label className="form-label">Max Utilisateurs *</label>
                  <input type="number" className="form-control" min="1" required value={planMaxUsers} onChange={e => setPlanMaxUsers(e.target.value)} />
                </div>
                <div className="col-md-4 form-group">
                  <label className="form-label">Max Articles *</label>
                  <input type="number" className="form-control" min="1" required value={planMaxProducts} onChange={e => setPlanMaxProducts(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Fonctionnalités incluses (1 par ligne)</label>
                <textarea className="form-control" rows="3" placeholder="5 Boutiques autorisées&#10;Gestion de stock avancée&#10;Support VIP 24/7" value={planFeaturesText} onChange={e => setPlanFeaturesText(e.target.value)}></textarea>
              </div>

              <div className="d-flex gap-4">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                  <input type="checkbox" checked={planIsActive} onChange={e => setPlanIsActive(e.target.checked)} /> Offre active
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                  <input type="checkbox" checked={planIsPopular} onChange={e => setPlanIsPopular(e.target.checked)} /> Badge Populaire
                </label>
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                <button type="button" onClick={() => setShowCreatePlanModal(false)} className="btn btn-cancel">Annuler</button>
                <button type="submit" className="btn btn-primary">Créer la formule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODALE : MODIFIER UNE FORMULE D'ABONNEMENT ── */}
      {showEditPlanModal && (
        <div className="modal-overlay" onClick={() => setShowEditPlanModal(false)}>
          <div className="modal-card card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px', textAlign: 'left' }}>
            <h3>Modifier la Formule : {selectedPlan?.name}</h3>
            <form onSubmit={handleEditPlan} style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="row">
                <div className="col-md-6 form-group">
                  <label className="form-label">Nom de la formule *</label>
                  <input type="text" className="form-control" required value={planName} onChange={e => setPlanName(e.target.value)} />
                </div>
                <div className="col-md-6 form-group">
                  <label className="form-label">Identifiant (Slug) *</label>
                  <input type="text" className="form-control" required value={planSlug} onChange={e => setPlanSlug(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description de l'offre</label>
                <textarea className="form-control" rows="2" value={planDescription} onChange={e => setPlanDescription(e.target.value)}></textarea>
              </div>

              <div className="row">
                <div className="col-md-6 form-group">
                  <label className="form-label">Prix Mensuel (XOF) *</label>
                  <input type="number" className="form-control" min="0" required value={planPriceMonthly} onChange={e => setPlanPriceMonthly(e.target.value)} />
                </div>
                <div className="col-md-6 form-group">
                  <label className="form-label">Prix Annuel (XOF) *</label>
                  <input type="number" className="form-control" min="0" required value={planPriceYearly} onChange={e => setPlanPriceYearly(e.target.value)} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 form-group">
                  <label className="form-label">Max Boutiques *</label>
                  <input type="number" className="form-control" min="1" required value={planMaxBranches} onChange={e => setPlanMaxBranches(e.target.value)} />
                </div>
                <div className="col-md-4 form-group">
                  <label className="form-label">Max Utilisateurs *</label>
                  <input type="number" className="form-control" min="1" required value={planMaxUsers} onChange={e => setPlanMaxUsers(e.target.value)} />
                </div>
                <div className="col-md-4 form-group">
                  <label className="form-label">Max Articles *</label>
                  <input type="number" className="form-control" min="1" required value={planMaxProducts} onChange={e => setPlanMaxProducts(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Fonctionnalités incluses (1 par ligne)</label>
                <textarea className="form-control" rows="3" value={planFeaturesText} onChange={e => setPlanFeaturesText(e.target.value)}></textarea>
              </div>

              <div className="d-flex gap-4">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                  <input type="checkbox" checked={planIsActive} onChange={e => setPlanIsActive(e.target.checked)} /> Offre active
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                  <input type="checkbox" checked={planIsPopular} onChange={e => setPlanIsPopular(e.target.checked)} /> Badge Populaire
                </label>
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                <button type="button" onClick={() => setShowEditPlanModal(false)} className="btn btn-cancel">Annuler</button>
                <button type="submit" className="btn btn-primary">Enregistrer les modifications</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODALE : CRÉATION D'UNE ENTREPRISE ── */}
      {showCreateCompanyModal && (
        <div className="modal-overlay" onClick={() => setShowCreateCompanyModal(false)}>
          <div className="modal-card card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', textAlign: 'left' }}>
            <h3>Créer une entreprise sur la plateforme</h3>
            <form onSubmit={handleCreateCompany} style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">Nom de l'entreprise *</label>
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
                <label className="form-label">Formule d'Abonnement (Plan) *</label>
                <select className="form-control" value={companyPlan} onChange={(e) => setCompanyPlan(e.target.value)}>
                  {plans.map(p => (
                    <option key={p.id} value={p.slug}>
                      {p.name} ({p.max_branches >= 999 ? 'Illimité' : `${p.max_branches} boutique(s)`} - {p.price_monthly.toLocaleString('fr-FR')} XOF/mois)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date d'expiration de l'abonnement (optionnel)</label>
                <input
                  type="date"
                  className="form-control"
                  value={companyExpiresAt}
                  onChange={(e) => setCompanyExpiresAt(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Statut Initial</label>
                <select className="form-control" value={companyStatus} onChange={(e) => setCompanyStatus(e.target.value)}>
                  <option value="active">Actif (Accès autorisé)</option>
                  <option value="inactive">Suspendu (Accès bloqué)</option>
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

      {/* ── MODALE : MODIFICATION D'UNE ENTREPRISE ── */}
      {showEditCompanyModal && (
        <div className="modal-overlay" onClick={() => setShowEditCompanyModal(false)}>
          <div className="modal-card card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', textAlign: 'left' }}>
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
                <label className="form-label">Formule d'Abonnement (Plan)</label>
                <select className="form-control" value={companyPlan} onChange={(e) => setCompanyPlan(e.target.value)}>
                  {plans.map(p => (
                    <option key={p.id} value={p.slug}>
                      {p.name} ({p.max_branches >= 999 ? 'Illimité' : `${p.max_branches} boutique(s)`} - {p.price_monthly.toLocaleString('fr-FR')} XOF/mois)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date d'expiration de l'abonnement</label>
                <input
                  type="date"
                  className="form-control"
                  value={companyExpiresAt}
                  onChange={(e) => setCompanyExpiresAt(e.target.value)}
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

      {/* ── MODALE DE REINITIALISATION DE MOT DE PASSE ── */}
      {selectedUserToReset && (
        <div className="modal-overlay" onClick={() => setSelectedUserToReset(null)}>
          <div className="modal-card card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'left' }}>
            <h3>Réinitialiser le mot de passe</h3>
            <p className="text-muted small">Modification forcée du mot de passe pour <strong>{selectedUserToReset.name}</strong>.</p>
            <form onSubmit={handleResetPassword} style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">Nouveau mot de passe</label>
                <PasswordInput
                  required
                  placeholder="Min. 8 caractères"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirmer le mot de passe</label>
                <PasswordInput
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
          max-width: 1280px;
          padding: 28px;
          background: var(--bg-card);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
        }

        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .admin-subtabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .subtab-btn {
          background: var(--bg-input, rgba(0,0,0,0.04));
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          font-weight: 700;
          font-size: 13px;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .subtab-btn.active, .subtab-btn:hover {
          background: var(--color-primary);
          color: #fff;
          border-color: var(--color-primary);
        }

        .admin-metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        .metric-box {
          background: var(--bg-input, rgba(0,0,0,0.02));
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .metric-title {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .metric-number {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-main);
        }

        .kpi-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          width: fit-content;
        }

        .kpi-badge.up { background: rgba(16, 185, 129, 0.12); color: #10b981; }
        .kpi-badge.neutral { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }

        .saas-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .saas-table th, .saas-table td {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .saas-table th {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          background: var(--bg-input, rgba(0,0,0,0.02));
        }

        .flex-1 { flex: 1; }
      `}</style>
      {/* MODAL UNIVERSEL D'EXPORTATION SAAS */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        documentType={exportType}
        documentTitle={exportTitle}
      />
    </div>
  );
};
