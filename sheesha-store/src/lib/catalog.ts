import type { Product } from '@/lib/types';

export const products: Product[] = [
  {
    id: 'classic-brass-hookah',
    slug: 'classic-brass-hookah',
    name: 'Classic Brass Hookah',
    category: 'hookahs',
    shortDescription: 'Heritage brass silhouette with smooth modern airflow.',
    longDescription:
      'A handcrafted brass piece tuned for long, smooth sessions. Built for lounge durability and elevated aesthetics with a stable base and balanced draw.',
    price: 3499,
    compareAtPrice: 4299,
    media: ['/images/Traditional-Brass-Hookah.jpg', '/images/Classic-Brass-Hookah.jpg', '/images/shop-front.jpg'],
    badges: ['Best Seller', 'Handcrafted'],
    rating: 4.8,
    reviewCount: 126,
    variants: [
      { id: 'brass-std', label: 'Standard Stem', priceDelta: 0, stock: 7 },
      { id: 'brass-xl', label: 'Extended Stem', priceDelta: 500, stock: 3 }
    ],
    trustBadges: ['Authentic Brass', '1-Year Support', 'Secure Checkout'],
    sku: 'SH-BR-101',
    weightLabel: '2.8 kg'
  },
  {
    id: 'cyber-glass-hookah',
    slug: 'cyber-glass-hookah',
    name: 'Cyber Glass Hookah',
    category: 'hookahs',
    shortDescription: 'Borosilicate body with diffused stem and magnetic purge.',
    longDescription:
      'Premium glass engineering with clean lines and cooler pulls. This model is tuned for flavor clarity and low harshness with multi-session reliability.',
    price: 5999,
    compareAtPrice: 6899,
    media: ['/images/premium-glass-hookah.jpg', '/images/shop-front.jpg', '/images/owner.jpg'],
    badges: ['New', 'Premium'],
    rating: 4.9,
    reviewCount: 94,
    variants: [
      { id: 'glass-clear', label: 'Clear', priceDelta: 0, stock: 5 },
      { id: 'glass-smoke', label: 'Smoke Tint', priceDelta: 350, stock: 4 }
    ],
    trustBadges: ['Heat-Resistant Glass', '1-Year Support', 'Free Delivery over Rs 3000'],
    sku: 'SH-GL-201',
    weightLabel: '2.1 kg'
  },
  {
    id: 'mini-travel-hookah',
    slug: 'mini-travel-hookah',
    name: 'Mini Travel Hookah',
    category: 'hookahs',
    shortDescription: 'Compact setup for effortless carry and quick sessions.',
    longDescription:
      'Portable build with silicone hose and compact base. Ideal for modern users who need premium performance in a smaller footprint.',
    price: 1999,
    compareAtPrice: 2599,
    media: ['/images/shop-front.jpg', '/images/Classic-Brass-Hookah.jpg'],
    badges: ['Travel', 'Staff Pick'],
    rating: 4.6,
    reviewCount: 81,
    variants: [
      { id: 'mini-black', label: 'Matte Black', priceDelta: 0, stock: 12 },
      { id: 'mini-sand', label: 'Sand Gold', priceDelta: 180, stock: 6 }
    ],
    trustBadges: ['Carry Case Included', 'Low Maintenance', '7-Day Easy Replacement'],
    sku: 'SH-MN-301',
    weightLabel: '1.1 kg'
  },
  {
    id: 'double-apple-flavor',
    slug: 'double-apple-flavor',
    name: 'Double Apple Flavor',
    category: 'flavors',
    shortDescription: 'Rich anise and apple blend for classic lounge aroma.',
    longDescription:
      'Traditional profile with balanced sweetness and long-lasting cloud output. Pairs exceptionally with brass and modern glass setups.',
    price: 499,
    compareAtPrice: 599,
    media: ['/images/Traditional-Brass-Hookah.jpg', '/images/premium-glass-hookah.jpg'],
    badges: ['Classic'],
    rating: 4.7,
    reviewCount: 204,
    variants: [
      { id: 'flavor-50g', label: '50g Pack', priceDelta: 0, stock: 30 },
      { id: 'flavor-100g', label: '100g Pack', priceDelta: 420, stock: 20 }
    ],
    trustBadges: ['Fresh Batch', 'Sealed Pack', 'Authentic Blend'],
    sku: 'SH-FL-401',
    weightLabel: '50 g'
  },
  {
    id: 'fresh-mint-flavor',
    slug: 'fresh-mint-flavor',
    name: 'Fresh Mint Flavor',
    category: 'flavors',
    shortDescription: 'Cooling mint profile with ultra-smooth finish.',
    longDescription:
      'Signature cooling blend designed for clean sessions and easy mixing. Great solo or layered with fruit-forward profiles.',
    price: 499,
    compareAtPrice: 599,
    media: ['/images/premium-glass-hookah.jpg', '/images/owner.jpg'],
    badges: ['Cooling'],
    rating: 4.8,
    reviewCount: 172,
    variants: [
      { id: 'mint-50g', label: '50g Pack', priceDelta: 0, stock: 24 },
      { id: 'mint-100g', label: '100g Pack', priceDelta: 420, stock: 16 }
    ],
    trustBadges: ['Fresh Batch', 'Sealed Pack', 'Authentic Blend'],
    sku: 'SH-FL-402',
    weightLabel: '50 g'
  },
  {
    id: 'grape-fusion-flavor',
    slug: 'grape-fusion-flavor',
    name: 'Grape Fusion Flavor',
    category: 'flavors',
    shortDescription: 'Deep grape notes with long aromatic tail.',
    longDescription:
      'Designed for premium session longevity. This grape-forward profile produces dense, flavorful clouds and a soft finish.',
    price: 499,
    media: ['/images/Classic-Brass-Hookah.jpg', '/images/Traditional-Brass-Hookah.jpg'],
    badges: ['Popular'],
    rating: 4.7,
    reviewCount: 133,
    variants: [
      { id: 'grape-50g', label: '50g Pack', priceDelta: 0, stock: 18 },
      { id: 'grape-100g', label: '100g Pack', priceDelta: 420, stock: 12 }
    ],
    trustBadges: ['Fresh Batch', 'Sealed Pack', 'Authentic Blend'],
    sku: 'SH-FL-403',
    weightLabel: '50 g'
  },
  {
    id: 'premium-clay-bowl',
    slug: 'premium-clay-bowl',
    name: 'Premium Clay Bowl',
    category: 'accessories',
    shortDescription: 'Heat-retaining bowl for consistent sessions.',
    longDescription:
      'Optimized airflow channels and thermal stability for long sessions. A reliable accessory upgrade for both beginners and enthusiasts.',
    price: 499,
    media: ['/images/owner.jpg', '/images/shop-front.jpg'],
    badges: ['Accessory'],
    rating: 4.5,
    reviewCount: 62,
    variants: [
      { id: 'bowl-red', label: 'Red Clay', priceDelta: 0, stock: 15 },
      { id: 'bowl-black', label: 'Black Clay', priceDelta: 70, stock: 10 }
    ],
    trustBadges: ['Durable Build', 'Heat Balanced', 'Quality Checked'],
    sku: 'SH-AC-501',
    weightLabel: '180 g'
  },
  {
    id: 'coconut-charcoal-1kg',
    slug: 'coconut-charcoal-1kg',
    name: 'Coconut Charcoal 1kg',
    category: 'accessories',
    shortDescription: 'Low ash premium charcoal with long burn time.',
    longDescription:
      'Consistent heat profile and reduced ash output for cleaner, longer sessions. Works well across classic and modern bowls.',
    price: 299,
    media: ['/images/shop-front.jpg', '/images/premium-glass-hookah.jpg'],
    badges: ['Fast Moving'],
    rating: 4.7,
    reviewCount: 211,
    variants: [
      { id: 'coal-cube', label: 'Cube Cut', priceDelta: 0, stock: 28 },
      { id: 'coal-flat', label: 'Flat Cut', priceDelta: 30, stock: 22 }
    ],
    trustBadges: ['Food Grade Coconut', 'Low Ash', 'Sealed Pack'],
    sku: 'SH-AC-502',
    weightLabel: '1 kg'
  }
];

export const categoryMeta = {
  hookahs: { label: 'Hookahs', blurb: 'Premium stems for modern lounge sessions.' },
  flavors: { label: 'Flavors', blurb: 'Curated blends for bold aroma and smooth pulls.' },
  accessories: { label: 'Accessories', blurb: 'Reliable upgrades for consistency and comfort.' }
} as const;

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(productId: string, limit = 4) {
  const base = products.find((item) => item.id === productId);
  if (!base) return products.slice(0, limit);

  return products
    .filter((item) => item.id !== productId)
    .sort((a, b) => {
      const aScore = Number(a.category === base.category);
      const bScore = Number(b.category === base.category);
      return bScore - aScore;
    })
    .slice(0, limit);
}

export function getRecommendedProducts(limit = 4) {
  return [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}
