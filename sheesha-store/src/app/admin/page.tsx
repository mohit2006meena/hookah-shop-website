import { products } from '@/lib/catalog';

const coupons = [
  { code: 'LUXE10', discount: '10% off', rule: 'All products above Rs 999', status: 'Active' },
  { code: 'NIGHT15', discount: '15% off', rule: 'Hookahs only', status: 'Active' },
  { code: 'FIRST5', discount: '5% off', rule: 'First order', status: 'Active' }
];

export default function AdminPage() {
  const totalProducts = products.length;
  const lowStock = products
    .flatMap((product) => product.variants.map((variant) => ({ product: product.name, variant: variant.label, stock: variant.stock })))
    .filter((item) => item.stock < 6);

  return (
    <div className="lux-shell pb-16 pt-6 sm:pt-10 space-y-6">
      <section className="lux-card p-4 sm:p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-[#1bb8a0]">Admin</p>
        <h1 className="mt-2 text-3xl text-white">Business Control Center</h1>
        <p className="mt-2 text-sm text-white/70">Catalog, inventory, discount engine, tax/shipping rules, and analytics hooks.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="lux-card p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-white/55">Products</p>
          <p className="mt-2 text-3xl text-white">{totalProducts}</p>
        </article>
        <article className="lux-card p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-white/55">Low stock variants</p>
          <p className="mt-2 text-3xl text-white">{lowStock.length}</p>
        </article>
        <article className="lux-card p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-white/55">Analytics</p>
          <p className="mt-2 text-white">Events wired: add_to_cart, purchase, reorder</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="lux-card p-4 sm:p-5">
          <h2 className="text-xl text-white">Inventory Tracking</h2>
          <div className="mt-3 space-y-2 text-sm">
            {lowStock.length === 0 ? (
              <p className="text-white/70">No low-stock products.</p>
            ) : (
              lowStock.map((item) => (
                <div key={`${item.product}-${item.variant}`} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
                  <p className="text-white/80">{item.product} ({item.variant})</p>
                  <p className="text-[#f2b6a2]">{item.stock} left</p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="lux-card p-4 sm:p-5">
          <h2 className="text-xl text-white">Discount Engine</h2>
          <div className="mt-3 space-y-2 text-sm">
            {coupons.map((coupon) => (
              <div key={coupon.code} className="rounded-lg border border-white/10 px-3 py-2">
                <p className="font-semibold text-white">{coupon.code} - {coupon.discount}</p>
                <p className="text-white/65">{coupon.rule}</p>
                <p className="text-xs text-[#89e8d7]">{coupon.status}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/60">Tax: 5% GST | Shipping rules: standard/express/pickup</p>
        </article>
      </section>

      <section className="lux-card p-4 sm:p-5 text-sm text-white/75">
        <p className="font-semibold text-white">Abandoned Cart Recovery</p>
        <p className="mt-1">Cart inactivity banners are enabled in header. WhatsApp recovery can be automated by integrating this state with a backend CRM.</p>
      </section>
    </div>
  );
}
