const express = require('express');
const { pool } = require('../db');
const { progressPhotos } = require('../upload');

const router = express.Router();

// GET /api/progress?user_id=1 — list progress records for a user (newest first)
router.get('/', async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: 'user_id is required' });
  }
  try {
    const [rows] = await pool.query(
      `SELECT id, user_id, created_at,
              current_weight, target_weight,
              bust, talie, solduri, coapse,
              age, height, activity_level, sleep_hours, water_liters, meals_per_day,
              photo_front_url, photo_side_url, photo_back_url
       FROM progress_records
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch progress records' });
  }
});

// POST /api/progress — multipart: form fields + photo_front, photo_side, photo_back files
router.post('/', progressPhotos, async (req, res) => {
  const b = req.body;
  const user_id = b.user_id;
  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  const num = (v) => (v === '' || v == null) ? null : Number(v);
  const str = (v) => (v === '' || v == null) ? null : String(v).trim() || null;

  const current_weight = num(b.current_weight);
  const target_weight = num(b.target_weight);
  const bust = num(b.bust);
  const talie = num(b.talie);
  const solduri = num(b.solduri);
  const coapse = num(b.coapse);
  const age = b.age !== '' && b.age != null ? parseInt(b.age, 10) : null;
  const height = num(b.height);
  const activity_level = str(b.activity_level);
  let sleep_hours = num(b.sleep_hours);
  let water_liters = num(b.water_liters);
  const meals_per_day = b.meals_per_day !== '' && b.meals_per_day != null ? parseInt(b.meals_per_day, 10) : null;

  if (sleep_hours != null) sleep_hours = Math.min(24, Math.max(0, sleep_hours));
  if (water_liters != null) water_liters = Math.min(30, Math.max(0, water_liters));

  const photo_front_url = req.files && req.files.photo_front && req.files.photo_front[0]
    ? req.files.photo_front[0].filename
    : null;
  const photo_side_url = req.files && req.files.photo_side && req.files.photo_side[0]
    ? req.files.photo_side[0].filename
    : null;
  const photo_back_url = req.files && req.files.photo_back && req.files.photo_back[0]
    ? req.files.photo_back[0].filename
    : null;

  try {
    const [result] = await pool.query(
      `INSERT INTO progress_records (
        user_id, current_weight, target_weight,
        bust, talie, solduri, coapse,
        age, height, activity_level, sleep_hours, water_liters, meals_per_day,
        photo_front_url, photo_side_url, photo_back_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        current_weight,
        target_weight,
        bust,
        talie,
        solduri,
        coapse,
        age,
        height,
        activity_level,
        sleep_hours,
        water_liters,
        meals_per_day,
        photo_front_url,
        photo_side_url,
        photo_back_url
      ]
    );

    const [rows] = await pool.query(
      'SELECT * FROM progress_records WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

module.exports = router;
