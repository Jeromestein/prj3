# React Application Architecture

The legacy multi-page (static HTML) contact site has been rebuilt as a modern single-page application powered by React Router. This document explains how the client is organised and how routing simulates a multi-page experience.

## Overview

- **SPA shell** served by `client/index.html`.
- **React Router** handles navigation between logical pages (`/`, `/login`, `/signup`, `/dashboard`).
- **Session-aware context** hydrates user information via `/api/auth/me` and exposes auth helpers to every route.
- **SASS styling** delivers a cohesive design system that can be extended per page.

## Key Modules

| Location | Responsibility |
| -------- | -------------- |
| `client/src/App.jsx` | Declares top-level routes and shared layout (header, main content). |
| `client/src/context/AuthContext.jsx` | Centralises auth state, session refresh, signup/login/logout helpers. |
| `client/src/components/ProtectedRoute.jsx` | Guards authenticated routes and redirects anonymous users. |
| `client/src/pages/*` | Individual page views rendered by the router. |
| `client/src/styles/` | SASS modules providing variables, theming, and layout primitives. |

## Route Flow

1. **Home (`/`)** – marketing copy with contextual CTAs that adapt to the auth state.
2. **Signup (`/signup`)** – registration form posting to `/api/auth/signup`; success redirects to the dashboard.
3. **Login (`/login`)** – login form posting to `/api/auth/login`; fails surface contextual error messaging.
4. **Dashboard (`/dashboard`)** – protected screen showing account metadata and a manual "Refresh session" action.

Navigation updates the browser history so the back/forward buttons behave naturally, mirroring an MPA while retaining client-side speed.

## Auth Lifecycle

1. On initial load, `AuthProvider` calls `/api/auth/me`.
2. If a session exists, user data is cached and the UI renders authenticated routes immediately.
3. `AuthForm` components call `signup` or `login`, which regenerate the session on the server and hydrate the client state.
4. `logout` destroys the session, clears the cookie, and resets the UI.

## Extending the App

- **New pages**: drop a component into `client/src/pages`, register it in `App.jsx`, and author any route guards as needed.
- **Shared SASS**: define reusable tokens or mixins inside `client/src/styles/_variables.scss` or additional partials.
- **PWA assets**: expand `client/public/manifest.json` and `client/public/sw.js` with new routes or offline behaviours.

## Server Integration

The Express API runs independently on port `3001` (configurable) and exposes session-protected endpoints. During development, the Vite dev server proxies `/api` and `/health` to Express to avoid manual CORS juggling. In production, Express serves the compiled React bundle, enabling a cohesive deployment target with optional HTTPS.
