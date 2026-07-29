/**
 * Service de stockage et de gestion hors-ligne (Offline Storage Manager)
 * Combine localStorage et le moteur IndexedDB/SQLite localDatabase.
 */

import { localDatabase } from './localDatabase';

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
      localDatabase.saveProducts(products || []);
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
      localDatabase.saveCategories(categories || []);
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
      localDatabase.saveCustomers(customers || []);
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

      // Sauvegarde parallèle dans le moteur SQL local pour transactions et historique
      localDatabase.saveSaleTransaction(salePayload, salePayload.items).catch(err => {
        console.warn('Sauvegarde BDD locale transaction SQL:', err);
      });

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
      localDatabase.markSaleSynced(localId).catch(() => {});
    } catch (e) {
      console.error('Erreur suppression vente synchronisée:', e);
    }
  },

  clearQueue() {
    localStorage.removeItem(QUEUE_KEY);
  }
};
