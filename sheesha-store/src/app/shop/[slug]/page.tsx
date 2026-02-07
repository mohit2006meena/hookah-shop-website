import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product/product-card';
import { ProductDetailClient } from '@/components/product/product-detail-client';
import { getProductBySlug, getRelatedProducts } from '@/lib/catalog';
import { getReviews } from '@/lib/reviews';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product not found' };

  return {
    title: product.name,
    description: product.shortDescription
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product.id, 4);
  const reviews = getReviews(product.id);

  return (
    <div className="lux-shell pb-16 pt-6 sm:pt-10">
      <ProductDetailClient product={product} />

      <section className="page-section space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#1bb8a0]">Ratings</p>
            <h2 className="text-3xl text-white">Reviews</h2>
          </div>
          <p className="text-sm text-white/70">{product.reviewCount} verified reviews</p>
        </div>

        {reviews.length === 0 ? (
          <div className="lux-card p-4 text-sm text-white/70">New product. Reviews will appear after first orders.</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <article key={review.id} className="lux-card p-4">
                <p className="text-sm text-[#c9a24f]">{'*'.repeat(review.rating)}</p>
                <p className="mt-2 text-base font-semibold text-white">{review.title}</p>
                <p className="mt-2 text-sm text-white/75">{review.body}</p>
                <p className="mt-3 text-xs text-white/55">
                  {review.author} | {review.date}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="page-section space-y-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[#1bb8a0]">Recommendations</p>
          <h2 className="text-3xl text-white">Related products</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
