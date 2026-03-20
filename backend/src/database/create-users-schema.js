const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

async function createUsersSchema() {
  try {
    console.log('Creating users and sessions tables...');
    
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'users-schema.sql'),
      'utf8'
    );
    
    await pool.query(schemaSQL);
    
    console.log('✅ Users and sessions tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
}

createUsersSchema();
