import type { Metadata } from 'next';
import { TrackOrderClient } from '@/components/account/track-order-client';

export const metadata: Metadata = {
  title: 'Track Order',
  description: 'Track your SHEESHA HOOKAH order status in real time.'
};

export default async function TrackOrderPage({
  searchParams
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const params = await searchParams;

  return <TrackOrderClient initialOrderId={params.orderId} />;
}
