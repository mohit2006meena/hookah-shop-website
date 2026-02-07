import type { CartLine, Product } from '@/lib/types';

export const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

export function formatINR(value: number) {
  return INR.format(value);
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function getVariant(product: Product, variantId: string) {
  return product.variants.find((variant) => variant.id === variantId) || product.variants[0];
}

export function linePrice(product: Product, line: CartLine) {
  const variant = getVariant(product, line.variantId);
  return (product.price + variant.priceDelta) * line.qty;
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((total, line) => total + line.qty, 0);
}
