const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');

router.get('/', collectionController.getAllCollections);
router.get('/:handle', collectionController.getCollectionByHandle);
router.get('/:handle/products', collectionController.getCollectionProducts);

module.exports = router;
