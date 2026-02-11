import { promises as fs } from 'fs';
import path from 'path';
import { products } from '@/lib/catalog';
import { getVariant, linePrice } from '@/lib/utils';
import type { CartLine, CheckoutPayload, Order, ShippingMode } from '@/lib/types';

type StoreData = {
  orders: Order[];
  inventory: Record<string, number>;
  abandonedCarts: AbandonedCartRecord[];
};

type PreparedLine = {
  productId: string;
  variantId: string;
  qty: number;
};

type PricingSummary = {
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  couponCode: string;
};

export type CheckoutRequest = {
  lines: CartLine[];
  shippingMode: ShippingMode;
  couponCode?: string;
  customer: CheckoutPayload;
};

export type CheckoutResult = {
  order: Order;
  payment:
    | null
    | {
        gateway: 'razorpay';
        keyId: string;
        gatewayOrderId: string;
        amount: number;
        currency: string;
      };
};

export type AbandonedCartInput = {
  fullName?: string;
  email?: string;
  phone?: string;
  lines: CartLine[];
  shippingMode: ShippingMode;
  couponCode?: string;
  total?: number;
};

type AbandonedCartRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  lines: PreparedLine[];
  shippingMode: ShippingMode;
  couponCode: string;
  total: number;
  updatedAt: string;
  recovered: boolean;
};

const STORE_FILE = path.join(process.cwd(), 'data', 'commerce.json');
const MAX_ORDERS = 1200;
const MAX_ABANDONED_CARTS = 800;
const GST_RATE = 0.05;

const COUPONS: Record<string, number> = {
  LUXE10: 0.1,
  NIGHT15: 0.15,
  FIRST5: 0.05
};

const productById = new Map(products.map((product) => [product.id, product]));

export class CommerceError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const defaultStore: StoreData = {
  orders: [],
  inventory: {},
  abandonedCarts: []
};

let mutationQueue: Promise<unknown> = Promise.resolve();

function variantStockKey(productId: string, variantId: string) {
  return `${productId}::${variantId}`;
}

function nowIso() {
  return new Date().toISOString();
}

function normalizePhone(value: string) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function couponRate(code?: string) {
  const normalized = String(code || '').trim().toUpperCase();
  return COUPONS[normalized] || 0;
}

function shippingFeeForMode(mode: ShippingMode, subtotal: number) {
  const base = mode === 'express' ? 199 : mode === 'pickup' ? 0 : 79;
  if (mode === 'standard' && subtotal >= 3000) return 0;
  return base;
}

function getBaseVariantStock(productId: string, variantId: string) {
  const product = productById.get(productId);
  if (!product) return 0;
  const variant = product.variants.find((item) => item.id === variantId);
  return variant ? variant.stock : 0;
}

function getVariantStock(store: StoreData, productId: string, variantId: string) {
  const key = variantStockKey(productId, variantId);
  if (Object.prototype.hasOwnProperty.call(store.inventory, key)) {
    return Math.max(0, Math.floor(store.inventory[key] || 0));
  }
  return getBaseVariantStock(productId, variantId);
}

function setVariantStock(store: StoreData, productId: string, variantId: string, stock: number) {
  store.inventory[variantStockKey(productId, variantId)] = Math.max(0, Math.floor(stock));
}

function sanitizePreparedLines(lines: CartLine[]) {
  if (!Array.isArray(lines) || lines.length === 0) {
    throw new CommerceError(400, 'INVALID_LINES', 'Cart is empty.');
  }

  const prepared: PreparedLine[] = [];
  for (const line of lines) {
    const product = productById.get(String(line.productId || ''));
    if (!product) throw new CommerceError(400, 'INVALID_PRODUCT', `Unknown product: ${line.productId}`);
    const variant = product.variants.find((item) => item.id === String(line.variantId || ''));
    if (!variant) throw new CommerceError(400, 'INVALID_VARIANT', `Unknown variant for product ${product.name}`);
    const qty = Math.max(1, Math.min(20, Math.floor(Number(line.qty) || 1)));
    prepared.push({
      productId: product.id,
      variantId: variant.id,
      qty
    });
  }

  return prepared;
}

