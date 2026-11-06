// server/controllers/authController.js - registration and login
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, storeName } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({ success: false, message: 'Name, email and an 8+ character password are required.' });
    }
    // Admin accounts cannot be self-registered
    const safeRole = role === 'vendor' ? 'vendor' : 'customer';
    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name, email, passwordHash, role: safeRole });

    // A new vendor gets a store profile that waits for admin approval
    if (safeRole === 'vendor') {
      await Vendor.create({ userId: user._id, storeName: storeName || `${name}'s Store` });
    }

    res.status(201).json({ success: true, token: signToken(user), user });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user || !(await user.comparePassword(password || ''))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.role === 'vendor') {
      const vendor = await Vendor.findOne({ userId: user._id });
      if (vendor && vendor.status === 'suspended') {
        return res.status(403).json({ success: false, message: 'Your store has been suspended by the administrator.' });
      }
    }

    res.json({ success: true, token: signToken(user), user });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    let vendor = null;
    if (user.role === 'vendor') {
      vendor = await Vendor.findOne({ userId: user._id });
    }
    res.json({ success: true, user, vendor });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
