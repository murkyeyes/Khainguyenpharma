const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.get('/', blogController.getAllBlogPosts);
router.get('/:handle', blogController.getBlogPostByHandle);

module.exports = router;
