const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'khainguyen_pharma_secret_key_2026';
const JWT_EXPIRES_IN = '7d'; // Token valid for 7 days

// Register new user (can be admin or customer)
exports.register = async (req, res) => {
  try {
    const { email, password, fullName, role = 'customer' } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email đã được sử dụng' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, role, created_at`,
      [email, passwordHash, fullName, role]
    );

    const user = result.rows[0];

    res.status(201).json({
      message: 'Đăng ký thành công',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Lỗi đăng ký tài khoản' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      'SELECT id, email, password_hash, full_name, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    const user = result.rows[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Store session (optional - for logout functionality)
    const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await pool.query(
      'INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [user.id, tokenHash, expiresAt]
    );

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Lỗi đăng nhập', detail: error.message || error.toString() });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex');
      await pool.query('DELETE FROM sessions WHERE token_hash = $1', [tokenHash]);
    }

    res.json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Lỗi đăng xuất' });
  }
};

// Get current user info
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT id, email, full_name, role, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User không tồn tại' });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Lỗi lấy thông tin user' });
  }
};
