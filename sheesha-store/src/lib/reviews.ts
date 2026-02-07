import type { ProductReview } from '@/lib/types';

export const reviewsByProduct: Record<string, ProductReview[]> = {
  'classic-brass-hookah': [
    {
      id: 'r1',
      author: 'Aman K.',
      title: 'Premium build and smooth draw',
      rating: 5,
      date: '2026-01-12',
      body: 'Looks luxurious in person and the pull is very smooth for long sessions.'
    },
    {
      id: 'r2',
      author: 'Ritika S.',
      title: 'Excellent gifting option',
      rating: 5,
      date: '2025-12-08',
      body: 'Packaging and finish felt high-end. Great purchase for gifting.'
    }
  ],
  'cyber-glass-hookah': [
    {
      id: 'r3',
      author: 'Yash P.',
      title: 'Clean flavor output',
      rating: 5,
      date: '2026-01-30',
      body: 'Flavor profile is very clean and modern. Easy maintenance too.'
    }
  ],
  'double-apple-flavor': [
    {
      id: 'r4',
      author: 'Faizan M.',
      title: 'Classic profile done right',
      rating: 4,
      date: '2025-11-18',
      body: 'Balanced sweetness and good session length. Reliable quality.'
    }
  ]
};

export function getReviews(productId: string) {
  return reviewsByProduct[productId] || [];
}
