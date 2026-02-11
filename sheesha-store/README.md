# SHEESHA HOOKAH Ecommerce (Next.js)

Production-oriented ecommerce app for hookahs, flavors, and accessories with:

- Mobile-first storefront + predictive search + smart filtering
- Variant-based cart and one-page checkout
- UPI-only checkout flow
- Stock reservation and inventory APIs
- Age-gate + tobacco disclaimer compliance
- Order tracking, wishlist, saved addresses, and policy pages
- Admin dashboard APIs for inventory and order metrics

## 1) Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 2) Configuration

- No environment variables are required.
- UPI intent checkout uses a fixed UPI ID inside `src/components/checkout/checkout-client.tsx`.
- Update `STORE_UPI_ID` and `STORE_UPI_NAME` in that file for your payment destination.

## 3) Age verification

- Middleware redirects all users to `/age-check` until they confirm 18+.
- Cookie `age_verified=yes` is issued by `/api/age/verify`.

## 4) Commerce APIs

- `POST /api/commerce/orders`
  - Creates order, validates stock, reserves inventory.
  - Returns order details for UPI intent payment.
- `POST /api/commerce/orders/verify`
  - Kept for compatibility; currently disabled in UPI-only mode.
- `GET /api/commerce/orders/:orderId`
  - Fetches a single order for tracking.
- `GET /api/commerce/orders?orderId=...|email=...|phone=...`
  - Fetches matching orders.
- `POST /api/commerce/abandoned-carts`
  - Captures recoverable abandoned cart records.
- `GET /api/commerce/admin/dashboard`
- `GET /api/commerce/admin/inventory`
- `PATCH /api/commerce/admin/inventory`

## 5) Data storage

- Store data is persisted to `data/commerce.json` on the server runtime.
- For horizontally scaled hosting, migrate this to a real database before launch.

## 6) Build and lint

```bash
npm run lint
npm run build
```

## 7) Go-live checklist

- Configure HTTPS + domain.
- Update the UPI ID constant in checkout client.
- Replace any placeholder contact/address data.
- Verify policy pages against legal requirements for your business.
