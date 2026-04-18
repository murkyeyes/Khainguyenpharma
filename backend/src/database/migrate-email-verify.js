/**
 * Migration: Thêm cột is_verified và verification_token vào bảng users
 * Đồng thời: Đặt is_verified = true cho tất cả tài khoản hiện có (tránh khoá tài khoản cũ)
 *
 * Chạy: node src/database/migrate-email-verify.js
 */
require('dotenv').config();
const pool = require('../config/database');

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🔄 Bắt đầu migration: Email Verification...\n');

    await client.query('BEGIN');

    // 1. Thêm cột is_verified (nếu chưa có)
    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT false;
    `);
    console.log('✅ Đã thêm cột is_verified');

    // 2. Thêm cột verification_token (nếu chưa có)
    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);
    `);
    console.log('✅ Đã thêm cột verification_token');

    // 3. Thêm cột token_expires_at để quản lý hết hạn token
    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMP;
    `);
    console.log('✅ Đã thêm cột token_expires_at');

    // 4. QUAN TRỌNG: Đặt is_verified = true cho TẤT CẢ tài khoản hiện có
    //    Tránh vô tình khoá tài khoản Admin/User đang sử dụng
    const updateResult = await client.query(`
      UPDATE users
      SET is_verified = true
      WHERE is_verified = false;
    `);
    console.log(`✅ Đã cập nhật ${updateResult.rowCount} tài khoản hiện có → is_verified = true`);

    // 5. Tạo index cho verification_token để tra cứu nhanh
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_verification_token
      ON users(verification_token)
      WHERE verification_token IS NOT NULL;
    `);
    console.log('✅ Đã tạo index cho verification_token');

    await client.query('COMMIT');

    console.log('\n🎉 Migration hoàn thành thành công!');
    console.log('📋 Tóm tắt thay đổi:');
    console.log('   - Bảng users: +is_verified (BOOLEAN), +verification_token (VARCHAR), +token_expires_at (TIMESTAMP)');
    console.log('   - Tài khoản cũ: is_verified = true (không bị ảnh hưởng)');
    console.log('   - Tài khoản mới: is_verified = false (phải xác minh email)');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration thất bại, đã rollback:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(() => process.exit(1));
