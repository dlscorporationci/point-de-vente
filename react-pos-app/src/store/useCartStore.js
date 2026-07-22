import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: [],
  globalDiscount: 0, // Remise globale en XOF
  taxSettings: { enable_tax: true, tax_rate: 18 },

  setTaxSettings: (settings) => {
    if (settings) {
      set({ taxSettings: settings });
    }
  },

  addItem: (product) => {
    const { cart } = get();
    const existingIndex = cart.findIndex(item => item.product.id === product.id);

    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      set({ cart: newCart });
    } else {
      set({ cart: [...cart, { product, quantity: 1, discount: 0 }] });
    }
  },

  removeItem: (productId) => {
    const { cart } = get();
    set({ cart: cart.filter(item => item.product.id !== productId) });
  },

  updateQuantity: (productId, quantity) => {
    const { cart } = get();
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    const newCart = cart.map(item => 
      item.product.id === productId ? { ...item, quantity: parseFloat(quantity) } : item
    );
    set({ cart: newCart });
  },

  updateDiscount: (productId, discount) => {
    const { cart } = get();
    const newCart = cart.map(item => 
      item.product.id === productId ? { ...item, discount: parseFloat(discount || '0') } : item
    );
    set({ cart: newCart });
  },

  setGlobalDiscount: (discount) => {
    set({ globalDiscount: parseFloat(discount || '0') });
  },

  clearCart: () => {
    set({ cart: [], globalDiscount: 0 });
  },

  getTotals: (overrideTaxSettings) => {
    const { cart, globalDiscount, taxSettings } = get();
    const activeTax = overrideTaxSettings || taxSettings || { enable_tax: true, tax_rate: 18 };
    const enableTax = activeTax.enable_tax !== false && activeTax.enable_tax !== '0' && activeTax.enable_tax !== 0;
    const taxRate = enableTax ? parseFloat(activeTax.tax_rate ?? 18) : 0;

    let subtotal = 0;
    let itemDiscounts = 0;

    cart.forEach(item => {
      const price = parseFloat(item.product.selling_price);
      subtotal += item.quantity * price;
      itemDiscounts += parseFloat(item.discount || '0');
    });

    const totalDiscount = itemDiscounts + globalDiscount;
    const netTotal = Math.max(0, subtotal - totalDiscount);
    const tax = enableTax ? netTotal * (taxRate / 100) : 0;
    const total = netTotal + tax;

    return {
      subtotal,
      discount: totalDiscount,
      tax,
      total,
      enableTax,
      taxRate: activeTax.tax_rate ?? 18
    };
  }
}));
