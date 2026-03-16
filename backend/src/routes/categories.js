const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:id/posts — published posts in this category
router.get('/:id/posts', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const [rows] = await pool.query(
      `SELECT p.id, p.title, p.slug, p.content, p.status, p.published_at, p.created_at,
              u.username AS author_username
       FROM posts p
       INNER JOIN post_categories pc ON p.id = pc.post_id AND pc.category_id = ?
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.status = 'published'
       ORDER BY p.published_at DESC, p.created_at DESC`,
      [categoryId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts for category' });
  }
});

// POST /api/categories
router.post('/', async (req, res) => {
  const { name, slug, description } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ error: 'name and slug are required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
      [name, slug, description || null]
    );
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [
      result.insertId
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res
        .status(409)
        .json({ error: 'category with same name or slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create category' });
  }
});

module.exports = router;

