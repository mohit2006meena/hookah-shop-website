/* Global motion + UI */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Nav toggle */
const nav = document.getElementById('navLinks');
const navToggle = document.getElementById('navToggle');
const navOverlay = document.getElementById('navOverlay');

function closeNav() {
  if (!nav) return;
  nav.classList.remove('open');
  document.body.classList.remove('nav-open');
  if (navOverlay) navOverlay.classList.remove('open');
}

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const isOpen = nav.classList.contains('open');
    document.body.classList.toggle('nav-open', isOpen);
    if (navOverlay) navOverlay.classList.toggle('open', isOpen);
  });
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 860) closeNav();
});

/* Navbar shrink + progress + back to top */
const navbar = document.getElementById('navbar');
const progressBar = document.getElementById('progressBar');
const backToTop = document.getElementById('backToTop');

function handleScroll() {
  const y = window.scrollY;
  if (navbar) navbar.classList.toggle('shrink', y > 30);
  if (backToTop) backToTop.classList.toggle('show', y > 400);
  if (progressBar) {
    const docH = document.body.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (y / docH) * 100 : 0;
    progressBar.style.width = `${pct}%`;
  }
}
window.addEventListener('scroll', handleScroll);
if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* Smooth scroll (Lenis) */
let lenis;
if (!prefersReduced && window.Lenis) {
  lenis = new Lenis({
    smooth: true,
    direction: 'vertical',
    gestureDirection: 'vertical',
    normalizeWheel: true,
    smoothTouch: false
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

/* GSAP scenes */
function initGSAP() {
  if (prefersReduced || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  if (document.querySelector('.hero-overlay')) {
    gsap.to('.hero-overlay', {
      opacity: 0.9,
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  if (document.querySelector('#timeline')) {
    ScrollTrigger.create({
      trigger: '#timeline',
      start: 'top center',
      end: '+=600',
      pin: '#timeline',
      pinSpacing: true
    });
  }

  document.querySelectorAll('.glass-panel, .section-heading, .product-card, .gallery-item, .flavor-card').forEach((el, i) => {
    gsap.fromTo(
      el,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: (i % 6) * 0.05,
        scrollTrigger: { trigger: el, start: 'top 90%' }
      }
    );
  });
}
document.addEventListener('DOMContentLoaded', initGSAP);

/* Shared 3D tilt for premium card feel */
function initCardTilt() {
  const allowTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!allowTilt || prefersReduced) return;

  const cards = document.querySelectorAll('.glass-panel, .product-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
document.addEventListener('DOMContentLoaded', initCardTilt);

/* Featured carousel (home) */
const featuredData = [
  {
    title: 'Cyber Glass',
    badge: 'New',
    price: 'Rs 4,999',
    note: 'Diffused stem, Magnetic purge',
    img: 'assets/gallery/premium-glass-hookah.jpg'
  },
  {
    title: 'Royal Brass',
    badge: 'Limited',
    price: 'Rs 3,499',
    note: 'Hand-etched, Heritage series',
    img: 'assets/gallery/Traditional-Brass-Hookah.jpg'
  },
  {
    title: 'Mini Traveler',
    badge: 'Staff Pick',
    price: 'Rs 1,999',
    note: 'Compact, Hard case included',
    img: 'assets/gallery/Classic-Brass-Hookah.jpg'
  },
  {
    title: 'Exotic Flavors Set',
    badge: 'New',
    price: 'Rs 999',
    note: 'Curated premium set',
    img: 'assets/gallery/owner.jpg'
  }
];

const featuredTrack = document.getElementById('featuredTrack');
if (featuredTrack) {
  featuredData.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'glass-panel carousel-card';
    card.innerHTML = `
      <img src="${item.img}" alt="${item.title}" loading="lazy" decoding="async">
      <div class="card-overlay">
        <div class="badge ${item.badge === 'New' ? 'badge-new' : ''}">${item.badge}</div>
        <div>
          <h4>${item.title}</h4>
          <p class="subtle">${item.note}</p>
          <p class="price">${item.price}</p>
        </div>
      </div>`;
    featuredTrack.appendChild(card);
  });

  const prev = document.getElementById('prevFeatured');
  const next = document.getElementById('nextFeatured');
  const getStep = () => {
    const firstCard = featuredTrack.querySelector('.carousel-card');
    if (!(firstCard instanceof HTMLElement)) return 280;
    const style = window.getComputedStyle(featuredTrack);
    const gap = Number.parseFloat(style.columnGap || style.gap || '16') || 16;
    return firstCard.offsetWidth + gap;
  };

  if (prev && next) {
    prev.onclick = () => {
      featuredTrack.scrollBy({ left: -getStep(), behavior: 'smooth' });
    };
    next.onclick = () => {
      featuredTrack.scrollBy({ left: getStep(), behavior: 'smooth' });
    };
  }
}

/* Products + ecommerce catalog */
const productGrid = document.getElementById('productGrid');
const products = [
  {
    id: 'classic-brass-hookah',
    name: 'Classic Brass Hookah',
    type: 'traditional',
    price: 3499,
    badge: 'Limited',
    note: 'Hand-etched stem, velvet hose',
    image: 'assets/gallery/Classic-Brass-Hookah.jpg',
    rating: 4.8
  },
  {
    id: 'modern-glass-tower',
    name: 'Modern Glass Tower',
    type: 'glass',
    price: 5999,
    badge: 'New',
    note: 'Borosilicate, diffused downstem',
    image: 'assets/gallery/premium-glass-hookah.jpg',
    rating: 4.9
  },
  {
    id: 'mini-portable-hookah',
    name: 'Mini Portable Hookah',
    type: 'glass',
    price: 1999,
    badge: 'Staff Pick',
    note: 'Travel case, silicone hose',
    image: 'assets/gallery/shop-front.jpg',
    rating: 4.6
  },
  {
    id: 'premium-clay-chillum',
    name: 'Premium Clay Chillum',
    type: 'accessories',
    price: 499,
    badge: 'New',
    note: 'Heat retaining bowl',
    image: 'assets/gallery/owner.jpg',
    rating: 4.5
  },
  {
    id: 'coconut-charcoal-1kg',
    name: 'Coconut Charcoal (1kg)',
    type: 'accessories',
    price: 299,
    badge: 'Fast Moving',
    note: 'Low ash, long burn',
    image: 'assets/gallery/shop-front.jpg',
    rating: 4.7
  },
  {
    id: 'double-apple-flavor',
    name: 'Double Apple Flavor',
    type: 'flavors',
    price: 149,
    badge: 'Classic',
    note: 'Rich anise finish',
    image: 'assets/gallery/Traditional-Brass-Hookah.jpg',
    rating: 4.7
  },
  {
    id: 'mint-frost-flavor',
    name: 'Mint Frost Flavor',
    type: 'flavors',
    price: 149,
    badge: 'Fresh',
    note: 'Cooling mint cloud',
    image: 'assets/gallery/premium-glass-hookah.jpg',
    rating: 4.8
  },
  {
    id: 'antique-brass-design',
    name: 'Antique Brass Design',
    type: 'traditional',
    price: 4499,
    badge: 'Limited',
    note: 'Collector edition',
    image: 'assets/gallery/Traditional-Brass-Hookah.jpg',
    rating: 4.8
  }
];

const flavorCatalog = [
  {
    id: 'flavor-double-apple-premium',
    name: 'Double Apple',
    type: 'flavors',
    price: 499,
    badge: 'Premium Blend',
    note: 'Sweet anise and red apple profile',
    image: 'assets/gallery/Traditional-Brass-Hookah.jpg',
    rating: 4.8
  },
  {
    id: 'flavor-fresh-mint-premium',
    name: 'Fresh Mint',
    type: 'flavors',
    price: 499,
    badge: 'Premium Blend',
    note: 'Chilled mint for smooth lounge pulls',
    image: 'assets/gallery/premium-glass-hookah.jpg',
    rating: 4.8
  },
  {
    id: 'flavor-wild-berry-premium',
    name: 'Wild Berry',
    type: 'flavors',
    price: 499,
    badge: 'Premium Blend',
    note: 'Bold berry aroma with long finish',
    image: 'assets/gallery/Classic-Brass-Hookah.jpg',
    rating: 4.7
  },
  {
    id: 'flavor-grape-fusion-premium',
    name: 'Grape Fusion',
    type: 'flavors',
    price: 499,
    badge: 'Premium Blend',
    note: 'Deep grape notes and smooth clouds',
    image: 'assets/gallery/Classic-Brass-Hookah.jpg',
    rating: 4.7
  },
  {
    id: 'flavor-citrus-burst-premium',
    name: 'Citrus Burst',
    type: 'flavors',
    price: 499,
    badge: 'Premium Blend',
    note: 'Zesty citrus finish with light sweetness',
    image: 'assets/gallery/shop-front.jpg',
    rating: 4.6
  },
  {
    id: 'flavor-spiced-mix-premium',
    name: 'Spiced Mix',
    type: 'flavors',
    price: 499,
    badge: 'Premium Blend',
    note: 'Warm aromatic spices for rich sessions',
    image: 'assets/gallery/owner.jpg',
    rating: 4.6
  }
];

const catalogById = new Map();
const catalogByName = new Map();
const cartStorageKey = 'sheesha_cart_v3';
const couponRates = { LUXE10: 0.1, NIGHT15: 0.15 };
const shippingRates = { standard: 79, express: 199, pickup: 0 };
let cartState = loadCartState();

[...products, ...flavorCatalog].forEach((item) => {
  catalogById.set(item.id, item);
  catalogByName.set(item.name.toLowerCase(), item);
  if (item.name.toLowerCase().endsWith(' flavor')) {
    catalogByName.set(item.name.toLowerCase().replace(/ flavor$/i, ''), item);
  }
});

function formatCurrency(value) {
  return `Rs ${Math.max(0, Math.round(Number(value) || 0)).toLocaleString('en-IN')}`;
}

function renderStars(rating) {
  const rounded = Math.max(1, Math.min(5, Math.round(rating)));
  return `${'★'.repeat(rounded)}${'☆'.repeat(5 - rounded)}`;
}

function getCatalogItemByName(name) {
  if (!name) return null;
  const key = String(name).trim().toLowerCase();
  if (catalogByName.has(key)) return catalogByName.get(key);
  if (key.endsWith(' flavor')) {
    const shorter = key.replace(/ flavor$/i, '');
    if (catalogByName.has(shorter)) return catalogByName.get(shorter);
  }
  return null;
}

function renderProducts(filter = 'all', sort = 'featured', query = '') {
  if (!productGrid) return;

  const resultCount = document.getElementById('resultCount');
  productGrid.innerHTML = '';

  let list = products.filter((item) => filter === 'all' || item.type === filter);

  if (query.trim()) {
    const searchTerm = query.trim().toLowerCase();
    list = list.filter((item) => `${item.name} ${item.type} ${item.note}`.toLowerCase().includes(searchTerm));
  }

  if (sort === 'price-asc') list = list.slice().sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') list = list.slice().sort((a, b) => b.price - a.price);
  if (sort === 'new') list = list.slice().reverse();

  if (resultCount) {
    resultCount.textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;
  }

  if (!list.length) {
    productGrid.innerHTML = `
      <article class="glass-panel product-empty">
        <h3>No products found</h3>
        <p class="subtle">Try another filter, search keyword, or sort option.</p>
      </article>`;
    return;
  }

  list.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'glass-panel product-card';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async">
      <div class="product-info">
        <div class="product-top">
          <div>
            <p class="eyebrow">${item.type}</p>
            <h4>${item.name}</h4>
          </div>
          <span class="price">${formatCurrency(item.price)}</span>
        </div>
        <p class="note">${item.note}</p>
        <div class="product-meta-row">
          <span class="badge">${item.badge}</span>
          <span class="product-rating" aria-label="${item.rating} star rating">${renderStars(item.rating)}</span>
        </div>
        <div class="product-actions">
          <button class="btn-mini" type="button" data-add-cart="${item.id}">Add to cart</button>
          <button class="chip" type="button" data-quick="${item.id}">View details</button>
        </div>
      </div>`;
    productGrid.appendChild(card);
  });
}

if (productGrid) {
  const chips = document.querySelectorAll('#filterChips .chip');
  const sortSelect = document.getElementById('sortSelect');
  const productSearch = document.getElementById('productSearch');
  let currentFilter = 'all';
  let currentSort = 'featured';
  let currentQuery = '';

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((item) => item.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter || 'all';
      renderProducts(currentFilter, currentSort, currentQuery);
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', (event) => {
      currentSort = event.target.value || 'featured';
      renderProducts(currentFilter, currentSort, currentQuery);
    });
  }

  if (productSearch) {
    productSearch.addEventListener('input', (event) => {
      currentQuery = String(event.target.value || '');
      renderProducts(currentFilter, currentSort, currentQuery);
    });
  }

  renderProducts(currentFilter, currentSort, currentQuery);
}

/* Quick view modal */
const modal = document.getElementById('productModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalBadge = document.getElementById('modalBadge');
const modalNote = document.getElementById('modalNote');
const modalType = document.getElementById('modalType');
const modalPrice = document.getElementById('modalPrice');
const modalCTA = document.getElementById('modalCTA');
const modalAddToCart = document.getElementById('modalAddToCart');

function openModal(id) {
  const item = catalogById.get(id);
  if (!item || !modal) return;
  if (modalImg) modalImg.src = item.image;
  if (modalTitle) modalTitle.textContent = item.name;
  if (modalBadge) modalBadge.textContent = item.badge;
  if (modalNote) modalNote.textContent = item.note;
  if (modalType) modalType.textContent = item.type;
  if (modalPrice) modalPrice.textContent = formatCurrency(item.price);
  if (modalCTA) {
    modalCTA.href = `https://wa.me/917790813469?text=${encodeURIComponent(`I want to buy ${item.name}`)}`;
  }
  if (modalAddToCart) {
    modalAddToCart.dataset.addCart = item.id;
  }
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof Element)) return;

  if (navOverlay && target === navOverlay) {
    closeNav();
    return;
  }

  const quickTrigger = target.closest('[data-quick]');
  if (quickTrigger && quickTrigger.dataset.quick) {
    openModal(quickTrigger.dataset.quick);
    return;
  }

  if (target.closest('[data-close]')) {
    closeModal();
    return;
  }

  if (target.closest('[data-open-cart]')) {
    openCart();
    return;
  }

  if (target.closest('[data-close-cart]')) {
    closeCart();
    return;
  }

  const addCartTrigger = target.closest('[data-add-cart]');
  if (addCartTrigger && addCartTrigger.dataset.addCart) {
    addToCartById(addCartTrigger.dataset.addCart);
    return;
  }

  const flavorTrigger = target.closest('[data-flavor-add]');
  if (flavorTrigger && flavorTrigger.dataset.flavorAdd) {
    addToCartByName(flavorTrigger.dataset.flavorAdd);
    return;
  }

  const incTrigger = target.closest('[data-cart-inc]');
  if (incTrigger && incTrigger.dataset.cartInc) {
    updateCartQuantity(incTrigger.dataset.cartInc, 1);
    return;
  }

  const decTrigger = target.closest('[data-cart-dec]');
  if (decTrigger && decTrigger.dataset.cartDec) {
    updateCartQuantity(decTrigger.dataset.cartDec, -1);
    return;
  }

  const removeTrigger = target.closest('[data-cart-remove]');
  if (removeTrigger && removeTrigger.dataset.cartRemove) {
    removeCartItem(removeTrigger.dataset.cartRemove);
    return;
  }

  if (target.id === 'applyCouponBtn') {
    applyCoupon();
    return;
  }

  if (target.id === 'clearCartBtn') {
    clearCart();
  }
});

document.addEventListener('change', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement)) return;

  if (target.id === 'shippingSelect') {
    cartState.shipping = Object.prototype.hasOwnProperty.call(shippingRates, target.value) ? target.value : 'standard';
    saveCartState();
    renderCart();
  }
});

