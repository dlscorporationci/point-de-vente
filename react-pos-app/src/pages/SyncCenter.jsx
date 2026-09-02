import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../services/db';
import { syncService } from '../services/SyncService';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const SyncCenter = () => {
  const { isOnline, isSyncing, companyId, branchId } = useApp();
  const [queueItems, setQueueItems] = useState([]);
  const [lastSyncCursor, setLastSyncCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmIgnore, setConfirmIgnore] = useState(null); // uuid string

  const loadSyncData = async () => {
    setLoading(true);
    try {
      const items = await db.sync_queue.reverse().sortBy('created_at');
      setQueueItems(items || []);

      const cursor = await db.sync_metadata.get('last_sync_cursor');
      setLastSyncCursor(cursor ? cursor.value : 'Aucune synchronisation effectuée');
    } catch (err) {
      console.error('Erreur chargement Centre de Sync:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSyncData();
    const unsubscribe = syncService.subscribe(() => {
      loadSyncData();
    });
    return () => unsubscribe();
  }, [companyId, branchId]);

  const handleForceSync = async () => {
    await syncService.runFullSync();
    await loadSyncData();
  };

  const handleRetryItem = async (uuid) => {
    await db.sync_queue.update(uuid, { status: 'pending', attempts: 0, last_error: null });
    await syncService.runFullSync();
    await loadSyncData();
  };

  const handleIgnoreItem = (uuid) => {
    setConfirmIgnore(uuid);
  };

  const doIgnoreItem = async () => {
    if (!confirmIgnore) return;
    await db.sync_queue.update(confirmIgnore, { status: 'ignored' });
    setConfirmIgnore(null);
    await loadSyncData();
  };

  const stats = {
    pending: queueItems.filter(i => i.status === 'pending').length,
    synced: queueItems.filter(i => i.status === 'synced').length,
    conflict: queueItems.filter(i => i.status === 'conflict').length,
    failed: queueItems.filter(i => i.status === 'failed').length,
  };

  return (
    <div className="page-container p-4">
      {/* HEADER CENTRE DE SYNCHRONISATION */}
      <div className="d-flex justify-content-between align-items-center mb-4 card p-3" style={{ borderRadius: '12px' }}>
        <div>
          <h2 className="mb-1" style={{ fontSize: '20px', fontWeight: 800 }}>
            🔄 Centre de Synchronisation Offline-First
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
            Surveillez le statut du réseau, la file d'attente hors-ligne et résolvez les conflits.
          </p>
        </div>

        <div className="d-flex align-items-center gap-3">
          <button
            onClick={handleForceSync}
            disabled={isSyncing || !isOnline}
            className="btn btn-primary btn-sm d-flex align-items-center gap-2"
            style={{ fontWeight: 700, borderRadius: '8px', padding: '8px 16px' }}
          >
            <i className={`fa-solid fa-arrows-rotate ${isSyncing ? 'fa-spin' : ''}`}></i>
            <span>{isSyncing ? 'Synchronisation...' : 'Forcer la Sync (PUSH & PULL)'}</span>
          </button>
        </div>
      </div>

      {/* STATUT RÉSEAU ET STATISTIQUES */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card p-3" style={{ borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
            <span className="text-muted" style={{ fontSize: '12px', fontWeight: 600 }}>STATUT RÉSEAU</span>
            <div className="d-flex align-items-center gap-2 mt-1">
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: isOnline ? '#10b981' : '#ef4444'
              }}></span>
              <strong style={{ fontSize: '16px', color: isOnline ? '#10b981' : '#ef4444' }}>
                {isOnline ? '🟢 En Ligne' : '🔴 Hors Ligne'}
              </strong>
            </div>
            <div className="text-muted mt-2" style={{ fontSize: '11px' }}>
              Curseur: {lastSyncCursor ? String(lastSyncCursor).substring(0, 20) : 'Standard'}
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3" style={{ borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
            <span className="text-muted" style={{ fontSize: '12px', fontWeight: 600 }}>EN ATTENTE (PENDING)</span>
            <div className="h3 mb-0 mt-1" style={{ fontWeight: 800, color: '#f59e0b' }}>
              {stats.pending}
            </div>
            <div className="text-muted mt-2" style={{ fontSize: '11px' }}>
              Opérations stockées localement
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3" style={{ borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
            <span className="text-muted" style={{ fontSize: '12px', fontWeight: 600 }}>SYNCHRONISÉES</span>
            <div className="h3 mb-0 mt-1" style={{ fontWeight: 800, color: '#3b82f6' }}>
              {stats.synced}
            </div>
            <div className="text-muted mt-2" style={{ fontSize: '11px' }}>
              Validées par le serveur Laravel
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3" style={{ borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
            <span className="text-muted" style={{ fontSize: '12px', fontWeight: 600 }}>CONFLITS & ÉCHECS</span>
            <div className="h3 mb-0 mt-1" style={{ fontWeight: 800, color: '#ef4444' }}>
              {stats.conflict + stats.failed}
            </div>
            <div className="text-muted mt-2" style={{ fontSize: '11px' }}>
              Requiert une révision manuelle
            </div>
          </div>
        </div>
      </div>

      {/* TABLEAU DE LA FILE D'ATTENTE DE SYNCHRONISATION */}
      <div className="card p-4" style={{ borderRadius: '12px' }}>
        <h4 className="mb-3" style={{ fontSize: '16px', fontWeight: 700 }}>
          📋 File d'Attente de Synchronisation (`sync_queue`)
        </h4>

        {loading ? (
          <div className="text-center py-4">Chargement de la file d'attente...</div>
        ) : queueItems.length === 0 ? (
          <div className="alert alert-info text-center py-4 mb-0">
            ✅ Aucune opération dans la file d'attente. Toutes les données sont synchronisées !
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
              <thead>
                <tr>
                  <th>UUID / Opération</th>
                  <th>Type &amp; Action</th>
                  <th>Horodatage</th>
                  <th>Statut</th>
                  <th>Détails &amp; Motif</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {queueItems.map(item => (
                  <tr key={item.uuid}>
                    <td>
                      <code>{item.uuid.substring(0, 13)}...</code>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {item.entity_type.toUpperCase()} : {item.action}
                      </span>
                    </td>
                    <td>{new Date(item.created_at).toLocaleString('fr-FR')}</td>
                    <td>
                      {item.status === 'synced' && <span className="badge bg-success">✓ Synchronisé</span>}
                      {item.status === 'pending' && <span className="badge bg-warning text-dark">⏳ En attente</span>}
                      {item.status === 'syncing' && <span className="badge bg-info text-dark">🔄 Syncing...</span>}
                      {item.status === 'conflict' && <span className="badge bg-danger">⚠️ Conflit</span>}
                      {item.status === 'failed' && <span className="badge bg-dark">❌ Échec</span>}
                      {item.status === 'ignored' && <span className="badge bg-secondary">⚫ Ignoré</span>}
                    </td>
                    <td>
                      {item.last_error ? (
                        <span className="text-danger" style={{ fontSize: '11px' }}>{item.last_error}</span>
                      ) : (
                        <span className="text-muted" style={{ fontSize: '11px' }}>
                          Montant: {item.payload?.total ? `${new Intl.NumberFormat('fr-FR').format(item.payload.total)} XOF` : 'N/A'}
                        </span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        {(item.status === 'conflict' || item.status === 'failed' || item.status === 'ignored') && (
                          <button
                            onClick={() => handleRetryItem(item.uuid)}
                            className="btn btn-outline-warning btn-sm"
                            style={{ fontSize: '11px', padding: '2px 8px' }}
                            title="Réessayer de synchroniser"
                          >
                            Réessayer
                          </button>
                        )}
                        {item.status !== 'synced' && item.status !== 'ignored' && (
                          <button
                            onClick={() => handleIgnoreItem(item.uuid)}
                            className="btn btn-outline-secondary btn-sm"
                            style={{ fontSize: '11px', padding: '2px 8px' }}
                            title="Ignorer sans supprimer de l'historique"
                          >
                            Ignorer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ConfirmDialog
        isOpen={!!confirmIgnore}
        title="Ignorer cette opération ?"
        message="Cette opération sera marquée comme ignorée. Elle sera conservée dans l'historique d'audit de synchronisation."
        confirmLabel="Ignorer l'opération"
        type="warning"
        onConfirm={doIgnoreItem}
        onCancel={() => setConfirmIgnore(null)}
      />
    </div>
  );
};
