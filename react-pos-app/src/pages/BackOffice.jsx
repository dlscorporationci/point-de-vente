import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { PasswordInput } from '../components/PasswordInput';
import { CountUp } from '../components/CountUp';
import { AuditLogs } from './AuditLogs';
import { ExportModal } from '../components/ExportModal';
import { GlobalDateRangeFilter } from '../components/GlobalDateRangeFilter';
import { CompanyInspection } from './CompanyInspection';

export const BackOffice = () => {
  const { token, user, logout } = useApp();
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

  // ── FACTURATION SAAS & ABONNEMENTS (PARTIES 1-5) ──
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [billingLoading, setBillingLoading] = useState(false);

  // Modales Facturation & Notification entreprise
  const [showCreateSubModal, setShowCreateSubModal] = useState(false);
  const [showCreatePaymentModal, setShowCreatePaymentModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  
  const [targetCompanyId, setTargetCompanyId] = useState('');
  const [subPlanSlug, setSubPlanSlug] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('cash');
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyMessage, setNotifyMessage] = useState('');
  const [notifyType, setNotifyType] = useState('warning');
  const [actionSaving, setActionSaving] = useState(false);

  // ── GESTION SMTP & LOGS E-MAILS ──
  const [emailSettingsData, setEmailSettingsData] = useState(null);
  const [emailLogsList, setEmailLogsList] = useState([]);
  const [emailLogsLoading, setEmailLogsLoading] = useState(false);
  const [testRecipientEmail, setTestRecipientEmail] = useState('infos@dlscorporation.ci');
  const [testSending, setTestSending] = useState(false);
  const [testConnecting, setTestConnecting] = useState(false);
  const [emailLogFilterStatus, setEmailLogFilterStatus] = useState('');
  const [emailLogSearchTerm, setEmailLogSearchTerm] = useState('');

  // ── MESSAGES ET ÉTATS ──
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadBillingData = async () => {
    if (!token) return;
    setBillingLoading(true);
    try {
      const [subRes, payRes, invRes] = await Promise.all([
        axios.get('/v1/admin/subscriptions').catch(() => ({ data: [] })),
        axios.get('/v1/admin/payments').catch(() => ({ data: [] })),
        axios.get('/v1/admin/invoices').catch(() => ({ data: [] }))
      ]);
      setSubscriptions(subRes.data.data || subRes.data || []);
      setPayments(payRes.data.data || payRes.data || []);
      setInvoices(invRes.data.data || invRes.data || []);
    } catch (err) {
      console.error("Billing load error:", err);
    } finally {
      setBillingLoading(false);
    }
  };
  
  // ── EXPORTS DOCUMENTAIRES SAAS ──
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState('saas_metrics');
  const [exportTitle, setExportTitle] = useState('Supervision SaaS');

  // ── DRILL-DOWN & SURVEILLANCE & PERFORMANCE (PHASE 3.1) ──
  const [selectedCompanyForInspection, setSelectedCompanyForInspection] = useState(null);
  const [dateFilter, setDateFilter] = useState({ period: 'this_month', start_date: '', end_date: '' });
  const [rankings, setRankings] = useState([]);
  const [rankingsLoading, setRankingsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('ca');
  const [companiesAtRisk, setCompaniesAtRisk] = useState([]);
  const [atRiskLoading, setAtRiskLoading] = useState(false);

  const userRole = typeof user?.role === 'string' ? user.role : (user?.role?.slug || user?.role?.name || '');
  const isSuperAdmin = userRole === 'super-admin' || userRole === 'Super Admin' || userRole === 'superadmin' || user?.email === 'superadmin@dls.com' || !!user?.is_superadmin;

  // 1. Charger le Dashboard SaaS avec filtres temporels
  const loadDashboard = async (filterParams = dateFilter) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get('/v1/admin/dashboard', {
        params: {
          period: filterParams.period,
          start_date: filterParams.start_date,
          end_date: filterParams.end_date,
        }
      });
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

  // 1b. Charger le classement de performance des entreprises
  const loadRankings = async (filterParams = dateFilter, currentSort = sortBy) => {
    if (!token) return;
    setRankingsLoading(true);
    try {
      const res = await axios.get('/v1/admin/performance-ranking', {
        params: {
          period: filterParams.period,
          start_date: filterParams.start_date,
          end_date: filterParams.end_date,
          sort_by: currentSort
        }
      });
      if (res.data && res.data.rankings) {
        setRankings(res.data.rankings);
      }
    } catch (err) {
      console.error("Rankings load error:", err);
    } finally {
      setRankingsLoading(false);
    }
  };

  // 1c. Charger les entreprises à risque
  const loadCompaniesAtRisk = async () => {
    if (!token) return;
    setAtRiskLoading(true);
    try {
      const res = await axios.get('/v1/admin/companies-at-risk');
      if (res.data && res.data.at_risk_companies) {
        setCompaniesAtRisk(res.data.at_risk_companies);
      }
    } catch (err) {
      console.error("Companies at risk load error:", err);
    } finally {
      setAtRiskLoading(false);
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
    if (activeSubTab === 'dashboard') {
      loadDashboard(dateFilter);
      loadCompaniesAtRisk();
    }
    if (activeSubTab === 'plans') loadPlans();
    if (activeSubTab === 'companies') loadCompanies();
    if (activeSubTab === 'billing') loadBillingData();
    if (activeSubTab === 'users') loadUsers();
    if (activeSubTab === 'system') loadSystemInfo();
    if (activeSubTab === 'ranking') loadRankings(dateFilter, sortBy);
    if (activeSubTab === 'risk') loadCompaniesAtRisk();
  }, [token, activeSubTab, dateFilter, sortBy]);

  // Action Handlers Abonnements & Facturation
  const handleCreateSubscriptionSubmit = async (e) => {
    e.preventDefault();
    setActionSaving(true);
    setError(null);
    try {
      await axios.post('/v1/admin/subscriptions', {
        company_id: parseInt(targetCompanyId),
        plan_slug: subPlanSlug,
        billing_cycle: billingCycle
      });
      setSuccess("Abonnement créé / renouvelé avec succès pour l'entreprise.");
      setShowCreateSubModal(false);
      loadBillingData();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Erreur lors de la création de l'abonnement.");
    } finally {
      setActionSaving(false);
    }
  };

  const handleStorePaymentSubmit = async (e) => {
    e.preventDefault();
    setActionSaving(true);
    setError(null);
    try {
      await axios.post('/v1/admin/payments', {
        company_id: parseInt(targetCompanyId),
        amount: parseFloat(payAmount),
        payment_method: payMethod
      });
      setSuccess("Règlement d'abonnement enregistré avec succès.");
      setShowCreatePaymentModal(false);
      setPayAmount('');
      loadBillingData();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Erreur lors de l'enregistrement du règlement.");
    } finally {
      setActionSaving(false);
    }
  };

  const handleGenerateInvoiceAction = async (companyId) => {
    setError(null);
    try {
      const res = await axios.post('/v1/admin/invoices/generate', { company_id: companyId });
      setSuccess(`Facture ${res.data?.invoice?.invoice_number || 'INV-2026'} générée avec succès.`);
      loadBillingData();
    } catch (err) {
      setError("Erreur lors de la génération de la facture.");
    }
  };

  const handleSendNotificationSubmit = async (e) => {
    e.preventDefault();
    setActionSaving(true);
    setError(null);
    try {
      await axios.post('/v1/admin/notifications/send', {
        company_id: targetCompanyId ? parseInt(targetCompanyId) : null,
        title: notifyTitle,
        message: notifyMessage,
        type: notifyType
      });
      window.dispatchEvent(new Event('notification-refresh'));
      setSuccess("Notification transmise avec succès aux administrateurs de l'entreprise.");
      setShowNotifyModal(false);
      setNotifyTitle('');
      setNotifyMessage('');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Erreur lors de la transmission de la notification.");
    } finally {
      setActionSaving(false);
    }
  };

  // ── FONCTIONS D'INTERACTIONS E-MAILS & SMTP ──
  const loadEmailSettings = async () => {
    if (!token) return;
    try {
      const res = await axios.get('/v1/admin/email-settings');
      setEmailSettingsData(res.data || null);
    } catch (err) {
      console.error("Email settings load error:", err);
    }
  };

  const loadEmailLogs = async () => {
    if (!token) return;
    setEmailLogsLoading(true);
    try {
      const res = await axios.get('/v1/admin/email-logs', {
        params: {
          status: emailLogFilterStatus,
          search: emailLogSearchTerm,
        }
      });
      setEmailLogsList(res.data.logs?.data || res.data.logs || []);
    } catch (err) {
      console.error("Email logs load error:", err);
    } finally {
      setEmailLogsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setTestConnecting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post('/v1/admin/email-settings/test-connection');
      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Échec de la connexion SMTP.");
    } finally {
      setTestConnecting(false);
    }
  };

  const handleSendTestEmailSubmit = async (e) => {
    e.preventDefault();
    setTestSending(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post('/v1/admin/email-settings/test-email', { recipient: testRecipientEmail });
      if (res.data && res.data.success === false) {
        setError(res.data.error || res.data.message || "Erreur lors de l'envoi de l'e-mail de test.");
      } else {
        setSuccess(res.data.message || "E-mail de test transmis avec succès.");
        loadEmailLogs();
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message || "Erreur lors de l'envoi de l'e-mail de test.");
    } finally {
      setTestSending(false);
    }
  };

  const handleRetryEmailLog = async (logId) => {
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post(`/v1/admin/email-logs/${logId}/retry`);
      setSuccess(res.data.message);
      loadEmailLogs();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors du renvoi de l'e-mail.");
    }
  };

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
    let feats = [];
    if (Array.isArray(p.features)) {
      feats = p.features;
    } else if (typeof p.features === 'string') {
      try { feats = JSON.parse(p.features); } catch (e) { feats = [p.features]; }
    }
    setPlanFeaturesText(Array.isArray(feats) ? feats.join('\n') : '');
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

  const handleDeleteCompany = async (company) => {
    if (!window.confirm(`⚠️ ATTENTION : Êtes-vous ABSOLUMENT SÛR de vouloir SUPPRIMER définitivement l'entreprise "${company.name}" (Code: ${company.code}) ?\n\nCette action détruira IRRÉVOCABLEMENT toutes ses boutiques, ses utilisateurs, ses ventes et ses stocks !`)) {
      return;
    }
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.delete(`/v1/admin/companies/${company.id}`);
      setSuccess(res.data?.message || `L'entreprise "${company.name}" a été supprimée.`);
      loadCompanies();
    } catch (err) {
      setError(err.response?.data?.error || "Impossible de supprimer l'entreprise.");
    }
  };

  const handleDeleteUser = async (u) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur "${u.name}" (${u.email}) ?`)) {
      return;
    }
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.delete(`/v1/admin/users/${u.id}`);
      setSuccess(res.data?.message || `L'utilisateur "${u.name}" a été supprimé.`);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Impossible de supprimer l'utilisateur.");
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

  // Filtrage local des entreprises (sécurisé contre les valeurs nulles)
  const filteredCompanies = (companies || []).filter(c => {
    if (!c) return false;
    const nameStr = (c.name || '').toLowerCase();
    const codeStr = (c.code || c.company_code || '').toLowerCase();
    const sTerm   = (searchCompany || '').toLowerCase();
    const matchesSearch = nameStr.includes(sTerm) || codeStr.includes(sTerm);
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

  // SI UNE ENTREPRISE EST SÉLECTIONNÉE POUR L'INSPECTION (DRILL-DOWN)
  if (selectedCompanyForInspection) {
    return (
      <div className="admin-container">
        <CompanyInspection
          companyId={selectedCompanyForInspection}
          onBack={() => setSelectedCompanyForInspection(null)}
          onExportPdf={(id, name) => {
            setExportType('company_inspection_report');
            setExportTitle(`Inspection - ${name}`);
            setShowExportModal(true);
          }}
        />
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          documentType={exportType}
          documentTitle={exportTitle}
          defaultFilters={{ company_id: selectedCompanyForInspection }}
        />
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-layout card">
        
        {/* Header Backoffice */}
        <div className="admin-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2><i className="fa-solid fa-gears text-primary me-2"></i> Console SaaS & Offres</h2>
              <p className="admin-subtitle">Portail de supervision, d'abonnements et de gestion des entreprises de la plateforme.</p>
            </div>
            <button
              onClick={() => logout()}
              title="Se déconnecter"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 18px', borderRadius: '8px', border: '1.5px solid #ef4444',
                background: 'transparent', color: '#ef4444', fontWeight: 700,
                fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
            >
              <i className="fa-solid fa-right-from-bracket"></i> Déconnexion
            </button>
          </div>
          <div className="admin-subtabs" style={{ flexWrap: 'wrap', gap: '6px' }}>
            <button className={`subtab-btn ${activeSubTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveSubTab('dashboard')}>
              <i className="fa-solid fa-chart-line me-1"></i> Supervision
            </button>
            <button className={`subtab-btn ${activeSubTab === 'companies' ? 'active' : ''}`} onClick={() => setActiveSubTab('companies')}>
              <i className="fa-solid fa-building me-1"></i> Entreprises ({companies.length})
            </button>
            <button className={`subtab-btn ${activeSubTab === 'risk' ? 'active' : ''}`} onClick={() => setActiveSubTab('risk')} style={{ border: '1.5px solid #ef4444', color: activeSubTab === 'risk' ? '#fff' : '#ef4444', fontWeight: 800 }}>
              <i className="fa-solid fa-triangle-exclamation me-1"></i> Entreprises à Risque ({companiesAtRisk.length})
            </button>
            <button className={`subtab-btn ${activeSubTab === 'ranking' ? 'active' : ''}`} onClick={() => setActiveSubTab('ranking')}>
              <i className="fa-solid fa-trophy me-1"></i> Classement Performance
            </button>
            <button className={`subtab-btn ${activeSubTab === 'billing' ? 'active' : ''}`} onClick={() => setActiveSubTab('billing')} style={{ border: '1.5px solid #10b981', color: activeSubTab === 'billing' ? '#fff' : '#10b981', fontWeight: 800 }}>
              <i className="fa-solid fa-file-invoice-dollar me-1"></i> Abonnements &amp; Factures
            </button>
            <button className={`subtab-btn ${activeSubTab === 'plans' ? 'active' : ''}`} onClick={() => setActiveSubTab('plans')}>
              <i className="fa-solid fa-gem me-1"></i> Formules &amp; Offres ({plans.length})
            </button>
            <button className={`subtab-btn ${activeSubTab === 'users' ? 'active' : ''}`} onClick={() => setActiveSubTab('users')}>
              <i className="fa-solid fa-users me-1"></i> Utilisateurs
            </button>
            <button className={`subtab-btn ${activeSubTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveSubTab('audit')}>
              <i className="fa-solid fa-shield-halved me-1"></i> Journal d'Audit
            </button>
            <button className={`subtab-btn ${activeSubTab === 'system' ? 'active' : ''}`} onClick={() => setActiveSubTab('system')}>
              <i className="fa-solid fa-sliders me-1"></i> Maintenance
            </button>
            <button className={`subtab-btn ${activeSubTab === 'emails' ? 'active' : ''}`} onClick={() => { setActiveSubTab('emails'); loadEmailSettings(); loadEmailLogs(); }} style={{ border: '1.5px solid #0284c7', color: activeSubTab === 'emails' ? '#fff' : '#0284c7', fontWeight: 800 }}>
              <i className="fa-solid fa-envelope me-1"></i> E-mails &amp; SMTP
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
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap" style={{ gap: '12px' }}>
                  <GlobalDateRangeFilter onFilterChange={setDateFilter} />
                  <button onClick={() => { setExportType('saas_metrics'); setExportTitle('Supervision & Bilan SaaS'); setShowExportModal(true); }} className="btn btn-outline-secondary btn-sm" style={{ fontWeight: 700 }}>
                    <i className="fa-solid fa-file-export me-1"></i> Exporter Bilan Supervision PDF
                  </button>
                </div>

                {/* BLOC KPI FINANCIERS SAAS (MRR, ARR, ARPU, CHURN) */}
                <div className="mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div className="metric-box" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.02) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <span className="metric-title" style={{ color: '#10b981', fontWeight: 800 }}>MRR (Revenu Mensuel)</span>
                    <span className="metric-number" style={{ fontSize: '22px', color: '#10b981' }}>
                      <CountUp end={metrics?.mrr || 0} format={true} /> FCFA
                    </span>
                    <span className="kpi-badge up">Récurrent / mois</span>
                  </div>

                  <div className="metric-box" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0.02) 100%)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                    <span className="metric-title" style={{ color: '#06b6d4', fontWeight: 800 }}>ARR (Revenu Annuel)</span>
                    <span className="metric-number" style={{ fontSize: '22px', color: '#06b6d4' }}>
                      <CountUp end={metrics?.arr || 0} format={true} /> FCFA
                    </span>
                    <span className="kpi-badge up">Projeté / an</span>
                  </div>

                  <div className="metric-box" style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.02) 100%)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                    <span className="metric-title" style={{ color: '#a855f7', fontWeight: 800 }}>ARPU (Revenu / Tenant)</span>
                    <span className="metric-number" style={{ fontSize: '22px', color: '#a855f7' }}>
                      <CountUp end={metrics?.arpu || 0} format={true} /> FCFA
                    </span>
                    <span className="kpi-badge neutral">Moyen par entreprise</span>
                  </div>

                  <div className="metric-box" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.02) 100%)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <span className="metric-title" style={{ color: '#ef4444', fontWeight: 800 }}>Taux de Churn (Attrition)</span>
                    <span className="metric-number" style={{ fontSize: '22px', color: '#ef4444' }}>
                      {metrics?.churn_rate || 0}%
                    </span>
                    <span className="kpi-badge down">{metrics?.companies_suspended || 0} inactives</span>
                  </div>

                  <div className="metric-box">
                    <span className="metric-title">Encaissements SaaS Période</span>
                    <span className="metric-number" style={{ fontSize: '20px' }}>
                      <CountUp end={metrics?.saas_revenue_period || 0} format={true} /> FCFA
                    </span>
                    <span className="kpi-badge up">{metrics?.period_label || 'Période'}</span>
                  </div>

                  <div className="metric-box">
                    <span className="metric-title">CA Métier Réseau</span>
                    <span className="metric-number" style={{ fontSize: '20px' }}>
                      <CountUp end={metrics?.tenant_sales_ca || 0} format={true} /> FCFA
                    </span>
                    <span className="kpi-badge neutral">{metrics?.tenant_sales_count || 0} ventes faites</span>
                  </div>
                </div>

                <div className="admin-metrics-grid animate-fade-in mb-4">
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
                    <span className="metric-title">Nouveaux Abonnés</span>
                    <span className="metric-number">
                      <CountUp end={metrics?.new_signups_count || 0} format={false} />
                    </span>
                    <span className="kpi-badge up">{metrics?.period_label || 'Période'}</span>
                  </div>

                  <div className="metric-box">
                    <span className="metric-title">Entreprises à Risque</span>
                    <span className="metric-number" style={{ color: '#ef4444' }}>
                      <CountUp end={metrics?.at_risk_count || 0} format={false} />
                    </span>
                    <span className="kpi-badge down cursor-pointer" onClick={() => setActiveSubTab('risk')}>Inspecter ➔</span>
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
                            <button onClick={() => setSelectedCompanyForInspection(c.id)} className="btn btn-success me-2 btn-sm" style={{ padding: '8px 14px', fontWeight: 700, backgroundColor: '#10b981', borderColor: '#10b981', color: '#fff' }}>
                              <i className="fa-solid fa-magnifying-glass me-1"></i> Inspecter
                            </button>
                            <button onClick={() => openEditCompanyModal(c)} className="btn btn-secondary me-2 btn-sm" style={{ padding: '8px 14px' }}>
                              <i className="fa-solid fa-pen me-1"></i> Gérer
                            </button>
                             <button onClick={() => toggleCompanyStatus(c)} className={`btn btn-sm me-2 ${c.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'}`} style={{ padding: '8px 14px' }}>
                               {c.status === 'active' ? 'Suspendre' : 'Activer'}
                             </button>
                             <button onClick={() => handleDeleteCompany(c)} className="btn btn-sm btn-danger" style={{ padding: '8px 14px', fontWeight: 700 }} title="Supprimer définitivement cette entreprise">
                               <i className="fa-solid fa-trash me-1"></i> Supprimer
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

        {/* 2b. SURVEILLANCE ET ENTREPRISES À RISQUE */}
        {activeSubTab === 'risk' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap" style={{ gap: '16px' }}>
              <div>
                <h3 className="m-0" style={{ fontWeight: 800, color: '#ef4444' }}>
                  <i className="fa-solid fa-triangle-exclamation me-2"></i> Entreprises à Surveiller & Signaux de Risque
                </h3>
                <p className="text-muted small m-0">Détection automatique des entreprises clientes présentant un risque de résiliation, d'expiration proche, ou d'inactivité prolongée.</p>
              </div>
              <button onClick={() => loadCompaniesAtRisk()} className="btn btn-outline-secondary btn-sm" style={{ fontWeight: 700 }}>
                <i className="fa-solid fa-rotate me-1"></i> Actualiser l'Analyse
              </button>
            </div>

            {atRiskLoading ? (
              <div className="loading-spinner">Analyse des signaux de risque en cours...</div>
            ) : companiesAtRisk.length === 0 ? (
              <div className="empty-state p-5 text-center">
                <h4>🟢 Aucune entreprise à risque critique détectée</h4>
                <p className="text-muted">Toutes les entreprises clientes sont actives avec une souscription saine.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="saas-table">
                  <thead>
                    <tr>
                      <th>Entreprise & Formule</th>
                      <th>Niveau de Risque</th>
                      <th>Facteurs & Signaux Détectés</th>
                      <th>Dernière Activité</th>
                      <th>Action Recommandée</th>
                      <th style={{ textAlign: 'right' }}>Inspection</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companiesAtRisk.map((item, idx) => (
                      <tr key={idx} className="hover-row">
                        <td>
                          <strong style={{ fontSize: '15px' }}>{item.company_name}</strong>
                          <div className="text-muted" style={{ fontSize: '12px', marginTop: '2px', fontFamily: 'monospace' }}>
                            Code: <strong>{item.company_code}</strong> • Formule: <span className="badge bg-primary">{item.plan}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${
                            item.level === 'critical' ? 'badge-error' : (item.level === 'high' ? 'bg-warning text-dark' : 'bg-secondary')
                          }`} style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                            {item.level === 'critical' ? '🔴 Critique' : (item.level === 'high' ? '🟠 Élevé' : '🟡 Moyen')}
                          </span>
                        </td>
                        <td>
                          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px' }}>
                            {item.reasons.map((r, rIdx) => (
                              <li key={rIdx} style={{ color: '#f87171' }}>{r}</li>
                            ))}
                          </ul>
                        </td>
                        <td style={{ fontSize: '12px' }}>
                          {item.last_activity_at ? new Date(item.last_activity_at).toLocaleString('fr-FR') : 'Non renseignée'}
                        </td>
                        <td>
                          <span className="text-warning small font-bold" style={{ fontSize: '12px' }}>
                            {item.recommended_action}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button onClick={() => setSelectedCompanyForInspection(item.company_id)} className="btn btn-success btn-sm" style={{ padding: '8px 14px', fontWeight: 700, backgroundColor: '#10b981', borderColor: '#10b981', color: '#fff' }}>
                            <i className="fa-solid fa-magnifying-glass me-1"></i> Inspecter
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

        {/* 2c. CLASSEMENT ET PERFORMANCE DES ENTREPRISES */}
        {activeSubTab === 'ranking' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap" style={{ gap: '16px' }}>
              <div>
                <h3 className="m-0" style={{ fontWeight: 800 }}>
                  <i className="fa-solid fa-trophy text-warning me-2"></i> Performance & Classement des Entreprises
                </h3>
                <p className="text-muted small m-0">Classement comparatif des entreprises par chiffre d'affaires, volume de ventes, portefeuille clients et score global.</p>
              </div>

              <div className="d-flex items-center space-x-3">
                <GlobalDateRangeFilter onFilterChange={setDateFilter} />

                <select className="form-control form-control-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: '160px' }}>
                  <option value="ca">Trier par CA</option>
                  <option value="sales">Trier par Ventes</option>
                  <option value="customers">Trier par Clients</option>
                  <option value="score">Trier par Score</option>
                </select>
              </div>
            </div>

            {rankingsLoading ? (
              <div className="loading-spinner">Calcul du classement de performance...</div>
            ) : (
              <div className="table-responsive">
                <table className="saas-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>Rang</th>
                      <th>Entreprise & Formule</th>
                      <th style={{ textAlign: 'right' }}>CA Généré (FCFA)</th>
                      <th style={{ textAlign: 'right' }}>Volume Ventes</th>
                      <th style={{ textAlign: 'right' }}>Panier Moyen</th>
                      <th style={{ textAlign: 'center' }}>Clients</th>
                      <th style={{ textAlign: 'center' }}>Boutiques</th>
                      <th style={{ textAlign: 'right' }}>Score SaaS</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((r) => (
                      <tr key={r.company_id} className="hover-row">
                        <td style={{ fontWeight: 900, fontSize: '16px', color: r.rank === 1 ? '#eab308' : (r.rank === 2 ? '#94a3b8' : (r.rank === 3 ? '#b45309' : 'inherit')) }}>
                          #{r.rank}
                        </td>
                        <td>
                          <strong style={{ fontSize: '15px' }}>{r.company_name}</strong>
                          <div className="text-muted" style={{ fontSize: '12px' }}>
                            Code: <code>{r.company_code}</code> • Plan: <span className="badge bg-primary">{r.plan}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 900, color: '#10b981', fontSize: '15px' }}>
                          {r.ca.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>
                          {r.sales_count} ventes
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>
                          {r.average_cart.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {r.customers_count}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {r.branches_count}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 900, color: '#06b6d4' }}>
                          {r.score} pts
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button onClick={() => setSelectedCompanyForInspection(r.company_id)} className="btn btn-success btn-sm" style={{ padding: '6px 12px', fontWeight: 700, backgroundColor: '#10b981', borderColor: '#10b981', color: '#fff' }}>
                            <i className="fa-solid fa-magnifying-glass me-1"></i> Inspecter
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

        {/* 3.5 ABONNEMENTS, FACTURES ET NOTIFICATIONS (PARTIES 1-5) */}
        {activeSubTab === 'billing' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                <i className="fa-solid fa-file-invoice-dollar me-2 text-primary"></i> Gestion Financière & Abonnements par Entreprise
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setExportType('subscriptions_list'); setExportTitle('Suivi des Abonnements'); setShowExportModal(true); }} className="btn btn-outline-secondary btn-sm" style={{ fontWeight: 700 }}>
                  <i className="fa-solid fa-file-export me-1"></i> Exporter
                </button>
                <button onClick={() => setShowNotifyModal(true)} className="btn btn-outline-warning btn-sm" style={{ fontWeight: 700 }}>
                  <i className="fa-solid fa-bell me-1"></i> Notifier Entreprise
                </button>
                <button onClick={() => setShowCreatePaymentModal(true)} className="btn btn-success btn-sm" style={{ fontWeight: 700 }}>
                  <i className="fa-solid fa-cash-register me-1"></i> + Enregistrer Règlement
                </button>
                <button onClick={() => setShowCreateSubModal(true)} className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                  <i className="fa-solid fa-plus me-1"></i> + Créer Abonnement
                </button>
              </div>
            </div>

            {/* KPI CARTES DE FACTURATION */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div className="card" style={{ padding: '16px', borderLeft: '4px solid #10b981' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Total Encaissements Abonnements</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#10b981' }}>
                  {new Intl.NumberFormat('fr-FR').format(payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0))} XOF
                </div>
              </div>
              <div className="card" style={{ padding: '16px', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Factures En Attente / Impayées</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#f59e0b' }}>
                  {invoices.filter(inv => inv.status === 'unpaid' || inv.status === 'pending').length} Facture(s)
                </div>
              </div>
              <div className="card" style={{ padding: '16px', borderLeft: '4px solid #3b82f6' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Abonnements Actifs</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#38bdf8' }}>
                  {subscriptions.filter(s => s.status === 'active').length} Entreprise(s)
                </div>
              </div>
            </div>

            {/* TABLEAU DES ABONNEMENTS ET FACTURATION */}
            {billingLoading ? (
              <div className="loading-spinner">Chargement du journal d'abonnements et factures...</div>
            ) : (
              <div className="table-responsive">
                <table className="saas-table">
                  <thead>
                    <tr>
                      <th>Entreprise</th>
                      <th>Formule & Cycle</th>
                      <th>Échéance</th>
                      <th>Statut</th>
                      <th>Paiements Reçus</th>
                      <th>Actions SuperAdmin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map(comp => {
                      const compSub = subscriptions.find(s => s.company_id === comp.id);
                      const compPays = payments.filter(p => p.company_id === comp.id);
                      const totalPaid = compPays.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

                      return (
                        <tr key={comp.id}>
                          <td>
                            <strong>{comp.name}</strong>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>Code: {comp.code || comp.company_code || `CMP-${comp.id}`}</div>
                          </td>
                          <td>
                            <span className="badge badge-info">{comp.subscription_plan || 'pro'}</span>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>{compSub?.billing_cycle === 'yearly' ? 'Annuel' : 'Mensuel'}</div>
                          </td>
                          <td>
                            {comp.subscription_expires_at ? new Date(comp.subscription_expires_at).toLocaleDateString('fr-FR') : 'Non définie'}
                          </td>
                          <td>
                            <span className={`badge ${comp.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                              {comp.status === 'active' ? 'Actif' : 'Suspendu'}
                            </span>
                          </td>
                          <td>
                            <strong>{new Intl.NumberFormat('fr-FR').format(totalPaid)} XOF</strong>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>{compPays.length} règlement(s)</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button 
                                onClick={() => handleGenerateInvoiceAction(comp.id)}
                                className="btn btn-xs btn-outline-primary"
                                title="Générer Facture INV-2026"
                              >
                                <i className="fa-solid fa-file-invoice"></i> Facture
                              </button>
                              <button 
                                onClick={() => { setTargetCompanyId(comp.id.toString()); setShowNotifyModal(true); }}
                                className="btn btn-xs btn-outline-warning"
                                title="Notifier Entreprise"
                              >
                                <i className="fa-solid fa-bell"></i> Notifier
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
          </div>
        )}

        {/* MODALE NOTIFICATION ENTREPRISE (Partie SuperAdmin) */}
        {showNotifyModal && (
          <div className="modal-overlay">
            <div className="modal-card card" style={{ maxWidth: '500px' }}>
              <h3><i className="fa-solid fa-bell text-warning me-2"></i> Transmettre une Notification système</h3>
              <form onSubmit={handleSendNotificationSubmit}>
                <div className="form-group mb-3">
                  <label className="form-label">Entreprise destinataire *</label>
                  <select 
                    className="form-control"
                    value={targetCompanyId}
                    onChange={(e) => setTargetCompanyId(e.target.value)}
                  >
                    <option value="">-- Toutes les entreprises (Diffusion Globale) --</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Titre du message *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ex: Rappel de renouvellement d'abonnement" 
                    value={notifyTitle}
                    onChange={(e) => setNotifyTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Niveau d'urgence *</label>
                  <select 
                    className="form-control"
                    value={notifyType}
                    onChange={(e) => setNotifyType(e.target.value)}
                  >
                    <option value="info">Information</option>
                    <option value="warning">Avertissement (Échéance proche)</option>
                    <option value="danger">Urgent (Impayé / Suspension imminent)</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Message détaillé *</label>
                  <textarea 
                    className="form-control" 
                    rows={3} 
                    placeholder="Saisissez les consignes ou rappels de facturation..."
                    value={notifyMessage}
                    onChange={(e) => setNotifyMessage(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-actions d-flex justify-content-end gap-2">
                  <button type="button" onClick={() => setShowNotifyModal(false)} className="btn btn-secondary">Annuler</button>
                  <button type="submit" disabled={actionSaving} className="btn btn-primary">
                    {actionSaving ? 'Envoi...' : 'Envoyer la Notification'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODALE CRÉATION ABONNEMENT */}
        {showCreateSubModal && (
          <div className="modal-overlay">
            <div className="modal-card card" style={{ maxWidth: '480px' }}>
              <h3><i className="fa-solid fa-file-contract text-primary me-2"></i> Activer un Abonnement Entreprise</h3>
              <form onSubmit={handleCreateSubscriptionSubmit}>
                <div className="form-group mb-3">
                  <label className="form-label">Entreprise *</label>
                  <select 
                    className="form-control"
                    value={targetCompanyId}
                    onChange={(e) => setTargetCompanyId(e.target.value)}
                    required
                  >
                    <option value="">Sélectionner une entreprise...</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Formule choisie *</label>
                  <select 
                    className="form-control"
                    value={subPlanSlug}
                    onChange={(e) => setSubPlanSlug(e.target.value)}
                  >
                    {plans.map(p => (
                      <option key={p.id} value={p.slug}>{p.name} ({p.price_monthly} XOF/mois)</option>
                    ))}
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Période de facturation *</label>
                  <select 
                    className="form-control"
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value)}
                  >
                    <option value="monthly">Mensuel (1 mois)</option>
                    <option value="yearly">Annuel (12 mois)</option>
                  </select>
                </div>

                <div className="modal-actions d-flex justify-content-end gap-2">
                  <button type="button" onClick={() => setShowCreateSubModal(false)} className="btn btn-secondary">Annuler</button>
                  <button type="submit" disabled={actionSaving} className="btn btn-primary">
                    {actionSaving ? 'Enregistrement...' : 'Activer l\'Abonnement'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODALE RÈGLEMENT PAIEMENT */}
        {showCreatePaymentModal && (
          <div className="modal-overlay">
            <div className="modal-card card" style={{ maxWidth: '480px' }}>
              <h3><i className="fa-solid fa-cash-register text-success me-2"></i> Enregistrer un Règlement d'Abonnement</h3>
              <form onSubmit={handleStorePaymentSubmit}>
                <div className="form-group mb-3">
                  <label className="form-label">Entreprise payer *</label>
                  <select 
                    className="form-control"
                    value={targetCompanyId}
                    onChange={(e) => setTargetCompanyId(e.target.value)}
                    required
                  >
                    <option value="">Sélectionner une entreprise...</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Montant reçu (XOF) *</label>
                  <input 
                    type="number" 
                    className="form-control"
                    placeholder="Ex: 50000"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    required
                    min="1"
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Mode de Règlement *</label>
                  <select 
                    className="form-control"
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                  >
                    <option value="cash">Espèces / Cash</option>
                    <option value="bank_transfer">Virement Bancaire</option>
                    <option value="wave">Wave Money</option>
                    <option value="orange_money">Orange Money</option>
                    <option value="card">Carte Bancaire</option>
                  </select>
                </div>

                <div className="modal-actions d-flex justify-content-end gap-2">
                  <button type="button" onClick={() => setShowCreatePaymentModal(false)} className="btn btn-secondary">Annuler</button>
                  <button type="submit" disabled={actionSaving} className="btn btn-success">
                    {actionSaving ? 'Enregistrement...' : 'Valider le Règlement'}
                  </button>
                </div>
              </form>
            </div>
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
                            <>
                              <button onClick={() => toggleUserStatus(u)} className={`btn btn-sm me-2 ${u.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'}`}>
                                {u.status === 'active' ? 'Bloquer' : 'Débloquer'}
                              </button>
                              <button onClick={() => handleDeleteUser(u)} className="btn btn-sm btn-danger" style={{ fontWeight: 700 }} title="Supprimer cet utilisateur">
                                <i className="fa-solid fa-trash me-1"></i> Supprimer
                              </button>
                            </>
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

        {/* 7. CENTRE DE GESTION DES E-MAILS TRANSACTIONNELS & LOGS */}
        {activeSubTab === 'emails' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap" style={{ gap: '16px' }}>
              <div>
                <h3 className="m-0" style={{ fontWeight: 800, color: '#0284c7' }}>
                  <i className="fa-solid fa-envelope me-2"></i> Centre de Communication E-mails &amp; Configuration SMTP
                </h3>
                <p className="text-muted small m-0">Supervision en temps réel des envois d'e-mails transactionnels, état de connexion SMTP et historique des messages.</p>
              </div>
              <button onClick={() => { loadEmailSettings(); loadEmailLogs(); }} className="btn btn-outline-secondary btn-sm" style={{ fontWeight: 700 }}>
                <i className="fa-solid fa-rotate me-1"></i> Actualiser les données
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              {/* Carte 1 : Configuration SMTP */}
              <div className="card p-4" style={{ borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '16px', fontSize: '18px' }}>
                  <i className="fa-solid fa-server text-primary me-2"></i> Paramètres du Serveur SMTP
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                  <div className="d-flex justify-content-between border-bottom pb-2">
                    <span className="text-muted">Serveur Hôte :</span>
                    <strong>{emailSettingsData?.host || 'webmail.oxa.host'}</strong>
                  </div>
                  <div className="d-flex justify-content-between border-bottom pb-2">
                    <span className="text-muted">Port &amp; Chiffrement :</span>
                    <strong>{emailSettingsData?.port || 465} ({emailSettingsData?.encryption?.toUpperCase() || 'SSL/TLS'})</strong>
                  </div>
                  <div className="d-flex justify-content-between border-bottom pb-2">
                    <span className="text-muted">Boîte Expéditrice :</span>
                    <strong style={{ color: '#0284c7' }}>{emailSettingsData?.from_address || 'infos@dlscorporation.ci'}</strong>
                  </div>
                  <div className="d-flex justify-content-between border-bottom pb-2">
                    <span className="text-muted">Nom de l'Expéditeur :</span>
                    <strong>{emailSettingsData?.from_name || 'DLS POS'}</strong>
                  </div>
                  <div className="d-flex justify-content-between border-bottom pb-2">
                    <span className="text-muted">Mot de Passe SMTP :</span>
                    <strong style={{ letterSpacing: '2px' }}>{emailSettingsData?.masked_password || '••••••••••••'}</strong>
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  <button onClick={handleTestConnection} disabled={testConnecting} className="btn btn-outline-primary w-100" style={{ fontWeight: 700 }}>
                    {testConnecting ? <><i className="fa-solid fa-spinner fa-spin me-2"></i> Test de connexion TCP/SMTP...</> : <><i className="fa-solid fa-network-wired me-2"></i> Tester la connexion SMTP</>}
                  </button>
                </div>
              </div>

              {/* Carte 2 : Envoi d'E-mail de Test */}
              <div className="card p-4" style={{ borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '16px', fontSize: '18px' }}>
                  <i className="fa-solid fa-paper-plane text-success me-2"></i> Envoyer un E-mail de Test Réel
                </h4>
                <p className="text-muted small">Saisissez une adresse e-mail destinataire pour valider la délivrabilité immédiate d'un message HTML avec le branding DLS POS.</p>

                <form onSubmit={handleSendTestEmailSubmit} className="mt-3">
                  <div className="form-group mb-3">
                    <label className="form-label" style={{ fontWeight: 600 }}>Adresse E-mail Destinataire *</label>
                    <input 
                      type="email" 
                      className="form-control"
                      value={testRecipientEmail}
                      onChange={(e) => setTestRecipientEmail(e.target.value)}
                      placeholder="ex: infos@dlscorporation.ci"
                      required
                    />
                  </div>

                  <button type="submit" disabled={testSending} className="btn btn-success w-100" style={{ fontWeight: 700, padding: '10px' }}>
                    {testSending ? <><i className="fa-solid fa-spinner fa-spin me-2"></i> Envoi en cours via SMTP...</> : <><i className="fa-solid fa-paper-plane me-2"></i> Envoyer l'e-mail de test</>}
                  </button>
                </form>
              </div>
            </div>

            {/* Tableau du Journal des E-mails */}
            <div className="card p-4" style={{ borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap" style={{ gap: '12px' }}>
                <h4 style={{ fontWeight: 800, margin: 0, fontSize: '18px' }}>
                  <i className="fa-solid fa-list-check me-2 text-primary"></i> Journal des E-mails Transactionnels (Email Logs)
                </h4>

                <div className="d-flex gap-2">
                  <input 
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Rechercher par destinataire..."
                    value={emailLogSearchTerm}
                    onChange={(e) => setEmailLogSearchTerm(e.target.value)}
                    style={{ width: '220px' }}
                  />
                  <select 
                    className="form-control form-control-sm"
                    value={emailLogFilterStatus}
                    onChange={(e) => setEmailLogFilterStatus(e.target.value)}
                    style={{ width: '150px' }}
                  >
                    <option value="">Tous les statuts</option>
                    <option value="sent">Envoyé (Sent)</option>
                    <option value="queued">En attente (Queued)</option>
                    <option value="failed">Échoué (Failed)</option>
                  </select>
                  <button onClick={loadEmailLogs} className="btn btn-secondary btn-sm" style={{ fontWeight: 700 }}>
                    Filtrer
                  </button>
                </div>
              </div>

              {emailLogsLoading ? (
                <div className="loading-spinner p-4">Chargement du journal des e-mails...</div>
              ) : emailLogsList.length === 0 ? (
                <div className="empty-state p-4 text-center">
                  <p className="text-muted m-0">Aucun log d'e-mail correspondant n'a été trouvé.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="saas-table">
                    <thead>
                      <tr>
                        <th>Date / Horodatage</th>
                        <th>Destinataire</th>
                        <th>Type d'Événement</th>
                        <th>Objet du Message</th>
                        <th style={{ textAlign: 'center' }}>Tentatives</th>
                        <th style={{ textAlign: 'center' }}>Statut</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emailLogsList.map((log) => (
                        <tr key={log.id} className="hover-row">
                          <td style={{ fontSize: '12px' }}>
                            {new Date(log.created_at).toLocaleString('fr-FR')}
                          </td>
                          <td><strong>{log.recipient}</strong></td>
                          <td><span className="badge bg-secondary" style={{ fontFamily: 'monospace' }}>{log.type}</span></td>
                          <td style={{ fontSize: '13px' }}>{log.subject}</td>
                          <td style={{ textAlign: 'center', fontWeight: 700 }}>{log.attempts}</td>
                          <td style={{ textAlign: 'center' }}>
                            {log.status === 'sent' && <span className="badge badge-success">ENVOYÉ</span>}
                            {log.status === 'queued' && <span className="badge badge-warning">EN ATTENTE</span>}
                            {log.status === 'sending' && <span className="badge badge-info">EN COURS</span>}
                            {log.status === 'failed' && <span className="badge badge-error" title={log.error_message || ''}>ÉCHOUÉ</span>}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {log.status === 'failed' && (
                              <button onClick={() => handleRetryEmailLog(log.id)} className="btn btn-warning btn-sm" style={{ fontWeight: 700, padding: '4px 10px' }}>
                                <i className="fa-solid fa-rotate-right me-1"></i> Réessayer
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
