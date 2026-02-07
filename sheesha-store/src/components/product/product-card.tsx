'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import { useStore } from '@/components/providers/store-provider';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlistIds } = useStore();
  const isWishlisted = wishlistIds.includes(product.id);

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.media[0]}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={`absolute right-3 top-3 rounded-full border px-2 py-1 text-xs ${
            isWishlisted ? 'border-[#c9a24f] bg-[#c9a24f]/20 text-[#f5d895]' : 'border-white/20 bg-black/30 text-white/70'
          }`}
          aria-label="Toggle wishlist"
        >
          {isWishlisted ? 'Saved' : 'Save'}
        </button>

        <div className="absolute left-3 top-3 rounded-full bg-black/45 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-white/80">
          {product.badges[0] || 'Featured'}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.12em] text-white/45">{product.category}</p>
          <Link href={`/shop/${product.slug}`} className="line-clamp-2 text-base font-semibold text-white">
            {product.name}
          </Link>
          <p className="line-clamp-2 text-sm text-white/60">{product.shortDescription}</p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-lg font-semibold text-[#c9a24f]">{formatINR(product.price)}</p>
            {product.compareAtPrice ? <p className="text-xs text-white/40 line-through">{formatINR(product.compareAtPrice)}</p> : null}
          </div>
          <p className="text-xs text-white/60">{product.rating.toFixed(1)} / 5</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => addToCart(product.id, product.variants[0].id, 1)}
            className="h-10 rounded-full border border-white/20 bg-white/10 text-sm font-medium text-white"
          >
            Add
          </button>
          <Link
            href={`/shop/${product.slug}`}
            className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-[#c9a24f] to-[#1bb8a0] text-sm font-semibold text-black"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
