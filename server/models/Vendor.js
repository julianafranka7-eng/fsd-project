// server/models/Vendor.js - store profile linked 1:1 to a vendor user
const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    storeName: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'suspended'], default: 'pending' },
    rating: { type: Number, min: 0, max: 5, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);
