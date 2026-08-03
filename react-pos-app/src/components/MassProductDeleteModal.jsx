import React, { useState } from 'react';
import axios from 'axios';

export const MassProductDeleteModal = ({ isOpen, onClose, productsCount, categoriesCount, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [understood, setUnderstood] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setStep(1);
    setUnderstood(false);
    setConfirmText('');
    setError(null);
    onClose();
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    if (confirmText.trim().toUpperCase() !== 'SUPPRIMER') {
      setError('Veuillez saisir exactement le mot "SUPPRIMER".');
      return;
    }

    setDeleting(true);
    setError(null);
    try {
      const res = await axios.post('/v1/products/destroy-all', {
        confirmation_text: confirmText
      });
      onSuccess(res.data.message);
      handleReset();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de la suppression massive.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleReset}>
      <div className="modal-card card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', width: '92%', border: '2px solid #ef4444' }}>
        
        {/* ÉTAPE 1 : AVERTISSEMENT INITIAL */}
        {step === 1 && (
          <div>
            <div className="text-center mb-3">
              <span style={{ fontSize: '48px' }}>⚠️</span>
              <h3 style={{ color: '#ef4444', marginTop: '10px' }}>SUPPRESSION MASSIVE</h3>
            </div>

            <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-main)' }}>
              Vous êtes sur le point de <strong>supprimer tous les produits</strong> de cette boutique.
              Cette opération videra le catalogue tout en préservant l'historique comptable de vos ventes passées.
            </p>

            <div className="alert-card bg-light p-3 rounded mb-4" style={{ borderLeft: '4px solid #ef4444' }}>
              <strong className="d-block text-danger">Attention :</strong>
              <span className="small text-muted">Cette action entraînera la désactivation de tous les articles enregistrés dans le catalogue de la boutique active.</span>
            </div>

            <div className="modal-actions d-flex justify-content-end gap-2">
              <button type="button" onClick={handleReset} className="btn btn-cancel">Annuler</button>
              <button type="button" onClick={() => setStep(2)} className="btn btn-danger" style={{ fontWeight: 700 }}>
                Continuer vers la confirmation →
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : RÉSUMÉ DES IMPACTS & CASE À COCHER */}
        {step === 2 && (
          <div>
            <h3 style={{ color: '#ef4444' }} className="mb-3">Résumé de l'opération</h3>

            <div className="stats-summary p-3 mb-4 rounded" style={{ background: 'var(--bg-input, #f8fafc)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', textAlign: 'center' }}>
              <div className="p-2 card" style={{ background: '#fff' }}>
                <span className="text-muted small d-block">Produits concernés</span>
                <strong style={{ fontSize: '24px', color: '#ef4444' }}>{productsCount}</strong>
              </div>
              <div className="p-2 card" style={{ background: '#fff' }}>
                <span className="text-muted small d-block">Catégories d'articles</span>
                <strong style={{ fontSize: '24px', color: 'var(--color-primary)' }}>{categoriesCount}</strong>
              </div>
            </div>

            <div className="form-group mb-4">
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                <input 
                  type="checkbox" 
                  checked={understood} 
                  onChange={(e) => setUnderstood(e.target.checked)} 
                  style={{ marginTop: '2px', width: '18px', height: '18px' }}
                />
                <span>Je comprends que cette opération va supprimer tous les produits de la boutique.</span>
              </label>
            </div>

            <div className="modal-actions d-flex justify-content-between">
              <button type="button" onClick={() => setStep(1)} className="btn btn-secondary">← Retour</button>
              <button 
                type="button" 
                disabled={!understood} 
                onClick={() => setStep(3)} 
                className="btn btn-danger" 
                style={{ fontWeight: 700 }}
              >
                Continuer vers l'étape finale →
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : SAISIE DE CONFIRMATION FORTE "SUPPRIMER" */}
        {step === 3 && (
          <div>
            <h3 style={{ color: '#ef4444' }} className="mb-2">Confirmation finale requise</h3>
            <p className="text-muted small mb-3">
              Pour des raisons de sécurité, veuillez saisir le mot <strong>SUPPRIMER</strong> en majuscules ci-dessous.
            </p>

            {error && <div className="error-banner mb-3"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}

            <form onSubmit={handleConfirmDelete}>
              <div className="form-group mb-4">
                <label className="form-label" style={{ fontWeight: 700 }}>Tapez "SUPPRIMER" pour valider :</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="SUPPRIMER" 
                  value={confirmText} 
                  onChange={(e) => setConfirmText(e.target.value)} 
                  style={{ fontSize: '16px', letterSpacing: '2px', fontWeight: 800, textAlign: 'center' }}
                />
              </div>

              <div className="modal-actions d-flex justify-content-between">
                <button type="button" onClick={() => setStep(2)} className="btn btn-cancel">Annuler</button>
                <button 
                  type="submit" 
                  disabled={deleting || confirmText.trim().toUpperCase() !== 'SUPPRIMER'} 
                  className="btn btn-danger" 
                  style={{ fontWeight: 800, padding: '10px 20px' }}
                >
                  {deleting ? 'Suppression en cours...' : '🚨 SUPPRIMER DÉFINITIVEMENT'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
