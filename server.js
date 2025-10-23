const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const dotenv = require('dotenv');

const connectDB = require('./src/config/db');
const createApp = require('./src/app');
const ensureInitialPosts = require('./src/seeds/ensurePosts');

dotenv.config({ path: path.resolve(__dirname, 'config.env') });

const {
  PORT = 3001,
  HTTPS_PORT = 3443,
  MONGODB_URI,
  SESSION_SECRET,
  SESSION_COOKIE_NAME,
  CLIENT_ORIGINS,
  NODE_ENV = 'development',
  SSL_KEY_PATH,
  SSL_CERT_PATH,
  SSL_CA_PATH,
} = process.env;

const isProduction = NODE_ENV === 'production';
const defaultDevOrigins = 'http://localhost:5173,http://127.0.0.1:5173';
const allowedOrigins = (CLIENT_ORIGINS || (isProduction ? '' : defaultDevOrigins))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const loadSslConfig = () => {
  if (!SSL_KEY_PATH || !SSL_CERT_PATH) {
    return null;
  }

  try {
    const key = fs.readFileSync(path.resolve(__dirname, SSL_KEY_PATH));
    const cert = fs.readFileSync(path.resolve(__dirname, SSL_CERT_PATH));
    const ca = SSL_CA_PATH ? fs.readFileSync(path.resolve(__dirname, SSL_CA_PATH)) : undefined;

    if (ca) {
      return { key, cert, ca };
    }

    return { key, cert };
  } catch (error) {
    console.warn('[server] Unable to load SSL certificates:', error.message);
    return null;
  }
};

const startServer = async () => {
  try {
    await connectDB(MONGODB_URI);
    await ensureInitialPosts();

    const app = createApp({
      mongoUri: MONGODB_URI,
      sessionSecret: SESSION_SECRET,
      allowedOrigins,
      sessionCookieName: SESSION_COOKIE_NAME,
      isProduction,
    });

    const httpServer = http.createServer(app);
    httpServer.listen(PORT, () => {
      console.log(`[server] HTTP listening on http://localhost:${PORT}`);
    });

    const sslConfig = loadSslConfig();
    if (sslConfig) {
      const httpsServer = https.createServer(sslConfig, app);
      httpsServer.listen(HTTPS_PORT, () => {
        console.log(`[server] HTTPS listening on https://localhost:${HTTPS_PORT} (SSL enabled)`);
      });
    } else {
      console.warn('[server] SSL certificates not configured. HTTPS server not started.');
    }
  } catch (error) {
    console.error('[server] Fatal startup error:', error);
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (reason) => {
  console.error('[server] Unhandled promise rejection:', reason);
});

process.on('SIGINT', () => {
  console.log('[server] Shutting down...');
  process.exit(0);
});
