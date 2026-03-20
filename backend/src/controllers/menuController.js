const pool = require('../config/database');

// Get menu by handle
exports.getMenuByHandle = async (req, res) => {
  try {
    const { handle } = req.params;

    const result = await pool.query(`
      SELECT * FROM menus
      WHERE handle = $1
      ORDER BY position ASC
    `, [handle]);

    const items = result.rows.map(row => ({
      title: row.title,
      path: row.path
    }));

    res.json({ menu: items });
  } catch (error) {
    console.error('Error getting menu:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
