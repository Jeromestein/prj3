# Modern Blog Websites

Full-stack blog platform built with React, Express, and MongoDB. Visitors can browse public articles while authenticated authors create, edit, and delete Markdown-powered posts directly from the dashboard. The project ships with a responsive SASS UI, optional HTTPS server, and offline-first PWA support.

## Highlights

- **React 18 + Vite** single-page client with React Router, context-driven auth, and service worker powered PWA.
- **Post authoring workflow**: Markdown editor, live routing, and dashboard tools to view, edit, and delete personal posts.
- **Express 4 + MongoDB/Mongoose** API with session & cookie authentication, slug generation, and author-scoped access control.
- **Secure by default**: helmet, compression, Mongo-backed session store, SSL-ready bootstrapping.
- **SASS design system** covering cards, typography, dashboard layouts, and reusable button styles.
- **Offline support** via custom service worker, installable manifest, and cached shell.

## Feature Overview

- **Public pages** (`/`, `/posts`, `/contact`) with responsive layouts and in-app navigation.
- **Authentication** (`/signup`, `/login`) backed by session cookies; `ProtectedRoute` guards private routes.
- **Post management**
  - Create and edit posts in Markdown; content is rendered via `react-markdown` + `remark-gfm`.
  - Automatic slug generation, topic tags, and read-time metadata.
  - `/posts` index supports sorting by date, author, or topic; `/posts/:slug` renders full content.
  - Dashboard lists the signed-in author's posts with quick links to view, edit, refresh, or delete.
- **API**
  - `GET /api/posts` - Public list with sort controls.
  - `GET /api/posts/:idOrSlug` - Retrieve a single post.
  - `GET /api/posts/mine` - Authenticated author list.
  - `POST /api/posts`, `PUT /api/posts/:id`, `DELETE /api/posts/:id` - Authenticated CRUD with author checks.
  - Auth endpoints remain available under `/api/auth/*`.

## Project Structure

```
.
|-- config.env               # Server environment variables
|-- server.js                # Express bootstrap with HTTP + HTTPS
|-- src/
|   |-- app.js               # Express app factory
|   |-- config/              # DB + session config
|   |-- controllers/         # Auth + post controllers
|   |-- middleware/          # Session/user middleware
|   |-- models/              # Mongoose models
|   `-- routes/              # API route registration
`-- client/
    |-- index.html
    |-- package.json
    |-- public/              # Manifest, service worker, offline fallback
    `-- src/                 # React application
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
   >

## Running Locally

Start the Express API:

```bash
npm run server:dev
```

In a separate terminal, start the React client:

```bash
npm run client:dev
```

The client is served from [http://localhost:5173](http://localhost:5173) and proxies `/api` requests to [http://localhost:3001](http://localhost:3001). Session cookies are stored with `SameSite=Lax` in development.

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

## Posts Workflow

- Posts are persisted in the `Post` collection with title, slug, topic, excerpt, read time, Markdown body, author references, and timestamps.
- Slugs are generated server-side (`generateSlug`) and remain unique across edits.
- Authors can manage their own content only; every mutation route verifies the current session user before proceeding.
- Markdown content is stored as plain text in MongoDB and rendered client-side with GitHub Flavored Markdown support.
- The dashboard retrieves `/api/posts/mine` to show authored posts, and delete operations ask for confirmation before calling the API.

## PWA & Offline Mode

- `client/public/manifest.json` defines name, icons, and theme for installation.
- `client/public/sw.js` precaches the shell, handles navigation offline fallbacks, and proxies API requests network-first.
- `client/public/offline.html` is served when navigation occurs without connectivity.
- `client/src/serviceWorkerRegistration.js` registers the service worker in production and on-demand in development.

## SSL Setup

Place your certificate files anywhere accessible and update `SSL_KEY_PATH`, `SSL_CERT_PATH`, and optionally `SSL_CA_PATH`. On boot, the server reads and mounts an HTTPS listener on `HTTPS_PORT`. Without the paths the server still exposes plain HTTP for local development.

## Available Scripts

| Script                     | Description                                 |
| -------------------------- | ------------------------------------------- |
| `npm run server:dev`     | Start Express with nodemon and hot reload   |
| `npm run client:dev`     | Launch Vite dev server for the React client |
| `npm run client:build`   | Build the client into `client/dist`       |
| `npm run client:preview` | Preview the production client build locally |
| `npm start`              | Run the Express server in production mode   |

## Next Steps

- Hook additional API routes into `src/routes/index.js`.
- Extend the React UI with new pages by adding route components in `client/src/pages`.
- Integrate role-based authorization using the `roles` array on the `User` model.
- Consider adding automated tests (e.g., Vitest or Jest + Supertest) for API and UI flows.
