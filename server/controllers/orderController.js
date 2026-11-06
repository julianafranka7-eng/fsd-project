// server/controllers/orderController.js - checkout and per-vendor fulfilment
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { currentVendor } = require('./productController');

// POST /api/orders (customer) body: { items: [{ productId, quantity }], shippingAddress }
const placeOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    let createdOrder;
    await session.withTransaction(async () => {
      const { items = [], shippingAddress, paymentMethod = 'card', transactionId } = req.body;
      if (!items.length) {
        const err = new Error('Cart is empty.');
        err.statusCode = 400;
        throw err;
      }
      if (!shippingAddress) {
        const err = new Error('Shipping address is required.');
        err.statusCode = 400;
        throw err;
      }

      const lines = [];
      let total = 0;

      for (const item of items) {
        const pId = item.productId || item._id || item.id;
        const qty = item.quantity || 1;

        // Decrease stock only if enough is available (atomic check-and-update)
        const product = await Product.findOneAndUpdate(
          { _id: pId, isActive: true, stock: { $gte: qty } },
          { $inc: { stock: -qty } },
          { new: true, session }
        );

        if (!product) {
          const err = new Error(`Item ${item.name || pId} is out of stock.`);
          err.statusCode = 409;
          throw err;
        }

        lines.push({
          productId: product._id,
          vendorId: product.vendorId, // lets each vendor see only its own lines
          name: product.name,
          price: product.price,
          quantity: qty,
          status: 'placed'
        });

        total += product.price * qty;
      }

      const [order] = await Order.create(
        [{
          customerId: req.user.id,
          items: lines,
          totalAmount: total,
          shippingAddress,
          paymentMethod,
          paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
          transactionId: transactionId || `TXN_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
          status: 'placed'
        }],
        { session }
      );
      createdOrder = order;
    });

    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

// GET /api/orders/mine (customer)
const myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// GET /api/vendor/orders (vendor) - only the lines that belong to this vendor
const vendorOrders = async (req, res, next) => {
  try {
    const vendor = await currentVendor(req.user.id);
    const orders = await Order.aggregate([
      { $match: { 'items.vendorId': vendor._id } },
      { $unwind: '$items' },
      { $match: { 'items.vendorId': vendor._id } },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          orderId: '$_id',
          createdAt: 1,
          shippingAddress: 1,
          itemId: '$items._id',
          productId: '$items.productId',
          name: '$items.name',
          quantity: '$items.quantity',
          price: '$items.price',
          status: '$items.status'
        }
      }
    ]);
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/vendor/orders/:orderId/items/:itemId/status (vendor)
const updateItemStatus = async (req, res, next) => {
  try {
    const vendor = await currentVendor(req.user.id);
    const { status } = req.body;
    if (!['shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const order = await Order.findOneAndUpdate(
      {
        _id: req.params.orderId,
        items: { $elemMatch: { _id: req.params.itemId, vendorId: vendor._id } }
      },
      { $set: { 'items.$.status': status } },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order item not found.' });
    }

    // Roll the overall order status up from its item statuses
    const states = order.items.map((i) => i.status);
    if (states.every((s) => s === 'delivered' || s === 'cancelled')) {
      order.status = 'completed';
    } else if (states.some((s) => s === 'shipped' || s === 'delivered')) {
      order.status = 'partially_shipped';
    }
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

module.exports = { placeOrder, myOrders, vendorOrders, updateItemStatus };
