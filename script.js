/* Global motion + UI */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Nav toggle */
const nav = document.getElementById('navLinks');
const navToggle = document.getElementById('navToggle');
if (navToggle) {
  navToggle.addEventListener('click', () => nav.classList.toggle('open'));
}

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
  const cards = document.querySelectorAll('.glass-panel, .product-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      if (prefersReduced) return;
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
    img: 'assets/gallery/interior.png'
  },
  {
    title: 'Exotic Flavors Set',
    badge: 'New',
    price: 'Rs 999',
    note: '4 curated blends',
    img: 'assets/gallery/wall-display.png'
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

  let idx = 0;
  const prev = document.getElementById('prevFeatured');
  const next = document.getElementById('nextFeatured');
  const update = () => {
    featuredTrack.style.transform = `translateX(-${idx * 320}px)`;
  };

  if (prev && next) {
    prev.onclick = () => {
      idx = Math.max(0, idx - 1);
      update();
    };
    next.onclick = () => {
      idx = Math.min(featuredData.length - 1, idx + 1);
      update();
    };
  }
}

/* Products page rendering */
const productGrid = document.getElementById('productGrid');
const products = [
  {
    name: 'Classic Brass Hookah',
    type: 'traditional',
    price: 3499,
    badge: 'Limited',
    note: 'Hand-etched stem, velvet hose',
    image: 'assets/gallery/Classic-Brass-Hookah.jpg'
  },
  {
    name: 'Modern Glass Tower',
    type: 'glass',
    price: 5999,
    badge: 'New',
    note: 'Borosilicate, Diffused downstem',
    image: 'assets/gallery/shelves-close.png'
  },
  {
    name: 'Mini Portable Hookah',
    type: 'glass',
    price: 1999,
    badge: 'Staff Pick',
    note: 'Travel case, Silicone hose',
    image: 'assets/gallery/interior.png'
  },
  {
    name: 'Premium Clay Chillum',
    type: 'accessories',
    price: 499,
    badge: 'New',
    note: 'Heat retaining bowl',
    image: 'assets/gallery/owner.png'
  },
  {
    name: 'Coconut Charcoal (1kg)',
    type: 'accessories',
    price: 299,
    badge: 'New',
    note: 'Low ash, Long burn',
    image: 'assets/gallery/shop-front.jpg'
  },
  {
    name: 'Double Apple Flavor',
    type: 'flavors',
    price: 149,
    badge: 'Classic',
    note: 'Rich anise finish',
    image: 'assets/gallery/shelves.png'
  },
  {
    name: 'Mint Frost Flavor',
    type: 'flavors',
    price: 149,
    badge: 'Fresh',
    note: 'Cooling mint cloud',
    image: 'assets/gallery/wall-display.png'
  },
  {
    name: 'Antique Brass Design',
    type: 'traditional',
    price: 4499,
    badge: 'Limited',
    note: 'Collector edition',
    image: 'assets/gallery/owner.png'
  }
];

function renderProducts(filter = 'all', sort = 'featured') {
  if (!productGrid) return;
  productGrid.innerHTML = '';
  let list = products.filter((p) => filter === 'all' || p.type === filter);

  if (sort === 'price-asc') list = list.slice().sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') list = list.slice().sort((a, b) => b.price - a.price);
  if (sort === 'new') list = list.slice().reverse();

  list.forEach((p) => {
    const card = document.createElement('article');
    card.className = 'glass-panel product-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" loading="lazy" decoding="async">
      <div class="product-info">
        <div class="product-top">
          <div>
            <p class="eyebrow">${p.type}</p>
            <h4>${p.name}</h4>
          </div>
          <span class="price">Rs ${p.price}</span>
        </div>
        <p class="note">${p.note}</p>
        <div class="product-top">
          <span class="badge">${p.badge}</span>
          <button class="chip" data-quick="${p.name}">View details</button>
        </div>
      </div>`;
    productGrid.appendChild(card);
  });
}

if (productGrid) {
  const chips = document.querySelectorAll('#filterChips .chip');
  const sortSelect = document.getElementById('sortSelect');
  let currentFilter = 'all';
  let currentSort = 'featured';

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      renderProducts(currentFilter, currentSort);
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProducts(currentFilter, currentSort);
    });
  }

  renderProducts();
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

function openModal(name) {
  const item = products.find((p) => p.name === name);
  if (!item || !modal) return;
  if (modalImg) modalImg.src = item.image;
  if (modalTitle) modalTitle.textContent = item.name;
  if (modalBadge) modalBadge.textContent = item.badge;
  if (modalNote) modalNote.textContent = item.note;
  if (modalType) modalType.textContent = item.type;
  if (modalPrice) modalPrice.textContent = `Rs ${item.price}`;
  if (modalCTA) {
    modalCTA.href = `https://wa.me/917790813469?text=${encodeURIComponent(`I want to buy ${item.name}`)}`;
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
  if (e.target && e.target.dataset && e.target.dataset.quick) {
    openModal(e.target.dataset.quick);
  }
  if (e.target && e.target.dataset && Object.prototype.hasOwnProperty.call(e.target.dataset, 'close')) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
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
  currentIdx = galleryItems.findIndex((g) => g.src === src);
  lightboxImg.src = src;
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
  if (lightboxCap) lightboxCap.textContent = item.cap || '';
}

if (lightbox) {
  galleryItems = Array.from(document.querySelectorAll('.gallery-item')).map((el) => ({
    src: el.dataset.src,
    cap: el.querySelector('.caption') ? el.querySelector('.caption').textContent : ''
  }));

  document.querySelectorAll('.gallery-item').forEach((el) => {
    el.addEventListener('click', () => openLightbox(el.dataset.src, el.querySelector('.caption') ? el.querySelector('.caption').textContent : ''));
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target && e.target.dataset && Object.prototype.hasOwnProperty.call(e.target.dataset, 'close')) {
      closeLightbox();
    }
  });

  if (lbPrev) lbPrev.onclick = () => stepLightbox(-1);
  if (lbNext) lbNext.onclick = () => stepLightbox(1);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') stepLightbox(1);
    if (e.key === 'ArrowLeft') stepLightbox(-1);
  });
}

/* Active link highlighting by scroll */
const sections = document.querySelectorAll('section[id]');
function markActive() {
  const scrollPos = window.scrollY + 120;
  sections.forEach((sec) => {
    const selectorA = `.nav-link[href="#${sec.id}"]`;
    const selectorB = `.nav-link[href="${location.pathname}#${sec.id}"]`;
    const link = document.querySelector(selectorA) || document.querySelector(selectorB);
    if (!link) return;
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}
window.addEventListener('scroll', markActive);

/* Back to top visibility */
const css = document.createElement('style');
css.innerHTML = '.fab.to-top { opacity:0; pointer-events:none; transition:opacity 0.2s; } .fab.to-top.show { opacity:1; pointer-events:auto; }';
document.head.appendChild(css);
