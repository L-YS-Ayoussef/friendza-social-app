const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

const mapPost = (row) => ({
  id: row.id,
  userId: row.user_id,
  caption: row.caption,
  location: row.location,
  imageUrl: row.image_url,
  createdAt: row.created_at,
  user: {
    id: row.user_id,
    username: row.username,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
  },
  likesCount: Number(row.likes_count || 0),
  commentsCount: Number(row.comments_count || 0),
  bookmarksCount: Number(row.saves_count || 0),
  isLiked: Boolean(row.is_liked),
  isSaved: Boolean(row.is_saved),
});

// POST /api/posts (multipart/form-data)
// fields: image(file), caption(text), location(text optional)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { caption, location } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const insertResult = await pool.query(
      `
      INSERT INTO posts (user_id, caption, image_url, location)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, caption, location, image_url, created_at
      `,
      [
        req.userId,
        caption?.trim() || null,
        imageUrl,
        location?.trim() || null,
      ]
    );

    const userResult = await pool.query(
      `SELECT id, username, full_name, avatar_url FROM users WHERE id = $1 LIMIT 1`,
      [req.userId]
    );

    const postRow = {
      ...insertResult.rows[0],
      ...userResult.rows[0],
      likes_count: 0,
      comments_count: 0,
      saves_count: 0,
      is_liked: false,
      is_saved: false,
    };

    return res.status(201).json({
      message: 'post created successfully',
      post: mapPost(postRow),
    });
  } catch (error) {
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
        p.location,
        p.image_url,
        p.created_at,
        u.username,
        u.full_name,
        u.avatar_url,

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
        FROM post_likes
        GROUP BY post_id
      ) pl ON pl.post_id = p.id

      LEFT JOIN (
        SELECT post_id, COUNT(*)::INT AS comments_count
        FROM post_comments
        GROUP BY post_id
      ) pc ON pc.post_id = p.id

      LEFT JOIN (
        SELECT post_id, COUNT(*)::INT AS saves_count
        FROM post_saves
        GROUP BY post_id
      ) ps ON ps.post_id = p.id

      LEFT JOIN post_likes my_like
        ON my_like.post_id = p.id AND my_like.user_id = $1

      LEFT JOIN post_saves my_save
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
        p.image_url AS post_image_url
      FROM post_likes pl
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
        imageUrl: row.post_image_url,
      },
    }));

    return res.status(200).json({ likes: items });
  } catch (error) {
    console.error('Recent likes error:', error);
    return res.status(500).json({ message: 'server error while fetching recent likes' });
  }
});

// POST /api/posts/:postId/like (toggle)
router.post('/:postId/like', authMiddleware, async (req, res) => {
  try {
    const postId = Number(req.params.postId);

    const inserted = await pool.query(
      `
      INSERT INTO post_likes (post_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT (post_id, user_id) DO NOTHING
      RETURNING post_id
      `,
      [postId, req.userId]
    );

    let isLiked = true;

    if (inserted.rows.length === 0) {
      await pool.query(
        `DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2`,
        [postId, req.userId]
      );
      isLiked = false;
    }

    const countResult = await pool.query(
      `SELECT COUNT(*)::INT AS likes_count FROM post_likes WHERE post_id = $1`,
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
      INSERT INTO post_saves (post_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT (post_id, user_id) DO NOTHING
      RETURNING post_id
      `,
      [postId, req.userId]
    );

    let isSaved = true;

    if (inserted.rows.length === 0) {
      await pool.query(
        `DELETE FROM post_saves WHERE post_id = $1 AND user_id = $2`,
        [postId, req.userId]
      );
      isSaved = false;
    }

    const countResult = await pool.query(
      `SELECT COUNT(*)::INT AS saves_count FROM post_saves WHERE post_id = $1`,
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
        c.comment_text,
        c.created_at,
        u.id AS user_id,
        u.username,
        u.full_name,
        u.avatar_url
      FROM post_comments c
      INNER JOIN users u ON u.id = c.user_id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC
      `,
      [postId]
    );

    return res.status(200).json({
      comments: result.rows.map((row) => ({
        id: row.id,
        text: row.comment_text,
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
      INSERT INTO post_comments (post_id, user_id, comment_text)
      VALUES ($1, $2, $3)
      `,
      [postId, req.userId, text.trim()]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*)::INT AS comments_count FROM post_comments WHERE post_id = $1`,
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

module.exports = router;