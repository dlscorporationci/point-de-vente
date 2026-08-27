import Dexie from 'dexie';

const DexieEngine = Dexie.default || Dexie;

export const db = new DexieEngine('ApexPOS_Offline_DB');

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

// Version 2 : Indexation composée [company_id+branch_id] et contextualisation stricte multi-tenant
db.version(2).stores({
  products: 'id, uuid, [company_id+branch_id], company_id, branch_id, barcode, sku, name, category_id, updated_at, deleted_at',
  categories: 'id, company_id, name',
  customers: 'id, company_id, name, phone',
  suppliers: 'id, company_id, name, phone',
  sales: 'uuid, id, [company_id+branch_id], company_id, branch_id, user_id, sale_number, payment_method, status, created_at, synced',
  sale_items: '++id, sale_uuid, [company_id+branch_id], company_id, branch_id, product_id, quantity, total',
  stock: '++id, [company_id+branch_id], company_id, branch_id, product_id, stock_quantity',
  cash_sessions: 'id, uuid, [company_id+branch_id], company_id, branch_id, user_id, status',
  purchases: 'id, uuid, [company_id+branch_id], company_id, branch_id',
  transfers: 'id, uuid, company_id, from_branch_id, to_branch_id, status',
  notifications: '++id, [company_id+branch_id], company_id, branch_id, user_id, read_at',
  sync_queue: 'uuid, [company_id+branch_id], company_id, branch_id, user_id, entity_type, entity_id, action, status, created_at',
  sync_metadata: 'key, value'
});

// Version 3 : Rôles personnalisés, zones d'accès, règles de gestion et packs de catalogue
db.version(3).stores({
  products: 'id, uuid, [company_id+branch_id], company_id, branch_id, barcode, sku, name, category_id, updated_at, deleted_at',
  categories: 'id, company_id, name',
  customers: 'id, company_id, name, phone',
  suppliers: 'id, company_id, name, phone',
  sales: 'uuid, id, [company_id+branch_id], company_id, branch_id, user_id, sale_number, payment_method, status, created_at, synced',
  sale_items: '++id, sale_uuid, [company_id+branch_id], company_id, branch_id, product_id, quantity, total',
  stock: '++id, [company_id+branch_id], company_id, branch_id, product_id, stock_quantity',
  cash_sessions: 'id, uuid, [company_id+branch_id], company_id, branch_id, user_id, status',
  purchases: 'id, uuid, [company_id+branch_id], company_id, branch_id',
  transfers: 'id, uuid, company_id, from_branch_id, to_branch_id, status',
  notifications: '++id, [company_id+branch_id], company_id, branch_id, user_id, read_at',
  sync_queue: 'uuid, [company_id+branch_id], company_id, branch_id, user_id, entity_type, entity_id, action, status, created_at',
  catalog_templates: 'id, slug, name, domain',
  custom_roles: 'id, company_id, name, slug',
  access_zones: 'id, company_id, name',
  business_rules: 'id, company_id, branch_id, rule_key'
});

// Version 4 : Packs/Types fournisseurs, ajustements de stock et corrections d'inventaire
db.version(4).stores({
  products: 'id, uuid, [company_id+branch_id], company_id, branch_id, barcode, sku, name, category_id, updated_at, deleted_at',
  categories: 'id, company_id, name',
  customers: 'id, company_id, name, phone',
  suppliers: 'id, company_id, name, phone',
  sales: 'uuid, id, [company_id+branch_id], company_id, branch_id, user_id, sale_number, payment_method, status, created_at, synced',
  sale_items: '++id, sale_uuid, [company_id+branch_id], company_id, branch_id, product_id, quantity, total',
  stock: '++id, [company_id+branch_id], company_id, branch_id, product_id, stock_quantity',
  cash_sessions: 'id, uuid, [company_id+branch_id], company_id, branch_id, user_id, status',
  purchases: 'id, uuid, [company_id+branch_id], company_id, branch_id',
  transfers: 'id, uuid, company_id, from_branch_id, to_branch_id, status',
  notifications: '++id, [company_id+branch_id], company_id, branch_id, user_id, read_at',
  sync_queue: 'uuid, [company_id+branch_id], company_id, branch_id, user_id, entity_type, entity_id, action, status, created_at',
  sync_metadata: 'key, value',
  catalog_templates: 'id, slug, name, domain',
  custom_roles: 'id, company_id, name, slug',
  access_zones: 'id, company_id, name',
  business_rules: 'id, company_id, branch_id, rule_key',
  supplier_packs: 'id, uuid, company_id, name',
  supplier_types: 'id, uuid, company_id, pack_id, name',
  stock_adjustments: 'id, uuid, [company_id+branch_id], company_id, branch_id, product_id, type, created_at'
});

