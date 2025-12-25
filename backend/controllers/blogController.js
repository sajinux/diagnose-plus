const { query } = require('../config/database');

// Get all blog posts
exports.getAllPosts = async (req, res) => {
    try {
        const result = await query(
            'SELECT id, title, category, excerpt, image_emoji, author, created_at FROM blog_posts ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blog posts'
        });
    }
};

// Get single blog post by ID
exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query(
            'SELECT * FROM blog_posts WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blog post'
        });
    }
};
