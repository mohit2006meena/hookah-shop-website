import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { FloatingActions } from '@/components/common/floating-actions';
import { MobileBottomBar } from '@/components/layout/mobile-bottom-bar';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { StoreProvider } from '@/components/providers/store-provider';
import './globals.css';

const bodyFont = Manrope({
  variable: '--font-body',
  subsets: ['latin']
});

const headingFont = Cormorant_Garamond({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['500', '600', '700']
});

export const metadata: Metadata = {
  title: {
    default: 'SHEESHA HOOKAH | Premium Hookah Store Jaipur',
    template: '%s | SHEESHA HOOKAH'
  },
  description:
    'Premium hookahs, flavors, and accessories with a mobile-first luxury ecommerce experience. Fast checkout and trusted delivery in Jaipur.',
  metadataBase: new URL('https://sheeshahookah.in'),
  openGraph: {
    title: 'SHEESHA HOOKAH',
    description: 'Premium modern hookah commerce with fast mobile checkout.',
    type: 'website'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${headingFont.variable} bg-[#07090c] text-white antialiased`}>
        <StoreProvider>
          <SiteHeader />
          <main className="min-h-[calc(100vh-11rem)] pb-24 md:pb-0">{children}</main>
          <SiteFooter />
          <CartDrawer />
          <FloatingActions />
          <MobileBottomBar />
        </StoreProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
