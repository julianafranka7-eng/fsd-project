// server/controllers/productController.js - storefront and vendor catalogue
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const Category = require('../models/Category');

// GET /api/products?search=&category=&page=1&limit=12 (public)
const listProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 12, 50);

    // Only products from approved vendors are visible in the storefront
    const approved = await Vendor.find({ status: 'approved' }).distinct('_id');
    const filter = { isActive: true, vendorId: { $in: approved } };

    if (category) filter.categoryId = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const [items, total] = await Promise.all([
      Product.find(filter)
        .populate('vendorId', 'storeName rating status')
        .populate('categoryId', 'name slug')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter)
    ]);

    res.json({ success: true, items, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id (public)
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendorId', 'storeName rating description status')
      .populate('categoryId', 'name slug');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// Helper: find the Vendor document for the logged-in vendor user
const currentVendor = async (userId) => {
  const vendor = await Vendor.findOne({ userId });
  if (!vendor || vendor.status !== 'approved') {
    const err = new Error('Your store is not approved yet.');
    err.statusCode = 403;
    throw err;
  }
  return vendor;
};

// POST /api/vendor/products (vendor)
const createProduct = async (req, res, next) => {
  try {
    const vendor = await currentVendor(req.user.id);
    const product = await Product.create({ ...req.body, vendorId: vendor._id });
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// GET /api/vendor/products (vendor - own products)
const getVendorProducts = async (req, res, next) => {
  try {
    const vendor = await currentVendor(req.user.id);
    const products = await Product.find({ vendorId: vendor._id })
      .populate('categoryId', 'name slug')
      .sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// PUT /api/vendor/products/:id (vendor - own products only)
const updateProduct = async (req, res, next) => {
  try {
    const vendor = await currentVendor(req.user.id);
    const { vendorId, ...changes } = req.body; // vendorId can never be changed
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, vendorId: vendor._id },
      changes,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/vendor/products/:id (vendor - own products only)
const deleteProduct = async (req, res, next) => {
  try {
    const vendor = await currentVendor(req.user.id);
    const result = await Product.findOneAndDelete({ _id: req.params.id, vendorId: vendor._id });
    if (!result) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product removed.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  getVendorProducts,
  updateProduct,
  deleteProduct,
  currentVendor
};

