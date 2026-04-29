const pool = require('../config/database');

// Public: lấy danh sách bài viết đã publish
exports.getAllBlogPosts = async (req, res) => {
  try {
    const { category } = req.query;

    let query = `SELECT * FROM blog_posts WHERE published = true`;
    const params = [];

    if (category && category !== 'all') {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);

    res.json({
      posts: result.rows.map(row => ({
        id: row.id,
        title: row.title,
        handle: row.handle,
        category: row.category,
        summary: row.summary,
        imageUrl: row.image_url,
        createdAt: row.created_at,
      }))
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách bài viết' });
  }
};

// Public: lấy chi tiết bài viết theo handle
exports.getBlogPostByHandle = async (req, res) => {
  try {
    const { handle } = req.params;

    const result = await pool.query(
      'SELECT * FROM blog_posts WHERE handle = $1 AND published = true',
      [handle]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy bài viết' });
    }

    const row = result.rows[0];
    res.json({
      post: {
        id: row.id,
        title: row.title,
        handle: row.handle,
        category: row.category,
        summary: row.summary,
        content: row.content,
        imageUrl: row.image_url,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    });
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ error: 'Lỗi lấy bài viết' });
  }
};
