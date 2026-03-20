const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Function to detect image extension
function getImageExtension(handle) {
  const uploadsDir = path.join(__dirname, '../../public/uploads/products', handle);
  const jpgPath = path.join(uploadsDir, 'main.jpg');
  const pngPath = path.join(uploadsDir, 'main.png');
  
  if (fs.existsSync(jpgPath)) {
    return 'jpg';
  } else if (fs.existsSync(pngPath)) {
    return 'png';
  }
  return 'jpg'; // default to jpg if neither exists
}

// Danh sách sản phẩm với thông tin chi tiết
const products = [
  {
    handle: 'amvitacine-150',
    title: 'AMVITACINE 150',
    description: 'Thuốc kháng sinh điều trị nhiễm khuẩn',
    price: 85000,
    category: 'Kháng sinh'
  },
  {
    handle: 'amvitacine-300',
    title: 'AMVITACINE 300',
    description: 'Thuốc kháng sinh điều trị nhiễm khuẩn liều cao',
    price: 145000,
    category: 'Kháng sinh'
  },
  {
    handle: 'cepmaxlox-100',
    title: 'CEPMAXLOX 100',
    description: 'Kháng sinh cephalosporin thế hệ mới',
    price: 120000,
    category: 'Kháng sinh'
  },
  {
    handle: 'chobamin-agi',
    title: 'CHOGAMIN AGI',
    description: 'Hỗ trợ tiêu hóa, tăng cường hấp thu',
    price: 65000,
    category: 'Tiêu hóa'
  },
  {
    handle: 'dau-nong-kwan-fi-hong',
    title: 'Dầu Nóng Kwan Fi Hồng',
    description: 'Dầu gió massage giảm đau nhức cơ',
    price: 45000,
    category: 'Ngoại dụng'
  },
  {
    handle: 'keyuni-150',
    title: 'KEYUNI 150',
    description: 'Dung dịch truyền tĩnh mạch Keyuni',
    price: 95000,
    category: 'Dung dịch truyền'
  },
  {
    handle: 'keyuni-300',
    title: 'KEYUNI 300',
    description: 'Dung dịch truyền tĩnh mạch Keyuni 300ml',
    price: 155000,
    category: 'Dung dịch truyền'
  },
  {
    handle: 'kim-tien-thao-480',
    title: 'Kim Tiền Thảo 480',
    description: 'Thực phẩm chức năng hỗ trợ thận, tiết niệu',
    price: 180000,
    category: 'TPBVSK'
  },
  {
    handle: 'odesol',
    title: 'ODESOL',
    description: 'Thuốc điều trị rối loạn tiêu hóa',
    price: 75000,
    category: 'Tiêu hóa'
  },
  {
    handle: 'povidone-iodine-10-percent',
    title: 'Povidone Iodine 10%',
    description: 'Dung dịch sát khuẩn vết thương',
    price: 35000,
    category: 'Sát khuẩn'
  },
  {
    handle: 'vien-uong-dep-da-white-master-gluta',
    title: 'Viên Uống Đẹp Da White Master Gluta',
    description: 'Viên uống trắng da, chống lão hóa',
    price: 320000,
    category: 'Làm đẹp'
  },
  {
    handle: 'xuyen-tam-lien-agi',
    title: 'Xuyên Tâm Liên AGI',
    description: 'Viên nang hỗ trợ điều trị nhiễm khuẩn đường hô hấp',
    price: 55000,
    category: 'Hô hấp'
  }
];

