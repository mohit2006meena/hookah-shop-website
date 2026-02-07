'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { products } from '@/lib/catalog';
import { useStore } from '@/components/providers/store-provider';
import { formatINR, getVariant, linePrice } from '@/lib/utils';
import type { CheckoutPayload, PaymentMethod, ShippingMode } from '@/lib/types';

const paymentMethods: PaymentMethod[] = ['UPI', 'Card', 'COD'];
const shippingModes: Array<{ value: ShippingMode; label: string; hint: string }> = [
  { value: 'standard', label: 'Standard', hint: '2-4 days' },
  { value: 'express', label: 'Express', hint: '1-2 days' },
  { value: 'pickup', label: 'Store Pickup', hint: 'Ready in 2 hours' }
];

const emptyForm: CheckoutPayload = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: 'Jaipur',
  pincode: '',
  paymentMethod: 'UPI'
};

export function CheckoutClient() {
  const {
    lines,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    shippingMode,
    setShippingMode,
    couponCode,
    setCouponCode,
    savedAddresses,
    placeOrder
  } = useStore();
  const [form, setForm] = useState<CheckoutPayload>(emptyForm);
  const [saveAddress, setSaveAddress] = useState(true);
  const [addressLabel, setAddressLabel] = useState('Home');
  const [orderId, setOrderId] = useState<string | null>(null);

  const lineItems = useMemo(() => {
    return lines
      .map((line) => {
        const product = products.find((item) => item.id === line.productId);
        if (!product) return null;
        const variant = getVariant(product, line.variantId);
        return {
          key: `${line.productId}-${line.variantId}`,
          name: product.name,
          variant: variant.label,
          qty: line.qty,
          amount: linePrice(product, line)
        };
      })
      .filter(Boolean);
  }, [lines]);

  function applySavedAddress(addressId: string) {
    const selected = savedAddresses.find((item) => item.id === addressId);
    if (!selected) return;
    setForm((prev) => ({
      ...prev,
      fullName: selected.fullName,
      phone: selected.phone,
      address: selected.address,
      city: selected.city,
      pincode: selected.pincode
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lines.length === 0) return;

    const id = placeOrder(form, saveAddress ? { saveAddressLabel: addressLabel } : undefined);
    setOrderId(id);
  }

  if (lines.length === 0) {
    return (
      <section className="lux-card p-6 text-center">
        <h1 className="text-3xl text-white">Checkout</h1>
        <p className="mt-2 text-sm text-white/70">Your cart is empty. Add products to continue.</p>
        <Link
          href="/shop"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#c9a24f] to-[#1bb8a0] px-6 text-sm font-semibold text-black"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="lux-card p-4 sm:p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-[#1bb8a0]">Guest checkout</p>
        <h1 className="mt-2 text-3xl text-white">One-page Checkout</h1>
        <p className="mt-1 text-sm text-white/70">Autofill-enabled fields for faster mobile completion.</p>

        {orderId ? (
          <div className="mt-5 rounded-2xl border border-[#1bb8a0]/40 bg-[#1bb8a0]/10 p-4">
            <p className="text-sm text-white">Order placed successfully.</p>
            <p className="mt-1 text-xl font-semibold text-[#8cf0dd]">Order ID: {orderId}</p>
            <p className="mt-1 text-sm text-white/70">A WhatsApp confirmation has been opened for instant processing.</p>
            <Link href={`/track-order?orderId=${orderId}`} className="mt-4 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm text-white">
              Track this order
            </Link>
          </div>
        ) : null}

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          {savedAddresses.length > 0 ? (
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.14em] text-white/55">Saved addresses</label>
              <select
                onChange={(event) => applySavedAddress(event.target.value)}
                className="h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              >
                <option value="">Choose saved address</option>
                {savedAddresses.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label} - {item.address}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs uppercase tracking-[0.14em] text-white/55">Full Name</span>
              <input
                required
                autoComplete="name"
                value={form.fullName}
                onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                className="h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs uppercase tracking-[0.14em] text-white/55">Phone</span>
              <input
                required
                autoComplete="tel"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                className="h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              />
            </label>
          </div>

          <label className="space-y-1 block">
            <span className="text-xs uppercase tracking-[0.14em] text-white/55">Email</span>
            <input
              required
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
            />
          </label>

          <label className="space-y-1 block">
            <span className="text-xs uppercase tracking-[0.14em] text-white/55">Address</span>
            <input
              required
              autoComplete="street-address"
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              className="h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs uppercase tracking-[0.14em] text-white/55">City</span>
              <input
                required
                autoComplete="address-level2"
                value={form.city}
                onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
                className="h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs uppercase tracking-[0.14em] text-white/55">Pincode</span>
              <input
                required
                maxLength={6}
                autoComplete="postal-code"
                value={form.pincode}
                onChange={(event) => setForm((prev) => ({ ...prev, pincode: event.target.value }))}
                className="h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              />
            </label>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.14em] text-white/55">Payment method</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {paymentMethods.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, paymentMethod: method }))}
                  className={`h-10 rounded-xl border text-sm ${
                    form.paymentMethod === method ? 'border-[#c9a24f] bg-[#c9a24f]/12 text-white' : 'border-white/15 bg-black/20 text-white/75'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-white/85">
              <input
                type="checkbox"
                checked={saveAddress}
                onChange={(event) => setSaveAddress(event.target.checked)}
                className="h-4 w-4"
              />
              Save this address for faster reorders
            </label>

            {saveAddress ? (
              <input
                value={addressLabel}
                onChange={(event) => setAddressLabel(event.target.value)}
                placeholder="Address label (Home/Office)"
                className="h-10 rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              />
            ) : null}
          </div>

          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#c9a24f] to-[#1bb8a0] text-sm font-semibold text-black"
          >
            Place Order ({formatINR(total)})
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <article className="lux-card p-4 sm:p-5">
          <h2 className="text-xl text-white">Order summary</h2>
          <div className="mt-3 space-y-3">
            {lineItems.map((line) =>
              line ? (
                <div key={line.key} className="flex items-start justify-between gap-3 text-sm">
                  <div>
                    <p className="text-white">{line.name}</p>
                    <p className="text-white/55">{line.variant} x {line.qty}</p>
                  </div>
                  <p className="text-white/80">{formatINR(line.amount)}</p>
                </div>
              ) : null
            )}
          </div>

          <div className="mt-4 space-y-2 border-t border-white/10 pt-3 text-sm text-white/80">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span>-{formatINR(discount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span>{formatINR(shippingFee)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tax</span>
              <span>{formatINR(tax)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-2 text-base font-semibold text-white">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>
        </article>

        <article className="lux-card p-4 sm:p-5">
          <h2 className="text-xl text-white">Shipping calculator</h2>
          <div className="mt-3 grid gap-2">
            {shippingModes.map((mode) => (
              <button
                key={mode.value}
                type="button"
                onClick={() => setShippingMode(mode.value)}
                className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${
                  shippingMode === mode.value ? 'border-[#c9a24f] bg-[#c9a24f]/12 text-white' : 'border-white/15 bg-black/25 text-white/75'
                }`}
              >
                <span>{mode.label}</span>
                <span className="text-xs">{mode.hint}</span>
              </button>
            ))}
          </div>

          <label className="mt-4 block text-sm text-white/80">
            Coupon code
            <input
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
              placeholder="LUXE10"
              className="mt-1 h-10 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
            />
          </label>
        </article>
      </section>
    </div>
  );
}
