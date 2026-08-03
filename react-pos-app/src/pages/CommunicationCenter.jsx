import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

export const CommunicationCenter = () => {
  const { user } = useApp();
  const [logs, setLogs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Formulaire d'envoi
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [channel, setChannel] = useState('system_message');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const fetchCommunications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/v1/communications');
      setLogs(res.data.logs?.data || []);
      setCompanies(res.data.companies || []);
    } catch (err) {
      console.error("Fetch Communications Error:", err);
      setError(err.response?.data?.error || "Erreur lors du chargement des communications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommunications();
  }, [fetchCommunications]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        company_id: selectedCompanyId || null,
        channel: channel,
        subject: subject,
        message: message,
      };

      const res = await axios.post('/v1/communications/send', payload);
      setSuccess("✅ Communication envoyée et historisée dans le journal d'audit avec succès.");
      setSubject('');
      setMessage('');
      fetchCommunications();
    } catch (err) {
      console.error("Send Communication Error:", err);
      setError(err.response?.data?.error || "Erreur lors de l'envoi de la communication.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
          📢 Centre de Communication SuperAdmin
        </h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
          Envoyez des alertes, notifications et e-mails système aux entreprises et boutiques de la plateforme
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }}></i> {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" style={{ marginBottom: '16px' }}>
          {success}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Formulaire de Rédaction */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b' }}>
            <i className="fa-solid fa-paper-plane" style={{ color: 'var(--color-primary)' }}></i> Composer un Message
          </h3>

          <form onSubmit={handleSendMessage}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Destinataire (Entreprise) :</label>
              <select
                className="form-input"
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
              >
                <option value="">Toutes les Entreprises (Diffusion Globale)</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Canal de Communication :</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  className={`btn ${channel === 'system_message' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setChannel('system_message')}
                  style={{ padding: '8px 4px', fontSize: '12px' }}
                >
                  <i className="fa-solid fa-bell" style={{ marginRight: '4px' }}></i> Message Système
                </button>
                <button
                  type="button"
                  className={`btn ${channel === 'email' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setChannel('email')}
                  style={{ padding: '8px 4px', fontSize: '12px' }}
                >
                  <i className="fa-solid fa-envelope" style={{ marginRight: '4px' }}></i> E-mail Officiel
                </button>
                <button
                  type="button"
                  className={`btn ${channel === 'notification' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setChannel('notification')}
                  style={{ padding: '8px 4px', fontSize: '12px' }}
                >
                  <i className="fa-solid fa-comment-dots" style={{ marginRight: '4px' }}></i> Notification Push
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Objet / Sujet : *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Information Maintenance Programmée"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Contenu du Message : *</label>
              <textarea
                className="form-input"
                rows={5}
                placeholder="Rédigez ici le contenu officiel de votre communication..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={sending}>
              {sending ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '6px' }}></i> Transmission...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane" style={{ marginRight: '6px' }}></i> Envoyer & Historiser
                </>
              )}
            </button>
          </form>
        </div>

        {/* Historique des Communications */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b' }}>
            <i className="fa-solid fa-clock-rotate-left" style={{ color: 'var(--color-primary)' }}></i> Historique d'Envoi & Audit
          </h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
              <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ marginBottom: '8px', display: 'block' }}></i>
              Chargement de l'historique...
            </div>
          ) : logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: '#94a3b8' }}>
              <i className="fa-solid fa-comments fa-2x" style={{ marginBottom: '12px', display: 'block' }}></i>
              <p>Aucune communication transmise pour le moment.</p>
            </div>
          ) : (
            <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
              {logs.map((log) => (
                <div key={log.id} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>{log.subject}</span>
                    <span className="badge" style={{ background: '#f1f5f9', color: '#475569', fontSize: '10px' }}>
                      {log.channel}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', marginBottom: '6px' }}>
                    {log.company ? `Destinataire : ${log.company.name}` : 'Destinataire : Diffusion Globale'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#334155', background: '#f8fafc', padding: '8px', borderRadius: '4px', whiteSpace: 'pre-line' }}>
                    {log.message}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '6px', textAlign: 'right' }}>
                    Envoyé le {log.created_at ? new Date(log.created_at).toLocaleString('fr-FR') : ''} par {log.sender?.name || 'SuperAdmin'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
