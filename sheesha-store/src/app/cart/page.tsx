'use client';

import Link from 'next/link';
import { products } from '@/lib/catalog';
import { useStore } from '@/components/providers/store-provider';
import { formatINR, getVariant, linePrice } from '@/lib/utils';

export default function CartPage() {
  const {
    lines,
    updateQty,
    removeLine,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    shippingMode,
    setShippingMode,
    couponCode,
    setCouponCode
  } = useStore();

  return (
    <div className="lux-shell pb-16 pt-6 sm:pt-10 space-y-6">
      <section className="lux-card p-4 sm:p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-[#1bb8a0]">Cart</p>
        <h1 className="mt-2 text-3xl text-white">Your Shopping Cart</h1>
        <p className="mt-2 text-sm text-white/70">Review quantity, variant, shipping mode, and coupon before checkout.</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-3">
          {lines.length === 0 ? (
            <article className="lux-card p-6 text-center">
              <p className="text-sm text-white/70">Your cart is empty.</p>
              <Link
                href="/shop"
                className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#c9a24f] to-[#1bb8a0] px-5 text-sm font-semibold text-black"
              >
                Browse Products
              </Link>
            </article>
          ) : (
            lines.map((line) => {
              const product = products.find((item) => item.id === line.productId);
              if (!product) return null;
              const variant = getVariant(product, line.variantId);

              return (
                <article key={`${line.productId}-${line.variantId}`} className="lux-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-white/50">{product.category}</p>
                      <h2 className="text-xl text-white">{product.name}</h2>
                      <p className="text-sm text-white/65">{variant.label}</p>
                      <p className="mt-2 text-sm text-[#c9a24f]">{formatINR(linePrice(product, line))}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(line.productId, line.variantId)}
                      className="rounded-full border border-[#f09191]/35 px-3 py-1 text-xs text-[#f2b5b5]"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-2 py-1">
                    <button
                      type="button"
                      onClick={() => updateQty(line.productId, line.variantId, line.qty - 1)}
                      className="h-8 w-8 rounded-full border border-white/20 bg-white/10"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm text-white">{line.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(line.productId, line.variantId, line.qty + 1)}
                      className="h-8 w-8 rounded-full border border-white/20 bg-white/10"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <section className="space-y-4">
          <article className="lux-card p-4 sm:p-5">
            <h2 className="text-xl text-white">Cart Summary</h2>
            <div className="mt-3 space-y-2 text-sm text-white/80">
              <div className="flex items-center justify-between"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
              <div className="flex items-center justify-between"><span>Discount</span><span>-{formatINR(discount)}</span></div>
              <div className="flex items-center justify-between"><span>Shipping</span><span>{formatINR(shippingFee)}</span></div>
              <div className="flex items-center justify-between"><span>Tax</span><span>{formatINR(tax)}</span></div>
              <div className="flex items-center justify-between border-t border-white/10 pt-2 text-base font-semibold text-white">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>
            </div>
          </article>

          <article className="lux-card p-4 sm:p-5 space-y-3">
            <h3 className="text-lg text-white">Shipping Calculator</h3>
            <div className="grid gap-2">
              {(['standard', 'express', 'pickup'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setShippingMode(mode)}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${
                    shippingMode === mode ? 'border-[#c9a24f] bg-[#c9a24f]/12 text-white' : 'border-white/15 bg-black/25 text-white/75'
                  }`}
                >
                  <span className="capitalize">{mode}</span>
                  <span className="text-xs">
                    {mode === 'express' ? '1-2 days' : mode === 'pickup' ? '2 hours' : '2-4 days'}
                  </span>
                </button>
              ))}
            </div>

            <label className="block text-sm text-white/80">
              Coupon code
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="LUXE10"
                className="mt-1 h-10 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              />
            </label>
          </article>

          <Link
            href="/checkout"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#c9a24f] to-[#1bb8a0] text-sm font-semibold text-black"
          >
            Proceed to Checkout
          </Link>

          <article className="lux-card space-y-2 p-4 text-xs text-white/70">
            <p className="font-semibold text-white">Secure checkout assurances</p>
            <p>- UPI payment supported</p>
            <p>- GST invoice included on every order</p>
            <p>- Encrypted checkout and verified order tracking</p>
          </article>
        </section>
      </div>
    </div>
  );
}
