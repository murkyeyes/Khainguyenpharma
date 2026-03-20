const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

router.get('/', pageController.getAllPages);
router.get('/:handle', pageController.getPageByHandle);

module.exports = router;
