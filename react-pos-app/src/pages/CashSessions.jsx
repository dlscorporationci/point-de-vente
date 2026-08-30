import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { db } from '../services/db';
import { ExportModal } from '../components/ExportModal';
import { useRealtime } from '../hooks/useRealtime';
import { hasPermission } from '../services/permissionService';

export const formatDateSafe = (dateString) => {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('fr-FR');
  } catch {
    return '-';
  }
};

export const formatTimeSafe = (dateString) => {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? '-' : d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '-';
  }
};

export const formatAmountSafe = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('fr-FR').format(num);
};

export const CashSessions = () => {
  const { user, token } = useApp();

  // Sessions courante et historique
  const [currentSession, setCurrentSession] = useState(null);
  const [allSessions, setAllSessions] = useState([]);
  
  // États d'ouverture de formulaires
  const [openingBalance, setOpeningBalance] = useState('10000');
  const [notes, setNotes] = useState('');
  
  // États transactions manuelles
  const [txType, setTxType] = useState('deposit');
  const [txAmount, setTxAmount] = useState('');
  const [txDesc, setTxDesc] = useState('');

  // Clôture
  const [closingBalance, setClosingBalance] = useState('');
  const [closingNotes, setClosingNotes] = useState('');

  // Validation écarts
  const [validationNotes, setValidationNotes] = useState('');
  const [selectedSessionToValidate, setSelectedSessionToValidate] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // États génériques
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Charger la session courante et l'historique
  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const companyId = parseInt(localStorage.getItem('company-id') || 1);
      let activeSession = null;
      let sessionHistory = [];

      try {
        const curRes = await axios.get('/v1/cash-sessions/current');
        if (curRes.data && curRes.data.id) {
          activeSession = curRes.data;
        }

        const allRes = await axios.get('/v1/cash-sessions');
        sessionHistory = allRes.data.data || [];
      } catch (netErr) {
        console.warn('Mode hors-ligne, chargement des sessions de caisse Dexie:', netErr);
        const localSessions = await db.cash_sessions
          .where('company_id').equals(companyId)
          .toArray();

        activeSession = localSessions.find(s => s.status === 'open') || null;
        sessionHistory = localSessions;
      }

      setCurrentSession(activeSession);
      setAllSessions(sessionHistory);
    } catch (err) {
      setError('Impossible de charger le module de session de caisse.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Abonnement Temps Réel (SSE) : actualisation automatique sans F5
  useRealtime(
    [
      'cash_session_opened',
      'cash_session_closed',
      'cash_session_validated',
      'cash_session_transaction'
    ],
    useCallback((eventType) => {
      loadData();
    }, [loadData]),
    { pullOnEvent: true }
  );

  useEffect(() => {
    loadData();
  }, [token, loadData]);

  const handleOpenSession = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post('/v1/cash-sessions/open', {
        opening_balance: parseFloat(openingBalance),
        notes
      });
      setSuccess('Caisse ouverte pour la boutique !');
      setNotes('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'ouverture de caisse.');
    }
  };

  const handleTxSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentSession || !currentSession.id) {
      setError("Impossible d'enregistrer l'opération : aucune session de caisse active n'a été détectée.");
      return;
    }

    const parsedAmount = parseFloat(txAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Veuillez saisir un montant d'opération valide et supérieur à 0.");
      return;
    }

    try {
      await axios.post(`/v1/cash-sessions/${currentSession.id}/transaction`, {
        type: txType,
        amount: parsedAmount,
        description: txDesc
      });
      setSuccess(txType === 'deposit' ? 'Dépôt de monnaie enregistré.' : 'Retrait de caisse enregistré.');
      setTxAmount('');
      setTxDesc('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'enregistrement du mouvement de caisse.');
    }
  };

  const handleCloseSession = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.post(`/v1/cash-sessions/${currentSession.id}/close`, {
        closing_balance: parseFloat(closingBalance),
        notes: closingNotes
      });
      setSuccess('Caisse fermée avec succès. Résumé de clôture disponible.');
      setClosingBalance('');
      setClosingNotes('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la clôture de caisse.');
    }
  };

  const handleValidateSession = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.post(`/v1/cash-sessions/${selectedSessionToValidate.id}/validate`, {
        validation_notes: validationNotes
      });
      setSuccess('Écarts validés et session régularisée.');
      setSelectedSessionToValidate(null);
      setValidationNotes('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la validation des écarts.');
    }
  };

  if (!token) {
    return (
      <div className="sessions-container">
        <div className="alert-card card">
          <span className="alert-icon"><i className="fa-solid fa-lock text-muted"></i></span>
          <h3>Accès Réservé</h3>
          <p>Vous devez vous connecter à une session pour gérer vos caisses.</p>
        </div>
      </div>
    );
  }

  const isAdminOrManager = user?.role === 'admin' || user?.role === 'gerant';

  const calculateTheoreticalDynamic = () => {
    if (!currentSession) return 0;
    if (currentSession.computed_theoretical_balance !== undefined) {
      return currentSession.computed_theoretical_balance;
    }
    let balance = parseFloat(currentSession.opening_balance) || 0;
    currentSession.transactions?.forEach(tx => {
      const amt = parseFloat(tx.amount) || 0;
      if (tx.type === 'deposit') balance += amt;
      if (tx.type === 'withdrawal') balance -= amt;
    });
    return balance;
  };

  const activeTheoretical = calculateTheoreticalDynamic();

  return (
    <div className="sessions-container">
      <div className="decorator-sphere sphere-1"></div>
      <div className="decorator-sphere sphere-2"></div>

      <div className="sessions-layout card">
        <div className="sessions-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2><i className="fa-solid fa-money-bill-wave me-2 text-success"></i> Gestion des Sessions de Caisses</h2>
            <p className="sessions-subtitle">Suivez vos fonds de caisse, entrées/sorties et régularisez les écarts de clôture</p>
          </div>
          <div>
            <button type="button" onClick={() => setShowExportModal(true)} className="btn btn-outline-secondary" style={{ fontWeight: 700 }}>
              <i className="fa-solid fa-file-export me-1"></i> Exporter Sessions Caisses
            </button>
          </div>
        </div>

        {error && <div className="error-banner"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}
        {success && <div className="success-banner"><i className="fa-solid fa-circle-check me-1"></i> {success}</div>}

        {/* SECTION 1: ÉTAT COURANT DE LA CAISSE (OUVERTURE / DÉTAIL / CLÔTURE) */}
        <div className="sessions-main-grid">
          {!currentSession ? (
            /* CAS CAISSE FERMÉE : FORMULAIRE D'OUVERTURE */
            <div className="session-card-block card-secondary">
              <h3><i className="fa-solid fa-cash-register me-2 text-danger"></i> La Caisse de cette Boutique est Fermée</h3>
              <p className="block-desc">Ouvrez la session de caisse avec un fonds de tiroir-caisse pour autoriser les encaissements dans cette boutique.</p>
              
              <form onSubmit={handleOpenSession} style={{ marginTop: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Fonds de caisse d'ouverture (XOF) *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value)}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Notes d'ouverture (Optionnel)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ex: Monnaie reçue du coffre"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                  <i className="fa-solid fa-unlock-keyhole me-1"></i> Ouvrir la caisse de la boutique
                </button>
              </form>
            </div>
          ) : (
            /* CAS CAISSE OUVERTE : TABLEAU DE BORD DÉTAILLÉ */
            <div className="session-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              {/* Infos & Métriques Globales */}
              <div className="session-card-block card-success-light">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', paddingBottom: '12px', marginBottom: '16px' }}>
                  <div>
                    <div className="session-status-badge">
                      <i className="fa-solid fa-circle-dot text-success me-1"></i> CAISSE OUVERTE — {currentSession.branch?.name || 'Boutique Active'}
                    </div>
                    <small className="text-muted">Session partagée active pour tous les vendeurs et caissiers de cette boutique</small>
                  </div>
                  <div className="text-end">
                    <small className="text-muted d-block">Ouverte le {formatDateSafe(currentSession.opened_at)} {formatTimeSafe(currentSession.opened_at)}</small>
                    <small className="text-muted">Responsable ouverture : <strong>{currentSession.user?.name || '-'}</strong></small>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-4 col-sm-6">
                    <div className="p-3 rounded border text-center" style={{ background: 'var(--bg-card, #ffffff)' }}>
                      <span className="text-muted small d-block mb-1">💰 Solde Espèces (Tiroir-Caisse)</span>
                      <strong className="text-success" style={{ fontSize: '1.6rem', fontWeight: 900 }}>
                        {formatAmountSafe(activeTheoretical)} XOF
                      </strong>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-6">
                    <div className="p-3 rounded border text-center" style={{ background: 'var(--bg-card, #ffffff)' }}>
                      <span className="text-muted small d-block mb-1">💵 Ouverture</span>
                      <strong style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                        {formatAmountSafe(currentSession.opening_balance)} XOF
                      </strong>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-6">
                    <div className="p-3 rounded border text-center" style={{ background: 'var(--bg-card, #ffffff)' }}>
                      <span className="text-muted small d-block mb-1">🛒 Ventes Espèces</span>
                      <strong className="text-primary" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                        +{formatAmountSafe(currentSession.cash_sales)} XOF
                      </strong>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-6">
                    <div className="p-3 rounded border text-center" style={{ background: 'var(--bg-card, #ffffff)' }}>
                      <span className="text-muted small d-block mb-1">💳 Ventes Carte</span>
                      <strong style={{ fontSize: '1.1rem', fontWeight: 700, color: '#6366f1' }}>
                        {formatAmountSafe(currentSession.card_sales)} XOF
                      </strong>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-6">
                    <div className="p-3 rounded border text-center" style={{ background: 'var(--bg-card, #ffffff)' }}>
                      <span className="text-muted small d-block mb-1">📋 Ventes Crédit</span>
                      <strong style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b' }}>
                        {formatAmountSafe(currentSession.credit_sales)} XOF
                      </strong>
                    </div>
                  </div>
                </div>

                {(currentSession.deposits_sum > 0 || currentSession.withdrawals_sum > 0) && (
                  <div className="mt-3 pt-2 d-flex gap-4 border-top text-muted small">
                    <span>➕ Dépôts manuel : <strong>+{formatAmountSafe(currentSession.deposits_sum)} XOF</strong></span>
                    <span>➖ Retraits manuel : <strong>-{formatAmountSafe(currentSession.withdrawals_sum)} XOF</strong></span>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {/* Transactions manuelles */}
                <div className="session-card-block">
                  <h3><i className="fa-solid fa-arrow-right-arrow-left me-2 text-primary"></i> Entrées/Sorties de caisse</h3>
                  <form onSubmit={handleTxSubmit} className="tx-form">
                    <div className="form-row-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div className="form-group">
                        <label className="form-label">Type d'opération</label>
                        <select className="form-control" value={txType} onChange={(e) => setTxType(e.target.value)}>
                          <option value="deposit">Dépôt de monnaie (+)</option>
                          <option value="withdrawal">Retrait de caisse (-)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Montant (XOF) *</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          value={txAmount} 
                          onChange={(e) => setTxAmount(e.target.value)} 
                          required 
                          min="1"
                        />
                      </div>
                    </div>
                    <div className="form-group mt-2">
                      <label className="form-label">Description / Motif *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ex: Appoint monnaie 5000, Carburant livraison" 
                        value={txDesc} 
                        onChange={(e) => setTxDesc(e.target.value)} 
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3" style={{ width: '100%' }}>
                      Enregistrer l'opération
                    </button>
                  </form>
                </div>

                {/* Clôture de caisse */}
                <div className="session-card-block card-danger-light">
                  <h3><i className="fa-solid fa-vault me-2 text-danger"></i> Fermeture Tiroir-Caisse</h3>
                  {!hasPermission(user, 'cash.close') ? (
                    <div className="alert alert-warning m-0 mt-3">
                      <i className="fa-solid fa-lock me-2"></i>
                      <strong>Fermeture non autorisée :</strong> La permission <code>cash.close</code> est obligatoire pour effectuer le comptage et la clôture de la caisse.
                    </div>
                  ) : (
                    <form onSubmit={handleCloseSession}>
                      <div className="form-group">
                        <label className="form-label">Montant réel compté dans le tiroir (XOF) *</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          placeholder={`Solde attendu: ${new Intl.NumberFormat('fr-FR').format(activeTheoretical)} XOF`}
                          value={closingBalance}
                          onChange={(e) => setClosingBalance(e.target.value)}
                          required
                          min="0"
                        />
                        {closingBalance !== '' && (
                          <div className="mt-2 style-xs" style={{
                            fontWeight: 700,
                            color: (parseFloat(closingBalance) - activeTheoretical) === 0 ? '#10b981' : '#ef4444'
                          }}>
                            Écart de caisse : {new Intl.NumberFormat('fr-FR').format(parseFloat(closingBalance) - activeTheoretical)} XOF
                          </div>
                        )}
                      </div>
                      <div className="form-group mt-2">
                        <label className="form-label">Notes de clôture (Optionnel)</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Remarques éventuelles sur l'écart"
                          value={closingNotes}
                          onChange={(e) => setClosingNotes(e.target.value)}
                        />
                      </div>
                      <button type="submit" className="btn btn-danger mt-3" style={{ width: '100%' }}>
                        <i className="fa-solid fa-lock me-1"></i> Clôturer et sceller la caisse
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: TABLEAU DE VALIDATION DES ÉCARTS (ADMIN/GERANT) */}
        {isAdminOrManager && (
          <div className="admin-validation-block" style={{ marginTop: '32px' }}>
            <h3 className="section-title">📋 Administration & Validation des Écarts de Caisses</h3>
            
            {/* Modal validation */}
            {selectedSessionToValidate && (
              <div className="modal-overlay">
                <div className="modal-card card">
                  <h3>✔️ Régulariser l'écart de caisse</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Session de : <strong>{selectedSessionToValidate.user?.name}</strong> <br />
                    Boutique : <strong>{selectedSessionToValidate.branch?.name}</strong> <br />
                    Solde Théorique : <strong>{new Intl.NumberFormat('fr-FR').format(selectedSessionToValidate.theoretical_balance || 0)} XOF</strong> <br />
                    Solde Réel compté : <strong>{new Intl.NumberFormat('fr-FR').format(selectedSessionToValidate.closing_balance || 0)} XOF</strong> <br />
                    Écart constaté : <strong style={{ color: 'var(--color-error)' }}>
                      {new Intl.NumberFormat('fr-FR').format((selectedSessionToValidate.closing_balance || 0) - (selectedSessionToValidate.theoretical_balance || 0))} XOF
                    </strong>
                  </p>

                  <form onSubmit={handleValidateSession}>
                    <div className="form-group">
                      <label className="form-label">Notes de validation / Décision de régularisation *</label>
                      <textarea 
                        className="form-control textarea-input"
                        placeholder="Ex: Écart de 500 CFA approuvé (erreur de rendu de monnaie compensée par le caissier)"
                        value={validationNotes}
                        onChange={(e) => setValidationNotes(e.target.value)}
                        required
                      />
                    </div>
                    <div className="modal-actions">
                      <button type="button" onClick={() => setSelectedSessionToValidate(null)} className="btn btn-cancel">Annuler</button>
                      <button type="submit" className="btn btn-primary">Valider la session</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {allSessions.length === 0 ? (
              <div className="empty-state">Aucun historique de caisse disponible.</div>
            ) : (
              <div className="table-responsive">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Boutique / Responsable</th>
                      <th>Ouverture</th>
                      <th>Fonds Initial</th>
                      <th>Solde Théorique / Réel</th>
                      <th>Écart</th>
                      <th>Statut</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSessions.map(session => {
                      const theoretical = parseFloat(session.theoretical_balance) || 0;
                      const closing = parseFloat(session.closing_balance) || 0;
                      const difference = session.closing_balance ? (closing - theoretical) : 0;
                      return (
                        <tr key={session.id || Math.random()}>
                          <td>
                            <div className="product-title-cell">{session.branch?.name || 'Boutique'}</div>
                            <div className="barcode-sub">Par {session.user?.name || '-'} • {formatDateSafe(session.opened_at)}</div>
                          </td>
                          <td>
                            <div className="desc-sub">{formatTimeSafe(session.opened_at)}</div>
                          </td>
                          <td className="price-cell">
                            {formatAmountSafe(session.opening_balance)} XOF
                          </td>
                          <td>
                            {session.status === 'open' ? (
                              <span style={{ color: 'var(--text-muted)' }}>En cours ({formatAmountSafe(session.computed_theoretical_balance || session.opening_balance)} XOF)</span>
                            ) : (
                              <div style={{ fontSize: '12px' }}>
                                Th: {formatAmountSafe(session.theoretical_balance)} XOF <br />
                                Réel: {formatAmountSafe(session.closing_balance)} XOF
                              </div>
                            )}
                          </td>
                          <td style={{ color: difference === 0 ? 'var(--color-success)' : 'var(--color-error)', fontWeight: '700' }}>
                            {session.status === 'open' ? '-' : `${difference > 0 ? '+' : ''}${formatAmountSafe(difference)} XOF`}
                          </td>
                          <td>
                            <span className={`badge-status ${session.status === 'open' ? 'status-ordered' : session.status === 'closed' ? 'payment-unpaid' : 'status-received'}`}>
                              {session.status === 'open' ? '🟢 Ouverte' : session.status === 'closed' ? '🔴 Close' : '✔️ Validée'}
                            </span>
                          </td>
                          <td>
                            {session.status === 'closed' && (
                              <button 
                                onClick={() => setSelectedSessionToValidate(session)}
                                className="btn-receive-action"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                              >
                                ✔️ Valider
                              </button>
                            )}
                            {session.status === 'validated' && (
                              <span className="text-lock" style={{ fontSize: '11px' }}>Régularisé</span>
                            )}
                            {session.status === 'open' && (
                              <span className="text-lock">-</span>
                            )}
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
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        documentType="cash_sessions"
        documentTitle="Rapport et Historique des Sessions de Caisses"
      />
    </div>
  );
};
