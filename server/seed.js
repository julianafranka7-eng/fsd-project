// server/seed.js - initial seed data for database demonstration
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/multivendor';
  console.log('Connecting to', uri);
  await mongoose.connect(uri);

  console.log('Clearing old collections...');
  await Promise.all([
    User.deleteMany({}),
    Vendor.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({})
  ]);

  console.log('Creating users...');
  const adminPass = await User.hashPassword('Admin@12345');
  const vendorPass = await User.hashPassword('Vendor@12345');
  const custPass = await User.hashPassword('Customer@12345');

  const admin = await User.create({
    name: 'Platform Admin',
    email: 'admin@marketplace.com',
    passwordHash: adminPass,
    role: 'admin'
  });

  const vendorUser1 = await User.create({
    name: 'Nova Electronics',
    email: 'vendor@novaelectronics.com',
    passwordHash: vendorPass,
    role: 'vendor'
  });

  const vendorUser2 = await User.create({
    name: 'Urban Threads',
    email: 'vendor@urbanthreads.com',
    passwordHash: vendorPass,
    role: 'vendor'
  });

  const customerUser = await User.create({
    name: 'J. Juliana Franka',
    email: 'juliana@student.edu',
    passwordHash: custPass,
    role: 'customer'
  });

  console.log('Creating vendor profiles...');
  const vendor1 = await Vendor.create({
    userId: vendorUser1._id,
    storeName: 'Nova Electronics Store',
    description: 'Premium electronics, wearables, and computing devices.',
    status: 'approved',
    rating: 4.8
  });

  const vendor2 = await Vendor.create({
    userId: vendorUser2._id,
    storeName: 'Urban Threads Studio',
    description: 'Contemporary apparel, ethnic wear, and modern textiles.',
    status: 'approved',
    rating: 4.6
  });

  console.log('Creating categories...');
  const catElectronics = await Category.create({
    name: 'Electronics',
    slug: 'electronics',
    description: 'Gadgets, audio gear, and personal electronics.'
  });

  const catFashion = await Category.create({
    name: 'Fashion & Apparel',
    slug: 'fashion',
    description: 'Clothing, kurtas, jackets and accessories.'
  });

  console.log('Creating products...');
  const p1 = await Product.create({
    vendorId: vendor1._id,
    categoryId: catElectronics._id,
    name: 'Wireless Noise Cancelling Earbuds Pro',
    description: 'Active noise cancellation with 32h playback and IPX5 resistance.',
    price: 1999,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop'],
    isActive: true
  });

  const p2 = await Product.create({
    vendorId: vendor1._id,
    categoryId: catElectronics._id,
    name: 'Ultra HD Smart Display 4K',
    description: 'Crystal clear IPS panel with HDR10+ and ambient backlight.',
    price: 14499,
    stock: 10,
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop'],
    isActive: true
  });

  const p3 = await Product.create({
    vendorId: vendor2._id,
    categoryId: catFashion._id,
    name: 'Handcrafted Cotton Kurta',
    description: 'Pure breathable cotton woven by traditional artisans in Chennai.',
    price: 799,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop'],
    isActive: true
  });

  const p4 = await Product.create({
    vendorId: vendor2._id,
    categoryId: catFashion._id,
    name: 'Classic Linen Summer Shirt',
    description: 'Relaxed fit breezy summer shirt suitable for casual wear.',
    price: 1199,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop'],
    isActive: true
  });

  console.log('Creating sample orders...');
  await Order.create({
    customerId: customerUser._id,
    items: [
      {
        productId: p1._id,
        vendorId: vendor1._id,
        name: p1.name,
        price: p1.price,
        quantity: 1,
        status: 'delivered'
      },
      {
        productId: p3._id,
        vendorId: vendor2._id,
        name: p3.name,
        price: p3.price,
        quantity: 2,
        status: 'shipped'
      }
    ],
    totalAmount: 1999 + 799 * 2,
    shippingAddress: '12, Anna Salai, Easwari Enclave, Ramapuram, Chennai - 600089',
    status: 'partially_shipped'
  });

  console.log('Seed completed successfully!');
  console.log('Accounts:');
  console.log('  Admin: admin@marketplace.com / Admin@12345');
  console.log('  Vendor 1: vendor@novaelectronics.com / Vendor@12345');
  console.log('  Vendor 2: vendor@urbanthreads.com / Vendor@12345');
  console.log('  Customer: juliana@student.edu / Customer@12345');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
