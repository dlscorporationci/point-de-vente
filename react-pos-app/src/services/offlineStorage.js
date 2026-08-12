/**
 * Service de stockage et de gestion hors-ligne (Offline Storage Manager)
 * Combine localStorage et le moteur IndexedDB/SQLite localDatabase.
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
    // Déprécié : les produits sont désormais gérés exclusivement par Dexie (db.js)
    // Conservé pour compatibilité lecture seule
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
    // Déprécié : les catégories sont désormais gérées par Dexie
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
    // Déprécié : les clients sont désormais gérés par Dexie
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
  // 2. GESTION DE LA FILE D'ATTENTE DES VENTES HORS-LIGNE
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
      const localId = `OFFLINE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const formattedSale = {
        ...salePayload,
        _local_id: localId,
        _offline_created_at: new Date().toISOString(),
        sale_number: `TICK-${localId.slice(-8)}`
      };
      queue.push(formattedSale);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));

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
    } catch (e) {
      console.error('Erreur suppression vente synchronisée:', e);
    }
  },

  clearQueue() {
    localStorage.removeItem(QUEUE_KEY);
  }
};
