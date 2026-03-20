const pool = require('../config/database');

// Get all pages
exports.getAllPages = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM pages
      ORDER BY title ASC
    `);

    const pages = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      handle: row.handle,
      bodySummary: row.body_summary,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.json({ pages });
  } catch (error) {
    console.error('Error getting pages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single page by handle
exports.getPageByHandle = async (req, res) => {
  try {
    const { handle } = req.params;

    const result = await pool.query(`
      SELECT * FROM pages WHERE handle = $1
    `, [handle]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const row = result.rows[0];
    const page = {
      id: row.id,
      title: row.title,
      handle: row.handle,
      body: row.body,
      bodySummary: row.body_summary,
      seo: {
        title: row.seo_title || row.title,
        description: row.seo_description || row.body_summary
      },
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };

    res.json({ page });
  } catch (error) {
    console.error('Error getting page:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