function sanitizeCheckoutCustomer(customer: CheckoutPayload) {
  const fullName = String(customer.fullName || '').trim();
  const phone = normalizePhone(customer.phone || '');
  const email = String(customer.email || '').trim().toLowerCase();
  const address = String(customer.address || '').trim();
  const city = String(customer.city || '').trim();
  const pincode = String(customer.pincode || '').trim();
  const paymentMethod = customer.paymentMethod;

  if (!fullName || !phone || !email || !address || !city || !pincode) {
    throw new CommerceError(400, 'INVALID_CUSTOMER', 'Complete name, phone, email, and address details are required.');
  }
  if (!/^\d{6}$/.test(pincode)) {
    throw new CommerceError(400, 'INVALID_PINCODE', 'Pincode must be 6 digits.');
  }
  if (!/^[6-9]\d{9}$/.test(phone)) {
    throw new CommerceError(400, 'INVALID_PHONE', 'Use a valid Indian mobile number.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new CommerceError(400, 'INVALID_EMAIL', 'Use a valid email address.');
  }
  if (paymentMethod !== 'UPI') {
    throw new CommerceError(400, 'INVALID_PAYMENT_METHOD', 'Payment method is not supported.');
  }

  return { fullName, phone, email, address, city, pincode, paymentMethod };
}

function calculatePricing(lines: PreparedLine[], shippingMode: ShippingMode, coupon?: string): PricingSummary {
  const subtotal = lines.reduce((total, line) => {
    const product = productById.get(line.productId);
    if (!product) return total;
    return total + linePrice(product, line);
  }, 0);

  const normalizedCoupon = String(coupon || '').trim().toUpperCase();
  const discount = Math.round(subtotal * couponRate(normalizedCoupon));
  const shippingFee = shippingFeeForMode(shippingMode, subtotal);
  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round(taxable * GST_RATE);
  const total = taxable + shippingFee + tax;

  return {
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    couponCode: normalizedCoupon
  };
}

function generateOrderId() {
  const stamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 900 + 100).toString();
  return `SH${stamp}${random}`;
}

function ensureStockAvailability(store: StoreData, lines: PreparedLine[]) {
  for (const line of lines) {
    const available = getVariantStock(store, line.productId, line.variantId);
    if (available < line.qty) {
      const product = productById.get(line.productId);
      const variant = product ? getVariant(product, line.variantId) : null;
      throw new CommerceError(409, 'OUT_OF_STOCK', `${product?.name || 'Product'} (${variant?.label || line.variantId}) has only ${available} left.`);
    }
  }
}

function reserveStock(store: StoreData, lines: PreparedLine[]) {
  for (const line of lines) {
    const available = getVariantStock(store, line.productId, line.variantId);
    setVariantStock(store, line.productId, line.variantId, available - line.qty);
  }
}

function releaseStock(store: StoreData, lines: PreparedLine[]) {
  for (const line of lines) {
    const available = getVariantStock(store, line.productId, line.variantId);
    setVariantStock(store, line.productId, line.variantId, available + line.qty);
  }
}

function normalizeStore(raw: unknown): StoreData {
  if (!raw || typeof raw !== 'object') return { ...defaultStore };
  const parsed = raw as Partial<StoreData>;
  return {
    orders: Array.isArray(parsed.orders) ? parsed.orders : [],
    inventory: parsed.inventory && typeof parsed.inventory === 'object' ? parsed.inventory : {},
    abandonedCarts: Array.isArray(parsed.abandonedCarts) ? parsed.abandonedCarts : []
  };
}

async function ensureStoreFile() {
  await fs.mkdir(path.dirname(STORE_FILE), { recursive: true });
  try {
    await fs.access(STORE_FILE);
  } catch {
    await fs.writeFile(STORE_FILE, JSON.stringify(defaultStore, null, 2), 'utf8');
  }
}

async function readStore(): Promise<StoreData> {
  await ensureStoreFile();
  const raw = await fs.readFile(STORE_FILE, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return normalizeStore(parsed);
  } catch {
    return { ...defaultStore };
  }
}

async function writeStore(store: StoreData) {
  const temp = `${STORE_FILE}.tmp`;
  await fs.writeFile(temp, JSON.stringify(store, null, 2), 'utf8');
  await fs.rename(temp, STORE_FILE);
}

