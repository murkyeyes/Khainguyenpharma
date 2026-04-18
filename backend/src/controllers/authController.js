const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/database');
const { sendVerificationEmail } = require('../config/resend');

const JWT_SECRET = process.env.JWT_SECRET || 'khainguyen_pharma_secret_key_2026';
const JWT_EXPIRES_IN = '7d'; // Token valid for 7 days

// ─────────────────────────────────────────────
// Register new user — gửi email xác minh
// ─────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { email, password, fullName, role = 'customer' } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email đã được sử dụng' });
    }

    // Hash mật khẩu
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Tạo verification token ngẫu nhiên (64 ký tự hex = 256 bit entropy)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Hết hạn sau 24 giờ

    // Insert user với is_verified = false
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role, is_verified, verification_token, token_expires_at)
       VALUES ($1, $2, $3, $4, false, $5, $6)
       RETURNING id, email, full_name, role, created_at`,
      [email, passwordHash, fullName, role, verificationToken, tokenExpiresAt]
    );

    const user = result.rows[0];

    // Gửi email xác minh (bất đồng bộ — không chặn response)
    sendVerificationEmail(email, fullName, verificationToken).catch((err) => {
      console.error('⚠️ Lỗi gửi email xác minh:', err.message);
    });

    res.status(201).json({
      message: 'Đăng ký thành công! Vui lòng kiểm tra Email để xác minh tài khoản.',
      requireVerification: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Lỗi đăng ký tài khoản' });
  }
};

// ─────────────────────────────────────────────
// Verify email — kích hoạt tài khoản bằng token
// ─────────────────────────────────────────────
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Token xác minh không hợp lệ' });
    }

    // Tìm user theo token
    const result = await pool.query(
      `SELECT id, email, full_name, is_verified, token_expires_at
       FROM users
       WHERE verification_token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Liên kết xác minh không hợp lệ hoặc đã được sử dụng.',
      });
    }

    const user = result.rows[0];

    // Kiểm tra đã xác minh chưa
    if (user.is_verified) {
      return res.status(200).json({
        message: 'Tài khoản đã được xác minh trước đó. Bạn có thể đăng nhập.',
        alreadyVerified: true,
      });
    }

    // Kiểm tra token hết hạn chưa
    if (new Date() > new Date(user.token_expires_at)) {
      return res.status(410).json({
        error: 'Liên kết xác minh đã hết hạn (24 giờ). Vui lòng đăng ký lại.',
        expired: true,
      });
    }

    // Kích hoạt tài khoản: xoá token, đặt is_verified = true
    await pool.query(
      `UPDATE users
       SET is_verified = true,
           verification_token = NULL,
           token_expires_at = NULL,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [user.id]
    );

    res.status(200).json({
      message: 'Xác minh thành công! Tài khoản của bạn đã được kích hoạt.',
      success: true,
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Lỗi xác minh tài khoản' });
  }
};

// ─────────────────────────────────────────────
// Login — chặn tài khoản chưa xác minh
// ─────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user (bao gồm is_verified)
    const result = await pool.query(
      'SELECT id, email, password_hash, full_name, role, is_verified FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    const user = result.rows[0];

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    // ⛔ Chặn tài khoản chưa xác minh email
    if (!user.is_verified) {
      return res.status(403).json({
        error: 'Tài khoản chưa được xác minh. Vui lòng kiểm tra Email và nhấn liên kết kích hoạt.',
        requireVerification: true,
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Lưu session
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày

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
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Lỗi đăng nhập', detail: error.message || error.toString() });
  }
};

// ─────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      await pool.query('DELETE FROM sessions WHERE token_hash = $1', [tokenHash]);
    }

    res.json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Lỗi đăng xuất' });
  }
};

// ─────────────────────────────────────────────
// Get current user info
// ─────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT id, email, full_name, role, is_verified, created_at FROM users WHERE id = $1',
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
        isVerified: user.is_verified,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Lỗi lấy thông tin user' });
  }
};
