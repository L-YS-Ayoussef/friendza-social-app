const fs = require('fs');
const path = require('path');
const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

const mapPost = (row) => ({
  id: row.id,
  userId: row.user_id,
  caption: row.caption,
  mediaUrl: row.media_url,
  mediaType: row.media_type,
  location: row.location,
  createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
  user: {
    id: row.user_id,
    username: row.username,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    hasActiveStory: row.author_has_active_story,
  },
  likesCount: Number(row.likes_count || 0),
  commentsCount: Number(row.comments_count || 0),
  savesCount: Number(row.saves_count || 0),
  isLiked: Boolean(row.is_liked),
  isSaved: Boolean(row.is_saved),
});

// POST /api/posts
router.post('/', authMiddleware, upload.single('media'), async (req, res) => {
  try {
    const { caption = '', location = '' } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Media file is required' });
    }

    const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    const mediaUrl = `/uploads/${req.file.filename}`;

    const result = await pool.query(
      `
      INSERT INTO posts (user_id, caption, media_url, media_type, location)
      VALUES ($1, $2, $3, $4, NULLIF($5, ''))
      RETURNING id, user_id, caption, media_url, media_type, location, created_at
      `,
      [req.userId, caption, mediaUrl, mediaType, location]
    );

    return res.status(201).json({
      message: 'Post created successfully',
      post: result.rows[0],
    });
  } catch (error) {
    if (req.file?.filename) {
      const filePath = path.join(__dirname, '../../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (_) {}
      }
    }
    console.error('Create post error:', error);
    return res.status(500).json({ message: 'server error while creating post' });
  }
});

// GET /api/posts/feed
router.get('/feed', authMiddleware, async (req, res) => {
  try {
    const requestedLimit = Number(req.query.limit) || 30;
    const limit = Math.min(Math.max(requestedLimit, 1), 50);

    const result = await pool.query(
      `
      WITH visible_users AS (
        SELECT $1::INT AS user_id
        UNION
        SELECT following_id FROM follows WHERE follower_id = $1
      )
      SELECT
        p.id,
        p.user_id,
        p.caption,
        p.media_url,
        p.media_type,
        p.location,
        p.created_at,
        u.username,
        u.full_name,
        u.avatar_url,

        EXISTS(
          SELECT 1 FROM stories s
          WHERE s.user_id = p.user_id
            AND s.expires_at > NOW()
        ) AS author_has_active_story,

        COALESCE(pl.likes_count, 0) AS likes_count,
        COALESCE(pc.comments_count, 0) AS comments_count,
        COALESCE(ps.saves_count, 0) AS saves_count,

        CASE WHEN my_like.post_id IS NULL THEN FALSE ELSE TRUE END AS is_liked,
        CASE WHEN my_save.post_id IS NULL THEN FALSE ELSE TRUE END AS is_saved

      FROM posts p
      INNER JOIN visible_users vu ON vu.user_id = p.user_id
      INNER JOIN users u ON u.id = p.user_id

      LEFT JOIN (
        SELECT post_id, COUNT(*)::INT AS likes_count
        FROM likes
        GROUP BY post_id
      ) pl ON pl.post_id = p.id

      LEFT JOIN (
        SELECT post_id, COUNT(*)::INT AS comments_count
        FROM comments
        GROUP BY post_id
      ) pc ON pc.post_id = p.id

      LEFT JOIN (
        SELECT post_id, COUNT(*)::INT AS saves_count
        FROM saved_posts
        GROUP BY post_id
      ) ps ON ps.post_id = p.id

      LEFT JOIN likes my_like
        ON my_like.post_id = p.id AND my_like.user_id = $1

      LEFT JOIN saved_posts my_save
        ON my_save.post_id = p.id AND my_save.user_id = $1

      ORDER BY p.created_at DESC
      LIMIT $2
      `,
      [req.userId, limit]
    );

    return res.status(200).json({
      posts: result.rows.map(mapPost),
    });
  } catch (error) {
    console.error('Get feed posts error:', error);
    return res.status(500).json({ message: 'server error while fetching feed posts' });
  }
});

