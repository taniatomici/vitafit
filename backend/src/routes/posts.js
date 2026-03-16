const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// GET /api/posts — optional: ?status=published & ?category_slug=...
router.get('/', async (req, res) => {
  try {
    const { status, category_slug } = req.query;
    let sql = `
      SELECT p.id, p.title, p.slug, p.content, p.status, p.published_at,
             p.created_at, p.updated_at, p.user_id,
             u.username AS author_username,
             GROUP_CONCAT(DISTINCT c.id) AS category_ids,
             GROUP_CONCAT(DISTINCT c.name) AS category_names,
             GROUP_CONCAT(DISTINCT c.slug) AS category_slugs
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN post_categories pc ON p.id = pc.post_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE 1=1`;
    const params = [];

    if (status) {
      sql += ' AND p.status = ?';
      params.push(status);
    }
    if (category_slug) {
      sql += ' AND c.slug = ?';
      params.push(category_slug);
    }
    sql += ' GROUP BY p.id ORDER BY p.published_at DESC, p.created_at DESC';

    const [rows] = await pool.query(sql, params);
    const posts = rows.map((row) => {
      const post = {
        id: row.id,
        title: row.title,
        slug: row.slug,
        content: row.content,
        status: row.status,
        published_at: row.published_at,
        created_at: row.created_at,
        updated_at: row.updated_at,
        user_id: row.user_id,
        author_username: row.author_username
      };
      if (row.category_ids) {
        const ids = row.category_ids.split(',').filter(Boolean);
        const names = (row.category_names || '').split(',').filter(Boolean);
        const slugs = (row.category_slugs || '').split(',').filter(Boolean);
        post.categories = ids.map((id, i) => ({
          id: Number(id),
          name: names[i] || '',
          slug: slugs[i] || ''
        }));
      } else {
        post.categories = [];
      }
      return post;
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// POST /api/posts
router.post('/', async (req, res) => {
  const {
    user_id,
    title,
    slug,
    content,
    status = 'draft',
    published_at = null
  } = req.body;

  if (!user_id || !title || !slug || !content) {
    return res
      .status(400)
      .json({ error: 'user_id, title, slug, content are required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO posts (user_id, title, slug, content, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, title, slug, content, status, published_at]
    );

    const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [
      result.insertId
    ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'post with same slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// POST /api/posts/:id/categories  (assign categories to a post)
router.post('/:id/categories', async (req, res) => {
  const postId = req.params.id;
  const { category_ids } = req.body;

  if (!Array.isArray(category_ids) || category_ids.length === 0) {
    return res
      .status(400)
      .json({ error: 'category_ids must be a non-empty array of ids' });
  }

  try {
    const values = category_ids.map((cid) => [postId, cid]);
    await pool.query(
      'INSERT IGNORE INTO post_categories (post_id, category_id) VALUES ?',
      [values]
    );
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to assign categories to post' });
  }
});

module.exports = router;

