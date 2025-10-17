const bcrypt = require('bcryptjs');
const User = require('../models/User');

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const getSafeUser = (user) => (user ? user.toSafeJSON() : null);
const getSessionCookieName = (req) => req.app?.get('sessionCookieName') || 'sid';

const setSessionUser = (req, userId) =>
  new Promise((resolve, reject) => {
    req.session.regenerate((regenerateErr) => {
      if (regenerateErr) {
        return reject(regenerateErr);
      }

      req.session.userId = userId;

      req.session.save((saveErr) => {
        if (saveErr) {
          return reject(saveErr);
        }

        return resolve();
      });
    });
  });

/**
 * POST /api/auth/signup
 */
const signup = async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  try {
    const normalizedEmail = normalizeEmail(email);

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    await setSessionUser(req, user.id);

    return res.status(201).json({ user: getSafeUser(user) });
  } catch (error) {
    console.error('[auth] signup error:', error);
    return res.status(500).json({ message: 'Unable to sign up right now' });
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    await setSessionUser(req, user.id);

    return res.json({ user: getSafeUser(user) });
  } catch (error) {
    console.error('[auth] login error:', error);
    return res.status(500).json({ message: 'Unable to login right now' });
  }
};

/**
 * POST /api/auth/logout
 */
const logout = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('[auth] logout error:', err);
        return res.status(500).json({ message: 'Unable to logout right now' });
      }

      res.clearCookie(getSessionCookieName(req));
      return res.json({ message: 'Logged out' });
    });
  } else {
    res.clearCookie(getSessionCookieName(req));
    res.json({ message: 'Logged out' });
  }
};

/**
 * GET /api/auth/me
 */
const me = (req, res) => {
  if (!req.currentUser) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  return res.json({ user: getSafeUser(req.currentUser) });
};

module.exports = {
  signup,
  login,
  logout,
  me,
};
