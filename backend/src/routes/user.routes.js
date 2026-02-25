const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

const mapUserCard = (row) => ({
  id: row.id,
  username: row.username,
  fullName: row.full_name,
  avatarUrl: row.avatar_url,
  bio: row.bio,
  createdAt: row.created_at,
});

// Current logged-in user profile
router.get('/me/profile', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        u.id,
        u.username,
        u.full_name,
        u.avatar_url,
        u.bio,
        u.created_at,
        u.is_private,
        (SELECT COUNT(*)::INT FROM follows WHERE following_id = u.id) AS followers_count,
        (SELECT COUNT(*)::INT FROM follows WHERE follower_id = u.id) AS following_count,
        (SELECT COUNT(*)::INT FROM posts WHERE user_id = u.id) AS posts_count
      FROM users u
      WHERE u.id = $1
      LIMIT 1
      `,
      [req.userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'user not found' });
    }

    const row = result.rows[0];

    return res.status(200).json({
      user: {
        id: row.id,
        username: row.username,
        fullName: row.full_name,
        avatarUrl: row.avatar_url,
        bio: row.bio,
        createdAt: row.created_at,
        followersCount: row.followers_count,
        followingCount: row.following_count,
        postsCount: row.posts_count,
        isPrivate: row.is_private,
      },
    });
  } catch (error) {
    console.error('My profile error:', error);
    return res.status(500).json({ message: 'server error while fetching profile' });
  }
});

router.put('/me/privacy', authMiddleware, async (req, res) => {
  try {
    const { isPrivate } = req.body;

    if (typeof isPrivate !== 'boolean') {
      return res.status(400).json({ message: 'isPrivate must be boolean' });
    }

    const result = await pool.query(
      `
      UPDATE users
      SET is_private = $1
      WHERE id = $2
      RETURNING id, is_private
      `,
      [isPrivate, req.userId]
    );

    return res.status(200).json({
      message: 'Privacy updated successfully',
      isPrivate: result.rows[0].is_private,
    });
  } catch (error) {
    console.error('Update privacy error:', error);
    return res.status(500).json({ message: 'server error while updating privacy' });
  }
});

// Upload or update avatar image
router.put('/me/avatar', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    const result = await pool.query(
      `
      UPDATE users
      SET avatar_url = $1
      WHERE id = $2
      RETURNING id, username, full_name, avatar_url, bio, created_at
      `,
      [avatarUrl, req.userId]
    );

    return res.status(200).json({
      message: 'Avatar updated successfully',
      user: {
        id: result.rows[0].id,
        username: result.rows[0].username,
        fullName: result.rows[0].full_name,
        avatarUrl,
        bio: result.rows[0].bio,
        createdAt: result.rows[0].created_at,
      },
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    return res.status(500).json({ message: 'server error while updating avatar' });
  }
});

// GET /api/users/suggestions
router.get('/suggestions', authMiddleware, async (req, res) => {
  try {
    const requestedLimit = Number(req.query.limit) || 20;
    const limit = Math.min(Math.max(requestedLimit, 1), 50);

    const result = await pool.query(
      `
      SELECT u.id, u.username, u.full_name, u.avatar_url, u.bio, u.created_at
      FROM users u
      WHERE u.id <> $1
        AND NOT EXISTS (
          SELECT 1
          FROM follows f
          WHERE f.follower_id = $1
            AND f.following_id = u.id
        )
      ORDER BY u.created_at DESC
      LIMIT $2
      `,
      [req.userId, limit]
    );

    return res.status(200).json({
      users: result.rows.map(mapUserCard),
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    return res.status(500).json({ message: 'server error while fetching suggestions' });
  }
});

// GET /api/users/:userId/profile
router.get('/:userId/profile', authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!userId) {
      return res.status(400).json({ message: 'invalid user id' });
    }

    const result = await pool.query(
      `
      SELECT
        u.id,
        u.username,
        u.full_name,
        u.avatar_url,
        u.bio,
        u.created_at,
        u.is_private,

        (SELECT COUNT(*)::INT FROM follows WHERE following_id = u.id) AS followers_count,
        (SELECT COUNT(*)::INT FROM follows WHERE follower_id = u.id) AS following_count,
        (SELECT COUNT(*)::INT FROM posts WHERE user_id = u.id) AS posts_count,

        EXISTS(
          SELECT 1 FROM follows
          WHERE follower_id = $1 AND following_id = u.id
        ) AS is_following
      FROM users u
      WHERE u.id = $2
      LIMIT 1
      `,
      [req.userId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'user not found' });
    }

    const row = result.rows[0];
    const isOwnProfile = row.id === req.userId;
    const isPrivateLocked = row.is_private && !row.is_following && !isOwnProfile;

    return res.status(200).json({
      user: {
        id: row.id,
        username: row.username,
        fullName: row.full_name,
        avatarUrl: row.avatar_url,
        bio: isPrivateLocked ? null : row.bio,
        createdAt: row.created_at,
        followersCount: row.followers_count,
        followingCount: row.following_count,
        postsCount: isPrivateLocked ? null : row.posts_count,
        isFollowing: row.is_following,
        isOwnProfile,
        isPrivate: row.is_private,
        isPrivateLocked,
      },
    });
  } catch (error) {
    console.error('User profile error:', error);
    return res.status(500).json({ message: 'server error while fetching profile' });
  }
});

// POST /api/users/:userId/follow (toggle follow/unfollow)
router.post('/:userId/follow', authMiddleware, async (req, res) => {
  try {
    const targetUserId = Number(req.params.userId);

    if (!targetUserId) {
      return res.status(400).json({ message: 'invalid user id' });
    }

    if (targetUserId === req.userId) {
      return res.status(400).json({ message: 'you cannot follow yourself' });
    }

    const inserted = await pool.query(
      `
      INSERT INTO follows (follower_id, following_id)
      VALUES ($1, $2)
      ON CONFLICT (follower_id, following_id) DO NOTHING
      RETURNING follower_id
      `,
      [req.userId, targetUserId]
    );

    let isFollowing = true;

    if (inserted.rows.length === 0) {
      await pool.query(
        `DELETE FROM follows WHERE follower_id = $1 AND following_id = $2`,
        [req.userId, targetUserId]
      );
      isFollowing = false;
    }

    const counts = await pool.query(
      `
      SELECT
        (SELECT COUNT(*)::INT FROM follows WHERE following_id = $1) AS followers_count,
        (SELECT COUNT(*)::INT FROM follows WHERE follower_id = $1) AS following_count
      `,
      [targetUserId]
    );

    return res.status(200).json({
      isFollowing,
      followersCount: counts.rows[0].followers_count,
      followingCount: counts.rows[0].following_count,
    });
  } catch (error) {
    console.error('Toggle follow error:', error);
    return res.status(500).json({ message: 'server error while toggling follow' });
  }
});

module.exports = router;