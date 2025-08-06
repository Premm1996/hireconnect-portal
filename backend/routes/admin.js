const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const { authenticateToken, requireAdmin, logActivity } = require('../middleware/auth');

// Get system statistics
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // User statistics
    const [userStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'student' THEN 1 END) as students,
        COUNT(CASE WHEN role = 'employer' THEN 1 END) as employers,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
        COUNT(CASE WHEN DATE(createdAt) = CURDATE() THEN 1 END) as new_today
      FROM users
    `);

    // Login statistics
    const [loginStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_logins,
        COUNT(CASE WHEN DATE(login_time) = CURDATE() THEN 1 END) as logins_today,
        COUNT(CASE WHEN success = TRUE THEN 1 END) as successful_logins,
        COUNT(CASE WHEN success = FALSE THEN 1 END) as failed_logins
      FROM login_logs
      WHERE login_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    // Form submission statistics
    const [formStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_submissions,
        COUNT(CASE WHEN DATE(submitted_at) = CURDATE() THEN 1 END) as submissions_today,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_reviews,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
      FROM form_submissions
      WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    // Recent activity
    const [recentActivity] = await pool.query(`
      SELECT al.*, u.email as user_email
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 10
    `);

    res.json({
      users: userStats[0],
      logins: loginStats[0],
      forms: formStats[0],
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users with pagination and filtering
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '', status = 'active' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, email, role, is_admin, profile, createdAt, last_login
      FROM users
      WHERE 1=1
    `;
    
    const params = [];

    if (search) {
      query += ' AND (email LIKE ? OR JSON_EXTRACT(profile, "$.fullName") LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [users] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const countParams = [];

    if (search) {
      countQuery += ' AND (email LIKE ? OR JSON_EXTRACT(profile, "$.fullName") LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (role) {
      countQuery += ' AND role = ?';
      countParams.push(role);
    }

    const [countResult] = await pool.query(countQuery, countParams);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user details
router.get('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, email, role, is_admin, profile, createdAt, last_login FROM users WHERE id = ?',
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user login history
    const [loginHistory] = await pool.query(
      'SELECT * FROM login_logs WHERE user_id = ? ORDER BY login_time DESC LIMIT 10',
      [req.params.id]
    );

    // Get user activity
    const [activity] = await pool.query(
      'SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
      [req.params.id]
    );

    res.json({
      user: users[0],
      loginHistory,
      activity
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new user (admin)
router.post('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { email, password, fullName, role = 'student', is_admin = false } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'Email, password, and full name are required' });
    }

    // Check if user already exists
    const [existingUser] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (email, password, role, is_admin, profile) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, role, is_admin, JSON.stringify({ fullName })]
    );

    await logActivity(req.user.id, 'create_user', 'users', result.insertId, { email, role, is_admin });

    res.status(201).json({
      message: 'User created successfully',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (admin)
router.put('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { email, fullName, role, is_admin, password } = req.body;

    const updates = [];
    const params = [];

    if (email) {
      updates.push('email = ?');
      params.push(email);
    }

    if (fullName) {
      updates.push('profile = JSON_SET(profile, "$.fullName", ?)');
      params.push(fullName);
    }

    if (role) {
      updates.push('role = ?');
      params.push(role);
    }

    if (typeof is_admin === 'boolean') {
      updates.push('is_admin = ?');
      params.push(is_admin);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      params.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No updates provided' });
    }

    params.push(req.params.id);

    const [result] = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await logActivity(req.user.id, 'update_user', 'users', req.params.id, { email, role, is_admin });

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin)
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await logActivity(req.user.id, 'delete_user', 'users', req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get system logs
router.get('/logs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { type = 'all', page = 1, limit = 10, start_date, end_date } = req.query;
    const offset = (page - 1) * limit;

    let query = '';
    let params = [];

    if (type === 'login') {
      query = `
        SELECT ll.*, u.email as user_email
        FROM login_logs ll
        LEFT JOIN users u ON ll.user_id = u.id
        WHERE 1=1
      `;
    } else if (type === 'activity') {
      query = `
        SELECT al.*, u.email as user_email
        FROM activity_logs al
        LEFT JOIN users u ON al.user_id = u.id
        WHERE 1=1
      `;
    } else {
      query = `
        SELECT 'login' as log_type, ll.*, u.email as user_email
        FROM login_logs ll
        LEFT JOIN users u ON ll.user_id = u.id
        WHERE 1=1
        UNION ALL
        SELECT 'activity' as log_type, al.*, u.email as user_email
        FROM activity_logs al
        LEFT JOIN users u ON al.user_id = u.id
        WHERE 1=1
      `;
    }

    if (start_date) {
      query += ` AND ${type === 'login' ? 'll.login_time' : type === 'activity' ? 'al.created_at' : 'login_time'} >= ?`;
      params.push(start_date);
    }

    if (end_date) {
      query += ` AND ${type === 'login' ? 'll.login_time' : type === 'activity' ? 'al.created_at' : 'login_time'} <= ?`;
      params.push(end_date);
    }

    query += ` ORDER BY ${type === 'login' ? 'll.login_time' : type === 'activity' ? 'al.created_at' : 'login_time'} DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [logs] = await pool.query(query, params);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
