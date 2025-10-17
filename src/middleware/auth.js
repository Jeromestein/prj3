const User = require('../models/User');

/**
 * Attach `req.currentUser` when a session user id is present.
 */
const attachUser = async (req, res, next) => {
  if (!req.session || !req.session.userId) {
    req.currentUser = null;
    return next();
  }

  try {
    const user = await User.findById(req.session.userId).select('-password');
    req.currentUser = user || null;
  } catch (error) {
    req.currentUser = null;
    console.error('[auth] attachUser error:', error.message);
  }

  return next();
};

/**
 * Guard middleware requiring an authenticated session.
 */
const requireAuth = (req, res, next) => {
  if (req.currentUser) {
    return next();
  }

  return res.status(401).json({ message: 'Authentication required' });
};

module.exports = {
  attachUser,
  requireAuth,
};
