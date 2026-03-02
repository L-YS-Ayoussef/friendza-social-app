const express = require('express');
const path = require('path');
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

// DELETE /api/users/me/avatar
router.delete('/me/avatar', authMiddleware, async (req, res) => {
  try {
    const old = await pool.query(`SELECT avatar_url FROM users WHERE id = $1 LIMIT 1`, [req.userId]);
    if (!old.rows.length) return res.status(404).json({ message: 'user not found' });

    const oldUrl = old.rows[0].avatar_url;

    const updated = await pool.query(
      `
      UPDATE users
      SET avatar_url = NULL
      WHERE id = $1
      RETURNING id, username, full_name, avatar_url, bio, created_at
      `,
      [req.userId]
    );

    // delete old file if exists
    if (oldUrl && oldUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '../../uploads', path.basename(oldUrl));
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (_) {}
      }
    }

    return res.status(200).json({
      message: 'avatar removed',
      user: {
        id: updated.rows[0].id,
        username: updated.rows[0].username,
        fullName: updated.rows[0].full_name,
        avatarUrl: updated.rows[0].avatar_url,
        bio: updated.rows[0].bio,
        createdAt: updated.rows[0].created_at,
      },
    });
  } catch (error) {
    console.error('Remove avatar error:', error);
    return res.status(500).json({ message: 'server error while removing avatar' });
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

// GET /api/users/:userId/profile (adds followsMe)
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
        ) AS is_following,

        EXISTS(
          SELECT 1 FROM follows
          WHERE follower_id = u.id AND following_id = $1
        ) AS follows_me
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
        followsMe: row.follows_me,
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

// GET /api/users/:userId/posts
router.get('/:userId/posts', authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) return res.status(400).json({ message: 'invalid user id' });

    const gate = await pool.query(
      `
      SELECT
        u.is_private,
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

    if (!gate.rows.length) return res.status(404).json({ message: 'user not found' });

    const isOwnProfile = userId === req.userId;
    const isPrivateLocked = gate.rows[0].is_private && !gate.rows[0].is_following && !isOwnProfile;
    if (isPrivateLocked) return res.status(403).json({ message: 'private account' });

    const requestedLimit = Number(req.query.limit) || 60;
    const limit = Math.min(Math.max(requestedLimit, 1), 120);

    const result = await pool.query(
      `
      SELECT
        p.id,
        p.user_id,
        p.caption,
        p.media_url,
        p.media_type,
        p.location,
        p.created_at
      FROM posts p
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2
      `,
      [userId, limit]
    );

    return res.status(200).json({ posts: result.rows });
  } catch (error) {
    console.error('User posts error:', error);
    return res.status(500).json({ message: 'server error while fetching user posts' });
  }
});

// DELETE /api/users/:userId/follower
router.delete('/:userId/follower', authMiddleware, async (req, res) => {
  try {
    const followerUserId = Number(req.params.userId);
    if (!followerUserId) return res.status(400).json({ message: 'invalid user id' });
    if (followerUserId === req.userId) return res.status(400).json({ message: 'invalid operation' });

    const deleted = await pool.query(
      `
      DELETE FROM follows
      WHERE follower_id = $1 AND following_id = $2
      RETURNING follower_id
      `,
      [followerUserId, req.userId]
    );

    const counts = await pool.query(
      `
      SELECT
        (SELECT COUNT(*)::INT FROM follows WHERE following_id = $1) AS followers_count,
        (SELECT COUNT(*)::INT FROM follows WHERE follower_id = $1) AS following_count
      `,
      [followerUserId]
    );

    return res.status(200).json({
      removed: deleted.rows.length > 0,
      targetUserId: followerUserId,
      followersCount: counts.rows[0].followers_count,
      followingCount: counts.rows[0].following_count,
    });
  } catch (error) {
    console.error('Delete follower error:', error);
    return res.status(500).json({ message: 'server error while deleting follower' });
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

// GET /api/users/:userId/followers
router.get('/:userId/followers', authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) return res.status(400).json({ message: 'invalid user id' });

    const result = await pool.query(
      `
      SELECT
        u.id,
        u.username,
        u.full_name,
        u.avatar_url,
        EXISTS (
          SELECT 1
          FROM follows f2
          WHERE f2.follower_id = $2
            AND f2.following_id = u.id
        ) AS is_following
      FROM follows f
      INNER JOIN users u ON u.id = f.follower_id
      WHERE f.following_id = $1
      ORDER BY f.created_at DESC NULLS LAST, u.id DESC
      `,
      [userId, req.userId]
    );

    return res.status(200).json({
      users: result.rows.map((row) => ({
        id: row.id,
        username: row.username,
        fullName: row.full_name,
        avatarUrl: row.avatar_url,
        isFollowing: !!row.is_following,
      })),
    });
  } catch (error) {
    console.error('Followers list error:', error);
    return res.status(500).json({ message: 'server error while fetching followers' });
  }
});

// GET /api/users/:userId/following
router.get('/:userId/following', authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) return res.status(400).json({ message: 'invalid user id' });

    const result = await pool.query(
      `
      SELECT
        u.id,
        u.username,
        u.full_name,
        u.avatar_url,
        EXISTS (
          SELECT 1
          FROM follows f2
          WHERE f2.follower_id = $2
            AND f2.following_id = u.id
        ) AS is_following
      FROM follows f
      INNER JOIN users u ON u.id = f.following_id
      WHERE f.follower_id = $1
      ORDER BY f.created_at DESC NULLS LAST, u.id DESC
      `,
      [userId, req.userId]
    );

    return res.status(200).json({
      users: result.rows.map((row) => ({
        id: row.id,
        username: row.username,
        fullName: row.full_name,
        avatarUrl: row.avatar_url,
        isFollowing: !!row.is_following,
      })),
    });
  } catch (error) {
    console.error('Following list error:', error);
    return res.status(500).json({ message: 'server error while fetching following' });
  }
});

module.exports = router;