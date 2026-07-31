import axios from 'axios';
import { db } from './db';

class SyncService {
  constructor() {
    this.isSyncing = false;
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.retryDelay = 1000; // Delay initial 1s (Backoff exponentiel)
    this.listeners = new Set();

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkStatus(true));
      window.addEventListener('offline', () => this.handleNetworkStatus(false));
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(cb => cb({
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      retryDelay: this.retryDelay
    }));
  }

  async handleNetworkStatus(online) {
    this.isOnline = online;
    this.notify();
    if (online) {
      const isApiAlive = await this.checkApiHealth();
      if (isApiAlive) {
        this.retryDelay = 1000;
        this.runFullSync();
      }
    }
  }

  /**
   * Test de connectivité réelle (Health Check Server)
   */
  async checkApiHealth() {
    if (!navigator.onLine) return false;
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      const res = await axios.get('/v1/sync/health', { timeout: 4000 });
      return res.data?.status === 'ok';
    } catch {
      return false;
    }
  }

  /**
   * Lancement complet de la synchronisation bidirectionnelle (PUSH puis PULL)
   */
  async runFullSync() {
    if (this.isSyncing || !this.isOnline) return;
    
    const isAlive = await this.checkApiHealth();
    if (!isAlive) {
      this.scheduleRetry();
      return;
    }

    this.isSyncing = true;
    this.notify();

    try {
      // 1. PUSH : Envoi des opérations locales hors-ligne
      await this.pushOfflineQueue();

      // 2. PULL : Récupération du delta incrémental depuis le serveur
      await this.pullServerUpdates();

      this.retryDelay = 1000; // Reset du backoff en cas de succès
    } catch (err) {
      console.warn('Erreur lors de la synchronisation globale:', err);
      this.scheduleRetry();
    } finally {
      this.isSyncing = false;
      this.notify();
    }
  }

  /**
   * Strategie de réessai avec Backoff Exponentiel & Jitter (max 30s)
   */
  scheduleRetry() {
    const jitter = Math.floor(Math.random() * 500);
    const delay = Math.min(30000, this.retryDelay * 2) + jitter;
    this.retryDelay = delay;
    console.log(`Nouvelle tentative de synchronisation programmée dans ${Math.round(delay / 1000)}s`);
    setTimeout(() => {
      if (this.isOnline) {
        this.runFullSync();
      }
    }, delay);
  }

  /**
   * PUSH : Envoi des opérations locales en attente avec Idempotence UUID
   */
  async pushOfflineQueue() {
    const pendingOps = await db.sync_queue
      .where('status').equals('pending')
      .toArray();

    if (pendingOps.length === 0) return;

    // Marquer comme 'syncing'
    await db.sync_queue
      .where('uuid').anyOf(pendingOps.map(o => o.uuid))
      .modify({ status: 'syncing' });

    try {
      const res = await axios.post('/v1/sync/push', {
        operations: pendingOps.map(op => ({
          uuid: op.uuid,
          entity_type: op.entity_type,
          entity_id: op.entity_id,
          action: op.action,
          payload: op.payload,
          company_id: op.company_id,
          branch_id: op.branch_id
        }))
      });

      const { synced_uuids = [], conflicts = [], failed = [] } = res.data;

      // Marquer les UUIDs synchronisés avec succès
      if (synced_uuids.length > 0) {
        await db.sync_queue
          .where('uuid').anyOf(synced_uuids)
          .modify({ status: 'synced', synced_at: new Date().toISOString() });
      }

      // Marquer les opérations en conflit (Conservées avec raison explicite et Toast UI immédiat)
      for (const c of conflicts) {
        await db.sync_queue
          .where('uuid').equals(c.uuid)
          .modify({ status: 'conflict', last_error: c.reason });

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('sync-conflict-toast', {
            detail: { uuid: c.uuid, reason: c.reason }
          }));
        }
      }

      // Marquer les échecs avec réessai
      for (const f of failed) {
        const op = await db.sync_queue.get(f.uuid);
        if (op) {
          await db.sync_queue.put({
            ...op,
            status: op.attempts >= 5 ? 'failed' : 'pending',
            attempts: (op.attempts || 0) + 1,
            last_error: f.error
          });
        }
      }
    } catch (pushErr) {
      // Revenir à 'pending' en cas d'interruption réseau
      await db.sync_queue
        .where('uuid').anyOf(pendingOps.map(o => o.uuid))
        .modify({ status: 'pending' });
      throw pushErr;
    }
  }

  /**
   * PULL : Récupération du delta incrémental avec curseur déterministe généré par Laravel
   */
  async pullServerUpdates() {
    const metaCursor = await db.sync_metadata.get('last_sync_cursor');
    const currentCursor = metaCursor ? metaCursor.value : null;

    const companyId = localStorage.getItem('company-id');
    const branchId = localStorage.getItem('branch-id');

    const res = await axios.get('/v1/sync/pull', {
      params: {
        cursor: currentCursor,
        company_id: companyId,
        branch_id: branchId
      }
    });

    const { next_cursor, products = [], categories = [], customers = [], stocks = [], notifications = [] } = res.data;

    // Mise à jour atomique du catalogue local Dexie
    await db.transaction('rw', [db.products, db.categories, db.customers, db.stock, db.notifications, db.sync_metadata], async () => {
      // Mettre à jour les produits (et traiter les tombstones deleted_at)
      for (const p of products) {
        if (p.deleted_at) {
          await db.products.delete(p.id);
        } else {
          await db.products.put(p);
        }
      }

      // Mettre à jour les catégories
      for (const c of categories) {
        await db.categories.put(c);
      }

      // Mettre à jour les clients
      for (const cust of customers) {
        await db.customers.put(cust);
      }

      // Mettre à jour les stocks de la boutique
      for (const st of stocks) {
        await db.stock.put(st);
      }

      // Mettre à jour les notifications du serveur (dédupliquées par id)
      for (const n of notifications) {
        await db.notifications.put(n);
      }

      // Enregistrer le curseur retourné par le serveur Laravel
      if (next_cursor) {
        await db.sync_metadata.put({ key: 'last_sync_cursor', value: next_cursor });
      }
    });

    if (notifications.length > 0 && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('notification-refresh'));
    }
  }
}

export const syncService = new SyncService();
