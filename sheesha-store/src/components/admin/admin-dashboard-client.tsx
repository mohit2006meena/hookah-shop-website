'use client';

import { useEffect, useMemo, useState } from 'react';

type DashboardResponse = {
  ok: boolean;
  metrics?: {
    totalOrders: number;
    pendingPayments: number;
    placedToday: number;
    abandonedCarts: number;
  };
  recentOrders?: Array<{
    id: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  message?: string;
};

type InventoryResponse = {
  ok: boolean;
  inventory?: Array<{
    productId: string;
    name: string;
    category: string;
    variants: Array<{
      variantId: string;
      label: string;
      stock: number;
      price: number;
    }>;
  }>;
  message?: string;
};

type InventoryUpdateResponse = {
  ok: boolean;
  updated?: {
    productId: string;
    variantId: string;
    stock: number;
  };
  message?: string;
};

function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

export function AdminDashboardClient() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [inventory, setInventory] = useState<InventoryResponse['inventory']>([]);
  const [draftStock, setDraftStock] = useState<Record<string, number>>({});
  const [saveMessage, setSaveMessage] = useState('');

  const inventoryRows = useMemo(() => {
    return (inventory || []).flatMap((product) =>
      product.variants.map((variant) => ({
        ...variant,
        productId: product.productId,
        productName: product.name,
        category: product.category
      }))
    );
  }, [inventory]);

  async function loadDashboard() {
    setLoading(true);
    setErrorMessage('');
    setSaveMessage('');

    try {
      const [dashboardRes, inventoryRes] = await Promise.all([
        fetch('/api/commerce/admin/dashboard', { cache: 'no-store' }),
        fetch('/api/commerce/admin/inventory', { cache: 'no-store' })
      ]);

      const dashboardData = (await dashboardRes.json()) as DashboardResponse;
      const inventoryData = (await inventoryRes.json()) as InventoryResponse;

      if (!dashboardRes.ok || !dashboardData.ok) {
        throw new Error(dashboardData.message || 'Failed to load dashboard.');
      }
      if (!inventoryRes.ok || !inventoryData.ok) {
        throw new Error(inventoryData.message || 'Failed to load inventory.');
      }

      setDashboard(dashboardData);
      setInventory(inventoryData.inventory || []);
      setDraftStock({});
    } catch (error) {
      setDashboard(null);
      setInventory([]);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  async function saveStock(productId: string, variantId: string, currentStock: number) {
    const key = `${productId}::${variantId}`;
    const nextStock = Number.isFinite(draftStock[key]) ? Math.max(0, Math.floor(draftStock[key])) : currentStock;
    setSaveMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('/api/commerce/admin/inventory', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          variantId,
          stock: nextStock
        })
      });
      const data = (await response.json()) as InventoryUpdateResponse;
      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Failed to update stock.');
      }

      setInventory((prev) =>
        (prev || []).map((product) => {
          if (product.productId !== productId) return product;
          return {
            ...product,
            variants: product.variants.map((variant) =>
              variant.variantId === variantId ? { ...variant, stock: data.updated?.stock ?? variant.stock } : variant
            )
          };
        })
      );
      setSaveMessage(`Updated stock for ${productId} (${variantId})`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update stock.');
    }
  }

  return (
    <div className="lux-shell space-y-6 pb-16 pt-6 sm:pt-10">
      <section className="lux-card p-4 sm:p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-[#1bb8a0]">Admin</p>
        <h1 className="mt-2 text-3xl text-white">Business Control Center</h1>
        <p className="mt-2 text-sm text-white/70">Manage inventory, monitor conversion leaks, and track orders from one dashboard.</p>

        <button
          type="button"
          onClick={() => void loadDashboard()}
          disabled={loading}
          className="mt-4 h-11 rounded-full bg-gradient-to-r from-[#c9a24f] to-[#1bb8a0] px-5 text-sm font-semibold text-black disabled:opacity-60"
        >
          {loading ? 'Loading...' : 'Refresh Dashboard'}
        </button>

        {errorMessage ? <p className="mt-3 text-sm text-[#f5c7c7]">{errorMessage}</p> : null}
        {saveMessage ? <p className="mt-3 text-sm text-[#8cf0dd]">{saveMessage}</p> : null}
      </section>

      {dashboard?.metrics ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="lux-card p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-white/55">Total orders</p>
            <p className="mt-2 text-3xl text-white">{dashboard.metrics.totalOrders}</p>
          </article>
          <article className="lux-card p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-white/55">Pending payments</p>
            <p className="mt-2 text-3xl text-white">{dashboard.metrics.pendingPayments}</p>
          </article>
          <article className="lux-card p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-white/55">Placed today</p>
            <p className="mt-2 text-3xl text-white">{dashboard.metrics.placedToday}</p>
          </article>
          <article className="lux-card p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-white/55">Abandoned carts</p>
            <p className="mt-2 text-3xl text-white">{dashboard.metrics.abandonedCarts}</p>
          </article>
        </section>
      ) : null}

      {inventoryRows.length > 0 ? (
        <section className="lux-card overflow-hidden p-4 sm:p-6">
          <div className="mb-3">
            <h2 className="text-2xl text-white">Inventory tracking</h2>
            <p className="text-sm text-white/65">Update stock counts without redeploying the storefront.</p>
          </div>
          <div className="space-y-3">
            {inventoryRows.map((row) => {
              const key = `${row.productId}::${row.variantId}`;
              return (
                <div key={key} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-white/55">{row.category}</p>
                      <p className="text-base font-semibold text-white">{row.productName}</p>
                      <p className="text-sm text-white/70">{row.label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#c9a24f]">{formatINR(row.price)}</p>
                      <p className="text-xs text-white/60">Current stock: {row.stock}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      type="number"
                      min={0}
                      value={Number.isFinite(draftStock[key]) ? draftStock[key] : row.stock}
                      onChange={(event) =>
                        setDraftStock((prev) => ({
                          ...prev,
                          [key]: Number(event.target.value)
                        }))
                      }
                      className="h-10 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white sm:max-w-[160px]"
                    />
                    <button
                      type="button"
                      onClick={() => void saveStock(row.productId, row.variantId, row.stock)}
                      className="h-10 rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white"
                    >
                      Save stock
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {dashboard?.recentOrders && dashboard.recentOrders.length > 0 ? (
        <section className="lux-card p-4 sm:p-6">
          <h2 className="text-2xl text-white">Recent orders</h2>
          <div className="mt-3 space-y-2">
            {dashboard.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm">
                <span className="text-white">{order.id}</span>
                <span className="text-white/70">{order.status}</span>
                <span className="text-[#c9a24f]">{formatINR(order.total)}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
