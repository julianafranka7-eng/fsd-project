// server/controllers/adminController.js - vendor governance and analytics
const Vendor = require('../models/Vendor');
const Order = require('../models/Order');
const User = require('../models/User');

// PATCH /api/admin/vendors/:id body: { status: 'approved' | 'suspended' }
const setVendorStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'suspended', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('userId', 'name email');
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found.' });
    res.json({ success: true, vendor });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/vendors
const listVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find().populate('userId', 'name email role').sort({ createdAt: -1 });
    res.json({ success: true, vendors });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/analytics - revenue by month, top products and top vendors
const analytics = async (req, res, next) => {
  try {
    const delivered = { 'items.status': { $ne: 'cancelled' } };

    const [revenueByMonth, topProducts, topVendors] = await Promise.all([
      Order.aggregate([
        { $unwind: '$items' },
        { $match: delivered },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
            orders: { $addToSet: '$_id' }
          }
        },
        { $project: { month: '$_id', revenue: 1, orders: { $size: '$orders' }, _id: 0 } },
        { $sort: { month: 1 } }
      ]),
      Order.aggregate([
        { $unwind: '$items' },
        { $match: delivered },
        { $group: { _id: '$items.productId', name: { $first: '$items.name' }, unitsSold: { $sum: '$items.quantity' } } },
        { $sort: { unitsSold: -1 } },
        { $limit: 5 }
      ]),
      Order.aggregate([
        { $unwind: '$items' },
        { $match: delivered },
        { $group: { _id: '$items.vendorId', revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'vendors', localField: '_id', foreignField: '_id', as: 'vendor' } },
        { $project: { revenue: 1, storeName: { $arrayElemAt: ['$vendor.storeName', 0] } } }
      ])
    ]);

    res.json({ success: true, revenueByMonth, topProducts, topVendors });
  } catch (error) {
    next(error);
  }
};

module.exports = { setVendorStatus, listVendors, listUsers, analytics };
