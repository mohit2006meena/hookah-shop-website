const ADMIN_ID = 'bhuvnesh2020';
const ADMIN_PASSWORD = 'Bhuvnesh@2020';
const ADMIN_AUTH_KEY = 'sheesha_admin_auth_v1';
const PRODUCTS_STORAGE_KEY = 'sheesha_products_v1';
const GITHUB_SETTINGS_KEY = 'sheesha_admin_github_settings_v1';
const GITHUB_TOKEN_SESSION_KEY = 'sheesha_admin_github_token_v1';
const ADMIN_UI_STATE_KEY = 'sheesha_admin_ui_state_v1';
const ADMIN_DRAFT_SESSION_KEY = 'sheesha_admin_draft_v1';
const PRODUCTS_JS_PATH = 'assets/data/products.js';
const PRODUCTS_JSON_PATH = 'assets/data/products.json';
const IMAGE_RATIO = 4 / 3;
const IMAGE_EXPORT_WIDTH = 1280;
const IMAGE_EXPORT_HEIGHT = 960;
const GITHUB_FIXED_CONFIG = Object.freeze({
  owner: 'mohit2006meena',
  repo: 'hookah-shop-website',
  branch: 'main'
});

const defaultProducts = [
  {
    id: 'classic-brass-hookah',
    name: 'Classic Brass Hookah',
    type: 'traditional',
    price: 3499,
    badge: 'Limited',
    note: 'Hand-etched stem, velvet hose',
    image: 'assets/gallery/Classic-Brass-Hookah.jpg',
    images: ['assets/gallery/Classic-Brass-Hookah.jpg', 'assets/gallery/Traditional-Brass-Hookah.jpg'],
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
    images: ['assets/gallery/premium-glass-hookah.jpg', 'assets/gallery/shop-front.jpg'],
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
    images: ['assets/gallery/shop-front.jpg', 'assets/gallery/premium-glass-hookah.jpg'],
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
    images: ['assets/gallery/owner.jpg', 'assets/gallery/Classic-Brass-Hookah.jpg'],
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
    images: ['assets/gallery/shop-front.jpg', 'assets/gallery/owner.jpg'],
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
    images: ['assets/gallery/Traditional-Brass-Hookah.jpg', 'assets/gallery/Classic-Brass-Hookah.jpg'],
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
    images: ['assets/gallery/premium-glass-hookah.jpg', 'assets/gallery/Traditional-Brass-Hookah.jpg'],
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
    images: ['assets/gallery/Traditional-Brass-Hookah.jpg', 'assets/gallery/Classic-Brass-Hookah.jpg'],
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
const imagesInput = document.getElementById('adminImagesInput');
const ratingInput = document.getElementById('adminRatingInput');
const saveBtn = document.getElementById('adminSaveBtn');
const uploadInput = document.getElementById('adminUploadImages');
const uploadBtn = document.getElementById('adminUploadBtn');
const uploadMessage = document.getElementById('adminUploadMessage');
const validationMessage = document.getElementById('adminValidationMessage');
const editCancelBtn = document.getElementById('adminEditCancelBtn');
const editState = document.getElementById('adminEditState');
const editStateTitle = document.getElementById('adminEditStateTitle');
const editStateDesc = document.getElementById('adminEditStateDesc');
const imageList = document.getElementById('adminImageList');
const imageRefreshBtn = document.getElementById('adminImageRefreshBtn');
const previewPanel = document.getElementById('adminPreviewPanel');
const previewImage = document.getElementById('adminPreviewImage');
const previewType = document.getElementById('adminPreviewType');
const previewName = document.getElementById('adminPreviewName');
const previewPrice = document.getElementById('adminPreviewPrice');
const previewNote = document.getElementById('adminPreviewNote');
const previewBadge = document.getElementById('adminPreviewBadge');
const previewRating = document.getElementById('adminPreviewRating');
const previewThumbs = document.getElementById('adminPreviewThumbs');
const listSearchInput = document.getElementById('adminListSearch');
const listTypeFilter = document.getElementById('adminListTypeFilter');
const listSortSelect = document.getElementById('adminListSort');
const githubPublishInput = document.getElementById('adminGithubPublish');
const githubOwnerInput = document.getElementById('adminGithubOwner');
const githubRepoInput = document.getElementById('adminGithubRepo');
const githubBranchInput = document.getElementById('adminGithubBranch');
const githubTokenInput = document.getElementById('adminGithubToken');
const githubMessage = document.getElementById('adminGithubMessage');
const cropModal = document.getElementById('adminCropModal');
const cropCanvas = document.getElementById('adminCropCanvas');
const cropMeta = document.getElementById('adminCropMeta');
const cropZoomInput = document.getElementById('adminCropZoom');
const cropXInput = document.getElementById('adminCropX');
const cropYInput = document.getElementById('adminCropY');
const cropApplyDefaultsInput = document.getElementById('adminCropApplyDefaults');
const cropApplyBtn = document.getElementById('adminCropApplyBtn');
const cropSkipBtn = document.getElementById('adminCropSkipBtn');
const cropCancelBtn = document.getElementById('adminCropCancelBtn');

let products = [];
let activeEditId = '';
let baselineDraftKey = '';
let listState = {
  search: '',
  type: 'all',
  sort: 'newest'
};
let cropPreset = null;
let replacingImageIndex = -1;
const replaceImageInput = document.createElement('input');
replaceImageInput.type = 'file';
replaceImageInput.accept = 'image/*';
replaceImageInput.style.display = 'none';
document.body.appendChild(replaceImageInput);
const cropState = {
  image: null,
  fileName: '',
  index: 0,
  total: 0,
  zoom: 1,
  shiftX: 0,
  shiftY: 0
};
let cropResolve = null;
let cropDrag = null;

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugifyToken(value) {
  const token = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return token || 'product';
}

function parsePathList(value) {
  const raw = String(value || '').trim();
  if (!raw) return [];
  const lineSplit = raw
    .split(/\r?\n/)
    .map((entry) => String(entry || '').trim())
    .filter(Boolean);
  if (lineSplit.length > 1 || lineSplit[0].startsWith('data:image/')) return lineSplit;

  return raw
    .split(',')
    .map((entry) => String(entry || '').trim())
    .filter(Boolean);
}

function makeProductId(value, fallbackIndex = 0) {
  const token = slugifyToken(value);
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
  const fallbackImage = 'assets/gallery/premium-glass-hookah.jpg';
  const primaryImage = String(product && product.image ? product.image : fallbackImage).trim() || fallbackImage;
  const incomingImages = Array.isArray(product && product.images)
    ? product.images
    : parsePathList(product && product.images ? product.images : '');
  const images = [];
  [primaryImage, ...incomingImages].forEach((src) => {
    const token = String(src || '').trim();
    if (!token || images.includes(token)) return;
    images.push(token);
  });
  if (!images.length) images.push(fallbackImage);

  return {
    id,
    name,
    type,
    price,
    badge: String(product && product.badge ? product.badge : 'Featured').trim() || 'Featured',
    note: String(product && product.note ? product.note : 'Premium quality selection').trim() || 'Premium quality selection',
    image: images[0],
    images,
    rating
  };
}

function loadProducts() {
  const remoteProducts = Array.isArray(window.sheeshaProducts) ? window.sheeshaProducts : [];
  const source = remoteProducts.length ? remoteProducts : defaultProducts;
  const fallback = source.map((item, index) => normalizeProduct(item, index));
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
  try {
    window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    return true;
  } catch (_error) {
    return false;
  }
}

function loadAdminUiState() {
  const fallback = { activeEditId: '', search: '', type: 'all', sort: 'newest' };
  try {
    const raw = window.localStorage.getItem(ADMIN_UI_STATE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return fallback;
    return {
      activeEditId: String(parsed.activeEditId || '').trim(),
      search: String(parsed.search || '').trim(),
      type: ['all', 'traditional', 'glass', 'flavors', 'accessories'].includes(String(parsed.type || 'all')) ? String(parsed.type) : 'all',
      sort: ['newest', 'name-asc', 'price-desc', 'price-asc'].includes(String(parsed.sort || 'newest')) ? String(parsed.sort) : 'newest'
    };
  } catch (_error) {
    return fallback;
  }
}

function saveAdminUiState() {
  const payload = {
    activeEditId,
    search: listState.search,
    type: listState.type,
    sort: listState.sort
  };
  window.localStorage.setItem(ADMIN_UI_STATE_KEY, JSON.stringify(payload));
}

function saveDraftSession(draft) {
  try {
    window.sessionStorage.setItem(ADMIN_DRAFT_SESSION_KEY, JSON.stringify(draft));
  } catch (_error) {
    // ignore session storage failures
  }
}

function loadDraftSession() {
  try {
    const raw = window.sessionStorage.getItem(ADMIN_DRAFT_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (_error) {
    return null;
  }
}

function clearDraftSession() {
  window.sessionStorage.removeItem(ADMIN_DRAFT_SESSION_KEY);
}

function loadGitHubSettings() {
  const fallback = {
    enabled: true,
    owner: GITHUB_FIXED_CONFIG.owner,
    repo: GITHUB_FIXED_CONFIG.repo,
    branch: GITHUB_FIXED_CONFIG.branch
  };
  try {
    const raw = window.localStorage.getItem(GITHUB_SETTINGS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return fallback;
    return {
      enabled: Boolean(parsed.enabled),
      owner: GITHUB_FIXED_CONFIG.owner,
      repo: GITHUB_FIXED_CONFIG.repo,
      branch: GITHUB_FIXED_CONFIG.branch
    };
  } catch (_error) {
    return fallback;
  }
}

function saveGitHubSettings(settings) {
  const payload = {
    enabled: Boolean(settings.enabled),
    owner: GITHUB_FIXED_CONFIG.owner,
    repo: GITHUB_FIXED_CONFIG.repo,
    branch: GITHUB_FIXED_CONFIG.branch
  };
  window.localStorage.setItem(GITHUB_SETTINGS_KEY, JSON.stringify(payload));
}

function hydrateGitHubSettingsForm() {
  const settings = loadGitHubSettings();
  if (githubPublishInput) githubPublishInput.checked = settings.enabled;
  if (githubOwnerInput) {
    githubOwnerInput.value = GITHUB_FIXED_CONFIG.owner;
    githubOwnerInput.readOnly = true;
  }
  if (githubRepoInput) {
    githubRepoInput.value = GITHUB_FIXED_CONFIG.repo;
    githubRepoInput.readOnly = true;
  }
  if (githubBranchInput) {
    githubBranchInput.value = GITHUB_FIXED_CONFIG.branch;
    githubBranchInput.readOnly = true;
  }
  if (githubTokenInput) {
    githubTokenInput.value = String(window.sessionStorage.getItem(GITHUB_TOKEN_SESSION_KEY) || '');
  }
}

function persistGitHubSettingsFromForm() {
  const settings = {
    enabled: githubPublishInput ? githubPublishInput.checked : false,
    owner: GITHUB_FIXED_CONFIG.owner,
    repo: GITHUB_FIXED_CONFIG.repo,
    branch: GITHUB_FIXED_CONFIG.branch
  };
  saveGitHubSettings(settings);
  if (githubTokenInput) {
    const token = String(githubTokenInput.value || '').trim();
    if (token) {
      window.sessionStorage.setItem(GITHUB_TOKEN_SESSION_KEY, token);
    } else {
      window.sessionStorage.removeItem(GITHUB_TOKEN_SESSION_KEY);
    }
  }
}

function getGitHubConfigFromForm() {
  const enabled = githubPublishInput ? githubPublishInput.checked : false;
  const owner = GITHUB_FIXED_CONFIG.owner;
  const repo = GITHUB_FIXED_CONFIG.repo;
  const branch = GITHUB_FIXED_CONFIG.branch;
  const token = String(githubTokenInput ? githubTokenInput.value : '').trim();
  return { enabled, owner, repo, branch, token };
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

function setUploadMessage(text, type = '') {
  if (!uploadMessage) return;
  uploadMessage.textContent = text;
  uploadMessage.classList.remove('error', 'success');
  if (type) uploadMessage.classList.add(type);
}

function setValidationMessage(text, type = '') {
  if (!validationMessage) return;
  validationMessage.textContent = text;
  validationMessage.classList.remove('error', 'success');
  if (type) validationMessage.classList.add(type);
}

function setGitHubMessage(text, type = '') {
  if (!githubMessage) return;
  githubMessage.textContent = text;
  githubMessage.classList.remove('error', 'success');
  if (type) githubMessage.classList.add(type);
}

function formatCurrency(value) {
  return `Rs ${Math.max(0, Math.round(Number(value) || 0)).toLocaleString('en-IN')}`;
}

function getCurrentFormImages() {
  const primary = String(imageInput ? imageInput.value : '').trim();
  const additional = imagesInput ? parsePathList(imagesInput.value) : [];
  return mergeImagePaths(primary, additional);
}

function setFormImages(paths) {
  const next = Array.isArray(paths) ? paths.map((item) => String(item || '').trim()).filter(Boolean) : [];
  if (imageInput) imageInput.value = next[0] || '';
  if (imagesInput) imagesInput.value = next.slice(1).join('\n');
  renderImageManager();
  renderLivePreview();
  syncValidationState();
}

function getFormDraft() {
  const draft = {
    id: String(editIdInput ? editIdInput.value : '').trim(),
    name: String(nameInput ? nameInput.value : '').trim(),
    type: String(typeInput ? typeInput.value : '').trim(),
    price: Number(priceInput ? priceInput.value : 0),
    badge: String(badgeInput ? badgeInput.value : '').trim(),
    note: String(noteInput ? noteInput.value : '').trim(),
    rating: Number(ratingInput ? ratingInput.value : 0),
    images: getCurrentFormImages()
  };
  return draft;
}

function draftKey(draft) {
  const normalized = normalizeProduct(
    {
      id: draft.id || draft.name,
      name: draft.name,
      type: draft.type,
      price: draft.price,
      badge: draft.badge,
      note: draft.note,
      image: draft.images[0] || '',
      images: draft.images,
      rating: draft.rating
    },
    0
  );
  return JSON.stringify({
    id: normalized.id,
    name: normalized.name,
    type: normalized.type,
    price: normalized.price,
    badge: normalized.badge,
    note: normalized.note,
    rating: normalized.rating,
    images: normalized.images
  });
}

function isFormDirty() {
  return Boolean(baselineDraftKey) && draftKey(getFormDraft()) !== baselineDraftKey;
}

function validateDraft(draft) {
  const errors = [];
  const warnings = [];
  const name = String(draft.name || '').trim();
  const type = String(draft.type || '').trim();
  const price = Number(draft.price);
  const rating = Number(draft.rating);
  const allowedTypes = new Set(['traditional', 'glass', 'flavors', 'accessories']);

  if (!name) errors.push('Product name is required.');
  if (!allowedTypes.has(type)) errors.push('Product type is invalid.');
  if (!Number.isFinite(price) || price < 0 || !Number.isInteger(price)) {
    errors.push('Price must be a whole number >= 0.');
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    errors.push('Rating must be between 1.0 and 5.0.');
  }
  if (!draft.images.length) errors.push('Add at least one image.');

  const duplicate = products.find((item) => item.id !== draft.id && item.name.trim().toLowerCase() === name.toLowerCase());
  if (duplicate) warnings.push(`Another product already uses this name (${duplicate.name}).`);

  return { errors, warnings };
}

function updateEditStateBanner() {
  if (!editState || !editStateTitle || !editStateDesc) return;
  const dirty = isFormDirty();
  editState.classList.toggle('is-dirty', dirty);

  if (activeEditId) {
    const current = products.find((item) => item.id === activeEditId);
    const label = current ? `${current.name} (${current.id})` : activeEditId;
    editStateTitle.textContent = dirty ? `Editing (unsaved): ${label}` : `Editing: ${label}`;
    editStateDesc.textContent = dirty ? 'Unsaved changes detected. Save or cancel before switching.' : 'Manual save mode. Edit fields and click Save Changes.';
  } else {
    editStateTitle.textContent = dirty ? 'New Product Mode (unsaved)' : 'New Product Mode';
    editStateDesc.textContent = dirty ? 'Unsaved new product draft is in progress.' : 'Create a product, crop images, and click save when ready.';
  }
}

function renderLivePreview() {
  if (!previewPanel) return;
  const draft = getFormDraft();
  const normalized = normalizeProduct(
    {
      id: draft.id || draft.name,
      name: draft.name,
      type: draft.type,
      price: draft.price,
      badge: draft.badge,
      note: draft.note,
      rating: draft.rating,
      image: draft.images[0] || '',
      images: draft.images
    },
    0
  );

  if (previewImage) previewImage.src = normalized.image;
  if (previewType) previewType.textContent = normalized.type;
  if (previewName) previewName.textContent = normalized.name;
  if (previewPrice) previewPrice.textContent = formatCurrency(normalized.price);
  if (previewNote) previewNote.textContent = normalized.note;
  if (previewBadge) previewBadge.textContent = normalized.badge;
  if (previewRating) previewRating.textContent = `Rating ${normalized.rating.toFixed(1)}`;
  if (previewThumbs) {
    previewThumbs.innerHTML = normalized.images
      .slice(0, 6)
      .map((src, index) => `<img src="${escapeHtml(src)}" alt="Preview image ${index + 1}" loading="lazy" decoding="async" />`)
      .join('');
  }
}

function renderImageManager() {
  if (!imageList) return;
  const paths = getCurrentFormImages();
  if (!paths.length) {
    imageList.innerHTML = '<p class="subtle">No images added yet.</p>';
    return;
  }

  imageList.innerHTML = paths
    .map((src, index) => {
      const filename = src.startsWith('data:image/') ? 'Uploaded image' : src.split('/').pop() || 'image';
      return `
        <article class="admin-image-item ${index === 0 ? 'is-primary' : ''}">
          <div class="admin-image-main">
            <img src="${escapeHtml(src)}" alt="Image ${index + 1}" loading="lazy" decoding="async" />
            <div class="admin-image-label">
              <strong>${index === 0 ? 'Primary image' : `Image ${index + 1}`}</strong>
              <span class="subtle">${escapeHtml(filename)}</span>
            </div>
          </div>
          <div class="admin-image-actions">
            <button class="chip" type="button" data-image-primary="${index}">Set primary</button>
            <button class="chip" type="button" data-image-move-left="${index}">Move left</button>
            <button class="chip" type="button" data-image-move-right="${index}">Move right</button>
            <button class="chip" type="button" data-image-replace="${index}">Replace</button>
            <button class="btn-mini" type="button" data-image-remove="${index}">Remove</button>
          </div>
        </article>
      `;
    })
    .join('');
}

function syncValidationState() {
  const validation = validateDraft(getFormDraft());
  if (validation.errors.length) {
    setValidationMessage(validation.errors[0], 'error');
    if (saveBtn) saveBtn.disabled = true;
  } else if (validation.warnings.length) {
    setValidationMessage(validation.warnings[0], 'success');
    if (saveBtn) saveBtn.disabled = false;
  } else {
    setValidationMessage('');
    if (saveBtn) saveBtn.disabled = false;
  }

  updateEditStateBanner();
  saveAdminUiState();
  saveDraftSession(getFormDraft());
}

function syncAdminFormUI() {
  renderImageManager();
  renderLivePreview();
  syncValidationState();
}

function confirmDiscardIfDirty(message) {
  if (!isFormDirty()) return true;
  return window.confirm(message);
}

function applyListControlsState() {
  if (listSearchInput) listSearchInput.value = listState.search;
  if (listSortSelect) listSortSelect.value = listState.sort;
  if (listTypeFilter) {
    listTypeFilter.querySelectorAll('[data-admin-type-filter]').forEach((button) => {
      button.classList.toggle('active', button.getAttribute('data-admin-type-filter') === listState.type);
    });
  }
}

function setListType(type) {
  const allowed = new Set(['all', 'traditional', 'glass', 'flavors', 'accessories']);
  listState.type = allowed.has(type) ? type : 'all';
  applyListControlsState();
  renderProductsList();
  saveAdminUiState();
}

function switchToNewMode(force = false) {
  if (!force && !confirmDiscardIfDirty('Discard unsaved changes and switch to new product mode?')) return false;
  resetProductForm();
  renderProductsList();
  saveAdminUiState();
  return true;
}

function renderProductsList() {
  if (!productList) return;
  const search = String(listState.search || '').trim().toLowerCase();
  const filterType = String(listState.type || 'all');
  const sort = String(listState.sort || 'newest');

  let visible = products.filter((item) => (filterType === 'all' ? true : item.type === filterType));
  if (search) {
    visible = visible.filter((item) =>
      `${item.name} ${item.type} ${item.badge} ${item.note}`.toLowerCase().includes(search)
    );
  }

  if (sort === 'name-asc') visible = visible.slice().sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'price-desc') visible = visible.slice().sort((a, b) => b.price - a.price);
  if (sort === 'price-asc') visible = visible.slice().sort((a, b) => a.price - b.price);

  if (!visible.length) {
    const message = products.length
      ? 'No products match current filters. Adjust search/filter settings.'
      : 'No products found. Add your first product.';
    productList.innerHTML = `<div class="admin-empty subtle">${message}</div>`;
    return;
  }

  productList.innerHTML = visible
    .map((item) => {
      const safeId = escapeHtml(item.id);
      const safeName = escapeHtml(item.name);
      const safeType = escapeHtml(item.type);
      const safeBadge = escapeHtml(item.badge);
      const safeNote = escapeHtml(item.note);
      const safeImage = escapeHtml(item.image);
      const imageLabel = String(item.image || '').startsWith('data:image/')
        ? 'Uploaded image'
        : safeImage;
      const safeRating = escapeHtml(item.rating);
      const imageCount = Array.isArray(item.images) ? item.images.length : 1;

      return `
        <article class="admin-product-row ${item.id === activeEditId ? 'is-editing' : ''}">
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
            <span class="chip">${imageCount} image${imageCount === 1 ? '' : 's'}</span>
            <span class="chip">${imageLabel}</span>
            <span class="chip">ID ${safeId}</span>
          </div>
          <div class="admin-product-actions">
            <button class="btn-mini" type="button" data-admin-edit="${safeId}">${item.id === activeEditId ? 'Editing' : 'Edit'}</button>
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
  if (priceInput) priceInput.value = '0';
  if (badgeInput) badgeInput.value = 'Featured';
  if (noteInput) noteInput.value = '';
  if (ratingInput) ratingInput.value = '4.6';
  if (imagesInput) imagesInput.value = '';
  if (imageInput) imageInput.value = '';
  if (uploadInput) uploadInput.value = '';
  activeEditId = '';
  baselineDraftKey = draftKey(getFormDraft());
  if (saveBtn) saveBtn.textContent = 'Save Product';
  if (editCancelBtn) editCancelBtn.disabled = true;
  setUploadMessage('');
  setStatusMessage('');
  setValidationMessage('');
  clearDraftSession();
  syncAdminFormUI();
}

function applyDraftToForm(draft) {
  if (!draft) return;
  if (editIdInput) editIdInput.value = String(draft.id || '').trim();
  if (nameInput) nameInput.value = String(draft.name || '').trim();
  if (typeInput) typeInput.value = String(draft.type || 'traditional').trim() || 'traditional';
  if (priceInput) priceInput.value = String(Number.isFinite(Number(draft.price)) ? Math.max(0, Math.round(Number(draft.price))) : 0);
  if (badgeInput) badgeInput.value = String(draft.badge || '').trim();
  if (noteInput) noteInput.value = String(draft.note || '').trim();
  if (ratingInput) ratingInput.value = String(Number.isFinite(Number(draft.rating)) ? Number(draft.rating) : 4.6);
  setFormImages(Array.isArray(draft.images) ? draft.images : []);
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
  if (imagesInput) imagesInput.value = (Array.isArray(target.images) ? target.images.slice(1) : []).join('\n');
  if (uploadInput) uploadInput.value = '';
  if (ratingInput) ratingInput.value = String(target.rating);
  activeEditId = target.id;
  baselineDraftKey = draftKey(getFormDraft());
  if (saveBtn) saveBtn.textContent = 'Save Changes';
  if (editCancelBtn) editCancelBtn.disabled = false;
  setUploadMessage('');
  setValidationMessage('');
  clearDraftSession();
  syncAdminFormUI();
  renderProductsList();
  saveAdminUiState();
}

function ensureUniqueId(baseId, currentId = '') {
  const normalizedBase = makeProductId(baseId);
  const inUse = products.some((item) => item.id === normalizedBase && item.id !== currentId);
  if (!inUse) return normalizedBase;
  return `${normalizedBase}-${Date.now().toString().slice(-5)}`;
}

function mergeImagePaths(primaryImage, additionalImages) {
  const paths = [];
  [primaryImage, ...additionalImages].forEach((src) => {
    const token = String(src || '').trim();
    if (!token || paths.includes(token)) return;
    paths.push(token);
  });
  return paths;
}

function isDataImage(value) {
  return String(value || '').startsWith('data:image/');
}

function extensionFromMime(mime) {
  const token = String(mime || '').toLowerCase();
  if (token.includes('png')) return 'png';
  if (token.includes('jpeg') || token.includes('jpg')) return 'jpg';
  if (token.includes('gif')) return 'gif';
  if (token.includes('webp')) return 'webp';
  return 'jpg';
}

function parseDataUrl(dataUrl) {
  const match = String(dataUrl || '').match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('Invalid image data format. Re-upload the image.');
  return { mime: match[1], base64: match[2] };
}

function encodeGitHubPath(path) {
  return String(path || '')
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
}

async function githubRequest(config, routePath, options = {}) {
  const response = await fetch(`https://api.github.com${routePath}`, {
    method: options.method || 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${config.token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    if (response.status === 404 && options.allowNotFound) return null;
    let detail = '';
    try {
      const payload = await response.json();
      detail = payload && payload.message ? ` ${payload.message}` : '';
    } catch (_error) {
      detail = '';
    }
    throw new Error(`GitHub request failed (${response.status}).${detail}`.trim());
  }

  return response.status === 204 ? null : response.json();
}

async function getGitHubFileSha(config, filePath) {
  const encodedPath = encodeGitHubPath(filePath);
  const ref = encodeURIComponent(config.branch);
  const data = await githubRequest(config, `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${encodedPath}?ref=${ref}`, {
    allowNotFound: true
  });
  return data && data.sha ? String(data.sha) : '';
}

async function upsertGitHubFile(config, filePath, contentBase64, message) {
  const encodedPath = encodeGitHubPath(filePath);
  const sha = await getGitHubFileSha(config, filePath);
  const body = {
    message,
    content: contentBase64,
    branch: config.branch
  };
  if (sha) body.sha = sha;

  await githubRequest(config, `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${encodedPath}`, {
    method: 'PUT',
    body
  });
}

function bytesToBase64(bytes) {
  let binary = '';
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return window.btoa(binary);
}

function stringToBase64(value) {
  const bytes = new TextEncoder().encode(String(value || ''));
  return bytesToBase64(bytes);
}

function buildProductsScript(catalog) {
  return `window.sheeshaProducts = ${JSON.stringify(catalog, null, 2)};\n`;
}

function materializeCatalogForGitHub(catalog) {
  const uploadQueue = [];

  const normalizedCatalog = catalog.map((item, productIndex) => normalizeProduct(item, productIndex));
  const publishedCatalog = normalizedCatalog.map((item, productIndex) => {
    const seenDataSources = new Map();
    let uploadIndex = 0;
    const baseName = slugifyToken(item.name);
    const publishedImages = item.images.map((src, imageIndex) => {
      const token = String(src || '').trim();
      if (!isDataImage(token)) return token;
      if (seenDataSources.has(token)) return seenDataSources.get(token);

      const parsed = parseDataUrl(token);
      const ext = extensionFromMime(parsed.mime);
      uploadIndex += 1;
      const seq = String(uploadIndex).padStart(2, '0');
      const filePath = `assets/gallery/${baseName}-${seq}.${ext}`;
      seenDataSources.set(token, filePath);
      uploadQueue.push({
        path: filePath,
        base64: parsed.base64
      });
      return filePath;
    });

    const finalImages = publishedImages.length ? publishedImages : [item.image];
    return {
      ...item,
      image: finalImages[0],
      images: finalImages
    };
  });

  return { publishedCatalog, uploadQueue };
}

async function publishCatalogToGitHub(catalog, reason) {
  const config = getGitHubConfigFromForm();
  if (!config.enabled) return null;
  if (!config.owner || !config.repo || !config.branch || !config.token) {
    throw new Error('GitHub publish is enabled. Fill owner, repo, branch, and token.');
  }

  const { publishedCatalog, uploadQueue } = materializeCatalogForGitHub(catalog);
  const baseMessage = `admin catalog sync: ${reason} (${new Date().toISOString()})`;
  setGitHubMessage('Publishing to GitHub...');

  for (let index = 0; index < uploadQueue.length; index += 1) {
    const image = uploadQueue[index];
    await upsertGitHubFile(config, image.path, image.base64, `${baseMessage} [image ${index + 1}]`);
  }

  const scriptContent = buildProductsScript(publishedCatalog);
  await upsertGitHubFile(config, PRODUCTS_JS_PATH, stringToBase64(scriptContent), `${baseMessage} [products.js]`);
  await upsertGitHubFile(
    config,
    PRODUCTS_JSON_PATH,
    stringToBase64(`${JSON.stringify(publishedCatalog, null, 2)}\n`),
    `${baseMessage} [products.json]`
  );

  setGitHubMessage('Published to GitHub successfully.', 'success');
  return publishedCatalog;
}

async function handleProductSubmit(event) {
  event.preventDefault();
  if (!(nameInput && typeInput && priceInput && badgeInput && noteInput && imageInput && ratingInput && editIdInput)) return;

  const currentId = String(editIdInput.value || '').trim();
  const draftInput = getFormDraft();
  const mergedImages = draftInput.images;

  const validation = validateDraft(draftInput);
  if (validation.errors.length) {
    setValidationMessage(validation.errors[0], 'error');
    return;
  }
  if (validation.warnings.length) {
    const proceed = window.confirm(`${validation.warnings[0]} Continue saving?`);
    if (!proceed) return;
  }

  const draft = normalizeProduct(
    {
      id: currentId || draftInput.name,
      name: draftInput.name,
      type: draftInput.type,
      price: draftInput.price,
      badge: draftInput.badge,
      note: draftInput.note,
      image: mergedImages[0] || '',
      images: mergedImages,
      rating: draftInput.rating
    },
    products.length
  );
  draft.id = ensureUniqueId(draft.id, currentId);
  const snapshot = products.slice();
  const nextCatalog = currentId ? products.map((item) => (item.id === currentId ? draft : item)) : [draft, ...products];
  const actionLabel = currentId ? `updated ${draft.name}` : `added ${draft.name}`;
  const originalSaveLabel = saveBtn ? saveBtn.textContent : '';

  try {
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
    }
    persistGitHubSettingsFromForm();
    const publishedCatalog = await publishCatalogToGitHub(nextCatalog, actionLabel);
    products = Array.isArray(publishedCatalog) ? publishedCatalog : nextCatalog;
    if (!publishedCatalog) setGitHubMessage('');
    if (!saveProducts()) {
      throw new Error('Save failed. Reduce image size/count and try again.');
    }
    const savedDraft = products.find((item) => item.id === draft.id);
    if (savedDraft) {
      fillFormForEdit(savedDraft.id);
    } else {
      resetProductForm();
    }
    setStatusMessage(
      publishedCatalog
        ? `Product ${currentId ? 'updated' : 'added'} and pushed to GitHub.`
        : `Product ${currentId ? 'updated' : 'added'} locally.`,
      'success'
    );
    saveAdminUiState();
  } catch (error) {
    products = snapshot;
    renderProductsList();
    setStatusMessage(error instanceof Error ? error.message : 'Save failed.', 'error');
    if (!String(error instanceof Error ? error.message : '').toLowerCase().includes('github')) {
      setGitHubMessage('');
    }
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = activeEditId ? 'Save Changes' : originalSaveLabel || 'Save Product';
    }
  }
}

async function handleProductActions(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const moveLeftBtn = target.closest('[data-image-move-left]');
  if (moveLeftBtn && moveLeftBtn.dataset.imageMoveLeft) {
    const index = Number(moveLeftBtn.dataset.imageMoveLeft);
    const paths = getCurrentFormImages();
    if (index > 0 && index < paths.length) {
      [paths[index - 1], paths[index]] = [paths[index], paths[index - 1]];
      setFormImages(paths);
    }
    return;
  }

  const moveRightBtn = target.closest('[data-image-move-right]');
  if (moveRightBtn && moveRightBtn.dataset.imageMoveRight) {
    const index = Number(moveRightBtn.dataset.imageMoveRight);
    const paths = getCurrentFormImages();
    if (index >= 0 && index < paths.length - 1) {
      [paths[index], paths[index + 1]] = [paths[index + 1], paths[index]];
      setFormImages(paths);
    }
    return;
  }

  const setPrimaryBtn = target.closest('[data-image-primary]');
  if (setPrimaryBtn && setPrimaryBtn.dataset.imagePrimary) {
    const index = Number(setPrimaryBtn.dataset.imagePrimary);
    const paths = getCurrentFormImages();
    if (index > 0 && index < paths.length) {
      const [chosen] = paths.splice(index, 1);
      paths.unshift(chosen);
      setFormImages(paths);
    }
    return;
  }

  const removeImageBtn = target.closest('[data-image-remove]');
  if (removeImageBtn && removeImageBtn.dataset.imageRemove) {
    const index = Number(removeImageBtn.dataset.imageRemove);
    const paths = getCurrentFormImages();
    if (index >= 0 && index < paths.length) {
      paths.splice(index, 1);
      setFormImages(paths);
    }
    return;
  }

  const replaceImageBtn = target.closest('[data-image-replace]');
  if (replaceImageBtn && replaceImageBtn.dataset.imageReplace) {
    replacingImageIndex = Number(replaceImageBtn.dataset.imageReplace);
    replaceImageInput.value = '';
    replaceImageInput.click();
    return;
  }

  const editBtn = target.closest('[data-admin-edit]');
  if (editBtn && editBtn.dataset.adminEdit) {
    if (activeEditId && activeEditId !== editBtn.dataset.adminEdit) {
      const proceed = confirmDiscardIfDirty('You have unsaved changes. Switch to another product and discard them?');
      if (!proceed) return;
    }
    fillFormForEdit(editBtn.dataset.adminEdit);
    setStatusMessage('Editing product. Update fields and save.');
    saveAdminUiState();
    return;
  }

  const deleteBtn = target.closest('[data-admin-delete]');
  if (deleteBtn && deleteBtn.dataset.adminDelete) {
    const id = deleteBtn.dataset.adminDelete;
    const product = products.find((item) => item.id === id);
    if (!product) return;

    const approved = window.confirm(`Delete "${product.name}"?`);
    if (!approved) return;
    if (activeEditId === id && !confirmDiscardIfDirty('Delete this product and discard current unsaved changes?')) {
      return;
    }

    const snapshot = products.slice();
    const nextCatalog = products.filter((item) => item.id !== id);
    try {
      persistGitHubSettingsFromForm();
      const publishedCatalog = await publishCatalogToGitHub(nextCatalog, `deleted ${product.name}`);
      products = Array.isArray(publishedCatalog) ? publishedCatalog : nextCatalog;
      if (!publishedCatalog) setGitHubMessage('');
      if (!saveProducts()) throw new Error('Delete failed. Reduce image size/count and try again.');
      if (activeEditId === id) {
        resetProductForm();
      }
      renderProductsList();
      setStatusMessage(
        publishedCatalog ? 'Product removed and pushed to GitHub.' : 'Product removed locally.',
        'success'
      );
      saveAdminUiState();
    } catch (error) {
      products = snapshot;
      renderProductsList();
      setStatusMessage(error instanceof Error ? error.message : 'Delete failed.', 'error');
    }
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error(`Unable to read "${file.name}".`));
    reader.readAsDataURL(file);
  });
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to process selected image.'));
    image.src = src;
  });
}

function clampValue(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function setCropInputsFromState() {
  if (cropZoomInput) cropZoomInput.value = String(cropState.zoom);
  if (cropXInput) cropXInput.value = String(Math.round(cropState.shiftX * 100));
  if (cropYInput) cropYInput.value = String(Math.round(cropState.shiftY * 100));
}

function resizeCropCanvas() {
  if (!(cropCanvas instanceof HTMLCanvasElement)) return;
  const hostWidth = cropCanvas.parentElement ? cropCanvas.parentElement.clientWidth : cropCanvas.width;
  const width = Math.max(320, Math.min(880, Math.floor(hostWidth || 800)));
  const height = Math.round(width / IMAGE_RATIO);
  if (cropCanvas.width !== width || cropCanvas.height !== height) {
    cropCanvas.width = width;
    cropCanvas.height = height;
  }
}

function drawImageIntoCanvas(canvas, image, zoom, shiftX, shiftY) {
  const context = canvas.getContext('2d');
  if (!context) return;
  const safeWidth = Math.max(1, image.width || 1);
  const safeHeight = Math.max(1, image.height || 1);
  const baseScale = Math.max(canvas.width / safeWidth, canvas.height / safeHeight);
  const scale = baseScale * clampValue(zoom, 1, 3);
  const drawWidth = safeWidth * scale;
  const drawHeight = safeHeight * scale;
  const maxShiftX = Math.max(0, (drawWidth - canvas.width) / 2);
  const maxShiftY = Math.max(0, (drawHeight - canvas.height) / 2);
  const x = (canvas.width - drawWidth) / 2 + maxShiftX * clampValue(shiftX, -1, 1);
  const y = (canvas.height - drawHeight) / 2 + maxShiftY * clampValue(shiftY, -1, 1);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#050505';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, x, y, drawWidth, drawHeight);
}

function renderCropPreview() {
  if (!(cropCanvas instanceof HTMLCanvasElement) || !(cropState.image instanceof HTMLImageElement)) return;
  resizeCropCanvas();
  drawImageIntoCanvas(cropCanvas, cropState.image, cropState.zoom, cropState.shiftX, cropState.shiftY);
}

function exportCroppedImage() {
  if (!(cropState.image instanceof HTMLImageElement)) return '';
  const output = document.createElement('canvas');
  output.width = IMAGE_EXPORT_WIDTH;
  output.height = IMAGE_EXPORT_HEIGHT;
  drawImageIntoCanvas(output, cropState.image, cropState.zoom, cropState.shiftX, cropState.shiftY);
  return output.toDataURL('image/webp', 0.9);
}

function closeCropModal() {
  if (cropModal) cropModal.classList.add('hidden');
  cropDrag = null;
  document.body.style.overflow = '';
}

function resolveCropAction(result) {
  const resolver = cropResolve;
  cropResolve = null;
  closeCropModal();
  if (resolver) resolver(result);
}

function setupCropStateForImage(image, fileName, index, total) {
  cropState.image = image;
  cropState.fileName = fileName;
  cropState.index = index;
  cropState.total = total;
  const usePreset = Boolean(cropApplyDefaultsInput && cropApplyDefaultsInput.checked && cropPreset);
  cropState.zoom = usePreset ? cropPreset.zoom : 1;
  cropState.shiftX = usePreset ? cropPreset.shiftX : 0;
  cropState.shiftY = usePreset ? cropPreset.shiftY : 0;
  setCropInputsFromState();
  if (cropMeta) {
    cropMeta.textContent = `${fileName} (${index + 1}/${total}) · Keep the product centered.`;
  }
  renderCropPreview();
}

async function openCropForFile(file, index, total) {
  const source = await readFileAsDataUrl(file);
  const image = await loadImageElement(source);

  if (!(cropModal instanceof HTMLElement) || !(cropCanvas instanceof HTMLCanvasElement)) {
    setupCropStateForImage(image, file.name, index, total);
    return { action: 'apply', data: exportCroppedImage() };
  }

  return new Promise((resolve) => {
    cropResolve = resolve;
    setupCropStateForImage(image, file.name, index, total);
    cropModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });
}

function initCropModal() {
  if (!(cropCanvas instanceof HTMLCanvasElement)) return;

  const updateFromInputs = () => {
    const zoom = Number(cropZoomInput ? cropZoomInput.value : cropState.zoom);
    const shiftX = Number(cropXInput ? cropXInput.value : cropState.shiftX * 100) / 100;
    const shiftY = Number(cropYInput ? cropYInput.value : cropState.shiftY * 100) / 100;
    cropState.zoom = clampValue(Number.isFinite(zoom) ? zoom : 1, 1, 3);
    cropState.shiftX = clampValue(Number.isFinite(shiftX) ? shiftX : 0, -1, 1);
    cropState.shiftY = clampValue(Number.isFinite(shiftY) ? shiftY : 0, -1, 1);
    setCropInputsFromState();
    renderCropPreview();
  };

  [cropZoomInput, cropXInput, cropYInput].forEach((input) => {
    if (input) input.addEventListener('input', updateFromInputs);
  });
  if (cropApplyDefaultsInput) {
    cropApplyDefaultsInput.addEventListener('change', () => {
      if (!cropApplyDefaultsInput.checked) cropPreset = null;
    });
  }

  if (cropApplyBtn) {
    cropApplyBtn.addEventListener('click', () => {
      if (!cropResolve) return;
      if (cropApplyDefaultsInput && cropApplyDefaultsInput.checked) {
        cropPreset = {
          zoom: cropState.zoom,
          shiftX: cropState.shiftX,
          shiftY: cropState.shiftY
        };
      }
      resolveCropAction({ action: 'apply', data: exportCroppedImage() });
    });
  }

  if (cropSkipBtn) {
    cropSkipBtn.addEventListener('click', () => {
      if (!cropResolve) return;
      resolveCropAction({ action: 'skip', data: '' });
    });
  }

  const cancelCrop = () => {
    if (!cropResolve) return;
    resolveCropAction({ action: 'cancel', data: '' });
  };

  if (cropCancelBtn) cropCancelBtn.addEventListener('click', cancelCrop);
  if (cropModal) {
    cropModal.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.matches('[data-crop-close]')) cancelCrop();
    });
  }

  cropCanvas.addEventListener('pointerdown', (event) => {
    if (!(cropState.image instanceof HTMLImageElement)) return;
    cropDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      baseShiftX: cropState.shiftX,
      baseShiftY: cropState.shiftY
    };
    cropCanvas.setPointerCapture(event.pointerId);
  });

  cropCanvas.addEventListener('pointermove', (event) => {
    if (!cropDrag || cropDrag.pointerId !== event.pointerId) return;
    const width = Math.max(1, cropCanvas.clientWidth);
    const height = Math.max(1, cropCanvas.clientHeight);
    const deltaX = event.clientX - cropDrag.startX;
    const deltaY = event.clientY - cropDrag.startY;
    cropState.shiftX = clampValue(cropDrag.baseShiftX + deltaX / (width / 2), -1, 1);
    cropState.shiftY = clampValue(cropDrag.baseShiftY + deltaY / (height / 2), -1, 1);
    setCropInputsFromState();
    renderCropPreview();
  });

  const clearDrag = (event) => {
    if (!cropDrag || cropDrag.pointerId !== event.pointerId) return;
    if (cropCanvas.hasPointerCapture(event.pointerId)) {
      cropCanvas.releasePointerCapture(event.pointerId);
    }
    cropDrag = null;
  };

  cropCanvas.addEventListener('pointerup', clearDrag);
  cropCanvas.addEventListener('pointercancel', clearDrag);

  window.addEventListener('resize', () => {
    if (cropResolve) renderCropPreview();
  });

  document.addEventListener('keydown', (event) => {
    if (!cropResolve) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelCrop();
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      if (cropApplyBtn) cropApplyBtn.click();
    }
  });
}

