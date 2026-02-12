const ADMIN_ID = 'bhuvnesh2020';
const ADMIN_PASSWORD = 'Bhuvnesh@2020';
const ADMIN_AUTH_KEY = 'sheesha_admin_auth_v1';
const PRODUCTS_STORAGE_KEY = 'sheesha_products_v1';

const defaultProducts = [
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

const loginPanel = document.getElementById('adminLoginPanel');
const loginForm = document.getElementById('adminLoginForm');
const authMessage = document.getElementById('adminAuthMessage');
const dashboard = document.getElementById('adminDashboard');
const productForm = document.getElementById('adminProductForm');
const productList = document.getElementById('adminProductList');
const statusMessage = document.getElementById('adminStatusMessage');
const resetBtn = document.getElementById('adminResetBtn');
const logoutBtn = document.getElementById('adminLogoutBtn');

const editIdInput = document.getElementById('adminEditId');
const nameInput = document.getElementById('adminNameInput');
const typeInput = document.getElementById('adminTypeInput');
const priceInput = document.getElementById('adminPriceInput');
const badgeInput = document.getElementById('adminBadgeInput');
const noteInput = document.getElementById('adminNoteInput');
const imageInput = document.getElementById('adminImageInput');
const ratingInput = document.getElementById('adminRatingInput');
const saveBtn = document.getElementById('adminSaveBtn');

let products = [];

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function makeProductId(value, fallbackIndex = 0) {
  const token = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  if (token) return token;
  return `product-${fallbackIndex + 1}`;
}

function normalizeProduct(product, index = 0) {
  const allowedTypes = new Set(['traditional', 'glass', 'flavors', 'accessories']);
  const name = String(product && product.name ? product.name : '').trim() || `Product ${index + 1}`;
  const rawType = String(product && product.type ? product.type : '').trim().toLowerCase();
  const type = allowedTypes.has(rawType) ? rawType : 'traditional';
  const rawPrice = Number(product && product.price);
  const price = Number.isFinite(rawPrice) ? Math.max(0, Math.round(rawPrice)) : 0;
  const rawRating = Number(product && product.rating);
  const rating = Number.isFinite(rawRating) ? Math.max(1, Math.min(5, rawRating)) : 4.6;
  const id = makeProductId(product && product.id ? product.id : name, index);

  return {
    id,
    name,
    type,
    price,
    badge: String(product && product.badge ? product.badge : 'Featured').trim() || 'Featured',
    note: String(product && product.note ? product.note : 'Premium quality selection').trim() || 'Premium quality selection',
    image: String(product && product.image ? product.image : 'assets/gallery/premium-glass-hookah.jpg').trim() || 'assets/gallery/premium-glass-hookah.jpg',
    rating
  };
}

function loadProducts() {
  const fallback = defaultProducts.map((item, index) => normalizeProduct(item, index));
  try {
    const raw = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) return fallback;
    return parsed.map((item, index) => normalizeProduct(item, index));
  } catch (_error) {
    return fallback;
  }
}

