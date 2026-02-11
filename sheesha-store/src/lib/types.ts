export type Category = 'hookahs' | 'flavors' | 'accessories';

export type ProductVariant = {
  id: string;
  label: string;
  priceDelta: number;
  stock: number;
};

export type ProductReview = {
  id: string;
  author: string;
  title: string;
  rating: number;
  date: string;
  body: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  shortDescription: string;
  longDescription: string;
  price: number;
  compareAtPrice?: number;
  media: string[];
  badges: string[];
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  trustBadges: string[];
  sku: string;
  weightLabel: string;
};

export type CartLine = {
  productId: string;
  variantId: string;
  qty: number;
};

export type ShippingMode = 'standard' | 'express' | 'pickup';

export type PaymentMethod = 'UPI';

export type CheckoutPayload = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: PaymentMethod;
};

export type SavedAddress = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
};

export type OrderStatus =
  | 'placed'
  | 'awaiting_payment'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'payment_expired'
  | 'cancelled';

export type Order = {
  id: string;
  createdAt: string;
  lines: CartLine[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  paidAt?: string;
  reservationExpiresAt?: string;
};
