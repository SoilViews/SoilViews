# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

SoilViews is a React 19 + Vite single-page app for ordering and viewing soil/crop satellite-derived data on a Leaflet map (react-leaflet 5). UI is MUI v6, routing is React Router 6. Backend is Firebase v10 modular SDK (Auth, Firestore, Storage, Cloud Functions). Production: app.soilviews.com. Bilingual (en/bg). Requires Node >= 20 (on this machine put `/usr/local/bin` first on PATH).

## Commands

- `npm install`, `npm run dev` - dev server on http://localhost:3000
- `npm run build` - production build into `build/` (Firebase Hosting serves `build`); `npm run preview`
- `npm test` - Vitest (single run); single file: `npx vitest run path/to/file.test.jsx`, single test: `npx vitest run -t "name"`; `npm run test:watch`
- `npm run server` - Sendgrid email Express server (`src/components/server/`, own `package.json`, run `npm install` there first; needs `SENDGRID_API_KEY` env var; port 4000)
- Deploy: `npm run build` then `firebase deploy`. Cloud Functions are in `functions/` (own `package.json`, Node 20, `firebase-functions/v1`).
- Docker: `npm run docker:build` / `npm run docker:run` (Vite dev server on port 3000)
- Config: copy `.env.example` to `.env.local` (`VITE_FIREBASE_*`, `VITE_EMAIL_SERVER_URL`).

## Architecture

- `src/main.jsx` mounts providers (`ThemeModeProvider`, `AuthProvider`) and `App`. `src/App.jsx` declares all routes (lazy-loaded pages) under the `AppShell` layout route; `RequireAuth` (optionally with `roles`) guards protected routes.
- `src/firebase/config.js` initialises Firebase from `import.meta.env.VITE_FIREBASE_*` and exports `app`, `auth`, `db`, `storage`. Components never call Firebase directly: use `src/services/*` (auth, users, orders, projects, notifications, storage).
- `src/context/AuthContext.jsx`: `useAuth()` -> `{ user, profile, loading }`. `src/hooks/useCollection.js`: live Firestore subscription hook. `src/theme/`: MUI theme + light/dark `ThemeModeProvider`. `src/constants/roles.js`: `Admin`, `Subscribed`, `User`.
- `src/components/layout/AppShell.jsx`: top bar, side nav, language/theme toggles, `<Outlet/>`.
- Ordering flow: `/Dashboard` and `/NewOrder` render `Wizard/HorizontalLinearStepper` (draw/upload area on `dashboard/MapView` -> crops -> review -> submit order). Map pieces (`DrawControl`, `KmlUpload`, `AllLayers`, `Legend`, ...) are in `src/components/dashboard/`; `AllLayers.jsx` WMS/tile URLs (several on `kade.si`) must stay unchanged.
- Firestore collections and shapes (`users`, `orders`, `projects`, `messages`, `cordinates` (sic), `notifications`) must not change.
- i18n: `src/i18n.js` loads `public/locales/{en,bg}/translation.json` over HTTP with flat keys (`keySeparator: false`); add every new key to both files and use `useTranslation`.
- Cloud Functions (`functions/index.js`) write `notifications` documents on project/order creation and user signup.
- Email: separate Express server (`src/components/server/server.js`, CommonJS); the Wizard calls it at `VITE_EMAIL_SERVER_URL` with query params.
- Sample/static data: `src/data/` (`ekate.json`, `masivi_haskovo.json`), `src/components/Files/`. `build/` is generated output.

## Notes

- `sendgrid.env` is git-ignored but treat as sensitive; never print it or the Firebase apiKey. The Sendgrid key should be rotated.
- Do not commit unless asked.
