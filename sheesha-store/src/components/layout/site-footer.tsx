import Link from 'next/link';

const socials = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/sheesha_hookah_shop/',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/sheeshahookahshop',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M13.5 8H16V5h-2.5C10.5 5 9 6.7 9 9.7V12H7v3h2v4h3v-4h2.4l.6-3H12V9.9c0-1.1.4-1.9 1.5-1.9Z" />
      </svg>
    )
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/917790813469',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M20.5 11.9A8.5 8.5 0 0 0 6.9 4.7a8.4 8.4 0 0 0-2.5 8.5L3 21l7.9-1.4A8.5 8.5 0 0 0 20.5 11.9Zm-8.4 6.8c-1.2 0-2.3-.3-3.4-.9l-.2-.1-3.2.6.6-3.1-.1-.2a6.8 6.8 0 1 1 6.3 3.7Zm3.7-5.1c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.4.1-.1.2-.5.7-.6.8-.1.1-.2.2-.5.1-.2-.1-.9-.3-1.6-1-.6-.5-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4l.3-.3c.1-.1.1-.2.2-.3.1-.1.1-.2.1-.3l-.6-1.5c-.1-.2-.3-.2-.4-.2h-.3c-.1 0-.3.1-.5.3-.2.2-.7.7-.7 1.7s.7 2 1 2.3c.1.1 1.4 2.2 3.4 3 .5.2.9.4 1.2.5.5.2 1 .2 1.4.1.4-.1 1.2-.5 1.4-1 .2-.5.2-.9.1-1-.1-.1-.2-.1-.4-.2Z" />
      </svg>
    )
  }
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#06080b]">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-white">SHEESHA HOOKAH</p>
          <p className="mt-3 text-sm text-white/60">Premium mobile-first hookah ecommerce for Jaipur and nearby regions.</p>
          <div className="mt-4 flex items-center gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:border-[#c9a24f] hover:text-white"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Shop</p>
          <div className="mt-3 grid gap-2 text-sm text-white/65">
            <Link href="/shop" className="hover:text-white">All Products</Link>
            <Link href="/shop?category=hookahs" className="hover:text-white">Hookahs</Link>
            <Link href="/shop?category=flavors" className="hover:text-white">Flavors</Link>
            <Link href="/shop?category=accessories" className="hover:text-white">Accessories</Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Customer</p>
          <div className="mt-3 grid gap-2 text-sm text-white/65">
            <Link href="/track-order" className="hover:text-white">Track Order</Link>
            <Link href="/account" className="hover:text-white">My Account</Link>
            <Link href="/wishlist" className="hover:text-white">Wishlist</Link>
            <a href="https://wa.me/917790813469" target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp Support</a>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Store</p>
          <div className="mt-3 grid gap-2 text-sm text-white/65">
            <Link href="/contact" className="hover:text-white">Contact & Visit</Link>
            <a href="https://share.google/YnWp1UfxyE2ImFTRb" target="_blank" rel="noopener noreferrer" className="hover:text-white">Google Maps</a>
            <Link href="/policies/shipping" className="hover:text-white">Shipping Policy</Link>
            <Link href="/policies/returns" className="hover:text-white">Returns Policy</Link>
            <Link href="/policies/privacy" className="hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/55">
        18+ only. Tobacco consumption is injurious to health. Copyright 2026 SHEESHA HOOKAH.
      </div>
    </footer>
  );
}
