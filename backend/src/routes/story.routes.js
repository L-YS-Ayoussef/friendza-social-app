const fs = require('fs');
const path = require('path');
const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

const mapStory = (row) => ({
  id: row.id,
  userId: row.user_id,
  caption: row.caption,
  mediaUrl: row.media_url,
  mediaType: row.media_type,
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
router.post('/', authMiddleware, upload.single('media'), async (req, res) => {
  try {
    const { caption = '' } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Media file is required' });
    }

    const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    const mediaUrl = `/uploads/${req.file.filename}`;

    const result = await pool.query(
      `
      INSERT INTO stories (user_id, caption, media_url, media_type, expires_at)
      VALUES ($1, $2, $3, $4, NOW() + INTERVAL '24 hours')
      RETURNING id, user_id, caption, media_url, media_type, created_at, expires_at
      `,
      [req.userId, caption, mediaUrl, mediaType]
    );

    return res.status(201).json({
      message: 'Story created successfully',
      story: result.rows[0],
    });
  } catch (error) {
    if (req.file?.filename) {
      const filePath = path.join(__dirname, '../../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (_) {}
      }
    }
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
      )
      SELECT
        s.id,
        s.user_id,
        s.media_url,
        s.media_type,
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
      ORDER BY s.created_at ASC
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