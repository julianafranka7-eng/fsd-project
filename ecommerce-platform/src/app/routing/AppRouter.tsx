import { Routes, Route } from 'react-router-dom';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { HomePage } from '@/pages/storefront/home/HomePage';
import { ProductDetailsPage } from '@/pages/storefront/product-details/ProductDetailsPage';
import { CartPage } from '@/pages/storefront/cart/CartPage';
import { CheckoutPage } from '@/pages/storefront/checkout/CheckoutPage';
import { LoginPage, RegisterPage } from '@/pages/auth';
import { ProtectedRoute } from './ProtectedRoute';
import { VendorLayout } from '@/pages/vendor/dashboard/VendorLayout';
import { VendorOverviewPage } from '@/pages/vendor/dashboard/VendorOverviewPage';
import { VendorProductsPage } from '@/pages/vendor/products/VendorProductsPage';
import { VendorOrdersPage } from '@/pages/vendor/orders/VendorOrdersPage';
import { VendorAnalyticsPage } from '@/pages/vendor/analytics/VendorAnalyticsPage';
import { AdminLayout } from '@/pages/admin/dashboard/AdminLayout';
import { AdminOverviewPage } from '@/pages/admin/dashboard/AdminOverviewPage';
import { AdminVendorsPage } from '@/pages/admin/vendors/AdminVendorsPage';
import { AdminAnalyticsPage } from '@/pages/admin/analytics/AdminAnalyticsPage';
import { AdminOrdersPage } from '@/pages/admin/orders/AdminOrdersPage';
import { AdminUsersPage } from '@/pages/admin/users/AdminUsersPage';

import { OrderTrackingPage } from '@/pages/storefront/orders/OrderTrackingPage';

export function AppRouter() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex-1">
        <Routes>
          {/* Public & Customer Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderTrackingPage />} />

          {/* Vendor Protected Routes (Accessible ONLY by vendors and admins) */}
          <Route element={<ProtectedRoute allowedRoles={['vendor', 'admin']} />}>
            <Route path="/vendor" element={<VendorLayout />}>
              <Route index element={<VendorOverviewPage />} />
              <Route path="products" element={<VendorProductsPage />} />
              <Route path="orders" element={<VendorOrdersPage />} />
              <Route path="analytics" element={<VendorAnalyticsPage />} />
            </Route>
          </Route>

          {/* Admin Protected Routes (Accessible ONLY by platform admins) */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverviewPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="vendors" element={<AdminVendorsPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
            </Route>
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
