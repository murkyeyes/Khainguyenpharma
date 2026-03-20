const pool = require('../config/database');

async function clearData() {
  try {
    console.log('🗑️  Clearing database...');

    // Clear all tables (CASCADE will clear related tables too)
    await pool.query(`
      TRUNCATE TABLE 
        products,
        collections,
        pages,
        menus,
        carts
      CASCADE;
    `);

    console.log('✅ Database cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Clear error:', error);
    process.exit(1);
  }
}

clearData();
