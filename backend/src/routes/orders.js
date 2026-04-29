const express = require('express');
const router = express.Router();
const { authenticate, requireUser } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// Tất cả routes đều yêu cầu đăng nhập và là customer
router.use(authenticate, requireUser);

router.post('/', orderController.createOrder);
router.get('/my', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/cancel', orderController.cancelOrder);

module.exports = router;
