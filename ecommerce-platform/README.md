# Multi-Vendor E-Commerce Platform with Analytics

A Feature-Sliced Design (FSD) frontend scaffold for a multi-vendor marketplace with a customer storefront, a vendor dashboard, and an admin/analytics panel. Runs fully standalone against a mocked API (MSW), so there is no backend to stand up before you can click around.

## Stack

- React 19 + TypeScript + Vite
- Redux Toolkit + RTK Query (single `baseApi`, entities inject their own endpoints)
- React Router v7
- Tailwind CSS v4
- Mock Service Worker (MSW) for the API layer

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL. MSW intercepts all `/api/*` calls in dev, so the app is fully interactive out of the box — browse products, add to cart, check out, manage a vendor's products/orders, and view admin analytics.

```bash
npm run build   # type-check + production build
npm run preview # preview the production build
```

## Feature-Sliced Design layers

```
src/
  app/        # app-wide setup: providers (Redux, Router), routing, global styles
  pages/      # route-level compositions, grouped by area:
              #   pages/storefront/*  (home, product details, cart, checkout)
              #   pages/vendor/*      (dashboard, products, orders, analytics)
              #   pages/admin/*       (dashboard, vendors, analytics, users)
  widgets/    # composite, reusable blocks made of features/entities
              #   header, footer, sidebar-nav, product-grid,
              #   vendor-stats-panel, admin-analytics-panel
  features/   # user-facing actions (scaffolded, ready to fill in):
              #   auth, add-to-cart, product-search, product-filter,
              #   manage-product, manage-order, vendor-approval
  entities/   # business domain models + their API/state:
              #   product, vendor, order, cart, user, category
              #   each exposes `ui/`, `model/`, `api/` segments
  shared/     # reusable, business-agnostic code:
              #   api/ (RTK Query base + MSW mocks), ui/, lib/, config/, types/
```

Import rules (standard FSD): a layer may only import from layers below it —
`app > pages > widgets > features > entities > shared`. Cross-imports within
the same layer should go through another layer's public API (its `index.ts`),
not reach into internal files.

## Where things live today

- **Storefront**: `pages/storefront/*` — category browsing, product details, cart (Redux slice in `entities/cart`), checkout that creates a mock order.
- **Vendor dashboard**: `pages/vendor/*` — overview stats, product CRUD, order status updates, analytics chart. Currently hardcoded to `vendor-1` (Nova Electronics) as the signed-in vendor — swap in real auth when ready.
- **Admin panel**: `pages/admin/*` — platform-wide analytics, vendor approval/suspension, user list.
- **Mock API**: `shared/api/mocks/` — MSW handlers + seed data for products, vendors, orders, categories, users, and an analytics summary. In-memory, resets on page reload.

## Next steps to flesh out

- Wire real authentication (`features/auth` is scaffolded but empty) and replace the hardcoded `vendor-1` / `user-1` IDs with the logged-in user.
- Fill in the empty `features/*` slices (product-search, product-filter, manage-product, manage-order, vendor-approval) as the corresponding pages grow more complex than what pages currently do inline.
- Point `shared/api/base-api.ts`'s `baseUrl` at a real backend and remove the MSW bootstrap in `main.tsx` once one exists.
- Add tests (Vitest + React Testing Library recommended) and CI.
