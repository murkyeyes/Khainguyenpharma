const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/', cartController.createCart);
router.get('/:id', cartController.getCart);
router.post('/:id/items', cartController.addToCart);
router.put('/:id/items', cartController.updateCart);
router.delete('/:id/items/:lineId', cartController.removeFromCart);

module.exports = router;
