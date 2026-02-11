'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { products } from '@/lib/catalog';
import { useStore } from '@/components/providers/store-provider';
import { formatINR, getVariant, linePrice } from '@/lib/utils';
import type { CheckoutPayload, Order, ShippingMode } from '@/lib/types';

type OrderCreateResponse =
  | { ok: true; order: Order; payment: null }
  | { ok: false; code: string; message: string };

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

const STORE_UPI_ID = 'sheeshahookahshop@upi';
const STORE_UPI_NAME = 'SHEESHA HOOKAH';

function openUpiIntent(order: Order) {
  const params = new URLSearchParams({
    pa: STORE_UPI_ID,
    pn: STORE_UPI_NAME,
    am: String(order.total),
    cu: 'INR',
    tn: `Order ${order.id}`
  });

  const url = `upi://pay?${params.toString()}`;
  window.location.href = url;
}

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
    syncOrder,
    clearCart,
    saveAddress
  } = useStore();

  const [form, setForm] = useState<CheckoutPayload>(emptyForm);
  const [saveAddressEnabled, setSaveAddressEnabled] = useState(true);
  const [addressLabel, setAddressLabel] = useState('Home');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  useEffect(() => {
    if (!lines.length) return;
    if (!form.email.trim() && !form.phone.trim()) return;

    const timer = window.setTimeout(() => {
      void fetch('/api/commerce/abandoned-carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          lines,
          shippingMode,
          couponCode,
          total
        })
      });
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [couponCode, form.email, form.fullName, form.phone, lines, shippingMode, total]);

  useEffect(() => {
    if (!lines.length) return;

    const payload = JSON.stringify({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      lines,
      shippingMode,
      couponCode,
      total
    });

    const onBeforeUnload = () => {
      if (!form.email.trim() && !form.phone.trim()) return;
      if (!navigator.sendBeacon) return;
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/commerce/abandoned-carts', blob);
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [couponCode, form.email, form.fullName, form.phone, lines, shippingMode, total]);

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

  function handleOrderSuccess(order: Order) {
    syncOrder(order);
    if (saveAddressEnabled) {
      saveAddress({
        label: addressLabel || 'Saved Address',
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        pincode: form.pincode
      });
    }
    clearCart();
    setOrderId(order.id);
    setErrorMessage('');
    openUpiIntent(order);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lines.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage('');
    setOrderId(null);

    try {
      const response = await fetch('/api/commerce/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines,
          shippingMode,
          couponCode,
          customer: {
            ...form,
            paymentMethod: 'UPI'
          }
        })
      });

      const data = (await response.json()) as OrderCreateResponse;
      if (!response.ok || !data.ok) {
        throw new Error(data.ok ? 'Unable to place order.' : data.message);
      }

      handleOrderSuccess(data.order);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Order could not be placed.');
    } finally {
      setIsSubmitting(false);
    }
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
        <p className="mt-1 text-sm text-white/70">Autofill-enabled fields with UPI-only checkout for faster completion.</p>

        {orderId ? (
          <div className="mt-5 rounded-2xl border border-[#1bb8a0]/40 bg-[#1bb8a0]/10 p-4">
            <p className="text-sm text-white">Order placed successfully.</p>
            <p className="mt-1 text-xl font-semibold text-[#8cf0dd]">Order ID: {orderId}</p>
            <p className="mt-1 text-sm text-white/70">UPI payment has been initiated on your device.</p>
            <Link href={`/track-order?orderId=${orderId}`} className="mt-4 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm text-white">
              Track this order
            </Link>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-4 rounded-2xl border border-[#f2a5a5]/35 bg-[#f2a5a5]/10 p-3 text-sm text-[#ffd6d6]">{errorMessage}</div>
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

          <label className="block space-y-1">
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

          <label className="block space-y-1">
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
            <div className="rounded-2xl border border-[#c9a24f]/35 bg-[#c9a24f]/10 p-3 text-sm text-white">
              UPI only
            </div>
            <div className="grid gap-2 rounded-2xl border border-white/10 bg-black/25 p-3 text-xs text-white/70 sm:grid-cols-3">
              <span>Secure UPI payments</span>
              <span>UPI-only checkout</span>
              <span>SSL encrypted checkout</span>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-white/85">
              <input
                type="checkbox"
                checked={saveAddressEnabled}
                onChange={(event) => setSaveAddressEnabled(event.target.checked)}
                className="h-4 w-4"
              />
              Save this address for faster reorders
            </label>

            {saveAddressEnabled ? (
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
            disabled={isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#c9a24f] to-[#1bb8a0] text-sm font-semibold text-black disabled:opacity-60"
          >
            {isSubmitting ? 'Processing...' : `Place Order (${formatINR(total)})`}
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
                    <p className="text-white/55">
                      {line.variant} x {line.qty}
                    </p>
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
