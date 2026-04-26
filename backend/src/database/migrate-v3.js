const pool = require('../config/database');

const migrations = `
-- 1. Add stock_quantity to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 100;

-- 2. Create order_logs table
CREATE TABLE IF NOT EXISTS order_logs (
    id SERIAL PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    admin_id INTEGER REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

async function runMigration() {
  try {
    console.log('🔄 Running database migrations V3 (Stock & Order Logs)...');
    await pool.query(migrations);
    console.log('✅ Migrations V3 completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during V3 migration:', error);
    process.exit(1);
  }
}

runMigration();
