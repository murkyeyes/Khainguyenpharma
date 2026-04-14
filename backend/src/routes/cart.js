const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { addToCartSchema, updateCartSchema } = require('../validations/cart.schema');

// Route cho user đã đăng nhập (đặt trước /:id để tránh conflict)
router.get('/my', authenticate, cartController.getMyCart);
router.post('/my/items', authenticate, cartController.addToMyCart);
router.put('/my/items', authenticate, cartController.updateMyCart);
router.delete('/my/items/:lineId', authenticate, cartController.removeFromMyCart);

// Routes legacy (anonymous cart)
router.post('/', cartController.createCart);
router.get('/:id', cartController.getCart);
router.post('/:id/items', validate(addToCartSchema), cartController.addToCart);
router.put('/:id/items', validate(updateCartSchema), cartController.updateCart);
router.delete('/:id/items/:lineId', cartController.removeFromCart);

module.exports = router;
