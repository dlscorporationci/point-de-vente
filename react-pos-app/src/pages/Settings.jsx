import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { PasswordInput } from '../components/PasswordInput';
import { BusinessRulesPanel } from '../components/BusinessRulesPanel';
import { CustomRolesModal } from '../components/CustomRolesModal';
import { AccessZonesModal } from '../components/AccessZonesModal';

export const Settings = () => {
  const { token, user, companyId, updateCompanyLogo, updateUser } = useApp();

  const isAdmin = user?.role === 'admin' || user?.role === 'super-admin' ||
                  user?.role?.slug === 'admin' || user?.role?.slug === 'super-admin';

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [success, setSuccess]     = useState(null);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [showZonesModal, setShowZonesModal] = useState(false);

  // ─── États Entreprise ──────────────────────────────────────────────────────
  const [companyName, setCompanyName]       = useState('');
  const [companyEmail, setCompanyEmail]     = useState('');
  const [companyPhone, setCompanyPhone]     = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companySlogan, setCompanySlogan]   = useState('');
  const [currency, setCurrency]             = useState('XOF');
  const [timezone, setTimezone]             = useState('Africa/Dakar');
  const [language, setLanguage]             = useState('fr');
  const [companyLogo, setCompanyLogo]       = useState(null);
  const [logoPreview, setLogoPreview]       = useState(null);
  const [companyFavicon, setCompanyFavicon] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);

  // ─── États TVA ────────────────────────────────────────────────────────────
  const [taxRate, setTaxRate]         = useState(18);
  const [enableTax, setEnableTax]     = useState(true);
  const [taxLoading, setTaxLoading]   = useState(false);

  // ─── États POS, Ticket & Caisse ───────────────────────────────────────────
  const [posName, setPosName]               = useState('Caisse Principale 1');
  const [printerModel, setPrinterModel]     = useState('Epson TM-T20III');
  const [printerWidth, setPrinterWidth]     = useState('80');
  const [scannerInterface, setScannerInterface] = useState('USB-HID');

  const [receiptHeader, setReceiptHeader]   = useState('Bienvenue dans notre boutique !');
  const [receiptFooter, setReceiptFooter]   = useState('Merci pour votre confiance. Les marchandises vendues ne sont ni reprises ni échangées.');
  const [receiptRccmIfu, setReceiptRccmIfu] = useState('RCCM: CI-ABJ-2026-B-12345 • IFU: 02026123456');
  const [showLogoOnReceipt, setShowLogoOnReceipt] = useState(true);
  const [showCustomerInfo, setShowCustomerInfo]   = useState(true);
  const [autoPrintReceipt, setAutoPrintReceipt]   = useState(false);

  const [requireInitialCash, setRequireInitialCash] = useState(true);
  const [requireManagerPinForOpen, setRequireManagerPinForOpen] = useState(false);
  const [requireManagerPinForDiscrepancy, setRequireManagerPinForDiscrepancy] = useState(false);
  const [hideTheoreticalCashBeforeClose, setHideTheoreticalCashBeforeClose] = useState(false);
  const [autoLockDuration, setAutoLockDuration] = useState(3);

  // ─── États Profil ─────────────────────────────────────────────────────────
  const [userName, setUserName]             = useState('');
  const [userEmail, setUserEmail]           = useState('');
  const [userPin, setUserPin]               = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]       = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const [dedicatedPin, setDedicatedPin]             = useState('');
  const [dedicatedPinLoading, setDedicatedPinLoading] = useState(false);
  const [pinSuccessMsg, setPinSuccessMsg]           = useState(null);
  const [pinErrorMsg, setPinErrorMsg]               = useState(null);
  const [showCurrentPin, setShowCurrentPin]         = useState(false);
  const [copiedPin, setCopiedPin]                   = useState(false);

  // ─── États Boutiques ──────────────────────────────────────────────────────
  const [branches, setBranches]             = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [editingBranch, setEditingBranch]   = useState(null);
  const [branchForm, setBranchForm]         = useState({ name: '', address: '', phone: '' });
  const [branchSaving, setBranchSaving]     = useState(false);

  // ─── États Utilisateurs ───────────────────────────────────────────────────
  const [users, setUsers]                   = useState([]);
  const [roles, setRoles]                   = useState([]);
  const [usersLoading, setUsersLoading]     = useState(false);
  const [showUserForm, setShowUserForm]     = useState(false);
  const [editingUser, setEditingUser]       = useState(null);
  const [userForm, setUserForm]             = useState({
    name: '', email: '', password: '', pin_code: '', role_id: '', branch_id: '', status: 'active'
  });
  const [userSaving, setUserSaving]         = useState(false);

  // ─── États Système ────────────────────────────────────────────────────────
  const [appVersion] = useState('v2.4.1');
  const [activeSessions] = useState([
    { id: 1, ip: '192.168.1.50', agent: 'Chrome (Linux)', current: true, date: 'Connecté' },
    { id: 2, ip: '192.168.1.121', agent: 'Firefox (Windows)', current: false, date: 'Il y a 3 heures' }
  ]);

  // ─── Abonnement & Factures de l'entreprise ───────────────────────────────
  const [mySubData, setMySubData] = useState(null);
  const [mySubLoading, setMySubLoading] = useState(false);

  const loadMySubscription = useCallback(async () => {
    if (!token) return;
    setMySubLoading(true);
    try {
      const res = await axios.get('/v1/my-subscription');
      setMySubData(res.data || null);
    } catch (err) {
      console.error("My Subscription load error:", err);
    } finally {
      setMySubLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && activeTab === 'subscription') {
      loadMySubscription();
    }
  }, [token, activeTab, loadMySubscription]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHARGEMENT INITIAL
  // ═══════════════════════════════════════════════════════════════════════════
  const loadCompanySettings = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`/v1/tenant-test`);
      const comp = res.data.company;
      if (comp) {
        setCompanyName(comp.name || '');
        setCompanyEmail(comp.email || '');
        setCompanyPhone(comp.phone || '');
        setCompanyAddress(comp.address || '');
        setCompanySlogan(comp.slogan || '');
        setCurrency(comp.currency || 'XOF');
        setTimezone(comp.timezone || 'Africa/Dakar');
        if (comp.logo_path) {
          setLogoPreview(comp.logo_path);
        }
        if (comp.favicon_path) {
          setFaviconPreview(comp.favicon_path);
        }
        // Charger les réglages TVA
        if (comp.tax_settings) {
          setTaxRate(comp.tax_settings.tax_rate ?? 18);
          setEnableTax(comp.tax_settings.enable_tax ?? true);
        }
        // Charger les réglages POS & Factures / Caisse
        if (comp.pos_settings) {
          const pos = comp.pos_settings;
          if (pos.pos_name) setPosName(pos.pos_name);
          if (pos.printer_model) setPrinterModel(pos.printer_model);
          if (pos.receipt_paper_width) setPrinterWidth(pos.receipt_paper_width);
          if (pos.scanner_interface) setScannerInterface(pos.scanner_interface);
          if (pos.receipt_header) setReceiptHeader(pos.receipt_header);
          if (pos.receipt_footer) setReceiptFooter(pos.receipt_footer);
          if (pos.receipt_rccm_ifu) setReceiptRccmIfu(pos.receipt_rccm_ifu);
          if (pos.show_logo_on_receipt !== undefined) setShowLogoOnReceipt(pos.show_logo_on_receipt);
          if (pos.show_customer_info !== undefined) setShowCustomerInfo(pos.show_customer_info);
          if (pos.auto_print_receipt !== undefined) setAutoPrintReceipt(pos.auto_print_receipt);
          if (pos.require_initial_cash !== undefined) setRequireInitialCash(pos.require_initial_cash);
          if (pos.require_manager_pin_for_open !== undefined) setRequireManagerPinForOpen(pos.require_manager_pin_for_open);
          if (pos.require_manager_pin_for_discrepancy !== undefined) setRequireManagerPinForDiscrepancy(pos.require_manager_pin_for_discrepancy);
          if (pos.hide_theoretical_cash_before_close !== undefined) setHideTheoreticalCashBeforeClose(pos.hide_theoretical_cash_before_close);
          if (pos.auto_lock_duration !== undefined) setAutoLockDuration(parseInt(pos.auto_lock_duration));
        }
      }
      if (user) {
        setUserName(user.name);
        setUserEmail(user.email);
      }
    } catch (err) {
      setError("Erreur de chargement des paramètres.");
    } finally {
      setLoading(false);
    }
  };

  const loadBranches = useCallback(async () => {
    if (!token) return;
    setBranchesLoading(true);
    try {
      const res = await axios.get('/v1/branches');
      setBranches(res.data || []);
    } catch {
      /* silencieux */
    } finally {
      setBranchesLoading(false);
    }
  }, [token]);

  const loadUsers = useCallback(async () => {
    if (!token) return;
    setUsersLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        axios.get('/v1/users'),
        axios.get('/v1/roles'),
      ]);
      setUsers(usersRes.data || []);
      setRoles(rolesRes.data || []);
    } catch {
      /* silencieux */
    } finally {
      setUsersLoading(false);
    }
  }, [token]);

  useEffect(() => { loadCompanySettings(); }, [token]);
  useEffect(() => { if (activeTab === 'branches') loadBranches(); }, [activeTab, loadBranches]);
  useEffect(() => { if (activeTab === 'users') loadUsers(); }, [activeTab, loadUsers]);

  // ═══════════════════════════════════════════════════════════════════════════
  // HANDLERS ENTREPRISE
  // ═══════════════════════════════════════════════════════════════════════════
  const handleSaveCompany = async (e) => {
    e.preventDefault();
    setSuccess(null); setError(null); setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', companyName);
      formData.append('slogan', companySlogan);
      if (companyLogo) {
        formData.append('logo', companyLogo);
      }
      if (companyFavicon) {
        formData.append('favicon', companyFavicon);
      }
      const res = await axios.post(`/v1/company-settings`, formData);
      setSuccess("✅ Informations de l'entreprise, logo et slogan enregistrés avec succès.");
      if (res.data.company) {
        if (res.data.company.logo_path) {
          setLogoPreview(res.data.company.logo_path);
        }
        if (res.data.company.favicon_path) {
          setFaviconPreview(res.data.company.favicon_path);
        }
        if (typeof updateCompanyLogo === 'function') {
          // Met à jour le user en mémoire avec le nouveau branding
          updateCompanyLogo(res.data.company.logo_path, {
            slogan: res.data.company.slogan,
            favicon_path: res.data.company.favicon_path,
            name: res.data.company.name,
          });
        }
      }
      setCompanyLogo(null);
      setCompanyFavicon(null);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'enregistrement des paramètres de l'entreprise.");
    } finally {
      setLoading(false);
    }
  };

  // ─── TVA ──────────────────────────────────────────────────────────────────
  const handleSaveTax = async (e) => {
    e.preventDefault();
    setSuccess(null); setError(null); setTaxLoading(true);
    try {
      await axios.post('/v1/company-settings', { tax_rate: taxRate, enable_tax: enableTax });
      setSuccess(`✅ TVA mise à jour : ${enableTax ? taxRate + '%' : 'désactivée'}.`);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur de sauvegarde des paramètres TVA.");
    } finally {
      setTaxLoading(false);
    }
  };

  // ─── POS ──────────────────────────────────────────────────────────────────
  const handleSavePOS = async (e) => {
    e.preventDefault();
    setSuccess(null); setError(null); setLoading(true);
    try {
      const posPayload = {
        pos_name: posName,
        printer_model: printerModel,
        receipt_paper_width: printerWidth,
        scanner_interface: scannerInterface,
        receipt_header: receiptHeader,
        receipt_footer: receiptFooter,
        receipt_rccm_ifu: receiptRccmIfu,
        show_logo_on_receipt: showLogoOnReceipt,
        show_customer_info: showCustomerInfo,
        auto_print_receipt: autoPrintReceipt,
        require_initial_cash: requireInitialCash,
        require_manager_pin_for_open: requireManagerPinForOpen,
        require_manager_pin_for_discrepancy: requireManagerPinForDiscrepancy,
        hide_theoretical_cash_before_close: hideTheoreticalCashBeforeClose,
        auto_lock_duration: parseInt(autoLockDuration),
      };

      await axios.post('/v1/company-settings', {
        pos_settings: posPayload
      });

      setSuccess("✅ Règles de gestion caisse et personnalisation ticket enregistrées avec succès pour votre entreprise !");
    } catch (err) {
      console.error("Save POS Settings Error:", err);
      setError(err.response?.data?.error || err.response?.data?.message || err.message || "Erreur de sauvegarde des paramètres du terminal POS.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Profil ───────────────────────────────────────────────────────────────
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (newPassword && newPassword !== newPasswordConfirm) {
      setError("Les nouveaux mots de passe ne correspondent pas."); return;
    }
    setLoading(true);
    try {
      const payload = { name: userName, email: userEmail };
      if (userPin)       payload.pin_code = userPin;
      if (newPassword) { payload.current_password = currentPassword; payload.password = newPassword; payload.password_confirmation = newPasswordConfirm; }
      const res = await axios.post('/v1/auth/profile', payload);
      setSuccess("✅ " + res.data.message);
      setCurrentPassword(''); setNewPassword(''); setNewPasswordConfirm(''); setUserPin('');
      if (res.data.user) updateUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Erreur de modification du profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDedicatedPin = async (e) => {
    e.preventDefault();
    setPinErrorMsg(null);
    setPinSuccessMsg(null);
    if (!dedicatedPin || dedicatedPin.length !== 4) {
      setPinErrorMsg("Le Code PIN doit comporter exactement 4 chiffres (ex: 1234).");
      return;
    }
    setDedicatedPinLoading(true);
    try {
      const res = await axios.post('/v1/auth/update-pin', { pin_code: dedicatedPin });
      setPinSuccessMsg("✅ " + (res.data.message || "Code PIN de caisse mis à jour avec succès !"));
      setDedicatedPin('');
      updateUser({ has_pin: true });
    } catch (err) {
      setPinErrorMsg(err.response?.data?.error || err.response?.data?.message || "Échec de la modification du Code PIN.");
    } finally {
      setDedicatedPinLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HANDLERS BOUTIQUES
  // ═══════════════════════════════════════════════════════════════════════════
  const openBranchForm = (branch = null) => {
    setEditingBranch(branch);
    setBranchForm(branch ? { name: branch.name, address: branch.address || '', phone: branch.phone || '' } : { name: '', address: '', phone: '' });
    setShowBranchForm(true);
    setError(null); setSuccess(null);
  };

  const handleSaveBranch = async (e) => {
    e.preventDefault();
    setBranchSaving(true); setError(null);
    try {
      if (editingBranch) {
        await axios.put(`/v1/branches/${editingBranch.id}`, branchForm);
        setSuccess("✅ Boutique mise à jour avec succès.");
      } else {
        await axios.post('/v1/branches', branchForm);
        setSuccess("✅ Boutique créée avec succès.");
      }
      setShowBranchForm(false);
      loadBranches();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la sauvegarde.");
    } finally {
      setBranchSaving(false);
    }
  };

  const handleToggleBranchStatus = async (branch) => {
    try {
      await axios.post(`/v1/branches/${branch.id}/toggle-status`);
      loadBranches();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur de modification du statut.");
    }
  };

  const handleDeleteBranch = async (branch) => {
    if (!window.confirm(`Supprimer la boutique "${branch.name}" ? Cette action est irréversible.`)) return;
    try {
      await axios.delete(`/v1/branches/${branch.id}`);
      setSuccess("✅ Boutique supprimée.");
      loadBranches();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur de suppression.");
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HANDLERS UTILISATEURS
  // ═══════════════════════════════════════════════════════════════════════════
  const openUserForm = (u = null) => {
    setEditingUser(u);
    setUserForm(u ? { name: u.name, email: u.email, password: '', pin_code: '', role_id: u.role?.id || '', branch_id: u.branch?.id || '', status: u.status } : { name: '', email: '', password: '', pin_code: '', role_id: '', branch_id: '', status: 'active' });
    setShowUserForm(true);
    setError(null); setSuccess(null);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setUserSaving(true); setError(null);
    try {
      const payload = { ...userForm };
      if (!payload.password) delete payload.password;
      if (!payload.pin_code) delete payload.pin_code;
      if (!payload.branch_id) delete payload.branch_id;
      if (editingUser) {
        await axios.put(`/v1/users/${editingUser.id}`, payload);
        setSuccess("✅ Utilisateur mis à jour.");
      } else {
        await axios.post('/v1/users', payload);
        setSuccess("✅ Utilisateur créé.");
      }
      setShowUserForm(false);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Erreur lors de la sauvegarde.");
    } finally {
      setUserSaving(false);
    }
  };

  const handleToggleUserStatus = async (u) => {
    try {
      await axios.post(`/v1/users/${u.id}/toggle-status`);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur de modification du statut.");
    }
  };

  const handleResetUserPin = async (u) => {
    const pin = window.prompt(`Saisir le nouveau code PIN (4 chiffres) pour ${u.name} :`);
    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      alert("Code PIN invalide (4 chiffres requis)."); return;
    }
    try {
      await axios.post(`/v1/users/${u.id}/reset-pin`, { pin_code: pin });
      setSuccess(`✅ Code PIN de ${u.name} réinitialisé.`);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur de réinitialisation du PIN.");
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  if (!token) {
    return (
      <div className="settings-container">
        <div className="alert-card card">
          <span style={{ fontSize: '40px' }}>🔒</span>
          <h3>Accès Réservé</h3>
          <p>Connectez-vous pour configurer l'application.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-layout card">
        <div className="settings-header">
          <div>
            <h2><i className="fa-solid fa-sliders text-primary me-2"></i> Configuration &amp; Paramètres</h2>
            <p className="settings-subtitle">Personnalisez votre boutique, la TVA, les périphériques et vos préférences de sécurité.</p>
          </div>
        </div>

        {error   && <div className="error-banner mb-3"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}
        {success && <div className="success-banner mb-3"><i className="fa-solid fa-circle-check me-1"></i> {success}</div>}

        <div className="settings-grid">
          {/* ─── SIDEBAR ─────────────────────────────────────────────── */}
          <div className="settings-sidebar">
            <button className={`settings-tab-btn ${activeTab === 'general' ? 'active' : ''}`}   onClick={() => setActiveTab('general')}>
              <i className="fa-solid fa-building me-2"></i> Entreprise
            </button>
            {isAdmin && (
              <>
                <button className={`settings-tab-btn ${activeTab === 'tva' ? 'active' : ''}`} onClick={() => setActiveTab('tva')}>
                  <i className="fa-solid fa-percent me-2"></i> TVA &amp; Fiscalité
                </button>
                <button className={`settings-tab-btn ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => setActiveTab('rules')}>
                  <i className="fa-solid fa-sliders me-2"></i> Règles de Gestion
                </button>
                <button className={`settings-tab-btn ${activeTab === 'roles_zones' ? 'active' : ''}`} onClick={() => setActiveTab('roles_zones')}>
                  <i className="fa-solid fa-user-lock me-2"></i> Rôles &amp; Zones d'Accès
                </button>
              </>
            )}

            <button className={`settings-tab-btn ${activeTab === 'subscription' ? 'active' : ''}`} onClick={() => setActiveTab('subscription')}>
              <i className="fa-solid fa-file-invoice-dollar me-2 text-success"></i> Abonnement &amp; Factures
            </button>
            <button className={`settings-tab-btn ${activeTab === 'pos' ? 'active' : ''}`}       onClick={() => setActiveTab('pos')}>
              <i className="fa-solid fa-print me-2"></i> Terminal de caisse
            </button>
            <button className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}   onClick={() => setActiveTab('profile')}>
              <i className="fa-solid fa-user-gear me-2"></i> Mon Profil
            </button>
            <button className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}  onClick={() => setActiveTab('security')}>
              <i className="fa-solid fa-shield-halved me-2"></i> Sécurité
            </button>
            <button className={`settings-tab-btn ${activeTab === 'system' ? 'active' : ''}`}    onClick={() => setActiveTab('system')}>
              <i className="fa-solid fa-hard-drive me-2"></i> Système
            </button>
          </div>

          {/* ─── CONTENU ─────────────────────────────────────────────── */}
          <div className="settings-content">

            {/* ══════════════ ONGLET 1 : ENTREPRISE ══════════════ */}
            {activeTab === 'general' && (
              <form onSubmit={handleSaveCompany}>
                <h3>🏢 Informations de l'entreprise</h3>
                
                {/* Carte Code Entreprise Unique */}
                <div className="p-3 mb-4 rounded border d-flex justify-content-between align-items-center" style={{ background: 'var(--bg-input)', border: '2px solid var(--color-primary)', borderRadius: 'var(--border-radius)' }}>
                  <div>
                    <strong style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      🔑 Code de Connexion Caisse de l'Entreprise
                    </strong>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '3px', marginTop: '2px' }}>
                      {user?.company?.code || 'X8M4-K92P'}
                    </div>
                    <small className="text-muted">Communiquez ce code alphanumérique à vos caissiers pour la connexion par PIN.</small>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={async () => {
                      try {
                        const code = user?.company?.code || '';
                        if (navigator?.clipboard?.writeText) {
                          await navigator.clipboard.writeText(code);
                        } else {
                          const textArea = document.createElement('textarea');
                          textArea.value = code;
                          document.body.appendChild(textArea);
                          textArea.select();
                          document.execCommand('copy');
                          document.body.removeChild(textArea);
                        }
                        setSuccess("✅ Code entreprise copié dans le presse-papier !");
                      } catch (err) {
                        alert(`Code entreprise : ${user?.company?.code || ''}`);
                      }
                    }}
                  >
                    <i className="fa-solid fa-copy me-1"></i> Copier
                  </button>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6 form-group">
                    <label className="form-label">Nom de la compagnie *</label>
                    <input type="text" className="form-control" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="form-label">Adresse E-mail de contact</label>
                    <input type="email" className="form-control" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label className="form-label">Téléphone de la boutique</label>
                    <input type="text" className="form-control" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="form-label">Adresse physique</label>
                    <input type="text" className="form-control" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Logo officiel de l'entreprise</label>
                  <small className="text-muted d-block mb-2">
                    <i className="fa-solid fa-circle-info me-1"></i>
                    S'affichera dans la barre de navigation, l'onglet navigateur et les tickets de caisse.
                  </small>
                  {logoPreview && (
                    <div className="mb-2 p-2 rounded border d-flex align-items-center gap-3" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
                      <img src={logoPreview} alt="Logo Entreprise" style={{ maxHeight: '55px', maxWidth: '160px', borderRadius: '6px', objectFit: 'contain' }} />
                      <div>
                        <span className="text-success small fw-bold"><i className="fa-solid fa-circle-check me-1"></i> Logo Actif</span>
                        <div className="text-muted style-xs">Afficha dans la navbar et les tickets.</div>
                      </div>
                    </div>
                  )}
                  <input type="file" className="form-control" accept="image/*" onChange={(e) => {
                    const file = e.target.files[0];
                    setCompanyLogo(file);
                    if (file) setLogoPreview(URL.createObjectURL(file));
                  }} />
                </div>

                {/* Slogan de l'entreprise */}
                <div className="form-group mt-3">
                  <label className="form-label">
                    <i className="fa-solid fa-quote-left me-2 text-primary"></i>
                    Slogan de l'entreprise
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: La qualité à votre service depuis 2010"
                    maxLength={255}
                    value={companySlogan}
                    onChange={(e) => setCompanySlogan(e.target.value)}
                  />
                  <small className="text-muted">
                    Afficha sous le nom de votre entreprise dans la barre de navigation et l'onglet du navigateur.
                  </small>
                </div>

                {/* Favicon personnalisé */}
                <div className="form-group mt-3">
                  <label className="form-label">
                    <i className="fa-solid fa-image me-2 text-primary"></i>
                    Favicon de l'application (icône onglet navigateur)
                  </label>
                  <small className="text-muted d-block mb-2">
                    Petite icône carrée (16×16 ou 32×32 px) qui s'affiche dans l'onglet du navigateur. PNG/ICO recommandé. Max 512 Ko.
                    Si non renseigné, votre logo sera utilisé.
                  </small>
                  {faviconPreview && (
                    <div className="mb-2 p-2 rounded border d-flex align-items-center gap-3" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
                      <img src={faviconPreview} alt="Favicon" style={{ height: '32px', width: '32px', borderRadius: '4px', objectFit: 'contain' }} />
                      <span className="text-success small fw-bold"><i className="fa-solid fa-circle-check me-1"></i> Favicon actif</span>
                    </div>
                  )}
                  <input type="file" className="form-control" accept="image/png,image/ico,image/svg+xml,image/jpeg,image/webp" onChange={(e) => {
                    const file = e.target.files[0];
                    setCompanyFavicon(file);
                    if (file) setFaviconPreview(URL.createObjectURL(file));
                  }} />
                </div>
                <div className="row">
                  <div className="col-md-4 form-group">
                    <label className="form-label">Devise de transaction</label>
                    <select className="form-control" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                      <option value="XOF">Franc CFA (XOF)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">Dollar ($)</option>
                    </select>
                  </div>
                  <div className="col-md-4 form-group">
                    <label className="form-label">Fuseau horaire</label>
                    <select className="form-control" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                      <option value="Africa/Dakar">Africa/Dakar (Sénégal)</option>
                      <option value="Africa/Abidjan">Africa/Abidjan (Côte d'Ivoire)</option>
                      <option value="Europe/Paris">Europe/Paris (France)</option>
                    </select>
                  </div>
                  <div className="col-md-4 form-group">
                    <label className="form-label">Langue</label>
                    <select className="form-control" value={language} onChange={(e) => setLanguage(e.target.value)}>
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 text-end">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    <i className="fa-solid fa-circle-check me-1"></i> Enregistrer les modifications
                  </button>
                </div>
              </form>
            )}

            {/* ══════════════ ONGLET TVA ══════════════ */}
            {activeTab === 'tva' && isAdmin && (
              <form onSubmit={handleSaveTax}>
                <h3>🧾 Paramétrage de la TVA</h3>
                <p className="text-muted small mb-4">Configurez le taux de TVA appliqué sur les ventes. Ce réglage est pris en compte en temps réel sur le terminal de caisse.</p>

                <div className="tva-card">
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <label className="form-label mb-0" style={{ minWidth: '140px', fontWeight: 700 }}>Activer la TVA</label>
                    <button
                      type="button"
                      className={`toggle-btn ${enableTax ? 'toggle-on' : 'toggle-off'}`}
                      onClick={() => setEnableTax(!enableTax)}
                    >
                      <span className="toggle-knob"></span>
                      <span style={{ marginLeft: '8px', fontSize: '13px', fontWeight: 600 }}>
                        {enableTax ? 'Activée' : 'Désactivée'}
                      </span>
                    </button>
                  </div>

                  {enableTax && (
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 700 }}>Taux de TVA (%)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="number"
                          className="form-control"
                          style={{ maxWidth: '140px', fontSize: '20px', fontWeight: 700, textAlign: 'center' }}
                          min="0" max="100" step="0.1"
                          value={taxRate}
                          onChange={(e) => setTaxRate(e.target.value === '' ? '' : (parseFloat(e.target.value) || 0))}
                          onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                          inputMode="decimal"
                          required
                        />
                        <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)' }}>%</span>
                        <div className="tva-presets">
                          {[0, 5, 10, 18, 20].map(v => (
                            <button key={v} type="button" className={`preset-btn ${taxRate === v ? 'active' : ''}`} onClick={() => setTaxRate(v)}>
                              {v}%
                            </button>
                          ))}
                        </div>
                      </div>
                      <small className="text-muted">Taux standards : 0% (exonéré) · 5% (réduit) · 10% · 18% (standard Sénégal) · 20% (Europe)</small>
                    </div>
                  )}

                  <div className="tva-preview mt-4">
                    <div className="tva-preview-label">Aperçu sur une vente de 10 000 XOF</div>
                    <div className="tva-preview-row">
                      <span>Prix HT</span><span>10 000 XOF</span>
                    </div>
                    <div className="tva-preview-row">
                      <span>TVA ({enableTax ? taxRate : 0}%)</span>
                      <span>{enableTax ? Math.round(10000 * taxRate / 100).toLocaleString() : 0} XOF</span>
                    </div>
                    <div className="tva-preview-row tva-total">
                      <span>Prix TTC</span>
                      <span>{(10000 + (enableTax ? Math.round(10000 * taxRate / 100) : 0)).toLocaleString()} XOF</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-end">
                  <button type="submit" className="btn btn-primary" disabled={taxLoading}>
                    <i className="fa-solid fa-circle-check me-1"></i>
                    {taxLoading ? 'Enregistrement...' : 'Enregistrer le paramétrage TVA'}
                  </button>
                </div>
              </form>
            )}

            {/* ══════════════ ONGLET BOUTIQUES ══════════════ */}
            {activeTab === 'branches' && isAdmin && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0 }}>🏪 Gestion des Boutiques</h3>
                  <button className="btn btn-primary btn-sm" onClick={() => openBranchForm()}>
                    <i className="fa-solid fa-plus me-1"></i> Nouvelle boutique
                  </button>
                </div>

                {showBranchForm && (
                  <div className="inline-form-card">
                    <h4 style={{ marginBottom: '16px', fontWeight: 700 }}>
                      {editingBranch ? '✏️ Modifier la boutique' : '➕ Nouvelle boutique'}
                    </h4>
                    <form onSubmit={handleSaveBranch}>
                      <div className="row">
                        <div className="col-md-6 form-group">
                          <label className="form-label">Nom de la boutique *</label>
                          <input type="text" className="form-control" required
                            value={branchForm.name} onChange={e => setBranchForm({...branchForm, name: e.target.value})} />
                        </div>
                        <div className="col-md-6 form-group">
                          <label className="form-label">Téléphone</label>
                          <input type="text" className="form-control"
                            value={branchForm.phone} onChange={e => setBranchForm({...branchForm, phone: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Adresse</label>
                        <input type="text" className="form-control"
                          value={branchForm.address} onChange={e => setBranchForm({...branchForm, address: e.target.value})} />
                      </div>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowBranchForm(false)}>Annuler</button>
                        <button type="submit" className="btn btn-primary btn-sm" disabled={branchSaving}>
                          {branchSaving ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {branchesLoading ? (
                  <p className="text-muted text-center">Chargement des boutiques...</p>
                ) : branches.length === 0 ? (
                  <div className="empty-state">
                    <i className="fa-solid fa-store" style={{ fontSize: '32px', color: 'var(--text-muted)', marginBottom: '12px' }}></i>
                    <p>Aucune boutique enregistrée.</p>
                  </div>
                ) : (
                  <div className="management-table">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Boutique</th><th>Adresse</th><th>Téléphone</th><th>Utilisateurs</th><th>Statut</th><th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {branches.map(b => (
                          <tr key={b.id}>
                            <td><strong>{b.name}</strong></td>
                            <td>{b.address || <span className="text-muted">—</span>}</td>
                            <td>{b.phone || <span className="text-muted">—</span>}</td>
                            <td><span className="badge-count">{b.users_count ?? 0}</span></td>
                            <td>
                              <span className={`status-badge ${(b.status ?? 'active') === 'active' ? 'status-active' : 'status-inactive'}`}>
                                {(b.status ?? 'active') === 'active' ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button className="btn btn-xs btn-secondary" onClick={() => openBranchForm(b)} title="Modifier">
                                  <i className="fa-solid fa-pen"></i>
                                </button>
                                <button className={`btn btn-xs ${(b.status ?? 'active') === 'active' ? 'btn-warning' : 'btn-success'}`}
                                  onClick={() => handleToggleBranchStatus(b)} title="Activer/Désactiver">
                                  <i className={`fa-solid ${(b.status ?? 'active') === 'active' ? 'fa-pause' : 'fa-play'}`}></i>
                                </button>
                                <button className="btn btn-xs btn-danger" onClick={() => handleDeleteBranch(b)} title="Supprimer">
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
            )}

            {/* ══════════════ ONGLET UTILISATEURS ══════════════ */}
            {activeTab === 'users' && isAdmin && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0 }}>👥 Gestion des Utilisateurs</h3>
                  <button className="btn btn-primary btn-sm" onClick={() => openUserForm()}>
                    <i className="fa-solid fa-user-plus me-1"></i> Nouvel utilisateur
                  </button>
                </div>

                {showUserForm && (
                  <div className="inline-form-card">
                    <h4 style={{ marginBottom: '16px', fontWeight: 700 }}>
                      {editingUser ? '✏️ Modifier l\'utilisateur' : '➕ Nouvel utilisateur'}
                    </h4>
                    <form onSubmit={handleSaveUser}>
                      <div className="row">
                        <div className="col-md-6 form-group">
                          <label className="form-label">Nom complet *</label>
                          <input type="text" className="form-control" required
                            value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} />
                        </div>
                        <div className="col-md-6 form-group">
                          <label className="form-label">E-mail *</label>
                          <input type="email" className="form-control" required
                            value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-4 form-group">
                          <label className="form-label">Mot de passe {editingUser ? '(vide = inchangé)' : '*'}</label>
                          <PasswordInput required={!editingUser}
                            value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} />
                        </div>
                        <div className="col-md-4 form-group">
                          <label className="form-label">Code PIN {editingUser ? '(vide = inchangé)' : '*'} (4 chiffres)</label>
                          <input type="text" className="form-control" maxLength="4" pattern="\d{4}" required={!editingUser}
                            placeholder="Ex: 1234"
                            value={userForm.pin_code} onChange={e => setUserForm({...userForm, pin_code: e.target.value.replace(/\D/g, '')})} />
                        </div>
                        <div className="col-md-4 form-group">
                          <label className="form-label">Statut</label>
                          <select className="form-control" value={userForm.status} onChange={e => setUserForm({...userForm, status: e.target.value})}>
                            <option value="active">Actif</option>
                            <option value="inactive">Inactif</option>
                          </select>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 form-group">
                          <label className="form-label">Rôle *</label>
                          <select className="form-control" required value={userForm.role_id} onChange={e => setUserForm({...userForm, role_id: e.target.value})}>
                            <option value="">— Sélectionner un rôle —</option>
                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                          </select>
                        </div>
                        <div className="col-md-6 form-group">
                          <label className="form-label">Boutique rattachée</label>
                          <select className="form-control" value={userForm.branch_id} onChange={e => setUserForm({...userForm, branch_id: e.target.value})}>
                            <option value="">— Toutes les boutiques —</option>
                            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowUserForm(false)}>Annuler</button>
                        <button type="submit" className="btn btn-primary btn-sm" disabled={userSaving}>
                          {userSaving ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {usersLoading ? (
                  <p className="text-muted text-center">Chargement des utilisateurs...</p>
                ) : users.length === 0 ? (
                  <div className="empty-state">
                    <i className="fa-solid fa-users" style={{ fontSize: '32px', color: 'var(--text-muted)', marginBottom: '12px' }}></i>
                    <p>Aucun utilisateur enregistré.</p>
                  </div>
                ) : (
                  <div className="management-table">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Nom</th><th>E-mail</th><th>Rôle</th><th>Boutique</th><th>Statut</th><th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div className="user-avatar-mini">{u.name.charAt(0)}</div>
                                <strong>{u.name}</strong>
                              </div>
                            </td>
                            <td>{u.email}</td>
                            <td><span className="badge-role">{u.role?.name || '—'}</span></td>
                            <td>{u.branch?.name || <span className="text-muted">—</span>}</td>
                            <td>
                              <span className={`status-badge ${u.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                                {u.status === 'active' ? 'Actif' : 'Inactif'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button className="btn btn-xs btn-secondary" onClick={() => openUserForm(u)} title="Modifier">
                                  <i className="fa-solid fa-pen"></i>
                                </button>
                                <button className="btn btn-xs btn-info" onClick={() => handleResetUserPin(u)} title="Réinitialiser le PIN">
                                  <i className="fa-solid fa-key"></i>
                                </button>
                                <button className={`btn btn-xs ${u.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                                  onClick={() => handleToggleUserStatus(u)} title="Activer/Désactiver">
                                  <i className={`fa-solid ${u.status === 'active' ? 'fa-user-slash' : 'fa-user-check'}`}></i>
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
            )}

            {/* ══════════════ ONGLET : ABONNEMENT & FACTURES ══════════════ */}
            {activeTab === 'subscription' && (
              <div>
                <h3>💳 Formule d'Abonnement &amp; Factures de l'Entreprise</h3>
                <p className="text-muted mb-4">Consultez l'état de votre offre SaaS et la liste de toutes vos factures d'abonnement.</p>

                {mySubLoading ? (
                  <div className="loading-spinner">Chargement des détails d'abonnement et factures...</div>
                ) : (
                  <>
                    {/* Carte Statut Abonnement */}
                    <div className="card p-4 mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)' }}>
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                          <span className="badge badge-primary mb-2" style={{ textTransform: 'uppercase', padding: '6px 12px', fontSize: '12px' }}>
                            Formule Actuelle : {mySubData?.company?.subscription_plan || user?.company?.subscription_plan || 'Pro'}
                          </span>
                          <h4 className="m-0" style={{ fontWeight: 800 }}>{mySubData?.company?.name || user?.company?.name}</h4>
                          <p className="text-muted mb-0 mt-1" style={{ fontSize: '13px' }}>
                            Date d'échéance : <strong>{mySubData?.company?.subscription_expires_at ? new Date(mySubData.company.subscription_expires_at).toLocaleDateString('fr-FR') : 'Licence active'}</strong>
                          </p>
                        </div>
                        <div>
                          <span className={`badge ${mySubData?.company?.status === 'active' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '14px', padding: '8px 16px' }}>
                            <i className="fa-solid fa-circle-check me-1"></i> {mySubData?.company?.status === 'active' ? 'Abonnement Actif' : 'Compte Suspendu'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tableau des Factures Reçues */}
                    <h4 className="mb-3"><i className="fa-solid fa-file-invoice me-2 text-primary"></i> Historique de vos Factures d'Abonnement</h4>
                    {!mySubData?.invoices || mySubData.invoices.length === 0 ? (
                      <div className="alert alert-info">
                        <i className="fa-solid fa-info-circle me-2"></i> Aucune facture d'abonnement émise pour le moment.
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>N° Facture</th>
                              <th>Période / Formule</th>
                              <th>Montant Total</th>
                              <th>Date d'émission</th>
                              <th>Date limite</th>
                              <th>Statut</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mySubData.invoices.map(inv => (
                              <tr key={inv.id}>
                                <td><strong className="text-primary">{inv.invoice_number}</strong></td>
                                <td>{inv.billing_period}</td>
                                <td><strong>{new Intl.NumberFormat('fr-FR').format(inv.total_amount)} FCFA</strong></td>
                                <td>{inv.issue_date ? new Date(inv.issue_date).toLocaleDateString('fr-FR') : '—'}</td>
                                <td>{inv.due_date ? new Date(inv.due_date).toLocaleDateString('fr-FR') : '—'}</td>
                                <td>
                                  <span className={`badge ${inv.status === 'paid' ? 'badge-success' : (inv.status === 'issued' ? 'badge-warning' : 'badge-secondary')}`}>
                                    {inv.status === 'paid' ? 'Payée' : (inv.status === 'issued' ? 'À Régler / Émise' : inv.status)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ══════════════ ONGLET TERMINAL POS ══════════════ */}
            {activeTab === 'pos' && (
              <form onSubmit={handleSavePOS}>
                <h3>🔌 Terminal POS &amp; Périphériques</h3>
                <p className="text-muted small mb-4">Configurez les périphériques physiques connectés à ce terminal de caisse.</p>

                <div className="row mt-3">
                  <div className="col-md-6 form-group">
                    <label className="form-label">Nom du Point de Vente (Caisse)</label>
                    <input type="text" className="form-control" value={posName} onChange={(e) => setPosName(e.target.value)} />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="form-label">Imprimante de Ticket par défaut</label>
                    <select className="form-control" value={printerModel} onChange={(e) => setPrinterModel(e.target.value)}>
                      <option value="Epson TM-T20III">Epson TM-T20III (Thermique USB)</option>
                      <option value="Star Micronics TSP143">Star Micronics TSP143 (Réseau)</option>
                      <option value="Generic 80mm">Imprimante 80mm Générique</option>
                      <option value="Generic 58mm">Imprimante 58mm Générique</option>
                      <option value="PDF/A4">Impression Standard A4 / PDF</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label className="form-label">Format / Largeur d'impression</label>
                    <select className="form-control" value={printerWidth} onChange={(e) => setPrinterWidth(e.target.value)}>
                      <option value="80">Large (80mm) - Recommandé POS</option>
                      <option value="58">Compact (58mm)</option>
                      <option value="A4">Format Facture A4</option>
                    </select>
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="form-label">Sélecteur de Lecteur Code-barres</label>
                    <select className="form-control" value={scannerInterface} onChange={(e) => setScannerInterface(e.target.value)}>
                      <option value="USB-HID">Clavier Émulé (USB-HID)</option>
                      <option value="Virtual-COM">Port Série Virtuel (V-COM)</option>
                    </select>
                  </div>
                </div>

                <div className="panel-divider my-4" style={{ borderTop: '1px solid var(--border-color)' }} />

                {/* SECTION PERSONNALISATION TICKETS & FACTURES */}
                <h3>🧾 Personnalisation des Tickets &amp; Factures</h3>
                <p className="text-muted small mb-3">Définissez les messages et informations légales figurant sur vos reçus imprimés.</p>

                <div className="row">
                  <div className="col-md-6 form-group">
                    <label className="form-label">Message d'En-tête de Ticket</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ex: Bienvenue chez Quincaillerie Pro"
                      value={receiptHeader}
                      onChange={(e) => setReceiptHeader(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="form-label">Mentions Légales (N° IFU / RCCM)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ex: RCCM: CI-ABJ-2026-B-12345 • IFU: 02026123456"
                      value={receiptRccmIfu}
                      onChange={(e) => setReceiptRccmIfu(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Message de Pied de Page (Bas de ticket / Conditions de retour)</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Ex: Merci de votre visite ! Les marchandises vendues ne sont ni reprises ni échangées."
                    value={receiptFooter}
                    onChange={(e) => setReceiptFooter(e.target.value)}
                  ></textarea>
                </div>

                <div className="row mt-3">
                  <div className="col-md-4 form-group">
                    <div className="form-check form-switch pt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="showLogoCheck"
                        checked={showLogoOnReceipt}
                        onChange={(e) => setShowLogoOnReceipt(e.target.checked)}
                      />
                      <label className="form-check-label fw-bold" htmlFor="showLogoCheck">
                        Afficher le logo entreprise sur le ticket
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4 form-group">
                    <div className="form-check form-switch pt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="showCustomerCheck"
                        checked={showCustomerInfo}
                        onChange={(e) => setShowCustomerInfo(e.target.checked)}
                      />
                      <label className="form-check-label fw-bold" htmlFor="showCustomerCheck">
                        Afficher les infos client sur le reçu
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4 form-group">
                    <div className="form-check form-switch pt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="autoPrintCheck"
                        checked={autoPrintReceipt}
                        onChange={(e) => setAutoPrintReceipt(e.target.checked)}
                      />
                      <label className="form-check-label fw-bold" htmlFor="autoPrintCheck">
                        Impression automatique après vente
                      </label>
                    </div>
                  </div>
                </div>

                <div className="panel-divider my-4" style={{ borderTop: '1px solid var(--border-color)' }} />

                {/* SECTION RÈGLES DE GESTION DE CAISSE & AUTORISATIONS */}
                <h3>🔒 Règles d'Ouverture &amp; Autorisations Caisse</h3>
                <p className="text-muted small mb-3">Définissez les contraintes de sécurité et d'habilitation pour les caissiers de votre entreprise.</p>

                <div className="p-3 rounded border mb-3" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
                  <div className="mb-3 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                    <label className="form-label fw-bold d-flex alignItems-center gap-2">
                      <i className="fa-solid fa-user-lock text-warning" style={{ fontSize: '18px' }}></i>
                      Temps de verrouillage automatique par inactivité
                    </label>
                    <select 
                      className="form-select fw-bold"
                      value={autoLockDuration}
                      onChange={(e) => setAutoLockDuration(parseInt(e.target.value))}
                      style={{ maxWidth: '320px' }}
                    >
                      <option value={1}>⏱️ 1 minute d'inactivité</option>
                      <option value={2}>⏱️ 2 minutes d'inactivité</option>
                      <option value={3}>⏱️ 3 minutes d'inactivité (Recommandé)</option>
                      <option value={5}>⏱️ 5 minutes d'inactivité</option>
                      <option value={10}>⏱️ 10 minutes d'inactivité</option>
                      <option value={15}>⏱️ 15 minutes d'inactivité</option>
                      <option value={30}>⏱️ 30 minutes d'inactivité</option>
                      <option value={0}>🚫 Désactivé (Ne jamais verrouiller)</option>
                    </select>
                    <div className="text-muted small mt-1">
                      Délai d'inactivité humaine avant que l'écran de verrouillage avec code PIN Caisse ne s'affiche automatiquement.
                    </div>
                  </div>

                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="reqCashCheck"
                      checked={requireInitialCash}
                      onChange={(e) => setRequireInitialCash(e.target.checked)}
                    />
                    <label className="form-check-label fw-bold" htmlFor="reqCashCheck">
                      Fond de caisse initial obligatoire à l'ouverture
                    </label>
                    <div className="text-muted small ms-1">Exige que le caissier saisisse le montant du fond de caisse au démarrage de la session.</div>
                  </div>

                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="reqPinOpenCheck"
                      checked={requireManagerPinForOpen}
                      onChange={(e) => setRequireManagerPinForOpen(e.target.checked)}
                    />
                    <label className="form-check-label fw-bold" htmlFor="reqPinOpenCheck">
                      Validation par PIN Gérant obligatoire pour ouvrir la caisse
                    </label>
                    <div className="text-muted small ms-1">Un gérant doit saisir son code PIN de sécurité pour autoriser l'ouverture de chaque session de caisse.</div>
                  </div>

                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="reqPinDiscCheck"
                      checked={requireManagerPinForDiscrepancy}
                      onChange={(e) => setRequireManagerPinForDiscrepancy(e.target.checked)}
                    />
                    <label className="form-check-label fw-bold" htmlFor="reqPinDiscCheck">
                      Validation par PIN Gérant obligatoire en cas d'écart de clôture
                    </label>
                    <div className="text-muted small ms-1">Empêche le caissier de valider une clôture avec un écart financier sans l'approbation explicite du responsable.</div>
                  </div>

                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="hideTheoCheck"
                      checked={hideTheoreticalCashBeforeClose}
                      onChange={(e) => setHideTheoreticalCashBeforeClose(e.target.checked)}
                    />
                    <label className="form-check-label fw-bold" htmlFor="hideTheoCheck">
                      Masquer le montant théorique attendu avant le comptage final
                    </label>
                    <div className="text-muted small ms-1">Force le caissier à faire un comptage physique à l'aveugle avant d'afficher les écarts.</div>
                  </div>
                </div>

                <div className="mt-4 text-end">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    <i className="fa-solid fa-circle-check me-1"></i> {loading ? 'Enregistrement...' : 'Enregistrer la configuration & règles POS'}
                  </button>
                </div>
              </form>
            )}

            {/* ══════════════ ONGLET PROFIL ══════════════ */}
            {activeTab === 'profile' && (
              <div>
                <form onSubmit={handleUpdateProfile}>
                  <h3>👤 Mon Profil Utilisateur</h3>
                  <div className="row mt-3">
                    <div className="col-md-6 form-group">
                      <label className="form-label">Nom complet</label>
                      <input type="text" className="form-control" value={userName} onChange={(e) => setUserName(e.target.value)} required />
                    </div>
                    <div className="col-md-6 form-group">
                      <label className="form-label">Adresse E-mail</label>
                      <input type="email" className="form-control" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
                    </div>
                  </div>
                  <div className="mt-3 text-end">
                    <button type="submit" className="btn btn-secondary btn-sm" disabled={loading}>
                      <i className="fa-solid fa-user-pen me-1"></i> {loading ? 'Sauvegarde...' : 'Mettre à jour les informations du profil'}
                    </button>
                  </div>
                </form>

                {/* ══════════════ SECTION CODE PIN DE CAISSE DÉDIÉE ══════════════ */}
                <div className="card p-3 my-4" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                        <i className="fa-solid fa-key text-primary me-2"></i> Code PIN Caisse POS (4 chiffres)
                      </h4>
                      <small className="text-muted">Utilisé pour la connexion rapide et le déverrouillage de caisse sur les terminaux POS.</small>
                    </div>
                    <div>
                      {(user?.has_pin || user?.hasPin || user?.pin_code || user?.is_pin_auth) ? (
                        <span className="badge bg-success" style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px' }}>
                          <i className="fa-solid fa-shield-halved me-1"></i> PIN Actif (Configuré)
                        </span>
                      ) : (
                        <span className="badge bg-warning text-dark" style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px' }}>
                          <i className="fa-solid fa-triangle-exclamation me-1"></i> Aucun PIN configuré
                        </span>
                      )}
                    </div>
                  </div>

                  {user?.plain_pin && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--bg-main)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px dashed #10b981',
                      marginBottom: '16px',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                          <i className="fa-solid fa-shield text-success me-1"></i> Code PIN Caisse Actuel :
                        </span>
                        <span style={{
                          fontFamily: 'monospace',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          letterSpacing: showCurrentPin ? '3px' : '6px',
                          color: '#10b981'
                        }}>
                          {showCurrentPin ? user.plain_pin : '••••'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setShowCurrentPin(!showCurrentPin)}
                          title={showCurrentPin ? "Masquer le PIN" : "Afficher le PIN"}
                        >
                          <i className={showCurrentPin ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i> {showCurrentPin ? 'Masquer' : 'Afficher'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success"
                          onClick={() => {
                            navigator.clipboard.writeText(user.plain_pin);
                            setCopiedPin(true);
                            setTimeout(() => setCopiedPin(false), 2000);
                          }}
                        >
                          <i className={copiedPin ? "fa-solid fa-check" : "fa-solid fa-copy"}></i> {copiedPin ? 'Copié !' : 'Copier le PIN'}
                        </button>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSaveDedicatedPin} style={{ marginTop: '8px' }}>
                    {pinSuccessMsg && <div className="success-banner mb-2" style={{ fontSize: '13px' }}>{pinSuccessMsg}</div>}
                    {pinErrorMsg && <div className="error-banner mb-2" style={{ fontSize: '13px' }}>{pinErrorMsg}</div>}
                    
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '220px', maxWidth: '280px' }}>
                        <PasswordInput
                          value={dedicatedPin}
                          onChange={(e) => setDedicatedPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="Saisir un nouveau PIN (4 chiffres)"
                          maxLength="4"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          autoComplete="new-password"
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={dedicatedPinLoading || dedicatedPin.length !== 4}
                        style={{ whiteSpace: 'nowrap', fontWeight: 700 }}
                      >
                        <i className="fa-solid fa-floppy-disk me-1"></i> {dedicatedPinLoading ? 'Enregistrement...' : 'Enregistrer le Code PIN'}
                      </button>
                    </div>
                    <small className="text-muted d-block mt-2" style={{ fontSize: '12px' }}>
                      💡 Saisissez 4 chiffres pour modifier ou mettre à jour votre PIN Caisse (ex: 9876). Le PIN actuel est masqué et sécurisé.
                    </small>
                  </form>
                </div>

                {/* ══════════════ SECTION CHANGEMENT DE MOT DE PASSE COMPTE ══════════════ */}
                <div className="card p-3 my-4" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                    <i className="fa-solid fa-lock text-warning me-2"></i> Modifier le Mot de Passe du Compte (Connexion E-mail)
                  </h4>
                  <small className="text-muted">Ce mot de passe est utilisé pour la connexion classique par E-mail + Mot de passe (min. 8 caractères, majuscule, chiffre).</small>
                  
                  <form onSubmit={handleUpdateProfile} style={{ marginTop: '16px' }}>
                    <div className="form-group mb-3">
                      <label className="form-label" style={{ fontWeight: 600 }}>Mot de passe actuel</label>
                      <PasswordInput value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Indispensable pour valider le changement" autoComplete="new-password" />
                    </div>
                    <div className="row">
                      <div className="col-md-6 form-group mb-3">
                        <label className="form-label" style={{ fontWeight: 600 }}>Nouveau mot de passe</label>
                        <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 8 caractères, 1 Majuscule, 1 Chiffre" />
                      </div>
                      <div className="col-md-6 form-group mb-3">
                        <label className="form-label" style={{ fontWeight: 600 }}>Confirmer le nouveau mot de passe</label>
                        <PasswordInput value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} placeholder="Confirmer le nouveau mot de passe" />
                      </div>
                    </div>
                    <div className="text-end mt-2">
                      <button type="submit" className="btn btn-primary btn-sm" disabled={loading || !newPassword}>
                        <i className="fa-solid fa-key me-1"></i> {loading ? 'Modification...' : 'Mettre à jour le mot de passe'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ══════════════ ONGLET SÉCURITÉ ══════════════ */}
            {activeTab === 'security' && (
              <div>
                <h3>🛡️ Sécurité &amp; Double Authentification (2FA)</h3>
                <p className="text-muted small mt-2">Sécurisez votre compte utilisateur contre les usurpations d'identité.</p>
                <div className="mt-4 p-3 bg-input rounded border d-flex justify-content-between align-items-center" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)' }}>
                  <div>
                    <strong>Double Authentification par application mobile (2FA)</strong>
                    <p className="text-muted small mb-0">Utilisez Google Authenticator ou Authy pour valider chaque connexion.</p>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => alert("L'activation de l'authentification 2FA nécessite la configuration de votre serveur de mails.")}>
                    Activer le 2FA
                  </button>
                </div>
                <div className="panel-divider my-4" style={{ borderTop: '1px solid var(--border-color)' }} />
                <h3>🖥️ Sessions de connexions actives</h3>
                <div className="table-responsive mt-3">
                  <table className="table table-striped table-hover align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>Adresse IP</th><th>Navigateur / OS</th><th>Date &amp; Heure</th><th style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeSessions.map(session => (
                        <tr key={session.id}>
                          <td><code>{session.ip}</code> {session.current && <span className="badge bg-success ms-1">Session courante</span>}</td>
                          <td>{session.agent}</td>
                          <td>{session.date}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button className="btn btn-sm btn-danger" disabled={session.current}>Déconnecter</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══════════════ ONGLET SYSTÈME ══════════════ */}
            {activeTab === 'system' && (
              <div>
                <h3>⚙️ Diagnostics Système</h3>
                <div className="row mt-4 g-3">
                  <div className="col-md-6">
                    <div className="p-3 border rounded text-left" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)' }}>
                      <strong>Version du Core POS</strong>
                      <p className="text-muted small mb-0">{appVersion}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 border rounded text-left" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)' }}>
                      <strong>Statut API Backend</strong>
                      <p className="text-success small mb-0"><i className="fa-solid fa-circle-check me-1"></i> Opérationnel • Connexion stable</p>
                    </div>
                  </div>
                </div>
                <div className="panel-divider my-4" style={{ borderTop: '1px solid var(--border-color)' }} />
                <h3>🗄️ Journal Système &amp; Diagnostic</h3>
                <div className="mt-3 p-3 bg-dark rounded border text-left" style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 'var(--border-radius-sm)', fontFamily: 'Courier New, monospace', fontSize: '11px', color: '#10B981' }}>
                  [2026-07-21 10:00:00] local.INFO: TenantManager set active company. <br />
                  [2026-07-21 10:00:01] local.INFO: Settings loaded dynamically. <br />
                  [2026-07-21 10:00:02] local.INFO: Role middleware registered OK.
                </div>
              </div>
            )}

            {/* ══════════════ ONGLET RÈGLES DE GESTION ══════════════ */}
            {activeTab === 'rules' && (
              <BusinessRulesPanel />
            )}

            {/* ══════════════ ONGLET RÔLES & ZONES D'ACCÈS ══════════════ */}
            {activeTab === 'roles_zones' && (
              <div>
                <h3>🔒 Rôles Personnalisés & Zones d'Accès du Personnel</h3>
                <p className="text-muted small mb-4">Gérez la sécurité, les droits d'accès et les périmètres d'intervention de votre équipe.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <div className="card p-4 text-center" style={{ background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '40px' }}>🔑</span>
                    <h4 className="mt-2" style={{ fontWeight: 800 }}>Rôles & Permissions</h4>
                    <p className="text-muted small">Créez des rôles personnalisés (ex: Vendeur, Magasinier) avec des permissions granulaires.</p>
                    <button type="button" onClick={() => setShowRolesModal(true)} className="btn btn-primary w-100 mt-2" style={{ fontWeight: 700 }}>
                      Gérer les Rôles Personnalisés
                    </button>
                  </div>

                  <div className="card p-4 text-center" style={{ background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '40px' }}>📍</span>
                    <h4 className="mt-2" style={{ fontWeight: 800 }}>Zones d'Accès</h4>
                    <p className="text-muted small">Restreignez le périmètre du personnel à certaines boutiques ou modules spécifiques.</p>
                    <button type="button" onClick={() => setShowZonesModal(true)} className="btn btn-secondary w-100 mt-2" style={{ fontWeight: 700 }}>
                      Gérer les Zones d'Accès
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <CustomRolesModal isOpen={showRolesModal} onClose={() => setShowRolesModal(false)} />
      <AccessZonesModal isOpen={showZonesModal} onClose={() => setShowZonesModal(false)} />

      <style>{`
        .settings-container { position: relative; width: 100%; min-height: 100vh; padding: 24px; display: flex; align-items: flex-start; justify-content: center; z-index: 1; }
        .settings-layout { width: 100%; max-width: 1100px; padding: 32px; margin-top: 100px; text-align: left; }
        .settings-header { border-bottom: 1px solid var(--border-color); padding-bottom: 24px; margin-bottom: 24px; }
        .settings-subtitle { font-size: 13px; color: var(--text-muted); font-weight: 500; margin-top: 4px; }
        .settings-grid { display: grid; grid-template-columns: 220px 1fr; gap: 32px; }
        @media (max-width: 768px) { .settings-grid { grid-template-columns: 1fr; gap: 20px; } }
        .settings-sidebar { display: flex; flex-direction: column; gap: 4px; }
        @media (max-width: 768px) { .settings-sidebar { flex-direction: row; overflow-x: auto; padding-bottom: 8px; white-space: nowrap; } }
        .settings-tab-btn { width: 100%; text-align: left; padding: 11px 14px; font-size: 12.5px; font-weight: 700; color: var(--text-muted); background: transparent; border: 1px solid transparent; border-radius: var(--border-radius-sm); cursor: pointer; transition: all var(--transition-fast); }
        @media (max-width: 768px) { .settings-tab-btn { width: auto; padding: 8px 14px; } }
        .settings-tab-btn:hover, .settings-tab-btn.active { color: var(--text-main); background: var(--bg-input); border-color: var(--border-color); }
        .settings-content { min-height: 400px; }
        .settings-content h3 { font-family: var(--font-title); font-size: 16px; font-weight: 800; color: var(--text-main); margin-bottom: 16px; border-left: 3px solid var(--color-primary); padding-left: 10px; }

        /* TVA */
        .tva-card { background: var(--bg-input); border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: 24px; }
        .tva-presets { display: flex; gap: 8px; }
        .preset-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-muted); font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .preset-btn.active, .preset-btn:hover { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
        .tva-preview { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); overflow: hidden; }
        .tva-preview-label { padding: 10px 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border-color); }
        .tva-preview-row { display: flex; justify-content: space-between; padding: 10px 16px; font-size: 13px; border-bottom: 1px solid var(--border-color); }
        .tva-total { font-weight: 800; color: var(--color-primary); font-size: 15px; background: rgba(var(--color-primary-rgb, 79,70,229), 0.07); }

        /* Toggle switch */
        .toggle-btn { display: inline-flex; align-items: center; padding: 4px 12px 4px 6px; border-radius: 24px; border: 2px solid; cursor: pointer; font-size: 13px; transition: all 0.2s; min-width: 110px; }
        .toggle-on  { background: var(--color-success); border-color: var(--color-success); color: #fff; }
        .toggle-off { background: var(--bg-input); border-color: var(--border-color); color: var(--text-muted); }
        .toggle-knob { width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.2); margin-right: 4px; }

        /* Tables management */
        .management-table { overflow-x: auto; }
        .management-table .table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .management-table thead th { padding: 10px 12px; font-weight: 700; font-size: 11px; text-transform: uppercase; color: var(--text-muted); border-bottom: 2px solid var(--border-color); white-space: nowrap; }
        .management-table tbody td { padding: 10px 12px; border-bottom: 1px solid var(--border-color); vertical-align: middle; }
        .management-table tbody tr:hover { background: var(--bg-input); }

        /* Badges & états */
        .status-badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; }
        .status-active  { background: rgba(16,185,129,.15); color: var(--color-success); }
        .status-inactive { background: rgba(239,68,68,.12); color: var(--color-danger); }
        .badge-count { display: inline-flex; align-items: center; justify-content: center; min-width: 24px; height: 24px; padding: 0 8px; border-radius: 12px; background: var(--bg-input); border: 1px solid var(--border-color); font-size: 12px; font-weight: 700; }
        .badge-role { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; background: rgba(99,102,241,.12); color: var(--color-primary); }
        .user-avatar-mini { width: 30px; height: 30px; border-radius: 50%; background: var(--color-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; flex-shrink: 0; }

        /* Boutons XS */
        .btn-xs { padding: 4px 9px; font-size: 11px; border-radius: 6px; }
        .btn-info { background: #0ea5e9; color: #fff; border-color: #0ea5e9; }
        .btn-info:hover { background: #0284c7; }

        /* Formulaire inline */
        .inline-form-card { background: var(--bg-input); border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: 20px; margin-bottom: 20px; }

        /* Vide */
        .empty-state { text-align: center; padding: 48px 24px; color: var(--text-muted); font-size: 14px; }
      `}</style>
    </div>
  );
};
