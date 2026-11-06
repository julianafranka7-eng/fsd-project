export const APP_NAME = 'Multi-Vendor Marketplace';

export const API_BASE_URL = '/api';

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  product: (id: string) => `/product/${id}`,
  cart: '/cart',
  checkout: '/checkout',
  myOrders: '/orders',
  vendor: {
    dashboard: '/vendor',
    products: '/vendor/products',
    orders: '/vendor/orders',
    analytics: '/vendor/analytics',
  },
  admin: {
    dashboard: '/admin',
    orders: '/admin/orders',
    vendors: '/admin/vendors',
    analytics: '/admin/analytics',
    users: '/admin/users',
  },
} as const;
