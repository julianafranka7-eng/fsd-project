// server/routes/vendorRoutes.js - every route requires a logged-in vendor
const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  createProduct,
  getVendorProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { vendorOrders, updateItemStatus } = require('../controllers/orderController');

router.use(authenticate, authorize('vendor'));

router.get('/products', getVendorProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/orders', vendorOrders);
router.patch('/orders/:orderId/items/:itemId/status', updateItemStatus);

module.exports = router;
