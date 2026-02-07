'use client';

import Link from 'next/link';
import { useStore } from '@/components/providers/store-provider';
import { formatINR } from '@/lib/utils';

export default function AccountPage() {
  const { orders, savedAddresses, deleteAddress, reorder } = useStore();

  return (
    <div className="lux-shell pb-16 pt-6 sm:pt-10 space-y-6">
      <section className="lux-card p-4 sm:p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-[#1bb8a0]">Customer</p>
        <h1 className="mt-2 text-3xl text-white">My Account</h1>
        <p className="mt-2 text-sm text-white/70">Order history, saved addresses, and fast reordering.</p>
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
                  <p className="text-white/75">{address.fullName} | {address.phone}</p>
                  <p className="text-white/65">{address.address}, {address.city} - {address.pincode}</p>
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
            <Link href="/track-order" className="text-sm text-[#f5d895]">Track</Link>
          </div>

          {orders.length === 0 ? (
            <p className="mt-3 text-sm text-white/65">No orders yet.</p>
          ) : (
            <div className="mt-3 grid gap-3">
              {orders.slice(0, 8).map((order) => (
                <div key={order.id} className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-white">{order.id}</p>
                    <p className="text-white/70">{formatINR(order.total)}</p>
                  </div>
                  <p className="text-white/60">{new Date(order.createdAt).toLocaleDateString()} | {order.status}</p>
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
