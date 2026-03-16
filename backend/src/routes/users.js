const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.email, u.password_hash, u.full_name, u.role_id, r.name AS role_name,
              u.created_at, u.updated_at, u.is_active
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST /api/users
router.post('/', async (req, res) => {
  const {
    role_id,
    username,
    email,
    password_hash,
    full_name,
    is_active = 1
  } = req.body;

  if (!role_id || !username || !email || !password_hash) {
    return res
      .status(400)
      .json({ error: 'role_id, username, email, password_hash are required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO users (role_id, username, email, password_hash, full_name, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [role_id, username, email, password_hash, full_name || null, is_active]
    );

    const [rows] = await pool.query(
      `SELECT id, role_id, username, email, full_name, created_at, updated_at, is_active
       FROM users WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'username or email already exists' });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
});

module.exports = router;

