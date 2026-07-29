import Dexie from 'dexie';

export const db = new Dexie('ApexPOS_Offline_DB');

db.version(1).stores({
  products: 'id, uuid, company_id, branch_id, barcode, sku, name, category_id, updated_at, deleted_at',
  categories: 'id, company_id, name',
  customers: 'id, company_id, name, phone',
  suppliers: 'id, company_id, name, phone',
  sales: 'uuid, id, company_id, branch_id, user_id, sale_number, payment_method, status, created_at, synced',
  sale_items: '++id, sale_uuid, product_id, quantity, total',
  stock: '++id, company_id, branch_id, product_id, stock_quantity',
  cash_sessions: 'id, uuid, company_id, branch_id, user_id, status',
  purchases: 'id, uuid, company_id, branch_id',
  transfers: 'id, uuid, company_id, from_branch_id, to_branch_id, status',
  notifications: '++id, company_id, branch_id, read_at',
  sync_queue: 'uuid, entity_type, entity_id, action, company_id, branch_id, user_id, status, created_at',
  sync_metadata: 'key, value'
});

/**
 * Utilitaires d'accès étanche par Entreprise et Boutique (Multi-Tenant & Multi-Branch)
 */
export const getLocalProducts = async (companyId, branchId) => {
  return await db.products
    .where('company_id').equals(companyId)
    .filter(p => !p.deleted_at)
    .toArray();
};

export const getLocalCustomers = async (companyId) => {
  return await db.customers
    .where('company_id').equals(companyId)
    .toArray();
};

export const getLocalCategories = async (companyId) => {
  return await db.categories
    .where('company_id').equals(companyId)
    .toArray();
};

export const getPendingSyncQueue = async (companyId, branchId) => {
  return await db.sync_queue
    .where('status').equals('pending')
    .filter(q => q.company_id === companyId && (!branchId || q.branch_id === branchId))
    .toArray();
};
