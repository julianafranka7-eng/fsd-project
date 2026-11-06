# Multi-Vendor E-Commerce Platform with Analytics

**Project Report Implementation**  
Submitted by: **J. Juliana Franka (310624148043)**  
Department of Computer Science and Engineering (AIML), Easwari Engineering College

---

## 📁 Repository & Directory Layout

```text
juliefsd/
├── MultiVendor_Ecommerce_Project_Report.pdf  # Project Report Document
├── ecommerce-platform/                       # React 19 + TypeScript + Vite + FSD Architecture
│   ├── src/
│   │   ├── app/                              # Redux store, AppRouter, providers, CSS
│   │   ├── pages/                            # Storefront, Vendor, Admin, Auth pages
│   │   ├── widgets/                          # Header, Footer, Sidebar, Analytics panel
│   │   ├── features/                         # Auth, Cart, Product & Order controls
│   │   ├── entities/                         # Product, Vendor, Order, Cart, User, Category
│   │   └── shared/                           # Base API, MSW mocks, config, UI components
│   ├── package.json
│   └── vite.config.ts
└── server/                                   # Node.js + Express.js + MongoDB REST API
    ├── config/
    │   └── db.js                             # MongoDB connection
    ├── models/
    │   ├── User.js                           # User schema with bcrypt & role-based validation
    │   ├── Vendor.js                         # Vendor store profile linked 1:1
    │   ├── Category.js                       # Product categories
    │   ├── Product.js                        # Product schema with full-text search index
    │   └── Order.js                          # Multi-vendor order schema with snapshot & vendorId
    ├── middleware/
    │   ├── auth.js                           # JWT authenticate & authorize(role)
    │   └── errorHandler.js                   # Centralized error handler
    ├── controllers/
    │   ├── authController.js                 # Register & Login with JWT signing
    │   ├── productController.js              # Storefront listing & Vendor product CRUD
    │   ├── orderController.js                # Atomic transaction checkout & vendor order status
    │   └── adminController.js                # Vendor approval & MongoDB analytics pipelines
    ├── routes/
    │   ├── authRoutes.js
    │   ├── productRoutes.js
    │   ├── orderRoutes.js
    │   ├── vendorRoutes.js
    │   └── adminRoutes.js
    ├── server.js                             # Express application bootstrap
    ├── seed.js                               # Database seeder with sample data
    ├── .env                                  # Environment variables
    └── package.json
```

---

## 🚀 Quick Start Guide

### 1. Backend Server (`juliefsd/server`)

```bash
cd juliefsd/server
npm install
# To seed demo users, vendors, products, and orders:
node seed.js
# To start the Express REST API (port 5000):
npm run dev
```

### 2. Frontend Client (`juliefsd/ecommerce-platform`)

```bash
cd juliefsd/ecommerce-platform
npm install
npm run dev
```

- In development mode, the client includes **MSW (Mock Service Worker)** for standalone execution with seed data.
- To connect to the live backend server, point `API_BASE_URL` in `src/shared/config/index.ts` to `http://localhost:5000/api`.

---

## 🔑 Default Seed Accounts

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@marketplace.com` | `Admin@12345` | Platform admin dashboard, vendor approval, analytics |
| **Vendor 1** | `vendor@novaelectronics.com` | `Vendor@12345` | Nova Electronics store management & orders |
| **Vendor 2** | `vendor@urbanthreads.com` | `Vendor@12345` | Urban Threads apparel & stock management |
| **Customer** | `juliana@student.edu` | `Customer@12345` | Multi-vendor browsing, single cart & checkout |
