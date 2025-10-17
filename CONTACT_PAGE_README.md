# Authentication UI Guide

The contact-page prototype has been replaced with dedicated authentication screens built in React and styled with SASS. This guide outlines the new user experience and how the components fit together.

## Screens

| Route | Purpose | Key Components |
| ----- | ------- | --------------- |
| `/` | Landing copy, contextual CTAs that adapt to auth state | `<Header />`, `<Home />` |
| `/signup` | Account creation with name/email/password | `<AuthForm showNameField />` |
| `/login` | Existing user authentication | `<AuthForm />` |
| `/dashboard` | Session-protected account overview | `<ProtectedRoute />`, `<Dashboard />` |

## AuthForm Component

Located at `client/src/components/AuthForm.jsx`, the form encapsulates:

- Shared layout, error messaging, and primary button styling.
- Optional name field toggled via `showNameField`.
- Min-length validation on password inputs.
- `onFieldChange` callback to reset error state while the user types.

## Visual Language

- SASS variables in `client/src/styles/_variables.scss` centralise typography, color, and spacing tokens.
- `client/src/styles/main.scss` composes page cards, buttons, chips, and responsive header layouts.
- The gradient background and glassmorphism header maintain visual cohesion across screens.

## Interaction Flow

1. Forms call `useAuth()` helpers for signup/login; each helper updates context state and propagates user data.
2. Errors returned by the API surface inline inside the form.
3. Successful authentication redirects to `/dashboard` using React Router navigation.
4. Logout clears the Mongo-backed session, resets context, and returns the visitor to `/`.

## Customising Further

- Add new content sections by composing reusable card and button classes in the SASS layer.
- Include additional profile data on the dashboard by extending `User.toSafeJSON()` on the server and reading the values in the React page.
- Modify navigation items in `client/src/components/Header.jsx`; the component automatically reflects authentication status.
