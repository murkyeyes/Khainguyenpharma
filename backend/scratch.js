const { Pool } = require('pg');
const pool = new Pool({
  host: 'aws-1-ap-south-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.cidavntqosyjevcigiui',
  password: 'Bleach2005@123',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const handle = 'amvitacine-300';
    const prodRes = await pool.query('SELECT id FROM products WHERE handle = $1', [handle]);
    const id = prodRes.rows[0].id;

    // Simulate updateProduct variables
    const description = "Thuốc kháng sinh điều trị nhiễm khuẩn liều cao\nđây là mô tả dùng để test";
    const descriptionHtml = "<p>Thuốc kháng sinh điều trị nhiễm khuẩn liều cao</p>";
    const title = "AMVITACINE 300";
    const availableForSale = true;
    const priceAmount = 165000;
    const priceCurrency = "VND";
    const collectionIds = [];

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

    if (updates.length > 1) { 
      const updateQuery = `
        UPDATE products 
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;
      console.log('QUERY:', updateQuery);
      var result = await pool.query(updateQuery, values);
    } 

    if (collectionIds !== undefined) {
      await pool.query('DELETE FROM product_collections WHERE product_id = $1', [id]);
    }

    if (priceAmount !== undefined) {
      await pool.query(
        'UPDATE product_variants SET price_amount = $1, price_currency = $2 WHERE product_id = $3',
        [priceAmount, priceCurrency || 'VND', id]
      );
    }

    await pool.query('COMMIT');
    console.log("Success", result.rows[0]);
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("ERROR:", err);
  }
  process.exit(0);
}
run();
