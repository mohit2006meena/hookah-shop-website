import type { Metadata } from 'next';
import { CheckoutClient } from '@/components/checkout/checkout-client';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order with one-page mobile checkout.'
};

export default function CheckoutPage() {
  return (
    <div className="lux-shell pb-16 pt-6 sm:pt-10">
      <CheckoutClient />
    </div>
  );
}
