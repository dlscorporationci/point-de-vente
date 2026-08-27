import { db } from './db';

/**
 * Service de stockage et de gestion hors-ligne (Offline Storage Manager)
 * Unifié sur le moteur Dexie (IndexedDB) avec fallback localStorage pour compatibilité.
 */

const QUEUE_KEY = 'apexpos_offline_sales_queue';
const PRODUCTS_KEY = 'apexpos_cached_products';
const CATEGORIES_KEY = 'apexpos_cached_categories';
const CUSTOMERS_KEY = 'apexpos_cached_customers';

export const offlineStorage = {
  // ----------------------------------------------------
  // 1. GESTION DU CATALOGUE ET DES CLIENTS EN CACHE
  // ----------------------------------------------------
  saveProducts(products) {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products || []));
    } catch (e) {
      console.warn('Erreur stockage produits local:', e);
    }
  },

  getProducts() {
    try {
      const data = localStorage.getItem(PRODUCTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveCategories(categories) {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories || []));
    } catch (e) {
      console.warn('Erreur stockage catégories local:', e);
    }
  },

  getCategories() {
    try {
      const data = localStorage.getItem(CATEGORIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveCustomers(customers) {
    try {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers || []));
    } catch (e) {
      console.warn('Erreur stockage clients local:', e);
    }
  },

  getCustomers() {
    try {
      const data = localStorage.getItem(CUSTOMERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // ----------------------------------------------------
  // 2. GESTION DE LA FILE D'ATTENTE DES VENTES HORS-LIGNE (DEXIE + FALLBACK)
  // ----------------------------------------------------
  getPendingSales() {
    try {
      const data = localStorage.getItem(QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  enqueueSale(salePayload) {
    try {
      const queue = this.getPendingSales();
      const uuid = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : `OFFLINE-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      const localId = uuid;
      
      const formattedSale = {
        ...salePayload,
        _local_id: localId,
        _offline_created_at: new Date().toISOString(),
        sale_number: `TICK-${localId.slice(-8)}`
      };
      queue.push(formattedSale);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));

      // Enregistrer également dans Dexie sync_queue pour le moteur SyncService
      const companyId = parseInt(localStorage.getItem('company-id') || salePayload.company_id || 1);
      const branchId = parseInt(localStorage.getItem('branch-id') || salePayload.branch_id || 1);
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

      db.sync_queue.put({
        uuid: uuid,
        company_id: companyId,
        branch_id: branchId,
        user_id: user ? user.id : 1,
        entity_type: 'sale',
        entity_id: null,
        action: 'create',
        payload: salePayload,
        status: 'pending',
        created_at: new Date().toISOString()
      }).catch(err => console.warn('Erreur insertion Dexie sync_queue:', err));

      return formattedSale;
    } catch (e) {
      console.error('Erreur mise en file d\'attente de la vente hors-ligne:', e);
      throw e;
    }
  },

  removePendingSale(localId) {
    try {
      const queue = this.getPendingSales().filter(item => item._local_id !== localId);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));

      db.sync_queue.where('uuid').equals(localId).delete().catch(() => {});
    } catch (e) {
      console.error('Erreur suppression vente synchronisée:', e);
    }
  },

  clearQueue() {
    localStorage.removeItem(QUEUE_KEY);
    db.sync_queue.where('entity_type').equals('sale').delete().catch(() => {});
  }
};

