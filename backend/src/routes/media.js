const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// GET /api/media
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM media_files');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch media files' });
  }
});

// POST /api/media
router.post('/', async (req, res) => {
  const { post_id, user_id, url, alt_text, type = 'image' } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'url is required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO media_files (post_id, user_id, url, alt_text, type)
       VALUES (?, ?, ?, ?, ?)`,
      [post_id || null, user_id || null, url, alt_text || null, type]
    );

    const [rows] = await pool.query('SELECT * FROM media_files WHERE id = ?', [
      result.insertId
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create media file' });
  }
});

module.exports = router;

