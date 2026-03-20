const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

async function exportDatabase() {
  try {
    console.log('📦 Exporting database...');

    let sqlContent = `-- Khải Nguyên Pharma Database Backup
-- Generated: ${new Date().toISOString()}
-- PostgreSQL Database Dump

-- Disable triggers and constraints temporarily
SET session_replication_role = 'replica';

-- Clear existing data
DELETE FROM product_collections;
DELETE FROM product_variant_options;
DELETE FROM product_variants;
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM collections;
DELETE FROM pages;

`;

    // Export Collections
    console.log('📁 Exporting collections...');
    const collections = await pool.query('SELECT * FROM collections ORDER BY created_at');
    sqlContent += '\n-- Collections\n';
    for (const col of collections.rows) {
      sqlContent += `INSERT INTO collections (id, handle, title, description, seo_title, seo_description, created_at, updated_at) VALUES ('${col.id}', '${col.handle}', '${col.title}', '${col.description}', ${col.seo_title ? `'${col.seo_title}'` : 'NULL'}, ${col.seo_description ? `'${col.seo_description}'` : 'NULL'}, '${col.created_at.toISOString()}', '${col.updated_at.toISOString()}');\n`;
    }

    // Export Products
    console.log('📦 Exporting products...');
    const products = await pool.query('SELECT * FROM products ORDER BY created_at');
    sqlContent += '\n-- Products\n';
    for (const prod of products.rows) {
      const description = prod.description ? prod.description.replace(/'/g, "''") : '';
      sqlContent += `INSERT INTO products (id, handle, title, description, price_amount, price_currency, available_for_sale, featured_image_url, featured_image_alt, seo_title, seo_description, created_at, updated_at) VALUES ('${prod.id}', '${prod.handle}', '${prod.title.replace(/'/g, "''")}', '${description}', ${prod.price_amount}, '${prod.price_currency}', ${prod.available_for_sale}, '${prod.featured_image_url}', ${prod.featured_image_alt ? `'${prod.featured_image_alt}'` : 'NULL'}, ${prod.seo_title ? `'${prod.seo_title.replace(/'/g, "''")}'` : 'NULL'}, ${prod.seo_description ? `'${prod.seo_description.replace(/'/g, "''")}'` : 'NULL'}, '${prod.created_at.toISOString()}', '${prod.updated_at.toISOString()}');\n`;
    }

    // Export Product Variants
    console.log('🔧 Exporting product variants...');
    const variants = await pool.query('SELECT * FROM product_variants');
    sqlContent += '\n-- Product Variants\n';
    for (const variant of variants.rows) {
      sqlContent += `INSERT INTO product_variants (id, product_id, title, price_amount, price_currency, available_for_sale) VALUES ('${variant.id}', '${variant.product_id}', '${variant.title}', ${variant.price_amount}, '${variant.price_currency}', ${variant.available_for_sale});\n`;
    }

    // Export Product Images
    console.log('🖼️  Exporting product images...');
    const images = await pool.query('SELECT * FROM product_images ORDER BY product_id, position');
    sqlContent += '\n-- Product Images\n';
    for (const img of images.rows) {
      const createdAt = img.created_at ? `'${img.created_at.toISOString()}'` : 'CURRENT_TIMESTAMP';
      sqlContent += `INSERT INTO product_images (id, product_id, url, alt_text, width, height, position, created_at) VALUES ('${img.id}', '${img.product_id}', '${img.url}', ${img.alt_text ? `'${img.alt_text.replace(/'/g, "''")}'` : 'NULL'}, ${img.width}, ${img.height}, ${img.position}, ${createdAt});\n`;
    }

    // Export Product Collections (junction table)
    console.log('🔗 Exporting product-collection relationships...');
    const prodCols = await pool.query('SELECT * FROM product_collections');
    sqlContent += '\n-- Product Collections\n';
    for (const pc of prodCols.rows) {
      sqlContent += `INSERT INTO product_collections (product_id, collection_id) VALUES ('${pc.product_id}', '${pc.collection_id}');\n`;
    }

    // Export Pages
    console.log('📄 Exporting pages...');
    const pages = await pool.query('SELECT * FROM pages ORDER BY created_at');
    sqlContent += '\n-- Pages\n';
    for (const page of pages.rows) {
      const body = page.body ? page.body.replace(/'/g, "''") : '';
      sqlContent += `INSERT INTO pages (id, title, handle, body, seo_title, seo_description, created_at, updated_at) VALUES ('${page.id}', '${page.title}', '${page.handle}', '${body}', ${page.seo_title ? `'${page.seo_title.replace(/'/g, "''")}'` : 'NULL'}, ${page.seo_description ? `'${page.seo_description.replace(/'/g, "''")}'` : 'NULL'}, '${page.created_at.toISOString()}', '${page.updated_at.toISOString()}');\n`;
    }

    sqlContent += '\n-- Re-enable triggers and constraints\nSET session_replication_role = DEFAULT;\n';

    // Write to file
    const outputPath = path.join(__dirname, '../../database_dump.sql');
    fs.writeFileSync(outputPath, sqlContent, 'utf8');

    console.log(`\n✅ Database exported successfully!`);
    console.log(`📁 File: ${outputPath}`);
    console.log(`📊 Stats:`);
    console.log(`   - Collections: ${collections.rows.length}`);
    console.log(`   - Products: ${products.rows.length}`);
    console.log(`   - Variants: ${variants.rows.length}`);
    console.log(`   - Images: ${images.rows.length}`);
    console.log(`   - Pages: ${pages.rows.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Export error:', error);
    process.exit(1);
  }
}

exportDatabase();
