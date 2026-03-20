const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Create new product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const {
      handle,
      title,
      description,
      descriptionHtml,
      availableForSale = true,
      priceAmount,
      priceCurrency = 'VND',
      collectionIds = []
    } = req.body;

    // Validate required fields
    if (!handle || !title || !priceAmount) {
      return res.status(400).json({ 
        error: 'Handle, title và giá là bắt buộc' 
      });
    }

    // Check if handle already exists
    const existing = await pool.query(
      'SELECT id FROM products WHERE handle = $1',
      [handle]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Handle đã tồn tại' });
    }

    // Start transaction
    await pool.query('BEGIN');

    // Insert product
    const productResult = await pool.query(
      `INSERT INTO products (
        handle, title, description, description_html, 
        available_for_sale, price_amount, price_currency
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [handle, title, description, descriptionHtml, availableForSale, priceAmount, priceCurrency]
    );

    const product = productResult.rows[0];

    // Insert product variant
    await pool.query(
      `INSERT INTO product_variants (
        product_id, title, price_amount, price_currency, available_for_sale
      ) VALUES ($1, $2, $3, $4, $5)`,
      [product.id, 'Default', priceAmount, priceCurrency, availableForSale]
    );

    // Link to collections
    if (collectionIds.length > 0) {
      for (const collectionId of collectionIds) {
        await pool.query(
          'INSERT INTO product_collections (product_id, collection_id) VALUES ($1, $2)',
          [product.id, collectionId]
        );
      }
    }

    await pool.query('COMMIT');

    res.status(201).json({
      message: 'Tạo sản phẩm thành công',
      product
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Lỗi tạo sản phẩm' });
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      handle,
      title,
      description,
      descriptionHtml,
      availableForSale,
      priceAmount,
      priceCurrency,
      collectionIds
    } = req.body;

    // Check if product exists
    const existing = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (handle !== undefined) {
      updates.push(`handle = $${paramCount++}`);
      values.push(handle);
    }
    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (descriptionHtml !== undefined) {
      updates.push(`description_html = $${paramCount++}`);
      values.push(descriptionHtml);
    }
    if (availableForSale !== undefined) {
      updates.push(`available_for_sale = $${paramCount++}`);
      values.push(availableForSale);
    }
    if (priceAmount !== undefined) {
      updates.push(`price_amount = $${paramCount++}`);
      values.push(priceAmount);
    }
    if (priceCurrency !== undefined) {
      updates.push(`price_currency = $${paramCount++}`);
      values.push(priceCurrency);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    await pool.query('BEGIN');

    // Update product
    if (updates.length > 1) { // More than just updated_at
      const updateQuery = `
        UPDATE products 
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;
      var result = await pool.query(updateQuery, values);
    } else {
      var result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    }

    // Update collections if provided
    if (collectionIds !== undefined) {
      await pool.query('DELETE FROM product_collections WHERE product_id = $1', [id]);
      for (const collectionId of collectionIds) {
        await pool.query(
          'INSERT INTO product_collections (product_id, collection_id) VALUES ($1, $2)',
          [id, collectionId]
        );
      }
    }

    // Update variant price if price changed
    if (priceAmount !== undefined) {
      await pool.query(
        'UPDATE product_variants SET price_amount = $1, price_currency = $2 WHERE product_id = $3',
        [priceAmount, priceCurrency || 'VND', id]
      );
    }

    await pool.query('COMMIT');

    res.json({
      message: 'Cập nhật sản phẩm thành công',
      product: result.rows[0]
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Lỗi cập nhật sản phẩm' });
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existing = await pool.query('SELECT handle FROM products WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }

    const handle = existing.rows[0].handle;

    await pool.query('BEGIN');

    // Delete related records (cascade should handle this, but being explicit)
    await pool.query('DELETE FROM product_collections WHERE product_id = $1', [id]);
    await pool.query('DELETE FROM product_images WHERE product_id = $1', [id]);
    await pool.query('DELETE FROM product_variants WHERE product_id = $1', [id]);
    await pool.query('DELETE FROM products WHERE id = $1', [id]);

    await pool.query('COMMIT');

    // Delete product images folder
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, '../../public/uploads/products', handle);
    if (fs.existsSync(uploadsDir)) {
      fs.rmSync(uploadsDir, { recursive: true, force: true });
    }

    res.json({ 
      message: 'Xóa sản phẩm thành công',
      deletedHandle: handle
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Lỗi xóa sản phẩm' });
  }
};
