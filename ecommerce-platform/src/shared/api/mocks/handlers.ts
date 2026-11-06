import { http, HttpResponse } from 'msw';
import { API_BASE_URL } from '@/shared/config';
import type { Order, Product, User } from '@/shared/types';
import { analyticsSummary, categories, orders, products, users, vendors } from './data';

const url = (path: string) => `${API_BASE_URL}${path}`;

// In-memory copies so mutations (create/update/delete) persist for the session.
let productsDb: Product[] = [...products];
let ordersDb: Order[] = [...orders];
let usersDb: User[] = [
  ...users,
  { id: 'user-admin', name: 'Platform Admin', email: 'admin@marketplace.com', role: 'admin' },
  { id: 'user-vendor1', name: 'Nova Electronics', email: 'vendor@novaelectronics.com', role: 'vendor' },
  { id: 'user-vendor2', name: 'Urban Threads', email: 'vendor@urbanthreads.com', role: 'vendor' },
  { id: 'user-cust', name: 'J. Juliana Franka', email: 'juliana@student.edu', role: 'customer' },
];

export const handlers = [
  // --- Auth Handlers ---
  http.post(url('/auth/login'), async ({ request }) => {
    const { email } = (await request.json()) as { email: string; password?: string };
    const cleanEmail = (email || '').trim().toLowerCase();
    let user = usersDb.find((u) => u.email.toLowerCase() === cleanEmail);

    // If user typed any email and it doesn't exist, automatically allow login for seamless testing
    if (!user) {
      const isVendorEmail = cleanEmail.includes('vendor') || cleanEmail.includes('seller');
      const isAdminEmail = cleanEmail.includes('admin');
      const inferredRole: User['role'] = isAdminEmail ? 'admin' : isVendorEmail ? 'vendor' : 'customer';

      user = {
        id: `user-${usersDb.length + 1}-${Date.now()}`,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        role: inferredRole,
      };
      usersDb = [user, ...usersDb];
    }

    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    return HttpResponse.json({
      success: true,
      token,
      user,
    });
  }),

  http.post(url('/auth/register'), async ({ request }) => {
    const { name, email, role, storeName } = (await request.json()) as {
      name: string;
      email: string;
      role: User['role'];
      storeName?: string;
    };
    if (!name || !email) {
      return HttpResponse.json({ success: false, message: 'Name and email are required.' }, { status: 400 });
    }
    if (usersDb.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return HttpResponse.json({ success: false, message: 'A user with this email already exists.' }, { status: 409 });
    }

    const newUser: User = {
      id: `user-${usersDb.length + 1}-${Date.now()}`,
      name,
      email,
      role: role || 'customer',
    };
    usersDb = [newUser, ...usersDb];

    if (role === 'vendor') {
      vendors.push({
        id: `vendor-${vendors.length + 1}`,
        name: storeName || `${name}'s Store`,
        slug: (storeName || name).toLowerCase().replace(/\s+/g, '-'),
        status: 'pending',
        rating: 5.0,
        totalSales: 0,
        joinedAt: new Date().toISOString().slice(0, 10),
      });
    }

    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
    return HttpResponse.json(
      {
        success: true,
        token,
        user: newUser,
      },
      { status: 201 }
    );
  }),

  // --- Products ---
  http.get(url('/products'), ({ request }) => {
    const params = new URL(request.url).searchParams;
    const categoryId = params.get('categoryId');
    const vendorId = params.get('vendorId');
    const search = params.get('search')?.toLowerCase();

    let result = productsDb;
    if (categoryId) result = result.filter((p) => p.categoryId === categoryId);
    if (vendorId) result = result.filter((p) => p.vendorId === vendorId);
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search));

    return HttpResponse.json(result);
  }),

  http.get(url('/products/:id'), ({ params }) => {
    const product = productsDb.find((p) => p.id === params.id);
    if (!product) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(product);
  }),

  http.post(url('/products'), async ({ request }) => {
    const body = (await request.json()) as Partial<Product>;
    const newProduct: Product = {
      id: `prod-${productsDb.length + 1}-${Date.now()}`,
      vendorId: body.vendorId ?? 'vendor-1',
      categoryId: body.categoryId ?? 'cat-1',
      name: body.name ?? 'Untitled product',
      description: body.description ?? '',
      price: body.price ?? 0,
      stock: body.stock ?? 0,
      imageUrl: body.imageUrl ?? 'https://picsum.photos/seed/new/400/300',
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    productsDb = [newProduct, ...productsDb];
    return HttpResponse.json(newProduct, { status: 201 });
  }),

  http.patch(url('/products/:id'), async ({ params, request }) => {
    const changes = (await request.json()) as Partial<Product>;
    productsDb = productsDb.map((p) => (p.id === params.id ? { ...p, ...changes } : p));
    const updated = productsDb.find((p) => p.id === params.id);
    return HttpResponse.json(updated);
  }),

  http.delete(url('/products/:id'), ({ params }) => {
    productsDb = productsDb.filter((p) => p.id !== params.id);
    return HttpResponse.json({ id: params.id });
  }),

  // --- Vendors ---
  http.get(url('/vendors'), () => HttpResponse.json(vendors)),

  http.get(url('/vendors/:id'), ({ params }) => {
    const vendor = vendors.find((v) => v.id === params.id);
    if (!vendor) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(vendor);
  }),

  http.patch(url('/vendors/:id'), async ({ params, request }) => {
    const { status } = (await request.json()) as { status: string };
    const vendor = vendors.find((v) => v.id === params.id);
    if (vendor) vendor.status = status as typeof vendor.status;
    return HttpResponse.json(vendor);
  }),

  // --- Orders ---
  http.get(url('/orders'), ({ request }) => {
    const params = new URL(request.url).searchParams;
    const vendorId = params.get('vendorId');
    const customerId = params.get('customerId');

    let result = ordersDb;
    if (vendorId) result = result.filter((o) => o.items.some((i) => i.vendorId === vendorId));
    if (customerId) result = result.filter((o) => o.customerId === customerId);

    return HttpResponse.json(result);
  }),

  http.get(url('/orders/:id'), ({ params }) => {
    const order = ordersDb.find((o) => o.id === params.id);
    if (!order) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(order);
  }),

  http.post(url('/orders'), async ({ request }) => {
    const body = (await request.json()) as Partial<Order>;
    const newOrder: Order = {
      id: `order-${ordersDb.length + 1}-${Date.now()}`,
      customerId: body.customerId ?? 'user-1',
      items: body.items ?? [],
      total: body.total ?? 0,
      paymentMethod: body.paymentMethod ?? 'card',
      paymentStatus: body.paymentMethod === 'cod' ? 'pending' : 'completed',
      transactionId: body.transactionId ?? `TXN_${Date.now()}`,
      shippingAddress: body.shippingAddress ?? 'Default Delivery Address',
      status: 'pending',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    ordersDb = [newOrder, ...ordersDb];
    return HttpResponse.json(newOrder, { status: 201 });
  }),

  http.patch(url('/orders/:id'), async ({ params, request }) => {
    const { status } = (await request.json()) as { status: string };
    ordersDb = ordersDb.map((o) => (o.id === params.id ? { ...o, status: status as Order['status'] } : o));
    return HttpResponse.json(ordersDb.find((o) => o.id === params.id));
  }),

  // --- Metadata & Misc ---
  http.get(url('/categories'), () => HttpResponse.json(categories)),
  http.get(url('/users'), () => HttpResponse.json(usersDb)),
  http.get(url('/me'), () => HttpResponse.json(usersDb[0])),
  http.get(url('/analytics/summary'), () => HttpResponse.json(analyticsSummary)),
];
