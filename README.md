# Modern Auth PWA

Full-stack authentication starter built with React, Express, MongoDB, and session-based security. The project ships with a responsive SASS-powered UI, optional HTTPS server, and offline-first PWA support.

## Highlights
- **React 18 + Vite** client with React Router and service worker driven PWA.
- **Express 4** API backed by **MongoDB/Mongoose** with session & cookie authentication.
- **Secure by default**: helmet, compression, Mongo-backed session store, SSL-ready bootstrapping.
- **SASS design system** with reusable layout, buttons, and auth forms.
- **Offline support** via custom service worker, installable manifest, and cached shell.

## Project Structure

```
.
├── config.env               # Server environment variables
├── server.js                # Express bootstrap with HTTP + HTTPS
├── src/
│   ├── app.js               # Express app factory
│   ├── config/              # DB + session config
│   ├── controllers/         # Auth controller
│   ├── middleware/          # Session/user middleware
│   ├── models/              # Mongoose models
│   └── routes/              # API route registration
└── client/
    ├── index.html
    ├── package.json
    ├── public/              # Manifest, service worker, offline fallback
    └── src/                 # React application
```

## Prerequisites
- Node.js 18+
- MongoDB 6+ (local or cloud)
- npm 9+
- (Optional) SSL certificate/key files for HTTPS

## Setup

1. **Install server dependencies**
   ```bash
   npm install
   ```

2. **Install client dependencies**
   ```bash
   npm install --prefix client
   ```

3. **Configure environment**
   Duplicate `config.env` or edit directly:
   ```env
   PORT=3001                     # HTTP port
   HTTPS_PORT=3443               # HTTPS port (if certs provided)
   MONGODB_URI=mongodb://localhost:27017/blog_platform
   SESSION_SECRET=replace_me_with_a_long_random_string
   SESSION_COOKIE_NAME=sid
   CLIENT_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   NODE_ENV=development
   SSL_KEY_PATH=certs/server.key # relative or absolute paths
   SSL_CERT_PATH=certs/server.crt
   SSL_CA_PATH=                  # optional chain file
   ```

   > In development, Vite proxies API requests to the Express server and the session cookie is issued against `SESSION_COOKIE_NAME`.

## Running Locally

Start the Express API:
```bash
npm run server:dev
```

In a separate terminal, start the React client:
```bash
npm run client:dev
```

The client is served from <http://localhost:5173> and proxies `/api` requests to <http://localhost:3001>. Session cookies are stored with `SameSite=Lax` in development.

## Production Build

1. Build the React client:
   ```bash
   npm run client:build
   ```

2. Ensure `NODE_ENV=production` and, if applicable, point SSL paths at valid certificates.

3. Launch the server:
   ```bash
   npm start
   ```

When `NODE_ENV=production`, the Express server serves the compiled client from `client/dist`, and HTTPS boots automatically if the configured certificate files are present.

## Authentication Flow
- `POST /api/auth/signup`: creates an account, hashes the password with bcrypt, and boots a new session.
- `POST /api/auth/login`: verifies credentials and regenerates the session to prevent fixation.
- `POST /api/auth/logout`: destroys the session and clears the auth cookie.
- `GET /api/auth/me`: returns the current authenticated user (requires session).

Session data lives in MongoDB via `connect-mongo`, and the React client always calls the API with `credentials: include` so cookies are exchanged automatically.

## PWA & Offline Mode
- `client/public/manifest.json` defines name, icons, and theme for installation.
- `client/public/sw.js` precaches the shell, handles navigation offline fallbacks, and proxies API requests network-first.
- `client/public/offline.html` is served when navigation occurs without connectivity.
- `client/src/serviceWorkerRegistration.js` registers the service worker in production and on-demand in development.

## SSL Setup
Place your certificate files anywhere accessible and update `SSL_KEY_PATH`, `SSL_CERT_PATH`, and optionally `SSL_CA_PATH`. On boot, the server reads and mounts an HTTPS listener on `HTTPS_PORT`. Without the paths the server still exposes plain HTTP for local development.

## Available Scripts
| Script | Description |
| ------ | ----------- |
| `npm run server:dev` | Start Express with nodemon and hot reload |
| `npm run client:dev` | Launch Vite dev server for the React client |
| `npm run client:build` | Build the client into `client/dist` |
| `npm run client:preview` | Preview the production client build locally |
| `npm start` | Run the Express server in production mode |

## Next Steps
- Hook additional API routes into `src/routes/index.js`.
- Extend the React UI with new pages by adding route components in `client/src/pages`.
- Integrate role-based authorization using the `roles` array on the `User` model.
- Consider adding automated tests (e.g., Vitest or Jest + Supertest) for API and UI flows.
