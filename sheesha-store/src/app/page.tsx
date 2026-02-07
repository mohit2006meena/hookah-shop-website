import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/product/product-card';
import { categoryMeta, getRecommendedProducts, products } from '@/lib/catalog';
import { formatINR } from '@/lib/utils';

const recommended = getRecommendedProducts(4);
const flavorPicks = products.filter((product) => product.category === 'flavors').slice(0, 6);

const testimonials = [
  {
    name: 'Aarav Singh',
    role: 'Lounge Owner',
    quote: 'Mobile checkout is incredibly smooth. We reorder weekly in under two minutes.'
  },
  {
    name: 'Sana Khan',
    role: 'Returning Customer',
    quote: 'Product quality is exactly as shown. Delivery updates and packaging are premium.'
  },
  {
    name: 'Rohan Mehta',
    role: 'Collector',
    quote: 'The variant options and detailed specs helped me choose the perfect setup quickly.'
  }
];

export default function HomePage() {
  return (
    <div className="lux-shell pb-16 pt-6 sm:pt-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0f14]">
        <div className="absolute inset-0">
          <Image src="/images/shop-front.jpg" alt="Sheesha Hookah lounge" fill priority className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/88 via-black/65 to-[#071e1a]/70" />
        </div>

        <div className="relative grid gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[#1bb8a0]">Jaipur | Since 2015</p>
            <h1 className="text-5xl leading-[0.92] text-white sm:text-6xl">
              Redefine Your
              <span className="block text-gradient">Hookah Ritual</span>
            </h1>
            <p className="max-w-xl text-sm text-white/75 sm:text-base">
              A mobile-first premium store experience with trusted products, fast checkout, and live WhatsApp support.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#c9a24f] to-[#1bb8a0] px-6 text-sm font-semibold text-black"
              >
                Explore Collection
              </Link>
              <a
                href="https://wa.me/917790813469"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 text-sm font-medium text-white"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="lux-card p-3">
                <p className="text-2xl font-semibold text-white">9+</p>
                <p className="text-xs uppercase tracking-[0.12em] text-white/55">Years Serving</p>
              </div>
              <div className="lux-card p-3">
                <p className="text-2xl font-semibold text-white">120+</p>
                <p className="text-xs uppercase tracking-[0.12em] text-white/55">Flavors Stocked</p>
              </div>
              <div className="lux-card p-3 sm:col-span-1 col-span-2">
                <p className="text-2xl font-semibold text-white">4.8/5</p>
                <p className="text-xs uppercase tracking-[0.12em] text-white/55">Customer Rating</p>
              </div>
            </div>
          </div>

          <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            <div className="relative aspect-[4/3]">
              <Image src="/images/premium-glass-hookah.jpg" alt="Featured hookah" fill className="object-cover" />
            </div>
            <div className="space-y-1 bg-[#0e3d3a]/50 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#1fd2b8]">Featured</p>
              <p className="text-3xl text-white">Cyber Glass</p>
              <p className="text-sm text-white/70">Borosilicate body with magnetic purge and cleaner flavor delivery.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="page-section space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#1bb8a0]">Categories</p>
            <h2 className="mt-1 text-3xl text-white">Shop by intent</h2>
          </div>
          <Link href="/shop" className="text-sm text-white/70 hover:text-white">
            View all
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {Object.entries(categoryMeta).map(([key, value]) => (
            <Link key={key} href={`/shop?category=${key}`} className="lux-card p-5 transition hover:border-[#c9a24f]/40">
              <p className="text-xl text-white">{value.label}</p>
              <p className="mt-2 text-sm text-white/65">{value.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section grid gap-6 rounded-[1.8rem] border border-white/10 bg-[#0b0f16]/90 p-4 sm:p-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative overflow-hidden rounded-3xl border border-white/10">
          <Image src="/images/Traditional-Brass-Hookah.jpg" alt="Flavor collection" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#c9a24f]">Flavors</p>
          <h2 className="mt-1 text-4xl leading-none text-white">
            Taste the
            <span className="block text-gradient">Extraordinary</span>
          </h2>
          <p className="mt-3 text-sm text-white/70 sm:text-base">
            Curated premium blends sourced for smooth burn and deep aroma. Built for fast mobile discovery and one-tap add to cart.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {flavorPicks.map((item) => (
              <article key={item.id} className="lux-card p-3">
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="text-sm text-[#c9a24f]">{formatINR(item.price)}</p>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/shop/${item.slug}`}
                    className="inline-flex h-8 flex-1 items-center justify-center rounded-full border border-white/20 text-xs text-white"
                  >
                    View
                  </Link>
                  <Link
                    href="/shop"
                    className="inline-flex h-8 flex-1 items-center justify-center rounded-full bg-white/10 text-xs text-white"
                  >
                    Add
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-4">
            <Link href="/shop?category=flavors" className="text-sm font-semibold tracking-[0.08em] text-[#f5d895]">
              Explore all flavors -&gt;
            </Link>
          </div>
        </div>
      </section>

      <section className="page-section space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#1bb8a0]">Recommended</p>
          <h2 className="mt-1 text-3xl text-white">Top picks for mobile shoppers</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="page-section space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#c9a24f]">Testimonials</p>
          <h2 className="mt-1 text-4xl leading-none text-white">
            What Our
            <span className="text-gradient"> Clients Say</span>
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="lux-card p-5">
              <p className="text-[#c9a24f]">★★★★★</p>
              <p className="mt-3 text-white/85">&ldquo;{item.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold text-white">{item.name}</p>
              <p className="text-xs text-white/55">{item.role}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
