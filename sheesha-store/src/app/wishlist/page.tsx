'use client';

import Link from 'next/link';
import { ProductCard } from '@/components/product/product-card';
import { useStore } from '@/components/providers/store-provider';
import { getRecommendedProducts, products } from '@/lib/catalog';

export default function WishlistPage() {
  const { wishlistIds } = useStore();
  const items = wishlistIds.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const fallback = getRecommendedProducts(4);

  return (
    <div className="lux-shell pb-16 pt-6 sm:pt-10 space-y-6">
      <section className="lux-card p-4 sm:p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-[#1bb8a0]">Saved</p>
        <h1 className="mt-2 text-3xl text-white">Wishlist</h1>
        <p className="mt-2 text-sm text-white/70">Keep your favorites ready for one-tap reorder and faster checkout.</p>
      </section>

      {items.length === 0 ? (
        <section className="lux-card p-6 text-center">
          <p className="text-white/75">No items saved yet.</p>
          <Link href="/shop" className="mt-4 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm text-white">
            Start browsing
          </Link>
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) =>
            item ? <ProductCard key={item.id} product={item} /> : null
          )}
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-2xl text-white">Recommended for you</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {fallback.map((item) => (
            <ProductCard key={`rec-${item.id}`} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