// GET /api/posts/recent-likes
// Likes on the current user's posts (excluding self-likes)
router.get('/recent-likes', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        pl.created_at,
        liker.id AS liker_id,
        liker.username AS liker_username,
        liker.full_name AS liker_full_name,
        liker.avatar_url AS liker_avatar_url,
        p.id AS post_id,
        p.caption AS post_caption,
        p.media_url AS post_media_url,
        p.media_type AS post_media_type
      FROM likes pl
      INNER JOIN posts p ON p.id = pl.post_id
      INNER JOIN users liker ON liker.id = pl.user_id
      WHERE p.user_id = $1
        AND pl.user_id <> $1
      ORDER BY pl.created_at DESC
      LIMIT 50
      `,
      [req.userId]
    );

    const items = result.rows.map((row) => ({
      createdAt: row.created_at,
      liker: {
        id: row.liker_id,
        username: row.liker_username,
        fullName: row.liker_full_name,
        avatarUrl: row.liker_avatar_url,
      },
      post: {
        id: row.post_id,
        caption: row.post_caption,
        mediaUrl: row.post_media_url,
        mediaType: row.post_media_type,
      },
    }));

    return res.status(200).json({ likes: items });
  } catch (error) {
    console.error('Recent likes error:', error);
    return res.status(500).json({ message: 'server error while fetching recent likes' });
  }
});

// GET /api/posts/:postId/likes
router.get('/:postId/likes', authMiddleware, async (req, res) => {
  try {
    const postId = Number(req.params.postId);
    if (!postId) return res.status(400).json({ message: 'invalid post id' });

    // --- gate check: ensure post exists + enforce privacy (private account)
    const gate = await pool.query(
      `
      SELECT
        p.user_id AS author_id,
        u.is_private,
        EXISTS(
          SELECT 1 FROM follows f
          WHERE f.follower_id = $1 AND f.following_id = p.user_id
        ) AS is_following_author
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.id = $2
      LIMIT 1
      `,
      [req.userId, postId]
    );

    if (!gate.rows.length) return res.status(404).json({ message: 'post not found' });

    const { author_id, is_private, is_following_author } = gate.rows[0];
    const isOwner = Number(author_id) === Number(req.userId);
    const isPrivateLocked = is_private && !is_following_author && !isOwner;

    if (isPrivateLocked) return res.status(403).json({ message: 'private account' });

    const requestedLimit = Number(req.query.limit) || 100;
    const limit = Math.min(Math.max(requestedLimit, 1), 200);

    // --- fetch users who liked the post
    const result = await pool.query(
      `
      SELECT
        l.created_at,
        u.id,
        u.username,
        u.full_name,
        u.avatar_url,
        EXISTS(
          SELECT 1 FROM follows f
          WHERE f.follower_id = $1 AND f.following_id = u.id
        ) AS is_following
      FROM likes l
      JOIN users u ON u.id = l.user_id
      WHERE l.post_id = $2
      ORDER BY l.created_at DESC
      LIMIT $3
      `,
      [req.userId, postId, limit]
    );

    return res.status(200).json({
      users: result.rows.map((row) => ({
        id: row.id,
        username: row.username,
        fullName: row.full_name,
        avatarUrl: row.avatar_url,
        likedAt: row.created_at,
        isFollowing: row.is_following,
      })),
    });
  } catch (error) {
    console.error('Post likes list error:', error);
    return res.status(500).json({ message: 'server error while fetching likes' });
  }
});

// POST /api/posts/:postId/like (toggle)
router.post('/:postId/like', authMiddleware, async (req, res) => {
  try {
    const postId = Number(req.params.postId);

    const inserted = await pool.query(
      `
      INSERT INTO likes (post_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT (post_id, user_id) DO NOTHING
      RETURNING post_id
      `,
      [postId, req.userId]
    );

    let isLiked = true;

    if (inserted.rows.length === 0) {
      await pool.query(
        `DELETE FROM likes WHERE post_id = $1 AND user_id = $2`,
        [postId, req.userId]
      );
      isLiked = false;
    }

    const countResult = await pool.query(
      `SELECT COUNT(*)::INT AS likes_count FROM likes WHERE post_id = $1`,
      [postId]
    );

    return res.status(200).json({
      isLiked,
      likesCount: countResult.rows[0].likes_count,
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    return res.status(500).json({ message: 'server error while toggling like' });
  }
});

// POST /api/posts/:postId/save (toggle)
router.post('/:postId/save', authMiddleware, async (req, res) => {
  try {
    const postId = Number(req.params.postId);

    const inserted = await pool.query(
      `
      INSERT INTO saved_posts (post_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT (post_id, user_id) DO NOTHING
      RETURNING post_id
      `,
      [postId, req.userId]
    );

    let isSaved = true;

    if (inserted.rows.length === 0) {
      await pool.query(
        `DELETE FROM saved_posts WHERE post_id = $1 AND user_id = $2`,
        [postId, req.userId]
      );
      isSaved = false;
    }

    const countResult = await pool.query(
      `SELECT COUNT(*)::INT AS saves_count FROM saved_posts WHERE post_id = $1`,
      [postId]
    );

    return res.status(200).json({
      isSaved,
      savesCount: countResult.rows[0].saves_count,
    });
  } catch (error) {
    console.error('Toggle save error:', error);
    return res.status(500).json({ message: 'server error while toggling save' });
  }
});

// GET /api/posts/:postId/comments
router.get('/:postId/comments', authMiddleware, async (req, res) => {
  try {
    const postId = Number(req.params.postId);

    const result = await pool.query(
      `
      SELECT
        c.id,
        c.text,
        c.created_at,
        u.id AS user_id,
        u.username,
        u.full_name,
        u.avatar_url
      FROM comments c
      INNER JOIN users u ON u.id = c.user_id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC
      `,
      [postId]
    );

    return res.status(200).json({
      comments: result.rows.map((row) => ({
        id: row.id,
        text: row.text,
        createdAt: row.created_at,
        user: {
          id: row.user_id,
          username: row.username,
          fullName: row.full_name,
          avatarUrl: row.avatar_url,
        },
      })),
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return res.status(500).json({ message: 'server error while fetching comments' });
  }
});

// POST /api/posts/:postId/comments
router.post('/:postId/comments', authMiddleware, async (req, res) => {
  try {
    const postId = Number(req.params.postId);
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'comment text is required' });
    }

    await pool.query(
      `
      INSERT INTO comments (post_id, user_id, text)
      VALUES ($1, $2, $3)
      `,
      [postId, req.userId, text.trim()]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*)::INT AS comments_count FROM comments WHERE post_id = $1`,
      [postId]
    );

    return res.status(201).json({
      message: 'comment added',
      commentsCount: countResult.rows[0].comments_count,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    return res.status(500).json({ message: 'server error while adding comment' });
  }
});

// GET /api/posts/me?mediaType=image|video
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { mediaType } = req.query;
    const values = [req.userId];
    let mediaFilterSql = '';

    if (mediaType === 'image' || mediaType === 'video') {
      values.push(mediaType);
      mediaFilterSql = `AND p.media_type = $2`;
    }

    const result = await pool.query(
      `
      SELECT
        p.id, p.user_id, p.caption, p.media_url, p.media_type, p.location, p.created_at,
        u.username, u.full_name, u.avatar_url,
        (SELECT COUNT(*)::INT FROM likes l WHERE l.post_id = p.id) AS likes_count,
        (SELECT COUNT(*)::INT FROM comments c WHERE c.post_id = p.id) AS comments_count,
        EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = $1) AS is_liked,
        EXISTS(SELECT 1 FROM saved_posts sp WHERE sp.post_id = p.id AND sp.user_id = $1) AS is_saved
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.user_id = $1
      ${mediaFilterSql}
      ORDER BY p.created_at DESC
      `,
      values
    );

    return res.status(200).json({ posts: result.rows });
  } catch (error) {
    console.error('My posts error:', error);
    return res.status(500).json({ message: 'server error while fetching my posts' });
  }
});

