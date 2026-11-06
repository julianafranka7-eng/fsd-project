import type { AnalyticsSummary, Category, Order, Product, User, Vendor } from '@/shared/types';

export const categories: Category[] = [
  { id: 'cat-1', name: 'Electronics', slug: 'electronics' },
  { id: 'cat-2', name: 'Home & Kitchen', slug: 'home-kitchen' },
  { id: 'cat-3', name: 'Fashion', slug: 'fashion' },
  { id: 'cat-4', name: 'Sports & Outdoors', slug: 'sports-outdoors' },
];

export const vendors: Vendor[] = [
  {
    id: 'vendor-1',
    name: 'Nova Electronics',
    slug: 'nova-electronics',
    status: 'approved',
    rating: 4.6,
    totalSales: 128000,
    joinedAt: '2024-02-10',
    logoUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=nova',
  },
  {
    id: 'vendor-2',
    name: 'Urban Home Co.',
    slug: 'urban-home-co',
    status: 'approved',
    rating: 4.3,
    totalSales: 76500,
    joinedAt: '2024-05-22',
    logoUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=urbanhome',
  },
  {
    id: 'vendor-3',
    name: 'Trailblaze Gear',
    slug: 'trailblaze-gear',
    status: 'pending',
    rating: 4.1,
    totalSales: 12300,
    joinedAt: '2025-08-01',
    logoUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=trailblaze',
  },
];

export const products: Product[] = [
  {
    id: 'prod-1',
    vendorId: 'vendor-1',
    categoryId: 'cat-1',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Over-ear headphones with active noise cancellation and 30h battery life.',
    price: 129.99,
    compareAtPrice: 159.99,
    stock: 42,
    imageUrl: 'https://picsum.photos/seed/headphones/400/300',
    rating: 4.5,
    reviewCount: 312,
    createdAt: '2025-01-15',
  },
  {
    id: 'prod-2',
    vendorId: 'vendor-1',
    categoryId: 'cat-1',
    name: 'Smart Fitness Watch',
    description: 'Tracks heart rate, sleep, and workouts with a 7-day battery.',
    price: 89.5,
    stock: 75,
    imageUrl: 'https://picsum.photos/seed/watch/400/300',
    rating: 4.2,
    reviewCount: 198,
    createdAt: '2025-02-20',
  },
  {
    id: 'prod-3',
    vendorId: 'vendor-2',
    categoryId: 'cat-2',
    name: 'Ceramic Non-Stick Cookware Set',
    description: '10-piece cookware set, PFOA-free ceramic coating.',
    price: 149.0,
    compareAtPrice: 199.0,
    stock: 20,
    imageUrl: 'https://picsum.photos/seed/cookware/400/300',
    rating: 4.7,
    reviewCount: 84,
    createdAt: '2025-03-05',
  },
  {
    id: 'prod-4',
    vendorId: 'vendor-2',
    categoryId: 'cat-2',
    name: 'Minimalist Desk Lamp',
    description: 'Dimmable LED desk lamp with USB-C charging port.',
    price: 34.99,
    stock: 150,
    imageUrl: 'https://picsum.photos/seed/lamp/400/300',
    rating: 4.0,
    reviewCount: 56,
    createdAt: '2025-04-11',
  },
  {
    id: 'prod-5',
    vendorId: 'vendor-3',
    categoryId: 'cat-4',
    name: 'Trail Running Backpack 20L',
    description: 'Lightweight hydration-compatible backpack for trail runs.',
    price: 64.0,
    stock: 30,
    imageUrl: 'https://picsum.photos/seed/backpack/400/300',
    rating: 4.4,
    reviewCount: 27,
    createdAt: '2025-06-18',
  },
  {
    id: 'prod-6',
    vendorId: 'vendor-3',
    categoryId: 'cat-4',
    name: 'All-Terrain Yoga Mat',
    description: 'Extra-thick non-slip mat for indoor and outdoor use.',
    price: 28.5,
    stock: 90,
    imageUrl: 'https://picsum.photos/seed/yogamat/400/300',
    rating: 4.6,
    reviewCount: 63,
    createdAt: '2025-07-02',
  },
];

export const users: User[] = [
  { id: 'user-1', name: 'Joseph Inbaraj', email: 'awsjoseph1977@outlook.com', role: 'customer' },
  { id: 'user-2', name: 'Ava Kumar', email: 'ava@novaelectronics.com', role: 'vendor' },
  { id: 'user-3', name: 'Site Admin', email: 'admin@marketplace.dev', role: 'admin' },
];

export const orders: Order[] = [
  {
    id: 'order-1',
    customerId: 'user-1',
    items: [
      { productId: 'prod-1', productName: 'Wireless Noise-Cancelling Headphones', vendorId: 'vendor-1', quantity: 1, price: 129.99 },
      { productId: 'prod-4', productName: 'Minimalist Desk Lamp', vendorId: 'vendor-2', quantity: 2, price: 34.99 },
    ],
    total: 199.97,
    status: 'shipped',
    createdAt: '2026-08-20',
  },
  {
    id: 'order-2',
    customerId: 'user-1',
    items: [{ productId: 'prod-5', productName: 'Trail Running Backpack 20L', vendorId: 'vendor-3', quantity: 1, price: 64.0 }],
    total: 64.0,
    status: 'pending',
    createdAt: '2026-09-05',
  },
];

export const analyticsSummary: AnalyticsSummary = {
  totalRevenue: 216800,
  totalOrders: 1420,
  totalCustomers: 980,
  totalVendors: vendors.length,
  revenueByDay: Array.from({ length: 14 }).map((_, i) => ({
    date: new Date(2026, 7, 27 + i).toISOString().slice(0, 10),
    revenue: Math.round(4000 + Math.random() * 3000),
  })),
  topProducts: [
    { productId: 'prod-1', productName: 'Wireless Noise-Cancelling Headphones', unitsSold: 512 },
    { productId: 'prod-3', productName: 'Ceramic Non-Stick Cookware Set', unitsSold: 340 },
    { productId: 'prod-2', productName: 'Smart Fitness Watch', unitsSold: 298 },
  ],
  topVendors: [
    { vendorId: 'vendor-1', vendorName: 'Nova Electronics', revenue: 128000 },
    { vendorId: 'vendor-2', vendorName: 'Urban Home Co.', revenue: 76500 },
    { vendorId: 'vendor-3', vendorName: 'Trailblaze Gear', revenue: 12300 },
  ],
};