/**
 * Utilitaires d'accès étanche par Entreprise et Boutique (Multi-Tenant & Multi-Branch)
 */
export const getLocalProducts = async (companyId, branchId) => {
  if (!companyId) return [];
  const cId = parseInt(companyId);
  const bId = branchId ? parseInt(branchId) : null;

  return await db.products
    .where('company_id').equals(cId)
    .filter(p => !p.deleted_at && (!bId || !p.branch_id || parseInt(p.branch_id) === bId))
    .toArray();
};

export const getLocalCustomers = async (companyId) => {
  if (!companyId) return [];
  return await db.customers
    .where('company_id').equals(parseInt(companyId))
    .toArray();
};

export const getLocalCategories = async (companyId) => {
  if (!companyId) return [];
  return await db.categories
    .where('company_id').equals(parseInt(companyId))
    .toArray();
};

export const getLocalSuppliers = async (companyId) => {
  if (!companyId) return [];
  return await db.suppliers
    .where('company_id').equals(parseInt(companyId))
    .toArray();
};

export const getLocalSales = async (companyId, branchId) => {
  if (!companyId) return [];
  const cId = parseInt(companyId);
  const bId = branchId ? parseInt(branchId) : null;

  return await db.sales
    .where('company_id').equals(cId)
    .filter(s => !bId || !s.branch_id || parseInt(s.branch_id) === bId)
    .reverse()
    .toArray();
};

export const getLocalCashSessions = async (companyId, branchId) => {
  if (!companyId) return [];
  const cId = parseInt(companyId);
  const bId = branchId ? parseInt(branchId) : null;

  return await db.cash_sessions
    .where('company_id').equals(cId)
    .filter(cs => !bId || !cs.branch_id || parseInt(cs.branch_id) === bId)
    .toArray();
};

export const getLocalTransfers = async (companyId) => {
  if (!companyId) return [];
  return await db.transfers
    .where('company_id').equals(parseInt(companyId))
    .toArray();
};

export const getLocalPurchases = async (companyId, branchId) => {
  if (!companyId) return [];
  const cId = parseInt(companyId);
  const bId = branchId ? parseInt(branchId) : null;

  return await db.purchases
    .where('company_id').equals(cId)
    .filter(p => !bId || !p.branch_id || parseInt(p.branch_id) === bId)
    .toArray();
};

export const getPendingSyncQueue = async (companyId, branchId) => {
  if (!companyId) return [];
  const cId = parseInt(companyId);
  const bId = branchId ? parseInt(branchId) : null;

  return await db.sync_queue
    .where('status').equals('pending')
    .filter(q => q.company_id === cId && (!bId || !q.branch_id || q.branch_id === bId))
    .toArray();
};

/**
 * Purge sécurisée lors du Logout sans détruire les opérations pending non synchronisées
 */
export const purgeLocalCacheOnLogout = async () => {
  try {
    await db.transaction('rw', [
      db.products, db.categories, db.customers, db.suppliers, db.stock, 
      db.notifications, db.sales, db.sale_items, db.cash_sessions, 
      db.purchases, db.transfers, db.sync_metadata,
      db.catalog_templates, db.custom_roles, db.access_zones,
      db.business_rules, db.supplier_packs, db.supplier_types, db.stock_adjustments
    ], async () => {
      await db.products.clear();
      await db.categories.clear();
      await db.customers.clear();
      await db.suppliers.clear();
      await db.stock.clear();
      await db.notifications.clear();
      await db.sales.clear();
      await db.sale_items.clear();
      await db.cash_sessions.clear();
      await db.purchases.clear();
      await db.transfers.clear();
      await db.sync_metadata.clear();
      await db.catalog_templates.clear();
      await db.custom_roles.clear();
      await db.access_zones.clear();
      await db.business_rules.clear();
      await db.supplier_packs.clear();
      await db.supplier_types.clear();
      await db.stock_adjustments.clear();
    });
  } catch (err) {
    console.warn('Purge sélective Dexie lors du logout:', err);
  }
};