async function handleUploadClick() {
  if (!(uploadInput instanceof HTMLInputElement)) return;
  const files = Array.from(uploadInput.files || []).filter((file) => !file.type || file.type.startsWith('image/'));
  if (!files.length) {
    setUploadMessage('Select image files first.', 'error');
    return;
  }

  if (uploadBtn) uploadBtn.disabled = true;
  if (uploadInput) uploadInput.disabled = true;
  cropPreset = null;
  setUploadMessage('Crop and process selected images...');
  try {
    const uploadedSources = [];
    for (let index = 0; index < files.length; index += 1) {
      setUploadMessage(`Crop image ${index + 1} of ${files.length}...`);
      const result = await openCropForFile(files[index], index, files.length);
      if (result.action === 'cancel') {
        setUploadMessage('Image upload cancelled.', 'error');
        if (uploadInput) uploadInput.value = '';
        return;
      }
      if (result.action === 'apply' && result.data) {
        uploadedSources.push(result.data);
      }
    }

    if (!uploadedSources.length) {
      setUploadMessage('No images were added. Select files and crop at least one image.', 'error');
      if (uploadInput) uploadInput.value = '';
      return;
    }

    const currentPrimary = imageInput ? String(imageInput.value || '').trim() : '';
    const currentAdditional = imagesInput ? parsePathList(imagesInput.value) : [];
    const merged = mergeImagePaths(currentPrimary, [...currentAdditional, ...uploadedSources]);

    setFormImages(merged);
    if (uploadInput) uploadInput.value = '';

    setUploadMessage(`${uploadedSources.length} cropped image(s) ready. File names auto-generate from product name on publish.`, 'success');
  } catch (error) {
    console.error(error);
    setUploadMessage(error instanceof Error ? error.message : 'Image processing failed.', 'error');
  } finally {
    if (uploadBtn) uploadBtn.disabled = false;
    if (uploadInput) uploadInput.disabled = false;
  }
}

