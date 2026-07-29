import { db } from './db';
import { syncService } from './SyncService';

class SaleService {
  /**
   * Créer une vente (Mode Offline-First avec UUID et Transaction Dexie)
   */
  async createSale(saleData, userContext) {
    const saleUuid = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : 'uuid-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);

    const companyId = parseInt(userContext.companyId || localStorage.getItem('company-id') || 1);
    const branchId = parseInt(userContext.branchId || localStorage.getItem('branch-id') || 1);
    const userId = userContext.user?.id || 1;

    const items = saleData.items || [];
    let subtotal = 0;
    let itemDiscounts = 0;
    const globalDiscount = parseFloat(saleData.global_discount || 0);

    items.forEach(it => {
      const q = parseFloat(it.quantity || 1);
      const p = parseFloat(it.selling_price || 0);
      const d = parseFloat(it.discount || 0);
      subtotal += (q * p);
      itemDiscounts += d;
    });

    const netSubtotal = Math.max(0, subtotal - (itemDiscounts + globalDiscount));
    const tax = Math.round(netSubtotal * 0.18 * 100) / 100;
    const total = Math.round((netSubtotal + tax) * 100) / 100;

    const saleNumber = 'VTE-OFFLINE-' + saleUuid.substring(0, 8).toUpperCase();

    const saleRecord = {
      uuid: saleUuid,
      sale_number: saleNumber,
      company_id: companyId,
      branch_id: branchId,
      user_id: userId,
      payment_method: saleData.payment_method || 'cash',
      payment_status: 'paid',
      amount_received: parseFloat(saleData.amount_received || total),
      amount_change: Math.max(0, parseFloat(saleData.amount_received || total) - total),
      client_name: saleData.client_name || 'Client Comptant',
      client_phone: saleData.client_phone || null,
      customer_id: saleData.customer_id || null,
      subtotal,
      discount: itemDiscounts + globalDiscount,
      tax,
      total,
      created_at: new Date().toISOString(),
      synced: 0
    };

    // Transaction Dexie Atomique (Sales + Items + Stock + Queue)
    await db.transaction('rw', [db.sales, db.sale_items, db.products, db.stock, db.sync_queue], async () => {
      // 1. Enregistrer la vente dans Dexie
      await db.sales.put(saleRecord);

      // 2. Enregistrer les articles et décrémenter le stock local
      for (const item of items) {
        const q = parseFloat(item.quantity);
        const p = parseFloat(item.selling_price);
        const d = parseFloat(item.discount || 0);
        const lTotal = (q * p) - d;

        await db.sale_items.add({
          sale_uuid: saleUuid,
          product_id: item.product_id || item.product?.id,
          product_name: item.product?.name || 'Produit',
          quantity: q,
          selling_price: p,
          discount: d,
          total: lTotal
        });

        // Décrémenter le stock dans le store local 'products'
        const pId = item.product_id || item.product?.id;
        if (pId) {
          const prod = await db.products.get(pId);
          if (prod && typeof prod.stock_quantity === 'number') {
            await db.products.update(pId, {
              stock_quantity: Math.max(0, prod.stock_quantity - q)
            });
          }
        }
      }

      // 3. Ajouter l'opération dans sync_queue
      await db.sync_queue.put({
        uuid: saleUuid,
        entity_type: 'sale',
        entity_id: null,
        action: 'create',
        company_id: companyId,
        branch_id: branchId,
        user_id: userId,
        payload: {
          ...saleRecord,
          items: items.map(it => ({
            product_id: it.product_id || it.product?.id,
            quantity: parseFloat(it.quantity),
            selling_price: parseFloat(it.selling_price),
            discount: parseFloat(it.discount || 0)
          }))
        },
        status: 'pending',
        attempts: 0,
        last_error: null,
        created_at: new Date().toISOString()
      });
    });

    // Tenter la synchronisation en arrière-plan
    syncService.runFullSync().catch(() => {});

    return {
      ...saleRecord,
      details: items.map(it => ({
        id: it.product_id || it.product?.id,
        product: it.product || { name: it.product_name || 'Produit' },
        quantity: parseFloat(it.quantity),
        selling_price: parseFloat(it.selling_price),
        discount: parseFloat(it.discount || 0),
        total: (parseFloat(it.quantity) * parseFloat(it.selling_price)) - parseFloat(it.discount || 0)
      }))
    };
  }
}

export const saleService = new SaleService();
