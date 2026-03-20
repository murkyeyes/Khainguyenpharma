const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/:handle', productController.getProductByHandle);
router.get('/:id/recommendations', productController.getProductRecommendations);

module.exports = router;
