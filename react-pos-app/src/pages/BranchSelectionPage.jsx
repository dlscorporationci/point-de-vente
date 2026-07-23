import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

export const BranchSelectionPage = ({ onSelectBranch }) => {
  const { user, switchActiveBranch, activeBranch } = useApp();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectingId, setSelectingId] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/v1/branches');
        const list = res.data.branches || res.data || [];
        setBranches(list);
      } catch (err) {
        setError('Impossible de charger la liste des boutiques.');
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleSelect = async (branch) => {
    setSelectingId(branch.id);
    const result = await switchActiveBranch(branch.id);
    setSelectingId(null);
    if (result.success) {
      if (onSelectBranch) {
        onSelectBranch(branch);
      }
    } else {
      setError(result.error || 'Impossible de sélectionner cette boutique.');
    }
  };

  return (
    <div className="branch-selection-container">
      <div className="branch-selection-card">
        <div className="branch-header-badge">
          <i className="fa-solid fa-store me-2"></i> Espaces de travail
        </div>
        <h2 className="branch-title">Sélectionnez votre Boutique de travail</h2>
        <p className="branch-subtitle">
          Bienvenue, <strong>{user?.name}</strong>. Veuillez choisir la boutique dans laquelle vous souhaitez opérer aujourd'hui. Toutes vos actions seront rattachées à cet espace.
        </p>

        {error && (
          <div className="alert alert-danger mb-4 d-flex align-items-center gap-2">
            <i className="fa-solid fa-circle-exclamation"></i> {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3 text-muted">Chargement de vos boutiques...</p>
          </div>
        ) : (
          <div className="branches-grid">
            {branches.map((b) => {
              const isActive = activeBranch?.id === b.id;
              const isSelecting = selectingId === b.id;

              return (
                <div key={b.id} className={`branch-workspace-card ${isActive ? 'active' : ''}`}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="branch-icon-box">
                      <i className="fa-solid fa-shop"></i>
                    </div>
                    <span className={`badge ${b.status === 'open' ? 'bg-success' : 'bg-warning'}`}>
                      {b.status === 'open' ? 'Ouverte' : 'Fermée'}
                    </span>
                  </div>

                  <h4 className="branch-name">{b.name}</h4>
                  <p className="branch-type">
                    <i className="fa-solid fa-location-dot me-1"></i> {b.address || 'Siège principal'}
                  </p>

                  <button
                    className={`btn w-100 ${isActive ? 'btn-outline-primary' : 'btn-primary'} mt-3`}
                    onClick={() => handleSelect(b)}
                    disabled={isSelecting}
                  >
                    {isSelecting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Connexion à la boutique...
                      </>
                    ) : isActive ? (
                      <>
                        <i className="fa-solid fa-check me-2"></i> Espace actuel (Continuer)
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-arrow-right-to-bracket me-2"></i> Ouvrir cet espace
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .branch-selection-container {
          min-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .branch-selection-card {
          width: 100%;
          max-width: 900px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .branch-header-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 20px;
          background: rgba(59, 130, 246, 0.1);
          color: var(--color-primary);
          font-weight: 700;
          font-size: 13px;
          margin-bottom: 16px;
        }

        .branch-title {
          font-family: var(--font-title);
          font-weight: 800;
          font-size: 28px;
          margin-bottom: 8px;
        }

        .branch-subtitle {
          color: var(--text-muted);
          font-size: 15px;
          margin-bottom: 32px;
        }

        .branches-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }

        .branch-workspace-card {
          background: var(--bg-input);
          border: 2px solid var(--border-color);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.25s ease;
        }

        .branch-workspace-card:hover {
          border-color: var(--color-primary);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
        }

        .branch-workspace-card.active {
          border-color: var(--color-primary);
          background: rgba(59, 130, 246, 0.04);
        }

        .branch-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--color-primary), #10b981);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .branch-name {
          font-family: var(--font-title);
          font-weight: 700;
          font-size: 18px;
          margin-bottom: 4px;
        }

        .branch-type {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
};
