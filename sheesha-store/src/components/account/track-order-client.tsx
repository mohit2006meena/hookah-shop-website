'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useStore } from '@/components/providers/store-provider';
import { products } from '@/lib/catalog';
import { formatINR, getVariant, linePrice } from '@/lib/utils';
import type { Order } from '@/lib/types';

const statusMessage: Record<string, string> = {
  placed: 'Order placed successfully',
  awaiting_payment: 'Awaiting payment completion',
  confirmed: 'Order confirmed by store',
  shipped: 'Out for delivery',
  delivered: 'Delivered',
  payment_expired: 'Payment session expired',
  cancelled: 'Order cancelled'
};

type OrderLookupResponse =
  | { ok: true; order: Order }
  | { ok: false; code: string; message: string };

export function TrackOrderClient({ initialOrderId }: { initialOrderId?: string }) {
  const { getOrderById, orders, syncOrder } = useStore();
  const [query, setQuery] = useState(initialOrderId || '');
  const [activeId, setActiveId] = useState(initialOrderId || '');
  const [remoteOrder, setRemoteOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const localOrder = useMemo(() => {
    if (!activeId) return null;
    return getOrderById(activeId);
  }, [activeId, getOrderById]);

  const order = remoteOrder || localOrder;

  async function fetchOrder(orderId: string) {
    setLoading(true);
    setErrorMessage('');
    setRemoteOrder(null);

    try {
      const response = await fetch(`/api/commerce/orders/${encodeURIComponent(orderId)}`, { cache: 'no-store' });
      const data = (await response.json()) as OrderLookupResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.ok ? 'Order not found.' : data.message || 'Order not found.');
      }

      setRemoteOrder(data.order);
      syncOrder(data.order);
    } catch (error) {
      const fallback = getOrderById(orderId);
      if (fallback) {
        setRemoteOrder(fallback);
      } else {
        setErrorMessage(error instanceof Error ? error.message : 'Order not found.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = query.trim();
    setActiveId(id);
    if (!id) return;
    void fetchOrder(id);
  }

  return (
    <div className="lux-shell space-y-6 pb-16 pt-6 sm:pt-10">
      <section className="lux-card p-4 sm:p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-[#1bb8a0]">Tracking</p>
        <h1 className="mt-2 text-3xl text-white">Track your order</h1>
        <p className="mt-2 text-sm text-white/70">Enter your order ID to check backend order status in real time.</p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Example: SH12345678"
            className="h-11 flex-1 rounded-full border border-white/15 bg-black/30 px-4 text-sm text-white"
          />
          <button type="submit" className="h-11 rounded-full bg-gradient-to-r from-[#c9a24f] to-[#1bb8a0] px-5 text-sm font-semibold text-black">
            {loading ? 'Checking...' : 'Track'}
          </button>
        </form>
      </section>

      {errorMessage ? <section className="lux-card p-4 text-sm text-[#f5c7c7]">{errorMessage}</section> : null}

      {activeId && !order && !loading ? (
        <section className="lux-card p-4 text-sm text-[#f5c7c7]">No order found with ID {activeId}.</section>
      ) : null}

      {order ? (
        <section className="lux-card space-y-4 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-2xl text-white">Order {order.id}</h2>
            <span className="rounded-full border border-[#1bb8a0]/50 bg-[#1bb8a0]/15 px-3 py-1 text-xs text-[#97f5e6]">
              {statusMessage[order.status] || order.status}
            </span>
          </div>
          <p className="text-sm text-white/70">Placed on {new Date(order.createdAt).toLocaleString()}</p>

          <div className="space-y-2 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-white/80">
            {order.lines.map((line) => {
              const product = products.find((item) => item.id === line.productId);
              if (!product) return null;
              const variant = getVariant(product, line.variantId);
              return (
                <div key={`${line.productId}-${line.variantId}`} className="flex items-center justify-between gap-3">
                  <span>
                    {product.name} ({variant.label}) x {line.qty}
                  </span>
                  <span>{formatINR(linePrice(product, line))}</span>
                </div>
              );
            })}
          </div>

          <div className="text-sm text-white/80">
            <p>
              Total: <span className="font-semibold text-white">{formatINR(order.total)}</span>
            </p>
            <p>
              Shipping to: {order.address}, {order.city} - {order.pincode}
            </p>
            <p>Phone: {order.phone}</p>
          </div>
        </section>
      ) : null}

      {orders.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-2xl text-white">Recent orders on this device</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {orders.slice(0, 6).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setQuery(item.id);
                  setActiveId(item.id);
                  void fetchOrder(item.id);
                }}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-left text-sm"
              >
                <span className="text-white">{item.id}</span>
                <span className="text-white/65">{formatINR(item.total)}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
