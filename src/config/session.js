const session = require('express-session');
const MongoStore = require('connect-mongo');

/**
 * Build an Express session middleware backed by MongoDB.
 */
const createSessionMiddleware = ({
  mongoUri,
  sessionSecret,
  cookieName = 'sid',
  ttlSeconds = 60 * 60 * 24 * 7, // 7 days
  isProduction = false,
}) => {
  if (!mongoUri) {
    throw new Error('Missing MongoDB connection string for session store.');
  }

  if (!sessionSecret) {
    throw new Error('Missing session secret. Set SESSION_SECRET in config.env.');
  }

  return session({
    name: cookieName,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoUri,
      collectionName: 'sessions',
      ttl: ttlSeconds,
      autoRemove: 'native',
    }),
    cookie: {
      httpOnly: true,
      sameSite: isProduction ? 'strict' : 'lax',
      secure: isProduction,
      maxAge: ttlSeconds * 1000,
    },
  });
};

module.exports = createSessionMiddleware;
