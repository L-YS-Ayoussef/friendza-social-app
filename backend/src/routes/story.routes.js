const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

const mapStory = (row) => ({
  id: row.id,
  userId: row.user_id,
  caption: row.caption,
  imageUrl: row.image_url,
  createdAt: row.created_at,
  expiresAt: row.expires_at,
  user: {
    id: row.user_id,
    username: row.username,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
  },
});

// POST /api/stories (multipart/form-data)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const insertResult = await pool.query(
      `
      INSERT INTO stories (user_id, image_url, caption)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, image_url, caption, created_at, expires_at
      `,
      [req.userId, imageUrl, caption?.trim() || null]
    );

    const userResult = await pool.query(
      `SELECT id, username, full_name, avatar_url FROM users WHERE id = $1 LIMIT 1`,
      [req.userId]
    );

    const storyRow = {
      ...insertResult.rows[0],
      ...userResult.rows[0],
    };

    return res.status(201).json({
      message: 'story created successfully',
      story: mapStory(storyRow),
    });
  } catch (error) {
    console.error('Create story error:', error);
    return res.status(500).json({ message: 'server error while creating story' });
  }
});

// GET /api/stories/active
router.get('/active', authMiddleware, async (req, res) => {
  try {
    // Optional cleanup so expired stories physically disappear from DB over time
    await pool.query(`DELETE FROM stories WHERE expires_at <= NOW()`);

    const requestedLimit = Number(req.query.limit) || 20;
    const limit = Math.min(Math.max(requestedLimit, 1), 50);

    const result = await pool.query(
      `
      WITH visible_users AS (
        SELECT $1::INT AS user_id
        UNION
        SELECT following_id FROM follows WHERE follower_id = $1
      ),
      latest_story_per_user AS (
        SELECT DISTINCT ON (s.user_id)
          s.id,
          s.user_id,
          s.image_url,
          s.caption,
          s.created_at,
          s.expires_at,
          u.username,
          u.full_name,
          u.avatar_url
        FROM stories s
        INNER JOIN visible_users vu ON vu.user_id = s.user_id
        INNER JOIN users u ON u.id = s.user_id
        WHERE s.expires_at > NOW()
        ORDER BY s.user_id, s.created_at DESC
      )
      SELECT *
      FROM latest_story_per_user
      ORDER BY created_at DESC
      LIMIT $2
      `,
      [req.userId, limit]
    );

    return res.status(200).json({
      stories: result.rows.map(mapStory),
    });
  } catch (error) {
    console.error('Get active stories error:', error);
    return res.status(500).json({ message: 'server error while fetching stories' });
  }
});

module.exports = router;