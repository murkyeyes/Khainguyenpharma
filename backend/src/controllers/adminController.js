const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Helper: nhận UUID hoặc handle, luôn trả về UUID
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
async function resolveCollectionId(client, idOrHandle) {
  if (UUID_REGEX.test(idOrHandle)) return idOrHandle; // đã là UUID
  // lookup theo handle
  const r = await client.query('SELECT id FROM collections WHERE handle = $1', [idOrHandle]);
  if (r.rows.length === 0) return null;
  return r.rows[0].id;
}

// Create new product (Admin only)
exports.createProduct = async (req, res) => {
  const client = await pool.connect();
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

    // Check if handle already exists
    const existing = await client.query(
      'SELECT id FROM products WHERE handle = $1',
      [handle]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Handle đã tồn tại' });
    }

    // Start transaction
    await client.query('BEGIN');

    // Insert product
    const productResult = await client.query(
      `INSERT INTO products (
        handle, title, description, description_html, 
        available_for_sale, price_amount, price_currency
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [handle, title, description, descriptionHtml, availableForSale, priceAmount, priceCurrency]
    );

    const product = productResult.rows[0];

    // Insert product variant
    await client.query(
      `INSERT INTO product_variants (
        product_id, title, price_amount, price_currency, available_for_sale
      ) VALUES ($1, $2, $3, $4, $5)`,
      [product.id, 'Default', priceAmount, priceCurrency, availableForSale]
    );

    // Link to collections
    if (collectionIds.length > 0) {
      for (const idOrHandle of collectionIds) {
        const collectionUUID = await resolveCollectionId(client, idOrHandle);
        if (!collectionUUID) continue; // bỏ qua nếu không tìm thấy
        await client.query(
          'INSERT INTO product_collections (product_id, collection_id) VALUES ($1, $2)',
          [product.id, collectionUUID]
        );
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Tạo sản phẩm thành công',
      product
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Lỗi tạo sản phẩm' });
  } finally {
    client.release();
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
  const client = await pool.connect();
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
    const existing = await client.query('SELECT id FROM products WHERE id = $1', [id]);
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

    await client.query('BEGIN');

    // Update product
    if (updates.length > 1) { // More than just updated_at
      const updateQuery = `
        UPDATE products 
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;
      var result = await client.query(updateQuery, values);
    } else {
      var result = await client.query('SELECT * FROM products WHERE id = $1', [id]);
    }

    // Update collections if provided
    if (collectionIds !== undefined) {
      await client.query('DELETE FROM product_collections WHERE product_id = $1', [id]);
      for (const idOrHandle of collectionIds) {
        const collectionUUID = await resolveCollectionId(client, idOrHandle);
        if (!collectionUUID) continue;
        await client.query(
          'INSERT INTO product_collections (product_id, collection_id) VALUES ($1, $2)',
          [id, collectionUUID]
        );
      }
    }

    // Update variant price if price changed
    if (priceAmount !== undefined) {
      await client.query(
        'UPDATE product_variants SET price_amount = $1, price_currency = $2 WHERE product_id = $3',
        [priceAmount, priceCurrency || 'VND', id]
      );
    }

    await client.query('COMMIT');

    res.json({
      message: 'Cập nhật sản phẩm thành công',
      product: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Lỗi cập nhật sản phẩm' });
  } finally {
    client.release();
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    // Check if product exists
    const existing = await client.query('SELECT handle FROM products WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }

    const handle = existing.rows[0].handle;

    await client.query('BEGIN');

    // Delete related records (cascade should handle this, but being explicit)
    await client.query('DELETE FROM product_collections WHERE product_id = $1', [id]);
    await client.query('DELETE FROM product_images WHERE product_id = $1', [id]);
    await client.query('DELETE FROM product_variants WHERE product_id = $1', [id]);
    await client.query('DELETE FROM products WHERE id = $1', [id]);

    await client.query('COMMIT');

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
    await client.query('ROLLBACK');
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Lỗi xóa sản phẩm' });
  } finally {
    client.release();
  }
};
