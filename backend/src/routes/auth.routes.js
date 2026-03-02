const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const buildToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const mapUser = (row) => ({
  id: row.id,
  username: row.username,
  email: row.email,
  fullName: row.full_name,
  bio: row.bio,
  avatarUrl: row.avatar_url,
  createdAt: row.created_at,
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, fullName, bio } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'password must be at least 6 characters' });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    const safeFullName = fullName ? fullName.trim() : null;
    const safeBio = bio ? String(bio).trim() : null;

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [normalizedUsername, normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'username or email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const insertResult = await pool.query(
      `
      INSERT INTO users (username, email, password_hash, full_name, bio)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, email, full_name, bio, avatar_url, created_at
      `,
      [normalizedUsername, normalizedEmail, passwordHash, safeFullName, safeBio]
    );

    const user = mapUser(insertResult.rows[0]);
    const token = buildToken(user.id);

    return res.status(201).json({
      message: 'signup successful',
      token,
      user,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'server error during signup' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'emailOrUsername and password are required' });
    }

    const identifier = emailOrUsername.trim().toLowerCase();

    const result = await pool.query(
      `
      SELECT id, username, email, full_name, bio, avatar_url, created_at, password_hash
      FROM users
      WHERE email = $1 OR username = $1
      LIMIT 1
      `,
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const userRow = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, userRow.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const token = buildToken(userRow.id);

    return res.status(200).json({
      message: 'login successful',
      token,
      user: mapUser(userRow),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'server error during login' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, username, email, full_name, bio, avatar_url, created_at
      FROM users
      WHERE id = $1
      LIMIT 1
      `,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'user not found' });
    }

    return res.status(200).json({
      user: mapUser(result.rows[0]),
    });
  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({ message: 'server error while fetching user' });
  }
});

module.exports = router;