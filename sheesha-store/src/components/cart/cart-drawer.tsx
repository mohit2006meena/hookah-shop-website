'use client';

import Link from 'next/link';
import { products } from '@/lib/catalog';
import { useStore } from '@/components/providers/store-provider';
import { formatINR, getVariant, linePrice } from '@/lib/utils';

export function CartDrawer() {
  const {
    lines,
    drawerOpen,
    closeDrawer,
    updateQty,
    removeLine,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    couponCode,
    setCouponCode,
    shippingMode,
    setShippingMode
  } = useStore();

  return (
    <>
      <button
        type="button"
        aria-label="Close cart drawer"
        onClick={closeDrawer}
        className={`fixed inset-0 z-40 bg-black/60 transition ${drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-white/10 bg-[#0b0f14] p-4 transition-transform sm:p-5 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!drawerOpen}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Your Cart</h2>
          <button type="button" onClick={closeDrawer} className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/75">
            Close
          </button>
        </div>

        <div className="mt-4 flex h-[calc(100%-3rem)] flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {lines.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                Cart is empty. Add products to start checkout.
              </div>
            ) : (
              lines.map((line) => {
                const product = products.find((item) => item.id === line.productId);
                if (!product) return null;
                const variant = getVariant(product, line.variantId);

                return (
                  <article key={`${line.productId}-${line.variantId}`} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-white">{product.name}</p>
                        <p className="text-xs text-white/60">{variant.label}</p>
                        <p className="mt-1 text-sm text-[#c9a24f]">{formatINR(linePrice(product, line))}</p>
                      </div>
                      <button type="button" onClick={() => removeLine(line.productId, line.variantId)} className="text-xs text-[#f28a8a]">
                        Remove
                      </button>
                    </div>

                    <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/15 px-2 py-1">
                      <button type="button" onClick={() => updateQty(line.productId, line.variantId, line.qty - 1)} className="h-7 w-7 rounded-full bg-white/10">
                        -
                      </button>
                      <span className="w-6 text-center text-sm text-white">{line.qty}</span>
                      <button type="button" onClick={() => updateQty(line.productId, line.variantId, line.qty + 1)} className="h-7 w-7 rounded-full bg-white/10">
                        +
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.14em] text-white/50">Coupon</label>
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="LUXE10"
                className="h-10 rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white outline-none"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.14em] text-white/50">Shipping</label>
              <select
                value={shippingMode}
                onChange={(event) => setShippingMode(event.target.value as 'standard' | 'express' | 'pickup')}
                className="h-10 rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              >
                <option value="standard">Standard</option>
                <option value="express">Express</option>
                <option value="pickup">Store Pickup</option>
              </select>
            </div>

            <div className="space-y-1 text-sm text-white/80">
              <div className="flex items-center justify-between"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
              <div className="flex items-center justify-between"><span>Discount</span><span>-{formatINR(discount)}</span></div>
              <div className="flex items-center justify-between"><span>Shipping</span><span>{formatINR(shippingFee)}</span></div>
              <div className="flex items-center justify-between"><span>Tax</span><span>{formatINR(tax)}</span></div>
              <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 text-base font-semibold text-white">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#c9a24f] to-[#1bb8a0] text-sm font-semibold text-black"
            >
              Continue to Checkout
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
