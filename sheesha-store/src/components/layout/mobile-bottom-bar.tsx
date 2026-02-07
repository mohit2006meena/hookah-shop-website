'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/components/providers/store-provider';
import { cn } from '@/lib/utils';

const mobileLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/wishlist', label: 'Wishlist' },
  { href: '/account', label: 'Account' }
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export function MobileBottomBar() {
  const pathname = usePathname();
  const { itemCount, openDrawer } = useStore();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#090d12]/95 p-2 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-5 gap-2">
        {mobileLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'rounded-xl px-2 py-2 text-center text-[11px]',
              isActive(pathname, link.href) ? 'bg-white/10 text-white' : 'text-white/75'
            )}
          >
            {link.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={openDrawer}
          className="rounded-xl bg-gradient-to-r from-[#c9a24f] to-[#1bb8a0] px-2 py-2 text-center text-[11px] font-semibold text-black"
          aria-label="Open cart"
        >
          Cart {itemCount > 0 ? `(${itemCount})` : ''}
        </button>
      </div>
    </div>
  );
}