function saveProducts() {
  window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

function setAuthMessage(text, type = '') {
  if (!authMessage) return;
  authMessage.textContent = text;
  authMessage.classList.remove('error', 'success');
  if (type) authMessage.classList.add(type);
}

function setStatusMessage(text, type = '') {
  if (!statusMessage) return;
  statusMessage.textContent = text;
  statusMessage.classList.remove('error', 'success');
  if (type) statusMessage.classList.add(type);
}

function formatCurrency(value) {
  return `Rs ${Math.max(0, Math.round(Number(value) || 0)).toLocaleString('en-IN')}`;
}

function renderProductsList() {
  if (!productList) return;
  if (!products.length) {
    productList.innerHTML = '<div class="admin-empty subtle">No products found. Add your first product.</div>';
    return;
  }

  productList.innerHTML = products
    .map((item) => {
      const safeId = escapeHtml(item.id);
      const safeName = escapeHtml(item.name);
      const safeType = escapeHtml(item.type);
      const safeBadge = escapeHtml(item.badge);
      const safeNote = escapeHtml(item.note);
      const safeImage = escapeHtml(item.image);
      const safeRating = escapeHtml(item.rating);

      return `
        <article class="admin-product-row">
          <div class="admin-product-main">
            <div>
              <strong>${safeName}</strong>
              <p class="subtle">${formatCurrency(item.price)} · ${safeType}</p>
            </div>
            <span class="badge">${safeBadge}</span>
          </div>
          <p class="subtle">${safeNote}</p>
          <div class="admin-product-meta">
            <span class="chip">Rating ${safeRating}</span>
            <span class="chip">${safeImage}</span>
            <span class="chip">ID ${safeId}</span>
          </div>
          <div class="admin-product-actions">
            <button class="btn-mini" type="button" data-admin-edit="${safeId}">Edit</button>
            <button class="chip" type="button" data-admin-delete="${safeId}">Delete</button>
          </div>
        </article>
      `;
    })
    .join('');
}

function resetProductForm() {
  if (productForm) productForm.reset();
  if (editIdInput) editIdInput.value = '';
  if (typeInput) typeInput.value = 'traditional';
  if (saveBtn) saveBtn.textContent = 'Save Product';
}

function fillFormForEdit(id) {
  const target = products.find((item) => item.id === id);
  if (!target) return;

  if (editIdInput) editIdInput.value = target.id;
  if (nameInput) nameInput.value = target.name;
  if (typeInput) typeInput.value = target.type;
  if (priceInput) priceInput.value = String(target.price);
  if (badgeInput) badgeInput.value = target.badge;
  if (noteInput) noteInput.value = target.note;
  if (imageInput) imageInput.value = target.image;
  if (ratingInput) ratingInput.value = String(target.rating);
  if (saveBtn) saveBtn.textContent = 'Update Product';
}

function ensureUniqueId(baseId, currentId = '') {
  const normalizedBase = makeProductId(baseId);
  const inUse = products.some((item) => item.id === normalizedBase && item.id !== currentId);
  if (!inUse) return normalizedBase;
  return `${normalizedBase}-${Date.now().toString().slice(-5)}`;
}

function handleProductSubmit(event) {
  event.preventDefault();
  if (!(nameInput && typeInput && priceInput && badgeInput && noteInput && imageInput && ratingInput && editIdInput)) return;

  const currentId = String(editIdInput.value || '').trim();
  const draft = normalizeProduct(
    {
      id: currentId || nameInput.value,
      name: nameInput.value,
      type: typeInput.value,
      price: priceInput.value,
      badge: badgeInput.value,
      note: noteInput.value,
      image: imageInput.value,
      rating: ratingInput.value
    },
    products.length
  );
  draft.id = ensureUniqueId(draft.id, currentId);

  if (currentId) {
    products = products.map((item) => (item.id === currentId ? draft : item));
    setStatusMessage('Product updated successfully.', 'success');
  } else {
    products.unshift(draft);
    setStatusMessage('Product added successfully.', 'success');
  }

  saveProducts();
  renderProductsList();
  resetProductForm();
}

function handleProductActions(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const editBtn = target.closest('[data-admin-edit]');
  if (editBtn && editBtn.dataset.adminEdit) {
    fillFormForEdit(editBtn.dataset.adminEdit);
    setStatusMessage('Editing product. Update fields and save.');
    return;
  }

  const deleteBtn = target.closest('[data-admin-delete]');
  if (deleteBtn && deleteBtn.dataset.adminDelete) {
    const id = deleteBtn.dataset.adminDelete;
    const product = products.find((item) => item.id === id);
    if (!product) return;

    const approved = window.confirm(`Delete "${product.name}"?`);
    if (!approved) return;

    products = products.filter((item) => item.id !== id);
    saveProducts();
    renderProductsList();
    resetProductForm();
    setStatusMessage('Product removed successfully.', 'success');
  }
}

function openDashboard() {
  if (loginPanel) loginPanel.classList.add('hidden');
  if (dashboard) dashboard.classList.remove('hidden');
  products = loadProducts();
  renderProductsList();
  resetProductForm();
  setAuthMessage('');
  setStatusMessage('Admin unlocked. Changes update the live product catalog.', 'success');
}

function closeDashboard() {
  if (dashboard) dashboard.classList.add('hidden');
  if (loginPanel) loginPanel.classList.remove('hidden');
  setStatusMessage('');
  setAuthMessage('');
}

function handleLogin(event) {
  event.preventDefault();
  const idInput = document.getElementById('adminIdInput');
  const passwordInput = document.getElementById('adminPasswordInput');
  if (!(idInput instanceof HTMLInputElement) || !(passwordInput instanceof HTMLInputElement)) return;

  const enteredId = idInput.value.trim();
  const enteredPassword = passwordInput.value;

  if (enteredId !== ADMIN_ID || enteredPassword !== ADMIN_PASSWORD) {
    setAuthMessage('Invalid credentials. Access denied.', 'error');
    return;
  }

  window.sessionStorage.setItem(ADMIN_AUTH_KEY, '1');
  setAuthMessage('Access granted.', 'success');
  openDashboard();
}

function handleLogout() {
  window.sessionStorage.removeItem(ADMIN_AUTH_KEY);
  closeDashboard();
}

function initNavToggle() {
  const nav = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const navOverlay = document.getElementById('navOverlay');
  if (!nav || !navToggle) return;

  const closeNav = () => {
    nav.classList.remove('open');
    document.body.classList.remove('nav-open');
    if (navOverlay) navOverlay.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const isOpen = nav.classList.contains('open');
    document.body.classList.toggle('nav-open', isOpen);
    if (navOverlay) navOverlay.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
  if (navOverlay) navOverlay.addEventListener('click', closeNav);
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) closeNav();
  });
}

function initAdminPage() {
  initNavToggle();
  if (productForm) productForm.addEventListener('submit', handleProductSubmit);
  if (productList) productList.addEventListener('click', handleProductActions);
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetProductForm();
      setStatusMessage('Form reset.');
    });
  }
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  if (window.sessionStorage.getItem(ADMIN_AUTH_KEY) === '1') {
    openDashboard();
  } else {
    closeDashboard();
  }
}

document.addEventListener('DOMContentLoaded', initAdminPage);
