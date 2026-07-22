import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

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

  // États génériques
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Charger la session courante et l'historique
  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const curRes = await axios.get('/v1/cash-sessions/current');
      if (curRes.data && curRes.data.id) {
        setCurrentSession(curRes.data);
      } else {
        setCurrentSession(null);
      }

      const allRes = await axios.get('/v1/cash-sessions');
      setAllSessions(allRes.data.data || []);
    } catch (err) {
      setError('Impossible de charger le module de session de caisse.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleOpenSession = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post('/v1/cash-sessions/open', {
        opening_balance: parseFloat(openingBalance),
        notes
      });
      setSuccess('Caisse ouverte pour la journée !');
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
      setError("Impossible d'enregistrer l'opération : aucune session de caisse active (ouverte) n'a été détectée.");
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

  // Calcul du solde théorique dynamique côté client pour affichage direct
  const calculateTheoreticalDynamic = () => {
    if (!currentSession) return 0;
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
        <div className="sessions-header">
          <div>
            <h2><i className="fa-solid fa-money-bill-wave me-2 text-success"></i> Gestion des Sessions de Caisses</h2>
            <p className="sessions-subtitle">Suivez vos fonds de caisse, dépôts/retraits et régularisez les écarts de clôture</p>
          </div>
        </div>

        {error && <div className="error-banner"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}
        {success && <div className="success-banner"><i className="fa-solid fa-circle-check me-1"></i> {success}</div>}

        {/* SECTION 1: ÉTAT COURANT DE LA CAISSE (OUVERTURE / CLÔTURE) */}
        <div className="sessions-main-grid">
          {!currentSession ? (
            /* CAS CAISSE FERMÉE : FORMULAIRE D'OUVERTURE */
            <div className="session-card-block card-secondary">
              <h3><i className="fa-solid fa-cash-register me-2 text-danger"></i> Votre Caisse est Fermée</h3>
              <p className="block-desc">Vous devez ouvrir une session de caisse avec un fonds de tiroir-caisse pour pouvoir débuter les ventes.</p>
              
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
                  <i className="fa-solid fa-unlock-keyhole me-1"></i> Ouvrir la caisse pour la journée
                </button>
              </form>
            </div>
          ) : (
            /* CAS CAISSE OUVERTE : TABLEAU DE BORD DE LA CAISSE ACTIVE */
            <div className="session-dashboard-grid">
              {/* Infos & Solde */}
              <div className="session-card-block card-success-light">
                <div className="session-status-badge"><i className="fa-solid fa-circle-dot text-success me-1"></i> CAISSE OUVERTE</div>
                <div className="session-metric">
                  <span className="metric-label">Solde Théorique Actuel :</span>
                  <span className="metric-val">{new Intl.NumberFormat('fr-FR').format(activeTheoretical)} XOF</span>
                </div>
                <div className="session-details-list" style={{ fontSize: '13px', marginTop: '16px' }}>
                  <div>• Caissier : <strong>{currentSession.user?.name || '-'}</strong></div>
                  <div>• Boutique : <strong>{currentSession.branch?.name || '-'}</strong></div>
                  <div>• Ouvert le : <strong>{currentSession.opened_at ? new Date(currentSession.opened_at).toLocaleString('fr-FR') : '-'}</strong></div>
                  <div>• Fonds d'ouverture : <strong>{new Intl.NumberFormat('fr-FR').format(parseFloat(currentSession.opening_balance) || 0)} XOF</strong></div>
                </div>
              </div>

              {/* Transactions manuelles */}
              <div className="session-card-block">
                <h3><i className="fa-solid fa-arrow-right-arrow-left me-2 text-primary"></i> Entrées/Sorties de caisse</h3>
                <form onSubmit={handleTxSubmit} className="tx-form">
                  <div className="form-row-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <div className="form-group">
                      <label className="form-label">Type d'opération</label>
                      <select className="form-control" value={txType} onChange={(e) => setTxType(e.target.value)}>
                        <option value="deposit">Dépôt de monnaie</option>
                        <option value="withdrawal">Retrait de caisse</option>
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
                  <div className="form-group">
                    <label className="form-label">Description / Motif *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ex: Achat fournitures de bureau, Monnaie 1000 XOF" 
                      value={txDesc} 
                      onChange={(e) => setTxDesc(e.target.value)} 
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Enregistrer l'opération
                  </button>
                </form>
              </div>

              {/* Clôture de caisse */}
              <div className="session-card-block card-danger-light">
                <h3><i className="fa-solid fa-vault me-2 text-danger"></i> Fermeture Tiroir-Caisse</h3>
                <form onSubmit={handleCloseSession}>
                  <div className="form-group">
                    <label className="form-label">Montant réel compté dans le tiroir (XOF) *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="Comptez tout l'argent liquide disponible"
                      value={closingBalance}
                      onChange={(e) => setClosingBalance(e.target.value)}
                      required
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes de clôture (Optionnel)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={closingNotes}
                      onChange={(e) => setClosingNotes(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-cancel" style={{ width: '100%', background: '#EF4444', color: '#FFF' }}>
                    🔒 Soumettre la clôture de caisse
                  </button>
                </form>
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
                    Solde Théorique : <strong>{selectedSessionToValidate.theoretical_balance} XOF</strong> <br />
                    Solde Réel compté : <strong>{selectedSessionToValidate.closing_balance} XOF</strong> <br />
                    Écart constaté : <strong style={{ color: 'var(--color-error)' }}>
                      {selectedSessionToValidate.closing_balance - selectedSessionToValidate.theoretical_balance} XOF
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
                      <th>Caissier / Date</th>
                      <th>Boutique</th>
                      <th>Fonds Ouverture</th>
                      <th>Théorique / Réel</th>
                      <th>Écart</th>
                      <th>Statut</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSessions.map(session => {
                      const difference = session.closing_balance ? (parseFloat(session.closing_balance) - parseFloat(session.theoretical_balance)) : 0;
                      return (
                        <tr key={session.id}>
                          <td>
                            <div className="product-title-cell">{session.user?.name}</div>
                            <div className="barcode-sub">{new Date(session.opened_at).toLocaleDateString()}</div>
                          </td>
                          <td>
                            <div className="desc-sub">{session.branch?.name}</div>
                          </td>
                          <td className="price-cell">
                            {new Intl.NumberFormat('fr-FR').format(session.opening_balance)} XOF
                          </td>
                          <td>
                            {session.status === 'open' ? (
                              <span style={{ color: 'var(--text-muted)' }}>En cours...</span>
                            ) : (
                              <div style={{ fontSize: '12px' }}>
                                Th: {new Intl.NumberFormat('fr-FR').format(session.theoretical_balance)} XOF <br />
                                Réel: {new Intl.NumberFormat('fr-FR').format(session.closing_balance)} XOF
                              </div>
                            )}
                          </td>
                          <td style={{ color: difference === 0 ? 'var(--color-success)' : 'var(--color-error)', fontWeight: '700' }}>
                            {session.status === 'open' ? '-' : `${difference > 0 ? '+' : ''}${difference} XOF`}
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

      <style>{`
        .sessions-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .sessions-layout {
          width: 100%;
          max-width: 1080px;
          padding: 32px;
          margin-top: 100px;
        }

        .sessions-header {
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 24px;
          text-align: left;
        }

        .sessions-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        .sessions-main-grid {
          text-align: left;
        }

        .session-card-block {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          padding: 20px;
          margin-bottom: 20px;
        }

        .card-secondary {
          border-top: 4px solid var(--color-primary);
        }

        .card-success-light {
          border-top: 4px solid var(--color-success);
        }

        .card-danger-light {
          border-top: 4px solid #EF4444;
        }

        .block-desc {
          font-size: 13px;
          color: var(--text-muted);
        }

        .session-dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr 1fr;
          gap: 20px;
        }

        .session-status-badge {
          display: inline-block;
          background: rgba(0, 166, 81, 0.1);
          color: var(--color-success);
          font-size: 11px;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .session-metric {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .metric-label {
          font-size: 12px;
          color: var(--text-muted);
        }

        .metric-val {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-main);
        }

        .tx-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admin-validation-block h3 {
          font-size: 16px;
          margin-bottom: 16px;
          border-left: 3px solid var(--color-primary);
          padding-left: 10px;
          text-align: left;
        }
      `}</style>
    </div>
  );
};