document.addEventListener('submit', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLFormElement)) return;

  if (target.id === 'checkoutForm') {
    event.preventDefault();
    checkoutOrder(target);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  closeNav();
  closeModal();
  closeLightbox();
  closeCart();
});

/* Lightbox */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCap = document.getElementById('lightboxCap');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
let galleryItems = [];
let currentIdx = 0;

function openLightbox(src, cap) {
  if (!lightbox || !lightboxImg) return;
  currentIdx = galleryItems.findIndex((item) => item.src === src);
  lightboxImg.src = src;
  lightboxImg.alt = cap || 'Gallery image';
  if (lightboxCap) lightboxCap.textContent = cap || '';
  lightbox.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.add('hidden');
  document.body.style.overflow = '';
}

function stepLightbox(dir) {
  if (!galleryItems.length || !lightboxImg) return;
  currentIdx = (currentIdx + dir + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentIdx];
  lightboxImg.src = item.src;
  lightboxImg.alt = item.cap || 'Gallery image';
  if (lightboxCap) lightboxCap.textContent = item.cap || '';
}

if (lightbox) {
  galleryItems = Array.from(document.querySelectorAll('.gallery-item')).map((el) => ({
    src: el.dataset.src,
    cap: el.querySelector('.caption') ? el.querySelector('.caption').textContent : ''
  }));

  document.querySelectorAll('.gallery-item').forEach((el) => {
    el.addEventListener('click', () => {
      const caption = el.querySelector('.caption');
      openLightbox(el.dataset.src, caption ? caption.textContent : '');
    });
  });

  lightbox.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest('[data-close]')) {
      closeLightbox();
    }
  });

  if (lbPrev) lbPrev.addEventListener('click', () => stepLightbox(-1));
  if (lbNext) lbNext.addEventListener('click', () => stepLightbox(1));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') stepLightbox(1);
    if (event.key === 'ArrowLeft') stepLightbox(-1);
  });
}

