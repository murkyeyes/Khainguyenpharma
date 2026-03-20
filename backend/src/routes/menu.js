const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/:handle', menuController.getMenuByHandle);

module.exports = router;
