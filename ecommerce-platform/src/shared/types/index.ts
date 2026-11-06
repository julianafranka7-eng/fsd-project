export type Role = 'customer' | 'vendor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  status: 'pending' | 'approved' | 'suspended';
  rating: number;
  totalSales: number;
  joinedAt: string;
}

export interface Product {
  id: string;
  vendorId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  vendorId: string;
  quantity: number;
  price: number;
}

export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'cod';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  transactionId?: string;
  shippingAddress?: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalVendors: number;
  revenueByDay: { date: string; revenue: number }[];
  topProducts: { productId: string; productName: string; unitsSold: number }[];
  topVendors: { vendorId: string; vendorName: string; revenue: number }[];
}
