const pool = require('../config/database');

const migrations = `
-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    handle VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Kiến Thức',
    summary TEXT,
    content TEXT,
    image_url TEXT,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_handle ON blog_posts(handle);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
`;

async function runMigration() {
  try {
    console.log('🔄 Running database migrations V4 (Blog Posts)...');
    await pool.query(migrations);
    console.log('✅ Migrations V4 completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during V4 migration:', error);
    process.exit(1);
  }
}

runMigration();
