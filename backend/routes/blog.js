const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// @route   GET /api/blog
// @desc    Get all blog posts
router.get('/', blogController.getAllPosts);

// @route   GET /api/blog/:id
// @desc    Get a single blog post by ID
router.get('/:id', blogController.getPostById);

module.exports = router;