async function handleReplaceImageSelection() {
  const file = replaceImageInput.files && replaceImageInput.files[0];
  if (!file || replacingImageIndex < 0) return;
  if (file.type && !file.type.startsWith('image/')) {
    setUploadMessage('Selected file is not an image.', 'error');
    replacingImageIndex = -1;
    return;
  }

  try {
    cropPreset = null;
    const result = await openCropForFile(file, 0, 1);
    if (result.action !== 'apply' || !result.data) return;
    const paths = getCurrentFormImages();
    if (replacingImageIndex >= 0 && replacingImageIndex < paths.length) {
      paths[replacingImageIndex] = result.data;
      setFormImages(paths);
      setUploadMessage('Image replaced successfully. Save to publish.', 'success');
    }
  } catch (error) {
    setUploadMessage(error instanceof Error ? error.message : 'Image replace failed.', 'error');
  } finally {
    replacingImageIndex = -1;
    replaceImageInput.value = '';
  }
}

function openDashboard() {
  if (loginPanel) loginPanel.classList.add('hidden');
  if (dashboard) dashboard.classList.remove('hidden');
  products = loadProducts();
  const uiState = loadAdminUiState();
  listState = {
    search: uiState.search,
    type: uiState.type,
    sort: uiState.sort
  };
  activeEditId = '';
  applyListControlsState();
  renderProductsList();
  resetProductForm();
  if (uiState.activeEditId && products.some((item) => item.id === uiState.activeEditId)) {
    fillFormForEdit(uiState.activeEditId);
  } else {
    const draft = loadDraftSession();
    if (draft && typeof draft === 'object') {
      applyDraftToForm(draft);
      setStatusMessage('Restored unsaved draft from this session.', 'success');
    }
  }
  hydrateGitHubSettingsForm();
  setAuthMessage('');
  if (!statusMessage || !statusMessage.textContent) {
    setStatusMessage('Admin unlocked. Save locally or enable GitHub publish for live deployment.', 'success');
  }
  setGitHubMessage(
    `Connected repo: ${GITHUB_FIXED_CONFIG.owner}/${GITHUB_FIXED_CONFIG.repo} (${GITHUB_FIXED_CONFIG.branch})`
  );
}

