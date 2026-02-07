'use client';

import { useMemo, useState } from 'react';
import type { Category, Product } from '@/lib/types';
import { ProductCard } from '@/components/product/product-card';
import { categoryMeta } from '@/lib/catalog';
import { useStore } from '@/components/providers/store-provider';

const categories: Array<{ value: 'all' | Category; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'hookahs', label: 'Hookahs' },
  { value: 'flavors', label: 'Flavors' },
  { value: 'accessories', label: 'Accessories' }
];

type SortValue = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';

type ShopClientProps = {
  allProducts: Product[];
  initialCategory?: string;
  initialQuery?: string;
  initialSort?: string;
};

function safeCategory(value?: string): 'all' | Category {
  if (value === 'hookahs' || value === 'flavors' || value === 'accessories') return value;
  return 'all';
}

function safeSort(value?: string): SortValue {
  if (value === 'price-low' || value === 'price-high' || value === 'rating' || value === 'newest') return value;
  return 'featured';
}

export function ShopClient({ allProducts, initialCategory, initialQuery, initialSort }: ShopClientProps) {
  const [category, setCategory] = useState<'all' | Category>(safeCategory(initialCategory));
  const [query, setQuery] = useState(initialQuery || '');
  const [sortBy, setSortBy] = useState<SortValue>(safeSort(initialSort));
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceCap, setPriceCap] = useState(7000);
  const { recentlyViewed } = useStore();

  const filtered = useMemo(() => {
    let list = allProducts.filter((product) => (category === 'all' ? true : product.category === category));

    if (query.trim()) {
      const term = query.trim().toLowerCase();
      list = list.filter((product) => `${product.name} ${product.shortDescription} ${product.category}`.toLowerCase().includes(term));
    }

    list = list.filter((product) => product.price <= priceCap);

    if (inStockOnly) {
      list = list.filter((product) => product.variants.some((variant) => variant.stock > 0));
    }

    if (sortBy === 'price-low') list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'newest') list = [...list].sort((a, b) => b.id.localeCompare(a.id));

    return list;
  }, [allProducts, category, query, sortBy, inStockOnly, priceCap]);

  const recentlyViewedItems = useMemo(
    () => recentlyViewed.map((id) => allProducts.find((product) => product.id === id)).filter(Boolean) as Product[],
    [allProducts, recentlyViewed]
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-[#1bb8a0]">Browse</p>
        <h1 className="mt-2 text-3xl text-white sm:text-4xl">Premium Collection</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/65">
          Mobile-first discovery with smart filtering, predictive search, and high-converting cards.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, flavor profile, category"
            className="h-11 rounded-full border border-white/15 bg-black/20 px-4 text-sm text-white outline-none"
            aria-label="Advanced product search"
          />
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortValue)}
            className="h-11 rounded-full border border-white/15 bg-black/20 px-4 text-sm text-white"
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setCategory(item.value)}
              className={`rounded-full border px-4 py-2 text-sm ${
                category === item.value ? 'border-[#c9a24f] bg-[#c9a24f]/15 text-[#f5d895]' : 'border-white/15 bg-white/5 text-white/75'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(event) => setInStockOnly(event.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-black/20"
            />
            In-stock only
          </label>
          <label className="text-sm text-white/80">
            Max price: <span className="text-[#f5d895]">Rs {priceCap}</span>
            <input
              type="range"
              min={299}
              max={7000}
              step={100}
              value={priceCap}
              onChange={(event) => setPriceCap(Number(event.target.value))}
              className="mt-1 w-full"
              aria-label="Set maximum price"
            />
          </label>
        </div>

        {category !== 'all' && <p className="mt-3 text-xs text-white/55">{categoryMeta[category].blurb}</p>}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>

      {filtered.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/70">No products match your search or filters.</div>
      )}

      {recentlyViewedItems.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl text-white">Recently Viewed</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentlyViewedItems.map((item) => (
              <ProductCard key={`recent-${item.id}`} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
