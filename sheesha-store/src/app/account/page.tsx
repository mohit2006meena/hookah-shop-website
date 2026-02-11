'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/components/providers/store-provider';
import { formatINR } from '@/lib/utils';
import type { Order } from '@/lib/types';

type OrdersLookupResponse =
  | { ok: true; orders: Order[] }
  | { ok: false; code: string; message: string };

export default function AccountPage() {
  const { orders, savedAddresses, deleteAddress, reorder, syncOrder } = useStore();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [fetchSuccess, setFetchSuccess] = useState('');

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
    [orders]
  );

  async function fetchOrders(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFetchError('');
    setFetchSuccess('');

    const queryEmail = email.trim().toLowerCase();
    const queryPhone = phone.trim();
    if (!queryEmail && !queryPhone) {
      setFetchError('Enter email or phone to sync order history.');
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (queryEmail) params.set('email', queryEmail);
      if (queryPhone) params.set('phone', queryPhone);
      params.set('limit', '25');

      const response = await fetch(`/api/commerce/orders?${params.toString()}`, { cache: 'no-store' });
      const data = (await response.json()) as OrdersLookupResponse;
      if (!response.ok || !data.ok) {
        throw new Error(data.ok ? 'Unable to fetch orders.' : data.message || 'Unable to fetch orders.');
      }

      data.orders.forEach((order) => syncOrder(order));
      setFetchSuccess(`Synced ${data.orders.length} order(s) to this device.`);
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : 'Unable to fetch orders.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="lux-shell space-y-6 pb-16 pt-6 sm:pt-10">
      <section className="lux-card p-4 sm:p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-[#1bb8a0]">Customer</p>
        <h1 className="mt-2 text-3xl text-white">My Account</h1>
        <p className="mt-2 text-sm text-white/70">Order history, saved addresses, and one-tap reordering.</p>

        <form onSubmit={fetchOrders} className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="h-11 rounded-full border border-white/15 bg-black/30 px-4 text-sm text-white"
          />
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Phone"
            className="h-11 rounded-full border border-white/15 bg-black/30 px-4 text-sm text-white"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="h-11 rounded-full bg-gradient-to-r from-[#c9a24f] to-[#1bb8a0] px-5 text-sm font-semibold text-black disabled:opacity-60"
          >
            {isLoading ? 'Syncing...' : 'Sync Orders'}
          </button>
        </form>
        {fetchError ? <p className="mt-2 text-sm text-[#f5c7c7]">{fetchError}</p> : null}
        {fetchSuccess ? <p className="mt-2 text-sm text-[#8cf0dd]">{fetchSuccess}</p> : null}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="lux-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-white">Saved Addresses</h2>
            <span className="text-xs text-white/60">{savedAddresses.length} saved</span>
          </div>

          {savedAddresses.length === 0 ? (
            <p className="mt-3 text-sm text-white/65">No saved addresses yet. Save one during checkout.</p>
          ) : (
            <div className="mt-3 grid gap-3">
              {savedAddresses.map((address) => (
                <div key={address.id} className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm">
                  <p className="font-semibold text-white">{address.label}</p>
                  <p className="text-white/75">
                    {address.fullName} | {address.phone}
                  </p>
                  <p className="text-white/65">
                    {address.address}, {address.city} - {address.pincode}
                  </p>
                  <button
                    type="button"
                    onClick={() => deleteAddress(address.id)}
                    className="mt-2 rounded-full border border-[#f09292]/40 px-3 py-1 text-xs text-[#f3b3b3]"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="lux-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-white">Order History</h2>
            <Link href="/track-order" className="text-sm text-[#f5d895]">
              Track
            </Link>
          </div>

          {sortedOrders.length === 0 ? (
            <p className="mt-3 text-sm text-white/65">No orders yet on this device.</p>
          ) : (
            <div className="mt-3 grid gap-3">
              {sortedOrders.slice(0, 10).map((order) => (
                <div key={order.id} className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-white">{order.id}</p>
                    <p className="text-white/70">{formatINR(order.total)}</p>
                  </div>
                  <p className="text-white/60">
                    {new Date(order.createdAt).toLocaleDateString()} | {order.status}
                  </p>
                  <button
                    type="button"
                    onClick={() => reorder(order.id)}
                    className="mt-2 rounded-full border border-white/20 px-3 py-1 text-xs text-white"
                  >
                    Reorder
                  </button>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