// GET /api/posts/saved
router.get('/saved', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        p.id, p.user_id, p.caption, p.media_url, p.media_type, p.location, p.created_at,
        u.username, u.full_name, u.avatar_url,
        (SELECT COUNT(*)::INT FROM likes l WHERE l.post_id = p.id) AS likes_count,
        (SELECT COUNT(*)::INT FROM comments c WHERE c.post_id = p.id) AS comments_count,
        EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = $1) AS is_liked,
        TRUE AS is_saved
      FROM saved_posts sp
      JOIN posts p ON p.id = sp.post_id
      JOIN users u ON u.id = p.user_id
      WHERE sp.user_id = $1
      ORDER BY sp.created_at DESC
      `,
      [req.userId]
    );

    return res.status(200).json({ posts: result.rows });
  } catch (error) {
    console.error('Saved posts error:', error);
    return res.status(500).json({ message: 'server error while fetching saved posts' });
  }
});

// GET /api/posts/:postId
router.get('/:postId', authMiddleware, async (req, res) => {
  try {
    const postId = Number(req.params.postId);
    if (!postId) return res.status(400).json({ message: 'invalid post id' });

    const result = await pool.query(
      `
      SELECT
        p.id, p.user_id, p.caption, p.media_url, p.media_type, p.location, p.created_at,
        u.username, u.full_name, u.avatar_url,
        EXISTS(
          SELECT 1 FROM stories s
          WHERE s.user_id = p.user_id AND s.expires_at > NOW()
        ) AS author_has_active_story,
        (SELECT COUNT(*)::INT FROM likes l WHERE l.post_id = p.id) AS likes_count,
        (SELECT COUNT(*)::INT FROM comments c WHERE c.post_id = p.id) AS comments_count,
        EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = $1) AS is_liked,
        EXISTS(SELECT 1 FROM saved_posts sp WHERE sp.post_id = p.id AND sp.user_id = $1) AS is_saved
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.id = $2
      LIMIT 1
      `,
      [req.userId, postId]
    );

    if (!result.rows.length) return res.status(404).json({ message: 'post not found' });

    return res.status(200).json({ post: result.rows[0] });
  } catch (error) {
    console.error('Post details error:', error);
    return res.status(500).json({ message: 'server error while fetching post' });
  }
});

module.exports = router;