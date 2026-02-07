'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import { useStore } from '@/components/providers/store-provider';

export function ProductDetailClient({ product }: { product: Product }) {
  const [activeMedia, setActiveMedia] = useState(product.media[0]);
  const [activeVariantId, setActiveVariantId] = useState(product.variants[0].id);
  const [zip, setZip] = useState('');
  const [zoomOpen, setZoomOpen] = useState(false);
  const { addToCart, toggleWishlist, wishlistIds, addRecentlyViewed } = useStore();

  useEffect(() => {
    addRecentlyViewed(product.id);
  }, [addRecentlyViewed, product.id]);

  const activeVariant = useMemo(
    () => product.variants.find((variant) => variant.id === activeVariantId) || product.variants[0],
    [activeVariantId, product.variants]
  );

  const livePrice = product.price + activeVariant.priceDelta;
  const isWishlisted = wishlistIds.includes(product.id);

  const deliveryEstimate = useMemo(() => {
    if (!zip || zip.length < 6) return 'Enter pincode for delivery estimate';
    const isJaipur = zip.startsWith('302');
    if (isJaipur) return 'Delivery in 1-2 days';
    return 'Delivery in 3-5 days';
  }, [zip]);

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
          >
            <Image src={activeMedia} alt={product.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
            <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-white/80">
              Tap to zoom
            </span>
          </button>

          <div className="grid grid-cols-4 gap-2">
            {product.media.map((media) => (
              <button
                type="button"
                key={media}
                onClick={() => setActiveMedia(media)}
                className={`relative aspect-square overflow-hidden rounded-2xl border ${
                  activeMedia === media ? 'border-[#c9a24f]' : 'border-white/15'
                }`}
              >
                <Image src={media} alt={`${product.name} thumbnail`} fill className="object-cover" sizes="120px" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#1bb8a0]">{product.category}</p>
            <h1 className="mt-2 text-3xl text-white sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-sm text-white/65">{product.longDescription}</p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-2xl font-semibold text-[#c9a24f]">{formatINR(livePrice)}</p>
              {product.compareAtPrice ? <p className="text-sm text-white/40 line-through">{formatINR(product.compareAtPrice)}</p> : null}
            </div>
            <p className="text-sm text-white/70">{product.rating.toFixed(1)} / 5 ({product.reviewCount})</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.14em] text-white/50">Select Variant</p>
            <div className="grid gap-2">
              {product.variants.map((variant) => {
                const variantPrice = product.price + variant.priceDelta;
                const selected = variant.id === activeVariantId;

                return (
                  <button
                    type="button"
                    key={variant.id}
                    onClick={() => setActiveVariantId(variant.id)}
                    className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-left ${
                      selected ? 'border-[#c9a24f] bg-[#c9a24f]/10' : 'border-white/15 bg-black/20'
                    }`}
                  >
                    <span className="text-sm text-white">{variant.label}</span>
                    <span className="text-sm text-white/70">{formatINR(variantPrice)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-white/75">
            <p className="font-medium text-white">Stock status: {activeVariant.stock > 0 ? `In stock (${activeVariant.stock})` : 'Out of stock'}</p>
            <p className="mt-1">SKU: {product.sku} | Weight: {product.weightLabel}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.14em] text-white/50">Delivery Estimate</p>
            <div className="flex gap-2">
              <input
                value={zip}
                onChange={(event) => setZip(event.target.value)}
                maxLength={6}
                placeholder="Enter pincode"
                className="h-11 w-full rounded-full border border-white/15 bg-black/20 px-4 text-sm text-white outline-none"
              />
            </div>
            <p className="text-sm text-white/70">{deliveryEstimate}</p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              disabled={activeVariant.stock === 0}
              onClick={() => addToCart(product.id, activeVariant.id, 1)}
              className="h-11 rounded-full bg-gradient-to-r from-[#c9a24f] to-[#1bb8a0] text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-45"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className="h-11 rounded-full border border-white/20 bg-white/10 text-sm font-medium text-white"
            >
              {isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}
            </button>
          </div>

          <div className="grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-white/80">
            {product.trustBadges.map((badge) => (
              <p key={badge}>- {badge}</p>
            ))}
          </div>
        </div>
      </div>

      {zoomOpen ? (
        <div className="fixed inset-0 z-[60] bg-black/80 p-4" role="dialog" aria-modal="true" aria-label="Product image zoom">
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white"
            aria-label="Close zoom"
          >
            x
          </button>
          <div className="mx-auto flex h-full max-w-4xl items-center justify-center">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10">
              <Image src={activeMedia} alt={`${product.name} zoom`} fill className="object-contain bg-black" sizes="100vw" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