function releaseExpiredPaymentReservations(store: StoreData) {
  const current = Date.now();
  let changed = false;

  for (const order of store.orders) {
    if (order.status !== 'awaiting_payment' || !order.reservationExpiresAt) continue;
    const expiresAt = Date.parse(order.reservationExpiresAt);
    if (!Number.isFinite(expiresAt) || current < expiresAt) continue;

    releaseStock(store, order.lines);
    order.status = 'payment_expired';
    order.reservationExpiresAt = undefined;
    changed = true;
  }

  return changed;
}

async function withMutation<T>(mutator: (store: StoreData) => Promise<T> | T): Promise<T> {
  const run = mutationQueue.then(async () => {
    const store = await readStore();
    releaseExpiredPaymentReservations(store);
    const result = await mutator(store);
    await writeStore(store);
    return result;
  });

  mutationQueue = run.then(
    () => undefined,
    () => undefined
  );

  return run;
}

function trimStore(store: StoreData) {
  store.orders = store.orders.slice(0, MAX_ORDERS);
  store.abandonedCarts = store.abandonedCarts.slice(0, MAX_ABANDONED_CARTS);
}

export async function createOrder(input: CheckoutRequest): Promise<CheckoutResult> {
  const lines = sanitizePreparedLines(input.lines);
  const customer = sanitizeCheckoutCustomer(input.customer);
  const shippingMode = input.shippingMode;
  if (shippingMode !== 'standard' && shippingMode !== 'express' && shippingMode !== 'pickup') {
    throw new CommerceError(400, 'INVALID_SHIPPING_MODE', 'Shipping mode is invalid.');
  }

  const pricing = calculatePricing(lines, shippingMode, input.couponCode);
  const orderId = generateOrderId();
  const result = await withMutation<CheckoutResult>((store) => {
    ensureStockAvailability(store, lines);
    reserveStock(store, lines);

    const order: Order = {
      id: orderId,
      createdAt: nowIso(),
      lines,
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      shippingFee: pricing.shippingFee,
      tax: pricing.tax,
      total: pricing.total,
      status: 'placed',
      paymentMethod: customer.paymentMethod,
      customerName: customer.fullName,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      city: customer.city,
      pincode: customer.pincode,
      gatewayOrderId: undefined,
      reservationExpiresAt: undefined
    };

    store.orders.unshift(order);
    const normalizedOrderPhone = normalizePhone(customer.phone);
    store.abandonedCarts = store.abandonedCarts.map((cart) => {
      const matchesEmail = customer.email && cart.email && cart.email === customer.email;
      const matchesPhone = normalizedOrderPhone && normalizePhone(cart.phone) === normalizedOrderPhone;
      if (matchesEmail || matchesPhone) {
        return { ...cart, recovered: true, updatedAt: nowIso() };
      }
      return cart;
    });
    trimStore(store);

    return {
      order,
      payment: null
    };
  });
  return result;
}

export async function verifyOrderPayment(payload: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  void payload;
  throw new CommerceError(410, 'PAYMENT_VERIFY_DISABLED', 'Gateway verification is disabled. UPI-only manual confirmation is enabled.');
}

export async function getOrderById(orderId: string) {
  const store = await readStore();
  if (releaseExpiredPaymentReservations(store)) {
    await writeStore(store);
  }
  return store.orders.find((item) => item.id.toLowerCase() === orderId.toLowerCase()) || null;
}

export async function captureAbandonedCart(input: AbandonedCartInput) {
  const lines = sanitizePreparedLines(input.lines);
  const shippingMode = input.shippingMode;
  if (shippingMode !== 'standard' && shippingMode !== 'express' && shippingMode !== 'pickup') return;

  const email = String(input.email || '').trim().toLowerCase();
  const phone = normalizePhone(String(input.phone || '').trim());
  if (!email && !phone) return;

  const pricing = calculatePricing(lines, shippingMode, input.couponCode);
  const total = typeof input.total === 'number' && input.total > 0 ? Math.round(input.total) : pricing.total;
  const fullName = String(input.fullName || '').trim();
  const couponCode = String(input.couponCode || '').trim().toUpperCase();

  await withMutation((store) => {
    const cartId = `${email || 'na'}::${phone || 'na'}`;
    const existing = store.abandonedCarts.find((item) => item.id === cartId);
    if (existing) {
      existing.fullName = fullName || existing.fullName;
      existing.email = email;
      existing.phone = phone;
      existing.lines = lines;
      existing.shippingMode = shippingMode;
      existing.couponCode = couponCode;
      existing.total = total;
      existing.updatedAt = nowIso();
      existing.recovered = false;
    } else {
      store.abandonedCarts.unshift({
        id: cartId,
        fullName,
        email,
        phone,
        lines,
        shippingMode,
        couponCode,
        total,
        updatedAt: nowIso(),
        recovered: false
      });
    }
    trimStore(store);
  });
}