async function seedData() {
  try {
    console.log('🌱 Seeding database...');

    // Clean up existing data
    console.log('🧹 Cleaning up existing data...');
    await pool.query('DELETE FROM product_collections');
    await pool.query('DELETE FROM product_variant_options');
    await pool.query('DELETE FROM product_variants');
    await pool.query('DELETE FROM product_images');
    await pool.query('DELETE FROM products');
    await pool.query('DELETE FROM collections');
    await pool.query('DELETE FROM pages');
    console.log('✅ Cleanup complete');

    // Seed Collections first
    const collectionId1 = uuidv4();
    const collectionId2 = uuidv4();
    const collectionId3 = uuidv4();
    const collectionId4 = uuidv4();

    await pool.query(`
      INSERT INTO collections (id, handle, title, description)
      VALUES 
        ($1, 'giam-dau-ha-sot', 'Thuốc Giảm Đau - Hạ Sốt', 'Các sản phẩm giảm đau và hạ sốt hiệu quả'),
        ($2, 'vitamin-bo-sung', 'Vitamin & Thực Phẩm Chức Năng', 'Bổ sung vitamin và dưỡng chất thiết yếu'),
        ($3, 'khang-sinh', 'Kháng Sinh', 'Thuốc kháng sinh điều trị nhiễm khuẩn'),
        ($4, 'tieu-hoa', 'Tiêu Hóa', 'Hỗ trợ và điều trị tiêu hóa')
    `, [collectionId1, collectionId2, collectionId3, collectionId4]);

    console.log('✅ Created collections');

    // Seed Products
    let productCount = 0;
    for (const product of products) {
      const productId = uuidv4();
      const variantId = uuidv4();
      
      // Auto-detect image extension
      const imageExt = getImageExtension(product.handle);
      const imageUrl = `http://localhost:3001/uploads/products/${product.handle}/main.${imageExt}`;
      
      await pool.query(`
        INSERT INTO products (id, handle, title, description, price_amount, price_currency, available_for_sale, featured_image_url, featured_image_alt)
        VALUES ($1, $2, $3, $4, $5, 'VND', true, $6, $7)
      `, [productId, product.handle, product.title, product.description, product.price, imageUrl, product.title]);

      // Add product images
      await pool.query(`
        INSERT INTO product_images (product_id, url, alt_text, position)
        VALUES ($1, $2, $3, 0)
      `, [productId, imageUrl, `${product.title} image`]);

      // Add product variant
      await pool.query(`
        INSERT INTO product_variants (id, product_id, title, price_amount, price_currency, available_for_sale)
        VALUES ($1, $2, 'Mặc định', $3, 'VND', true)
      `, [variantId, productId, product.price]);

      // Link to appropriate collection
      let collectionId = collectionId1; // Default
      if (product.category === 'Kháng sinh') collectionId = collectionId3;
      else if (product.category === 'Tiêu hóa') collectionId = collectionId4;
      else if (product.category === 'TPBVSK') collectionId = collectionId2;

      await pool.query(`
        INSERT INTO product_collections (product_id, collection_id)
        VALUES ($1, $2)
      `, [productId, collectionId]);

      productCount++;
      console.log(`   ✓ ${product.title}`);
    }

    console.log(`✅ Created ${productCount} products`);

    // Seed Pages
    await pool.query(`
      INSERT INTO pages (id, handle, title, body, body_summary)
      VALUES 
        ($1, 'about-us', 'Về Chúng Tôi', '<h1>Khải Nguyên Pharma</h1><p>Chúng tôi là nhà phân phối dược phẩm uy tín hàng đầu Việt Nam.</p>', 'Thông tin về Khải Nguyên Pharma'),
        ($2, 'contact', 'Liên Hệ', '<h1>Liên hệ với chúng tôi</h1><p>Email: contact@khainguyen.com</p><p>Hotline: 1900-xxxx</p>', 'Thông tin liên hệ')
    `, [uuidv4(), uuidv4()]);

    console.log('✅ Created pages');

    // Seed Menu
    await pool.query(`
      INSERT INTO menus (handle, title, path, position)
      VALUES 
        ('main-menu', 'Trang Chủ', '/', 0),
        ('main-menu', 'Sản Phẩm', '/search', 1),
        ('main-menu', 'Giảm Đau - Hạ Sốt', '/search/giam-dau-ha-sot', 2),
        ('main-menu', 'Vitamin', '/search/vitamin-bo-sung', 3),
        ('main-menu', 'Kháng Sinh', '/search/khang-sinh', 4),
        ('main-menu', 'Về Chúng Tôi', '/about-us', 5),
        ('main-menu', 'Liên Hệ', '/contact', 6)
    `);

    console.log('✅ Created menu items');
    console.log('\n📦 Database seeding completed successfully!');
    console.log(`   - ${productCount} products`);
    console.log('   - 4 collections');
    console.log('   - 2 pages');
    console.log('   - 7 menu items');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedData();
