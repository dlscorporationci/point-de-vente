import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const BusinessRulesPanel = () => {
  const [rules, setRules] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadBranches();
  }, []);

  useEffect(() => {
    loadRules();
  }, [selectedBranchId]);

  const loadBranches = async () => {
    try {
      const res = await axios.get('/v1/branches');
      setBranches(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/v1/business-rules', {
        params: { branch_id: selectedBranchId || null }
      });
      const data = res.data?.rules || res.data || [];
      setRules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Erreur chargement des règles de gestion:', err);
      setRules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRuleChange = (ruleKey, newValue) => {
    setRules(rules.map(r => r.rule_key === ruleKey ? { ...r, effective_value: newValue, is_overridden: true } : r));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = rules.map(r => ({
        rule_key: r.rule_key,
        rule_value: r.effective_value
      }));

      const res = await axios.post('/v1/business-rules', {
        rules: payload,
        branch_id: selectedBranchId || null
      });

      setSuccess(res.data.message || 'Règles de gestion enregistrées avec succès.');
      loadRules();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de la sauvegarde des règles.');
    } finally {
      setSaving(false);
    }
  };

  // Groupement des règles par catégorie
  const groupedRules = rules.reduce((acc, rule) => {
    const cat = rule.category || 'Général';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(rule);
    return acc;
  }, {});

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap" style={{ gap: '16px' }}>
        <div>
          <h3 className="m-0"><i className="fa-solid fa-sliders text-primary me-2"></i> Paramètres & Règles de Gestion Configurables</h3>
          <p className="text-muted small m-0">Personnalisez le fonctionnement métier (ventes, crédits, caisse, stock) par boutique.</p>
        </div>

        <div style={{ minWidth: '220px' }}>
          <select 
            className="form-control" 
            value={selectedBranchId} 
            onChange={(e) => setSelectedBranchId(e.target.value)}
            style={{ fontWeight: 700 }}
          >
            <option value="">🏢 Règle Globale Entreprise (Toutes boutiques)</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>📍 Surcharge Boutique : {b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-banner mb-3"><i className="fa-solid fa-circle-exclamation me-1"></i> {error}</div>}
      {success && <div className="success-banner mb-3"><i className="fa-solid fa-circle-check me-1"></i> {success}</div>}

      {loading ? (
        <div className="loading-spinner">Chargement des règles métier...</div>
      ) : (
        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {Object.entries(groupedRules).map(([catName, catRules]) => (
              <div key={catName} className="card p-4" style={{ background: 'var(--bg-input, #f8fafc)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontWeight: 800, fontSize: '17px', color: 'var(--color-primary)' }} className="mb-3">
                  {catName}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {catRules.map(r => (
                    <div 
                      key={r.rule_key} 
                      className="p-3 bg-white rounded border d-flex justify-content-between align-items-center flex-wrap gap-3"
                      style={{ background: '#fff', borderRadius: '10px' }}
                    >
                      <div style={{ flex: '1 1 300px' }}>
                        <strong style={{ fontSize: '14px', display: 'block' }}>{r.name}</strong>
                        <span className="text-muted small d-block mt-1">{r.description}</span>
                        {r.is_overridden && (
                          <span className="badge bg-secondary mt-1" style={{ fontSize: '10px' }}>Valeur personnalisée</span>
                        )}
                      </div>

                      <div style={{ minWidth: '160px', textAlign: 'right' }}>
                        {r.value_type === 'boolean' ? (
                          <label className="switch" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={Boolean(r.effective_value)}
                              onChange={(e) => handleRuleChange(r.rule_key, e.target.checked)}
                              style={{ width: '20px', height: '20px' }}
                            />
                            <strong style={{ fontSize: '14px', color: r.effective_value ? '#10b981' : '#ef4444' }}>
                              {r.effective_value ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                            </strong>
                          </label>
                        ) : (
                          <input
                            type="number"
                            className="form-control text-end"
                            style={{ width: '140px', fontWeight: 700, display: 'inline-block' }}
                            value={r.effective_value}
                            onChange={(e) => handleRuleChange(r.rule_key, e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-end mt-4">
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ fontWeight: 800, padding: '12px 28px' }}>
              {saving ? 'Enregistrement des règles...' : '💾 Enregistrer les Règles Métier'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
