// server/server.js - Express application bootstrap
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Pre-register all Mongoose models upfront to avoid missing schema errors in population
require('./models/User');
require('./models/Vendor');
require('./models/Category');
require('./models/Product');
require('./models/Order');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json({ limit: '1mb' }));

// Root welcome endpoint for cloud deployment checks
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Multi-Vendor E-Commerce REST API',
    endpoints: {
      ping: '/api/ping',
      products: '/api/products',
      auth: '/api/auth'
    }
  });
});

app.get('/api/ping', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/vendor', require('./routes/vendorRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`[Server] API running on port ${PORT}`));
  });
}

module.exports = app;
