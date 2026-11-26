# SoilViews

SoilViews is a web app for ordering and viewing satellite-derived soil and crop data. Users draw their fields on a map, choose what they want to monitor, and submit an order. Their saved fields stay available to them every time they sign in.

- Production app: https://app.soilviews.com
- About the project: https://soilviews.com

## Features

- **Map-based ordering:** a step-by-step wizard to draw field polygons or upload KML/GeoJSON files, pick crop categories (fruits, vegetables, protein, grains, vines, berries), review the area, and submit an order.
- **Saved fields:** every shape you submit is stored per user and shown again on the order map and in the "My fields" card on your profile, even after a reload.
- **Map tools:** multiple basemaps and WMS layers, place search, "locate me", fullscreen, and KML download.
- **My orders:** view, edit and delete your own orders and see their status.
- **Accounts:** sign up, sign in, password reset and a profile page. Roles are `User`, `Subscribed` and `Admin`.
- **Admin panel:** admins manage users and roles, review all orders and their statuses, see notifications and browse uploaded files.
- **Bilingual UI:** English and Bulgarian, with light and dark mode.
- **Notifications and email:** Cloud Functions record new users, projects and orders, and an optional email server sends order confirmations.

## Technologies

| Area | Technology |
|---|---|
| Frontend | React 19, Vite, React Router 6 |
| UI | MUI (Material UI) v6, light/dark theme |
| Map | Leaflet 1.9, react-leaflet 5, leaflet-draw, leaflet-geosearch |
| Backend | Firebase v10: Auth, Firestore, Storage, Cloud Functions |
| Email | Express + Sendgrid (separate small server) |
| i18n | i18next, react-i18next |
| Tests | Vitest, React Testing Library |

## Getting started

### Requirements

- Node.js 20 or newer (22 recommended). Check with `node -v`.
- Access to the SoilViews Firebase project (for the web config values).

### 1. Clone and install

```bash
git clone https://github.com/SoilViews/SoilViews.git
cd SoilViews
npm install
```

### 2. Configure Firebase

Copy the example file and fill in the values from the Firebase console (Project settings, then Your apps, then Web app config), or ask a maintainer for the dev project values:

```bash
cp .env.example .env.local
```

| Variable | Meaning |
|---|---|
| `VITE_FIREBASE_*` | Firebase web app config (API key, project ID, bucket and so on) |
| `VITE_EMAIL_SERVER_URL` | URL of the email server (default `http://127.0.0.1:4000`) |

`.env.local` is git-ignored. Never commit it.

### 3. Run the app

```bash
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `npm start` | Start the Vite dev server on port 3000 |
| `npm run build` | Production build into `build/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npx vitest run path/to/file.test.jsx` | Run a single test file |

## Project structure

```
src/
  main.jsx, App.jsx        Entry point and routes (lazy-loaded pages)
  firebase/config.js       Firebase setup from VITE_* variables
  services/                All Firebase access (auth, users, orders, projects, storage)
  context/, hooks/         AuthProvider/useAuth, useCollection, useMyShapes
  theme/                   MUI theme and light/dark mode
  components/
    layout/                App shell, side navigation, route guard
    Wizard/                Order wizard
    dashboard/             Map components (MapView, draw, upload, layers)
    MyOrders/, Admin/      Orders and admin screens
    auth/, Profile/ ...    Sign-in, sign-up, profile and static pages
public/locales/{en,bg}/    Translation files
functions/                 Firebase Cloud Functions
```

Firestore collections used: `users`, `orders`, `projects`, `messages`, `cordinates` (sic) and `notifications`. Their document shapes are shared with the existing production data, so don't change them without a migration plan.

## Translations

Translations live in `public/locales/en/translation.json` and `public/locales/bg/translation.json` and use flat keys such as `nav.home`. Add every new key to both files.

## Email server (optional)

A separate Express + Sendgrid server in `src/components/server/` with its own `package.json`.

```bash
cd src/components/server
npm install
export SENDGRID_API_KEY=your-key   # never commit this
cd ../../..
npm run server
```

Open http://localhost:4000. It should say "Welcome to the Sendgrid Emailing Server".

## Cloud Functions

They live in `functions/` with their own `package.json` (Node 20, `firebase-functions` v6 using the v1 API). Run `npm install` there before deploying.

## Deploy

```bash
npm run build
firebase deploy
```

Firebase Hosting serves the `build/` folder.

## Docker

```bash
npm run docker:build
npm run docker:run
```

The container runs the Vite dev server on port 3000. Pass the Firebase `VITE_*` values with `-e` flags, because `.env.local` is excluded from the image.

## Contributing

- Create a feature branch from `master` and open a pull request.
- Run `npm test` and `npm run build` before pushing.
- Don't commit secrets. `.env.local` and `sendgrid.env` must stay private.
