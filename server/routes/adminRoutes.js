// server/routes/adminRoutes.js - routes for admin governance and analytics
const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { setVendorStatus, listVendors, listUsers, analytics } = require('../controllers/adminController');

router.use(authenticate, authorize('admin'));

router.get('/vendors', listVendors);
router.patch('/vendors/:id', setVendorStatus);
router.get('/users', listUsers);
router.get('/analytics', analytics);

module.exports = router;
