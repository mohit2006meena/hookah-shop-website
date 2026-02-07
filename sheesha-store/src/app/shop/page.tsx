import type { Metadata } from 'next';
import { ShopClient } from '@/components/shop/shop-client';
import { products } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Shop Collection',
  description: 'Browse premium hookahs, flavors, and accessories with smart filters and mobile-first discovery.'
};

export default async function ShopPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="lux-shell pb-16 pt-6 sm:pt-10">
      <ShopClient allProducts={products} initialCategory={params.category} initialQuery={params.q} initialSort={params.sort} />
    </div>
  );
}
