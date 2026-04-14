const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminOrderController = require('../controllers/adminOrderController');
const uploadController = require('../controllers/uploadController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createProductSchema, updateProductSchema } = require('../validations/admin.schema');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Product management
router.post('/products', validate(createProductSchema), adminController.createProduct);
router.put('/products/:id', validate(updateProductSchema), adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Image upload
router.post('/products/:handle/images', uploadController.uploadProductImage);
router.delete('/products/:handle/images/:filename', uploadController.deleteProductImage);
router.get('/products/:handle/images', uploadController.getProductImages);

// Order management
router.get('/orders/stats', adminOrderController.getOrderStats);
router.get('/orders', adminOrderController.getAllOrders);
router.get('/orders/:id', adminOrderController.getOrderDetail);
router.put('/orders/:id/status', adminOrderController.updateOrderStatus);

module.exports = router;
