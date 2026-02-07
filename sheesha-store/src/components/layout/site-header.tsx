'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { products } from '@/lib/catalog';
import { useStore } from '@/components/providers/store-provider';
import { cn, formatINR } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/shop?category=flavors', label: 'Flavors' },
  { href: '/contact', label: 'Contact' },
  { href: '/wishlist', label: 'Wishlist' },
  { href: '/track-order', label: 'Track' },
  { href: '/account', label: 'Account' }
];

function isActive(pathname: string, href: string) {
  const path = href.split('?')[0];
  if (href === '/') return pathname === '/';
  return pathname.startsWith(path);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { itemCount, openDrawer, abandonedCart } = useStore();

  const suggestions = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter((product) => `${product.name} ${product.shortDescription} ${product.category}`.toLowerCase().includes(term))
      .slice(0, 6);
  }, [query]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080a0d]/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-2 px-4 sm:px-6">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="text-xl leading-none">{menuOpen ? 'x' : '='}</span>
        </button>

        <Link href="/" className="shrink-0 text-xs font-semibold tracking-[0.2em] text-white sm:text-sm">
          SHEESHA HOOKAH
        </Link>

        <nav className="ml-5 hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-full px-3 py-2 text-sm transition',
                isActive(pathname, link.href)
                  ? 'bg-white/10 text-white ring-1 ring-white/20'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="relative ml-auto hidden w-full max-w-sm md:block">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            className="h-10 w-full rounded-full border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-[#c9a24f]"
            aria-label="Predictive search"
          />
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-12 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1116] p-2 shadow-2xl">
              {suggestions.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-white/85 transition hover:bg-white/10"
                  onClick={() => setQuery('')}
                >
                  <span className="truncate pr-3">{product.name}</span>
                  <span className="text-[#c9a24f]">{formatINR(product.price)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={openDrawer}
          className="relative inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-sm text-white transition hover:bg-white/10"
          aria-label="Open cart"
        >
          <span>Cart</span>
          <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#c9a24f] px-1 text-xs font-semibold text-black">
            {itemCount}
          </span>
        </button>
      </div>

      {abandonedCart && (
        <div className="border-t border-white/10 bg-[#1f1a0f] px-4 py-2 text-xs text-[#f4dfa8] sm:px-6">
          You have items waiting in your cart. Complete checkout in under 60 seconds.
        </div>
      )}

      <div className={cn('border-t border-white/10 bg-[#090d12] md:hidden', menuOpen ? 'block' : 'hidden')}>
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search hookahs, flavors, accessories"
            className="h-10 w-full rounded-full border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-white/45 outline-none"
            aria-label="Mobile search"
          />

          {suggestions.length > 0 && (
            <div className="grid gap-2 rounded-xl border border-white/10 bg-white/5 p-2">
              {suggestions.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="rounded-lg px-2 py-2 text-sm text-white/90"
                  onClick={() => {
                    setMenuOpen(false);
                    setQuery('');
                  }}
                >
                  {product.name}
                </Link>
              ))}
            </div>
          )}

          <nav className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-xl border px-3 py-2 text-sm',
                  isActive(pathname, link.href) ? 'border-[#c9a24f] bg-[#c9a24f]/10 text-white' : 'border-white/10 text-white/80'
                )}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/checkout"
            className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#c9a24f] to-[#1bb8a0] text-sm font-semibold text-black"
            onClick={() => setMenuOpen(false)}
          >
            Quick Checkout
          </Link>
        </div>
      </div>
    </header>
  );
}
