const { Pool } = require('pg');
const p = new Pool({
  host: 'aws-1-ap-south-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.cidavntqosyjevcigiui',
  password: 'Bleach2005@123',
  ssl: { rejectUnauthorized: false }
});

p.query('SELECT id, email, password_hash, full_name, role FROM users WHERE email = $1', ['admin@khainguyen.com'], (err, res) => {
  console.log(err ? 'DB_ERROR: ' + err.message : res.rows);
  process.exit(0);
});
