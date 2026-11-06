// server/models/Order.js - one customer order, items may span many vendors
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    name: { type: String, required: true }, // snapshot at time of purchase
    price: { type: Number, required: true }, // snapshot at time of purchase
    quantity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['placed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed'
    }
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [orderItemSchema], validate: (v) => v.length > 0 },
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'cod'],
      default: 'card'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed'
    },
    transactionId: { type: String },
    status: {
      type: String,
      enum: ['placed', 'partially_shipped', 'completed', 'cancelled'],
      default: 'placed'
    }
  },
  { timestamps: true }
);

orderSchema.index({ 'items.vendorId': 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