/* Ecommerce cart */
function loadCartState() {
  const fallback = { items: [], coupon: '', shipping: 'standard' };

  try {
    const raw = localStorage.getItem(cartStorageKey);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed.items) ? parsed.items.filter(Boolean) : [];
    const shipping = Object.prototype.hasOwnProperty.call(shippingRates, parsed.shipping) ? parsed.shipping : 'standard';
    const coupon = typeof parsed.coupon === 'string' ? parsed.coupon.toUpperCase().trim() : '';

    return { items, coupon, shipping };
  } catch (_error) {
    return fallback;
  }
}

function saveCartState() {
  try {
    localStorage.setItem(cartStorageKey, JSON.stringify(cartState));
  } catch (_error) {
    // localStorage may be unavailable in private mode; fail silently.
  }
}

function sanitizeCartItem(item) {
  const id = item && item.id ? String(item.id) : '';
  const source = catalogById.get(id) || getCatalogItemByName(item && item.name);
  if (!source) return null;

  const qty = Math.max(1, Math.min(99, Number(item.qty) || 1));
  return {
    id: source.id,
    name: source.name,
    type: source.type,
    price: source.price,
    badge: source.badge,
    note: source.note,
    image: source.image,
    qty
  };
}

function normalizeCartState() {
  cartState.items = cartState.items.map(sanitizeCartItem).filter(Boolean);
  if (!Object.prototype.hasOwnProperty.call(shippingRates, cartState.shipping)) cartState.shipping = 'standard';
  if (!Object.prototype.hasOwnProperty.call(couponRates, cartState.coupon)) cartState.coupon = '';
}