function closeDashboard() {
  if (dashboard) dashboard.classList.add('hidden');
  if (loginPanel) loginPanel.classList.remove('hidden');
  setStatusMessage('');
  setAuthMessage('');
  setGitHubMessage('');
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
  if (!confirmDiscardIfDirty('You have unsaved changes. Logout and discard them?')) return;
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
  initCropModal();
  if (productForm) productForm.addEventListener('submit', handleProductSubmit);
  if (productList) productList.addEventListener('click', (event) => void handleProductActions(event));
  if (imageList) imageList.addEventListener('click', (event) => void handleProductActions(event));
  if (uploadBtn) uploadBtn.addEventListener('click', handleUploadClick);
  if (uploadInput) {
    uploadInput.addEventListener('change', () => {
      if ((uploadInput.files || []).length) handleUploadClick();
    });
  }
  replaceImageInput.addEventListener('change', () => {
    void handleReplaceImageSelection();
  });
  if (imageRefreshBtn) {
    imageRefreshBtn.addEventListener('click', () => {
      syncAdminFormUI();
      setStatusMessage('Image manager refreshed.');
    });
  }
  if (editCancelBtn) {
    editCancelBtn.addEventListener('click', () => {
      if (activeEditId) {
        if (confirmDiscardIfDirty('Discard changes and exit edit mode?')) {
          switchToNewMode(true);
          setStatusMessage('Exited edit mode.');
        }
      } else {
        switchToNewMode(true);
      }
    });
  }
  if (listSearchInput) {
    listSearchInput.addEventListener('input', () => {
      listState.search = String(listSearchInput.value || '').trim();
      renderProductsList();
      saveAdminUiState();
    });
  }
  if (listTypeFilter) {
    listTypeFilter.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const chip = target.closest('[data-admin-type-filter]');
      if (!chip) return;
      setListType(String(chip.getAttribute('data-admin-type-filter') || 'all'));
    });
  }
  if (listSortSelect) {
    listSortSelect.addEventListener('change', () => {
      listState.sort = String(listSortSelect.value || 'newest');
      renderProductsList();
      saveAdminUiState();
    });
  }
  if (productForm) {
    productForm.addEventListener('input', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.id === 'adminUploadImages' || target.id === 'adminImageRefreshBtn') return;
      syncAdminFormUI();
    });
    productForm.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.id === 'adminUploadImages' || target.id === 'adminImageRefreshBtn') return;
      syncAdminFormUI();
    });
  }
  [githubPublishInput, githubOwnerInput, githubRepoInput, githubBranchInput].forEach((field) => {
    if (field) field.addEventListener('change', persistGitHubSettingsFromForm);
  });
  if (githubTokenInput) {
    githubTokenInput.addEventListener('input', persistGitHubSettingsFromForm);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (activeEditId) {
        const current = products.find((item) => item.id === activeEditId);
        if (current) {
          fillFormForEdit(current.id);
          setStatusMessage('Fields reset to saved product values.');
          return;
        }
      }
      resetProductForm();
      setStatusMessage('Fields reset.');
    });
  }

  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  window.addEventListener('beforeunload', (event) => {
    if (!isFormDirty()) return;
    event.preventDefault();
    event.returnValue = '';
  });

  if (window.sessionStorage.getItem(ADMIN_AUTH_KEY) === '1') {
    openDashboard();
  } else {
    closeDashboard();
  }
}

document.addEventListener('DOMContentLoaded', initAdminPage);
