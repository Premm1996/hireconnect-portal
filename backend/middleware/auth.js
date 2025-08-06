const jwt = require('jsonwebtoken');
const pool = require('../db');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from database
    const [users] = await pool.query(
      'SELECT id, email, role, is_admin, profile FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Check user role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

// Log user activity
const logActivity = async (userId, action, entityType = null, entityId = null, details = {}) => {
  try {
    await pool.query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [userId, action, entityType, entityId, JSON.stringify(details)]
    );
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Log login attempts
const logLoginAttempt = async (userId, success, ipAddress, userAgent, failureReason = null) => {
  try {
    await pool.query(
      'INSERT INTO login_logs (user_id, ip_address, user_agent, success, failure_reason) VALUES (?, ?, ?, ?, ?)',
      [userId, ipAddress, userAgent, success, failureReason]
    );
    
    if (success) {
      await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [userId]);
    }
  } catch (error) {
    console.error('Error logging login attempt:', error);
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireRole,
  logActivity,
  logLoginAttempt
};