function computeTotals() {
  const subtotal = cartState.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountRate = couponRates[cartState.coupon] || 0;
  const discount = Math.round(subtotal * discountRate);
  const shippingBase = shippingRates[cartState.shipping] || shippingRates.standard;
  const shipping = cartState.shipping === 'standard' && subtotal >= 3000 ? 0 : shippingBase;
  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round(taxable * 0.05);
  const total = taxable + shipping + tax;

  return { subtotal, discount, shipping, tax, total };
}

let cartToastTimer = 0;
function showCartToast(message) {
  const toast = document.getElementById('cartToast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  if (cartToastTimer) clearTimeout(cartToastTimer);
  cartToastTimer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

function mountNavCartButton() {
  if (!navbar || document.getElementById('cartToggle')) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.id = 'cartToggle';
  button.className = 'cart-toggle';
  button.setAttribute('data-open-cart', '');
  button.setAttribute('aria-label', 'Open cart');
  button.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="20" r="1.5"></circle>
      <circle cx="18" cy="20" r="1.5"></circle>
      <path d="M3 4h2l2.3 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.5L21 7H7"></path>
    </svg>
    <span class="cart-toggle-label">Cart</span>
    <span class="cart-count">0</span>
  `;

  if (navToggle && navToggle.parentElement === navbar) {
    navbar.insertBefore(button, navToggle);
  } else {
    navbar.appendChild(button);
  }
}

function mountCartShell() {
  if (document.getElementById('cartDrawer')) return;

  document.body.insertAdjacentHTML(
    'beforeend',
    `
      <div class="cart-overlay" id="cartOverlay" data-close-cart></div>
      <aside class="cart-drawer" id="cartDrawer" aria-hidden="true">
        <div class="cart-head">
          <div>
            <p class="eyebrow">Shop</p>
            <h3>Your cart</h3>
          </div>
          <button class="chip" type="button" data-close-cart aria-label="Close cart">x</button>
        </div>
        <div class="cart-body">
          <p class="cart-empty subtle show" id="cartEmpty">Your cart is empty. Add products to continue.</p>
          <div class="cart-items" id="cartItems"></div>
        </div>
        <div class="cart-footer">
          <div class="coupon-row">
            <input class="form-input cart-input" id="couponInput" type="text" placeholder="Coupon code (LUXE10)" />
            <button class="chip" type="button" id="applyCouponBtn">Apply</button>
          </div>
          <p class="coupon-status subtle" id="couponStatus">Use code LUXE10 for 10% off.</p>
          <div class="shipping-row">
            <label for="shippingSelect" class="subtle">Shipping</label>
            <select class="chip select shipping-select" id="shippingSelect" aria-label="Select shipping">
              <option value="standard">Standard (Rs 79)</option>
              <option value="express">Express (Rs 199)</option>
              <option value="pickup">Store Pickup (Free)</option>
            </select>
          </div>
          <div class="summary-grid">
            <div class="summary-row"><span>Subtotal</span><strong id="sumSubtotal">Rs 0</strong></div>
            <div class="summary-row"><span>Discount</span><strong id="sumDiscount">- Rs 0</strong></div>
            <div class="summary-row"><span>Shipping</span><strong id="sumShipping">Rs 0</strong></div>
            <div class="summary-row"><span>Tax (5%)</span><strong id="sumTax">Rs 0</strong></div>
            <div class="summary-row total"><span>Total</span><strong id="sumTotal">Rs 0</strong></div>
          </div>
          <form class="checkout-form" id="checkoutForm">
            <input class="form-input cart-input" name="fullName" type="text" placeholder="Full name" required />
            <input class="form-input cart-input" name="phone" type="tel" placeholder="Phone" required />
            <input class="form-input cart-input" name="email" type="email" placeholder="Email (optional)" />
            <textarea class="form-input cart-input" name="address" placeholder="Delivery address" rows="2" required></textarea>
            <div class="checkout-grid">
              <input class="form-input cart-input" name="city" type="text" placeholder="City" value="Jaipur" required />
              <input class="form-input cart-input" name="pincode" type="text" placeholder="Pincode" required />
            </div>
            <select class="form-input cart-input" name="payment" aria-label="Payment method" required>
              <option value="UPI">UPI</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Card on Delivery">Card on Delivery</option>
            </select>
            <button class="btn btn-primary checkout-btn" type="submit">Place order on WhatsApp</button>
          </form>
          <button class="btn btn-ghost clear-cart-btn" id="clearCartBtn" type="button">Clear cart</button>
        </div>
      </aside>
      <div class="cart-toast" id="cartToast" role="status" aria-live="polite"></div>
    `
  );
}

function renderCart() {
  normalizeCartState();
  saveCartState();

  const cartItemsEl = document.getElementById('cartItems');
  const cartEmptyEl = document.getElementById('cartEmpty');
  const couponInput = document.getElementById('couponInput');
  const couponStatus = document.getElementById('couponStatus');
  const shippingSelect = document.getElementById('shippingSelect');
  if (!cartItemsEl || !cartEmptyEl) return;

  if (shippingSelect) shippingSelect.value = cartState.shipping;
  if (couponInput && cartState.coupon) couponInput.value = cartState.coupon;
  if (couponStatus) {
    couponStatus.textContent = cartState.coupon ? `${cartState.coupon} applied.` : 'Use code LUXE10 for 10% off.';
  }

  const count = cartState.items.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.cart-count').forEach((node) => {
    node.textContent = String(count);
  });

  if (!cartState.items.length) {
    cartItemsEl.innerHTML = '';
    cartEmptyEl.classList.add('show');
  } else {
    cartEmptyEl.classList.remove('show');
    cartItemsEl.innerHTML = cartState.items
      .map((item) => `
        <article class="cart-line">
          <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async" />
          <div class="cart-line-meta">
            <h4>${item.name}</h4>
            <p class="subtle">${item.note}</p>
            <p class="price">${formatCurrency(item.price)}</p>
          </div>
          <div class="qty-controls">
            <button class="qty-btn" type="button" data-cart-dec="${item.id}" aria-label="Decrease quantity">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" type="button" data-cart-inc="${item.id}" aria-label="Increase quantity">+</button>
          </div>
          <button class="cart-remove" type="button" data-cart-remove="${item.id}">Remove</button>
        </article>
      `)
      .join('');
  }

  const totals = computeTotals();
  const sumSubtotal = document.getElementById('sumSubtotal');
  const sumDiscount = document.getElementById('sumDiscount');
  const sumShipping = document.getElementById('sumShipping');
  const sumTax = document.getElementById('sumTax');
  const sumTotal = document.getElementById('sumTotal');

  if (sumSubtotal) sumSubtotal.textContent = formatCurrency(totals.subtotal);
  if (sumDiscount) sumDiscount.textContent = `- ${formatCurrency(totals.discount)}`;
  if (sumShipping) sumShipping.textContent = formatCurrency(totals.shipping);
  if (sumTax) sumTax.textContent = formatCurrency(totals.tax);
  if (sumTotal) sumTotal.textContent = formatCurrency(totals.total);
}

function openCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (!drawer || !overlay) return;
  drawer.classList.add('open');
  overlay.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (!drawer || !overlay) return;
  drawer.classList.remove('open');
  overlay.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
}

function addToCartById(id) {
  const source = catalogById.get(id);
  if (!source) return;

  const existing = cartState.items.find((item) => item.id === source.id);
  if (existing) {
    existing.qty = Math.min(99, existing.qty + 1);
  } else {
    cartState.items.push({
      id: source.id,
      name: source.name,
      type: source.type,
      price: source.price,
      badge: source.badge,
      note: source.note,
      image: source.image,
      qty: 1
    });
  }

  saveCartState();
  renderCart();
  showCartToast(`${source.name} added to cart`);
}

function addToCartByName(name) {
  const source = getCatalogItemByName(name);
  if (!source) return;
  addToCartById(source.id);
}

function updateCartQuantity(id, delta) {
  const line = cartState.items.find((item) => item.id === id);
  if (!line) return;

  const next = line.qty + delta;
  if (next <= 0) {
    cartState.items = cartState.items.filter((item) => item.id !== id);
  } else {
    line.qty = Math.max(1, Math.min(99, next));
  }

  saveCartState();
  renderCart();
}

function removeCartItem(id) {
  cartState.items = cartState.items.filter((item) => item.id !== id);
  saveCartState();
  renderCart();
  showCartToast('Item removed from cart');
}

function clearCart() {
  cartState.items = [];
  saveCartState();
  renderCart();
  showCartToast('Cart cleared');
}

function applyCoupon() {
  const input = document.getElementById('couponInput');
  if (!input) return;

  const code = String(input.value || '').trim().toUpperCase();
  if (!code) {
    cartState.coupon = '';
    saveCartState();
    renderCart();
    showCartToast('Coupon removed');
    return;
  }

  if (!Object.prototype.hasOwnProperty.call(couponRates, code)) {
    showCartToast('Invalid coupon code');
    return;
  }

  cartState.coupon = code;
  saveCartState();
  renderCart();
  showCartToast(`Coupon ${code} applied`);
}

function checkoutOrder(form) {
  if (!cartState.items.length) {
    showCartToast('Your cart is empty');
    return;
  }

  const formData = new FormData(form);
  const fullName = String(formData.get('fullName') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const address = String(formData.get('address') || '').trim();
  const city = String(formData.get('city') || '').trim();
  const pincode = String(formData.get('pincode') || '').trim();
  const payment = String(formData.get('payment') || 'UPI').trim();

  if (!fullName || !phone || !address || !city || !pincode) {
    showCartToast('Fill all required checkout fields');
    return;
  }

  const totals = computeTotals();
  const itemsText = cartState.items
    .map((item, index) => `${index + 1}. ${item.name} x${item.qty} = ${formatCurrency(item.qty * item.price)}`)
    .join('\n');

  const message = [
    'New Order from SHEESHA HOOKAH Website',
    '',
    `Name: ${fullName}`,
    `Phone: ${phone}`,
    `Email: ${email || 'Not provided'}`,
    `Address: ${address}`,
    `City: ${city}`,
    `Pincode: ${pincode}`,
    `Payment: ${payment}`,
    `Shipping: ${cartState.shipping}`,
    '',
    'Items:',
    itemsText,
    '',
    `Subtotal: ${formatCurrency(totals.subtotal)}`,
    `Discount: -${formatCurrency(totals.discount)}`,
    `Shipping: ${formatCurrency(totals.shipping)}`,
    `Tax (5%): ${formatCurrency(totals.tax)}`,
    `Total: ${formatCurrency(totals.total)}`
  ].join('\n');

  window.open(`https://wa.me/917790813469?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  showCartToast('Checkout opened in WhatsApp');
}

mountNavCartButton();
mountCartShell();
renderCart();
