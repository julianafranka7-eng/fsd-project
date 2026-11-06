// server/routes/productRoutes.js
const router = require('express').Router();
const { listProducts, getProductById } = require('../controllers/productController');

router.get('/', listProducts);
router.get('/:id', getProductById);

module.exports = router;
