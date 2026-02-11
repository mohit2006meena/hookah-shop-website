'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { products } from '@/lib/catalog';
import type { CartLine, Order, SavedAddress, ShippingMode } from '@/lib/types';
import { cartCount, getVariant, linePrice } from '@/lib/utils';

type StoreContextValue = {
  lines: CartLine[];
  wishlistIds: string[];
  recentlyViewed: string[];
  shippingMode: ShippingMode;
  couponCode: string;
  drawerOpen: boolean;
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  itemCount: number;
  orders: Order[];
  savedAddresses: SavedAddress[];
  abandonedCart: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (productId: string, variantId: string, qty?: number) => void;
  updateQty: (productId: string, variantId: string, qty: number) => void;
  removeLine: (productId: string, variantId: string) => void;
  clearCart: () => void;
  replaceCart: (lines: CartLine[]) => void;
  toggleWishlist: (productId: string) => void;
  addRecentlyViewed: (productId: string) => void;
  setShippingMode: (mode: ShippingMode) => void;
  setCouponCode: (code: string) => void;
  saveAddress: (address: Omit<SavedAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  syncOrder: (order: Order) => void;
  getOrderById: (orderId: string) => Order | null;
  reorder: (orderId: string) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const STORAGE_KEY = 'sheesha-store-v3';
const VALID_COUPONS: Record<string, number> = {
  LUXE10: 0.1,
  NIGHT15: 0.15,
  FIRST5: 0.05
};

type PersistedState = {
  lines: CartLine[];
  wishlistIds: string[];
  recentlyViewed: string[];
  shippingMode: ShippingMode;
  couponCode: string;
  savedAddresses: SavedAddress[];
  orders: Order[];
  lastCartTouch: number;
};

const defaultState: PersistedState = {
  lines: [],
  wishlistIds: [],
  recentlyViewed: [],
  shippingMode: 'standard',
  couponCode: '',
  savedAddresses: [],
  orders: [],
  lastCartTouch: Date.now()
};

function findProduct(productId: string) {
  return products.find((product) => product.id === productId);
}

function sanitizeLine(line: CartLine): CartLine | null {
  const product = findProduct(line.productId);
  if (!product) return null;

  const variant = getVariant(product, line.variantId);
  const qty = Math.max(1, Math.min(20, Math.round(Number(line.qty) || 1)));

  return {
    productId: product.id,
    variantId: variant.id,
    qty
  };
}

function sanitizeAddress(entry: SavedAddress): SavedAddress | null {
  if (!entry || typeof entry !== 'object') return null;
  if (!entry.fullName || !entry.phone || !entry.address || !entry.city || !entry.pincode) return null;

  return {
    id: entry.id || `ADDR${Date.now().toString().slice(-6)}`,
    label: entry.label || 'Saved Address',
    fullName: entry.fullName,
    phone: entry.phone,
    address: entry.address,
    city: entry.city,
    pincode: entry.pincode
  };
}

function sanitizeOrder(entry: Order): Order | null {
  if (!entry || typeof entry !== 'object') return null;
  if (!entry.id || !entry.createdAt || !Array.isArray(entry.lines)) return null;

  const lines = entry.lines.map((line) => sanitizeLine(line)).filter(Boolean) as CartLine[];
  if (lines.length === 0) return null;

  return {
    ...entry,
    lines,
    status: entry.status || 'placed'
  };
}

function hydrateState(raw: string | null): PersistedState {
  if (!raw) return defaultState;

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedState>;

    return {
      lines: Array.isArray(parsed.lines) ? (parsed.lines.map((line) => sanitizeLine(line)).filter(Boolean) as CartLine[]) : [],
      wishlistIds: Array.isArray(parsed.wishlistIds)
        ? parsed.wishlistIds.filter((id): id is string => typeof id === 'string' && !!findProduct(id))
        : [],
      recentlyViewed: Array.isArray(parsed.recentlyViewed)
        ? parsed.recentlyViewed.filter((id): id is string => typeof id === 'string' && !!findProduct(id)).slice(0, 12)
        : [],
      shippingMode: parsed.shippingMode === 'express' || parsed.shippingMode === 'pickup' ? parsed.shippingMode : 'standard',
      couponCode: typeof parsed.couponCode === 'string' ? parsed.couponCode.toUpperCase().trim() : '',
      savedAddresses: Array.isArray(parsed.savedAddresses)
        ? (parsed.savedAddresses.map((address) => sanitizeAddress(address)).filter(Boolean) as SavedAddress[])
        : [],
      orders: Array.isArray(parsed.orders) ? (parsed.orders.map((order) => sanitizeOrder(order)).filter(Boolean) as Order[]) : [],
      lastCartTouch: typeof parsed.lastCartTouch === 'number' ? parsed.lastCartTouch : Date.now()
    };
  } catch {
    return defaultState;
  }
}

function track(eventName: string, payload: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const dataLayer = (window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer;
  if (Array.isArray(dataLayer)) dataLayer.push({ event: eventName, ...payload });
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => {
    if (typeof window === 'undefined') return defaultState;
    return hydrateState(window.localStorage.getItem(STORAGE_KEY));
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [abandonedCart, setAbandonedCart] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  useEffect(() => {
    const evaluate = () => {
      setAbandonedCart(state.lines.length > 0 && Date.now() - state.lastCartTouch > 1000 * 60 * 20);
    };

    evaluate();
    const timer = window.setInterval(evaluate, 60_000);
    return () => window.clearInterval(timer);
  }, [state.lastCartTouch, state.lines.length]);

  const pricing = useMemo(() => {
    const subtotal = state.lines.reduce((total, line) => {
      const product = findProduct(line.productId);
      if (!product) return total;
      return total + linePrice(product, line);
    }, 0);

    const discountRate = VALID_COUPONS[state.couponCode] || 0;
    const discount = Math.round(subtotal * discountRate);
    const baseShipping = state.shippingMode === 'express' ? 199 : state.shippingMode === 'pickup' ? 0 : 79;
    const shippingFee = state.shippingMode === 'standard' && subtotal >= 3000 ? 0 : baseShipping;
    const taxable = Math.max(0, subtotal - discount);
    const tax = Math.round(taxable * 0.05);
    const total = taxable + shippingFee + tax;

    return { subtotal, discount, shippingFee, tax, total, itemCount: cartCount(state.lines) };
  }, [state.couponCode, state.lines, state.shippingMode]);

  const value: StoreContextValue = {
    lines: state.lines,
    wishlistIds: state.wishlistIds,
    recentlyViewed: state.recentlyViewed,
    shippingMode: state.shippingMode,
    couponCode: state.couponCode,
    drawerOpen,
    subtotal: pricing.subtotal,
    shippingFee: pricing.shippingFee,
    discount: pricing.discount,
    tax: pricing.tax,
    total: pricing.total,
    itemCount: pricing.itemCount,
    orders: state.orders,
    savedAddresses: state.savedAddresses,
    abandonedCart,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
    addToCart: (productId, variantId, qty = 1) => {
      const product = findProduct(productId);
      if (!product) return;
      const variant = getVariant(product, variantId);

      setState((prev) => {
        const nextLines = [...prev.lines];
        const existing = nextLines.find((line) => line.productId === productId && line.variantId === variant.id);

        if (existing) {
          existing.qty = Math.min(20, existing.qty + qty);
        } else {
          nextLines.push({ productId, variantId: variant.id, qty: Math.min(20, Math.max(1, qty)) });
        }

        return { ...prev, lines: nextLines, lastCartTouch: Date.now() };
      });

      setDrawerOpen(true);
      track('add_to_cart', { productId, variantId, qty });
    },
    updateQty: (productId, variantId, qty) => {
      if (qty < 1) {
        setState((prev) => ({
          ...prev,
          lines: prev.lines.filter((line) => !(line.productId === productId && line.variantId === variantId)),
          lastCartTouch: Date.now()
        }));
        return;
      }

      setState((prev) => {
        const nextLines = prev.lines
          .map((line) => (line.productId === productId && line.variantId === variantId ? { ...line, qty: Math.max(1, Math.min(20, qty)) } : line))
          .filter((line) => line.qty > 0);

        return { ...prev, lines: nextLines, lastCartTouch: Date.now() };
      });
    },
    removeLine: (productId, variantId) => {
      setState((prev) => ({
        ...prev,
        lines: prev.lines.filter((line) => !(line.productId === productId && line.variantId === variantId)),
        lastCartTouch: Date.now()
      }));
    },
    clearCart: () => setState((prev) => ({ ...prev, lines: [], couponCode: '', lastCartTouch: Date.now() })),
    replaceCart: (lines) => {
      const nextLines = lines.map((line) => sanitizeLine(line)).filter(Boolean) as CartLine[];
      setState((prev) => ({ ...prev, lines: nextLines, lastCartTouch: Date.now() }));
    },
    toggleWishlist: (productId) => {
      if (!findProduct(productId)) return;
      setState((prev) => {
        const hasItem = prev.wishlistIds.includes(productId);
        return {
          ...prev,
          wishlistIds: hasItem ? prev.wishlistIds.filter((id) => id !== productId) : [productId, ...prev.wishlistIds].slice(0, 40)
        };
      });
    },
    addRecentlyViewed: (productId) => {
      if (!findProduct(productId)) return;
      setState((prev) => ({
        ...prev,
        recentlyViewed: [productId, ...prev.recentlyViewed.filter((id) => id !== productId)].slice(0, 12)
      }));
    },
    setShippingMode: (mode) => setState((prev) => ({ ...prev, shippingMode: mode })),
    setCouponCode: (code) => setState((prev) => ({ ...prev, couponCode: code.toUpperCase().trim() })),
    saveAddress: (address) => {
      const nextAddress: SavedAddress = {
        ...address,
        id: `ADDR${Date.now().toString().slice(-7)}`
      };
      setState((prev) => ({ ...prev, savedAddresses: [nextAddress, ...prev.savedAddresses].slice(0, 10) }));
    },
    deleteAddress: (id) => {
      setState((prev) => ({ ...prev, savedAddresses: prev.savedAddresses.filter((address) => address.id !== id) }));
    },
    syncOrder: (order) => {
      const clean = sanitizeOrder(order);
      if (!clean) return;

      setState((prev) => {
        const existingIndex = prev.orders.findIndex((item) => item.id === clean.id);
        const nextOrders = [...prev.orders];
        if (existingIndex >= 0) {
          nextOrders[existingIndex] = clean;
        } else {
          nextOrders.unshift(clean);
        }
        return { ...prev, orders: nextOrders.slice(0, 80) };
      });
    },
    getOrderById: (orderId) => state.orders.find((order) => order.id.toLowerCase() === orderId.toLowerCase()) || null,
    reorder: (orderId) => {
      const order = state.orders.find((item) => item.id === orderId);
      if (!order) return;
      setState((prev) => ({ ...prev, lines: order.lines, couponCode: '', lastCartTouch: Date.now() }));
      setDrawerOpen(true);
      track('reorder', { orderId });
    }
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside StoreProvider');
  return context;
}
