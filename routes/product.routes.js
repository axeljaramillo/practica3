const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Admin only
router.post('/', auth, role(['admin']), productController.createProduct);
router.put('/:id', auth, role(['admin']), productController.updateProduct);
router.delete('/:id', auth, role(['admin']), productController.deleteProduct);

module.exports = router;
