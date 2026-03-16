const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// GET /api/contact-messages
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

// POST /api/contact-messages
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res
      .status(400)
      .json({ error: 'name, email, subject, message are required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES (?, ?, ?, ?)`,
      [name, email, subject, message]
    );

    const [rows] = await pool.query(
      'SELECT * FROM contact_messages WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create contact message' });
  }
});

// PATCH /api/contact-messages/:id/read
router.patch('/:id/read', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query(
      'UPDATE contact_messages SET is_read = 1 WHERE id = ?',
      [id]
    );
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

module.exports = router;