export async function findOrders(query: {
  orderId?: string;
  email?: string;
  phone?: string;
  limit?: number;
}) {
  const store = await readStore();
  if (releaseExpiredPaymentReservations(store)) {
    await writeStore(store);
  }

  const orderId = String(query.orderId || '').trim().toLowerCase();
  const email = String(query.email || '').trim().toLowerCase();
  const phone = normalizePhone(String(query.phone || '').trim());
  const limit = Math.max(1, Math.min(50, Math.floor(Number(query.limit) || 10)));

  if (!orderId && !email && !phone) {
    throw new CommerceError(400, 'MISSING_QUERY', 'Provide orderId, email, or phone to fetch orders.');
  }

  const matched = store.orders
    .filter((order) => {
      if (orderId) return order.id.toLowerCase() === orderId;
      const emailMatch = email ? order.email.toLowerCase() === email : false;
      const phoneMatch = phone ? normalizePhone(order.phone) === phone : false;
      return emailMatch || phoneMatch;
    })
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, limit);

  return matched;
}

export async function getInventoryView() {
  const store = await readStore();
  if (releaseExpiredPaymentReservations(store)) {
    await writeStore(store);
  }

  return products.map((product) => ({
    productId: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    variants: product.variants.map((variant) => ({
      variantId: variant.id,
      label: variant.label,
      stock: getVariantStock(store, product.id, variant.id),
      price: product.price + variant.priceDelta
    }))
  }));
}

export async function setInventoryStock(payload: { productId: string; variantId: string; stock: number }) {
  const product = productById.get(payload.productId);
  if (!product) throw new CommerceError(404, 'PRODUCT_NOT_FOUND', 'Product not found.');
  const variant = product.variants.find((item) => item.id === payload.variantId);
  if (!variant) throw new CommerceError(404, 'VARIANT_NOT_FOUND', 'Variant not found.');

  const stock = Math.max(0, Math.floor(Number(payload.stock) || 0));
  await withMutation((store) => {
    setVariantStock(store, product.id, variant.id, stock);
  });

  return { productId: product.id, variantId: variant.id, stock };
}

export async function getAdminDashboard() {
  const store = await readStore();
  if (releaseExpiredPaymentReservations(store)) {
    await writeStore(store);
  }

  const inventory = await getInventoryView();
  const lowStock = inventory
    .flatMap((product) =>
      product.variants
        .filter((variant) => variant.stock <= 5)
        .map((variant) => ({
          productId: product.productId,
          productName: product.name,
          variantId: variant.variantId,
          variantLabel: variant.label,
          stock: variant.stock
        }))
    )
    .slice(0, 100);

  const recentOrders = [...store.orders]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 30);

  const pendingPayments = store.orders.filter((order) => order.status === 'awaiting_payment').length;
  const placedToday = store.orders.filter((order) => {
    const placed = new Date(order.createdAt);
    const now = new Date();
    return placed.getDate() === now.getDate() && placed.getMonth() === now.getMonth() && placed.getFullYear() === now.getFullYear();
  }).length;

  return {
    metrics: {
      totalOrders: store.orders.length,
      pendingPayments,
      placedToday,
      abandonedCarts: store.abandonedCarts.filter((item) => !item.recovered).length
    },
    lowStock,
    recentOrders,
    abandonedCarts: [...store.abandonedCarts]
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      .slice(0, 40)
  };
}

export function isAdminAuthorized(token: string | null) {
  void token;
  return true;
}
