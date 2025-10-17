const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const createSessionMiddleware = require('./config/session');
const { attachUser } = require('./middleware/auth');
const apiRoutes = require('./routes');

const buildCorsOptions = (allowedOrigins) => {
  if (!allowedOrigins || allowedOrigins.length === 0) {
    return {
      origin: false,
      credentials: true,
    };
  }

  const origins = allowedOrigins.map((origin) => origin.trim()).filter(Boolean);

  return {
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (origins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('CORS policy violation'));
    },
    credentials: true,
  };
};

const createApp = ({
  mongoUri,
  sessionSecret,
  allowedOrigins = [],
  sessionCookieName = 'sid',
  isProduction = false,
} = {}) => {
  const app = express();

  app.set('trust proxy', 1);
  app.set('sessionCookieName', sessionCookieName);

  app.use(helmet());
  app.use(compression());
  app.use(morgan(isProduction ? 'combined' : 'dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  const corsOptions = buildCorsOptions(allowedOrigins);
  if (corsOptions.origin) {
    app.use(cors(corsOptions));
  }

  const sessionMiddleware = createSessionMiddleware({
    mongoUri,
    sessionSecret,
    cookieName: sessionCookieName,
    isProduction,
  });
  app.use(sessionMiddleware);
  app.use(attachUser);

  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api', apiRoutes);

  app.use('/api', (req, res) => {
    res.status(404).json({ message: 'Resource not found' });
  });

  app.use((err, req, res, next) => {
    console.error('[server] Unhandled error:', err);
    res.status(500).json({ message: 'Unexpected server error' });
  });

  // Serve built React app in production
  if (isProduction) {
    const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
    app.use(express.static(clientBuildPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  }

  return app;
};

module.exports = createApp;
