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
  createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
  expiresAt: row.expires_at ? new Date(row.expires_at).toISOString() : null,
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

// POST /api/stories/from-post/:postId  (owner only)
router.post('/from-post/:postId', authMiddleware, async (req, res) => {
  try {
    const postId = Number(req.params.postId);
    if (!postId) return res.status(400).json({ message: 'invalid post id' });

    const found = await pool.query(
      `
      SELECT id, user_id, caption, media_url, media_type, media_duration_seconds
      FROM posts
      WHERE id = $1
      LIMIT 1
      `,
      [postId]
    );

    if (!found.rows.length) return res.status(404).json({ message: 'post not found' });

    const post = found.rows[0];
    if (Number(post.user_id) !== Number(req.userId)) {
      return res.status(403).json({ message: 'only owner can add this post to story' });
    }

    // copy file so deleting post doesn't break story
    if (!post.media_url || !post.media_url.startsWith('/uploads/')) {
      return res.status(400).json({ message: 'post media is not stored locally' });
    }

    const srcPath = path.join(__dirname, '../../uploads', path.basename(post.media_url));
    if (!fs.existsSync(srcPath)) {
      return res.status(500).json({ message: 'post media file missing on server' });
    }

    const ext = path.extname(post.media_url) || (post.media_type === 'video' ? '.mp4' : '.jpg');
    const newName = `story_${Date.now()}_${Math.random().toString(16).slice(2)}${ext}`;
    const dstPath = path.join(__dirname, '../../uploads', newName);

    fs.copyFileSync(srcPath, dstPath);

    const newMediaUrl = `/uploads/${newName}`;

    const result = await pool.query(
      `
      INSERT INTO stories (user_id, caption, media_url, media_type, media_duration_seconds, expires_at)
      VALUES ($1, $2, $3, $4, $5, NOW() + INTERVAL '24 hours')
      RETURNING id, user_id, caption, media_url, media_type, created_at, expires_at
      `,
      [
        req.userId,
        post.caption || '',
        newMediaUrl,
        post.media_type || 'image',
        post.media_duration_seconds || null,
      ]
    );

    return res.status(201).json({
      message: 'added to story',
      story: result.rows[0],
    });
  } catch (error) {
    console.error('Add to story from post error:', error);
    return res.status(500).json({ message: 'server error while adding to story' });
  }
});

// DELETE /api/stories/:storyId (owner only)
router.delete('/:storyId', authMiddleware, async (req, res) => {
  try {
    const storyId = Number(req.params.storyId);
    if (!storyId) return res.status(400).json({ message: 'invalid story id' });

    const found = await pool.query(
      `SELECT id, user_id, media_url FROM stories WHERE id = $1 LIMIT 1`,
      [storyId]
    );
    if (!found.rows.length) return res.status(404).json({ message: 'story not found' });

    const story = found.rows[0];
    if (Number(story.user_id) !== Number(req.userId)) {
      return res.status(403).json({ message: 'only owner can delete this story' });
    }

    await pool.query(`DELETE FROM stories WHERE id = $1`, [storyId]);

    // delete file if unused
    const mediaUrl = story.media_url;
    if (mediaUrl && mediaUrl.startsWith('/uploads/')) {
      const usage = await pool.query(
        `
        SELECT
          (SELECT COUNT(*)::INT FROM posts WHERE media_url = $1) AS posts_using,
          (SELECT COUNT(*)::INT FROM stories WHERE media_url = $1) AS stories_using
        `,
        [mediaUrl]
      );

      const total = (usage.rows[0].posts_using || 0) + (usage.rows[0].stories_using || 0);
      if (total === 0) {
        const filePath = path.join(__dirname, '../../uploads', path.basename(mediaUrl));
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (_) {}
        }
      }
    }

    return res.status(200).json({ message: 'story deleted', storyId });
  } catch (error) {
    console.error('Delete story error:', error);
    return res.status(500).json({ message: 'server error while deleting story' });
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