const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const validate = require('../middleware/validate');
const { addToCartSchema, updateCartSchema } = require('../validations/cart.schema');

router.post('/', cartController.createCart);
router.get('/:id', cartController.getCart);
router.post('/:id/items', validate(addToCartSchema), cartController.addToCart);
router.put('/:id/items', validate(updateCartSchema), cartController.updateCart);
router.delete('/:id/items/:lineId', cartController.removeFromCart);

module.exports = router;
