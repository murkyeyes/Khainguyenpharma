const pool = require('../config/database');
const bcrypt = require('bcrypt');

async function seedAdminUser() {
  try {
    console.log('Creating admin user...');

    const email = 'admin@khainguyen.com';
    const password = 'Admin@123';
    const fullName = 'Administrator';
    const role = 'admin';

    // Check if admin already exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email:', email);
      process.exit(0);
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert admin user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, role, created_at`,
      [email, passwordHash, fullName, role]
    );

    const user = result.rows[0];

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', user.email);
    console.log('Password:', password);
    console.log('Role:', user.role);
    console.log('Created at:', user.created_at);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Save these credentials securely!');
    console.log('⚠️  Password is hashed in database using bcrypt');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

seedAdminUser();
