// server/routes/orderRoutes.js
const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { placeOrder, myOrders } = require('../controllers/orderController');

router.use(authenticate);

router.post('/', authorize('customer'), placeOrder);
router.get('/mine', authorize('customer'), myOrders);

module.exports = router;
