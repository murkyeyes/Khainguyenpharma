const pool = require('../config/database');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

// Helper: tạo handle từ title
function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Admin: lấy tất cả bài viết (kể cả unpublished)
exports.getAllBlogPosts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');

    res.json({
      posts: result.rows.map(row => ({
        id: row.id,
        title: row.title,
        handle: row.handle,
        category: row.category,
        summary: row.summary,
        content: row.content,
        imageUrl: row.image_url,
        published: row.published,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }))
    });
  } catch (error) {
    console.error('Admin get blog posts error:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách bài viết' });
  }
};

// Admin: tạo bài viết mới
exports.createBlogPost = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, category, summary, content, published } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Tiêu đề là bắt buộc' });
      }

      let handle = slugify(title);
      // Đảm bảo handle unique
      const existing = await pool.query('SELECT id FROM blog_posts WHERE handle = $1', [handle]);
      if (existing.rows.length > 0) {
        handle = handle + '-' + Date.now();
      }

      let imageUrl = null;
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'khainguyen-pharma/blog', public_id: handle },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        imageUrl = result.secure_url;
      }

      const isPublished = published === undefined
        ? true
        : (published === 'true' || published === true);

      const insertResult = await pool.query(`
        INSERT INTO blog_posts (title, handle, category, summary, content, image_url, published)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [title, handle, category || 'Kiến Thức', summary || null, content || null, imageUrl, isPublished]);

      const row = insertResult.rows[0];
      res.status(201).json({
        message: 'Tạo bài viết thành công',
        post: {
          id: row.id,
          title: row.title,
          handle: row.handle,
          category: row.category,
          imageUrl: row.image_url,
          published: row.published,
          createdAt: row.created_at,
        }
      });
    } catch (error) {
      console.error('Create blog post error:', error);
      res.status(500).json({ error: 'Lỗi tạo bài viết' });
    }
  }
];

// Admin: cập nhật bài viết
exports.updateBlogPost = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, category, summary, content, published } = req.body;

      const existing = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Không tìm thấy bài viết' });
      }

      let imageUrl = existing.rows[0].image_url;
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'khainguyen-pharma/blog', public_id: existing.rows[0].handle },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        imageUrl = result.secure_url;
      }

      const updates = [];
      const values = [];
      let paramCount = 1;

      if (title !== undefined) { updates.push(`title = $${paramCount++}`); values.push(title); }
      if (category !== undefined) { updates.push(`category = $${paramCount++}`); values.push(category); }
      if (summary !== undefined) { updates.push(`summary = $${paramCount++}`); values.push(summary); }
      if (content !== undefined) { updates.push(`content = $${paramCount++}`); values.push(content); }
      if (published !== undefined) { updates.push(`published = $${paramCount++}`); values.push(published === 'true' || published === true); }
      if (imageUrl !== existing.rows[0].image_url) { updates.push(`image_url = $${paramCount++}`); values.push(imageUrl); }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      const result = await pool.query(
        `UPDATE blog_posts SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );

      const row = result.rows[0];
      res.json({
        message: 'Cập nhật bài viết thành công',
        post: {
          id: row.id,
          title: row.title,
          handle: row.handle,
          category: row.category,
          summary: row.summary,
          content: row.content,
          imageUrl: row.image_url,
          published: row.published,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }
      });
    } catch (error) {
      console.error('Update blog post error:', error);
      res.status(500).json({ error: 'Lỗi cập nhật bài viết' });
    }
  }
];

// Admin: xóa bài viết
exports.deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query('SELECT handle FROM blog_posts WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy bài viết' });
    }

    // Xóa ảnh trên Cloudinary (best effort)
    try {
      await cloudinary.uploader.destroy(`khainguyen-pharma/blog/${existing.rows[0].handle}`);
    } catch { /* ignore */ }

    await pool.query('DELETE FROM blog_posts WHERE id = $1', [id]);

    res.json({ message: 'Xóa bài viết thành công' });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({ error: 'Lỗi xóa bài viết' });
  }
};
