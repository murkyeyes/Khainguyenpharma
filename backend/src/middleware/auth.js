const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'khainguyen_pharma_secret_key_2026';

// Middleware to verify JWT token
exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token không hợp lệ' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if session exists and not expired
    const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex');
    const sessionResult = await pool.query(
      'SELECT * FROM sessions WHERE token_hash = $1 AND expires_at > NOW()',
      [tokenHash]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(401).json({ error: 'Session đã hết hạn' });
    }

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token không hợp lệ' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token đã hết hạn' });
    }
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Lỗi xác thực' });
  }
};

// Middleware to check if user is admin
exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Yêu cầu quyền admin' });
  }
  next();
};

// Middleware chỉ cho phép customer (không phải admin)
exports.requireUser = (req, res, next) => {
  const role = req.user.role;
  if (role !== 'customer' && role !== 'user') {
    return res.status(403).json({ error: 'Chỉ dành cho khách hàng' });
  }
  next();
};
