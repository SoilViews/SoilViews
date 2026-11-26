# SoilViews Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade SoilViews from React 16 / CRA 3 / MUI v4 / Redux to React 19 / Vite / MUI v6 / Firebase v10 modular SDK with context+hooks, and give it a new map-first UI with a shared theme, while keeping all current functionality.

**Architecture:** Vite builds the SPA. A `src/services/` layer wraps the Firebase v10 modular SDK (auth, users, orders, projects, messages, storage). `src/context/` providers (`AuthProvider`, `ThemeModeProvider`) and `src/hooks/` expose that data to components, replacing Redux and `react-redux-firebase`. One MUI v6 theme (`src/theme/`) drives all UI inside a new `AppShell` (collapsible side nav + top bar). The Leaflet map is upgraded to react-leaflet 4 and shown full-height with floating panels.

**Tech Stack:** React 19, Vite 6, React Router 6, MUI v6 (`@mui/material`, `@mui/icons-material`), Firebase 10 (modular), react-leaflet 4 + Leaflet 1.9, i18next + react-i18next, Vitest + React Testing Library, Node 22+.

**Spec:** Design approved in chat on 2026-11-26 (no spec file; the design is summarised in "Architecture" above and in the stages below).

## Global Constraints

- Node >= 20 (local machine: use `/usr/local/bin/node` v24; default `node` on PATH is v16 and is too old for Vite).
- Firestore collections and document shapes MUST NOT change: `users`, `orders`, `projects`, `messages`, `cordinates` (sic), `notifications`. No data migration.
- Roles stay `Admin`, `Subscribed`, `User` (`src/store/actions/Role.js` -> `src/constants/roles.js`).
- Keep en/bg i18n (`public/locales/{en,bg}/translation.json`); every new user-visible string needs a key in both files.
- Keep all existing routes in `src/App.js` working (`/`, `/indexPage`, `/SignIn`, `/SignUp`, `/ResetPassword`, `/CreateProject`, `/Dashboard`, `/NewOrder`, `/Profile`, `/ContactForm`, `/HelpPage`, `/AdminPanel`, `/MyOrders`, `/edit/:id`, `/editOrder/:id`, `/About`, `/Acknowledgements`, `/Pricing`).
- No Redux, no `react-redux-firebase`, no `redux-firestore` in the final code.
- Do NOT commit. The user reviews the working tree. Steps below that normally say "commit" are replaced by "run build + tests".
- Never print or copy the contents of `sendgrid.env` or the Firebase `apiKey`.
- Firebase config must move to `import.meta.env.VITE_FIREBASE_*` with a `.env.example`; the real `.env.local` is git-ignored.

---

## File Structure

New / replaced:

| Path | Responsibility |
|---|---|
| `vite.config.js`, `index.html` (root), `vitest.setup.js` | Build + test config |
| `src/main.jsx` | Entry: providers + `<App/>` |
| `src/firebase/config.js` | Initialise Firebase app, export `auth`, `db`, `storage` |
| `src/services/authService.js` | signIn, signUp, signOut, resetPassword |
| `src/services/usersService.js` | getUser, updateUser, subscribeUsers |
| `src/services/ordersService.js` | createOrder, updateOrder, deleteOrder, subscribeOrders |
| `src/services/projectsService.js` | project CRUD + messages + coordinates |
| `src/services/storageService.js` | uploadFile, listFolder, getDownloadUrl |
| `src/context/AuthContext.jsx` | `AuthProvider`, `useAuth()` -> `{ user, profile, loading }` |
| `src/hooks/useCollection.js` | Generic live Firestore subscription hook |
| `src/theme/index.js`, `src/theme/ThemeModeProvider.jsx` | MUI theme, light/dark |
| `src/components/layout/AppShell.jsx` | Top bar + collapsible side nav + `<Outlet/>` |
| `src/constants/roles.js` | Role constants |

Replaced in place (same folder, rewritten with MUI v6 + hooks): everything under `src/components/**`.
Deleted at the end: `src/store/`, `src/serviceWorker.js`, `src/components/DrawerLeft/`, `src/components/Help/Test*.js`, `src/components/Help/TableTest.js`, `src/App.test.js` (replaced), `dist/`, unused deps.

---

### Task 1: Tooling – Vite, React 19, Vitest baseline

**Files:**
- Create: `vite.config.js`, `index.html`, `vitest.setup.js`, `.env.example`, `src/main.jsx`, `src/App.test.jsx`
- Modify: `package.json`, `.gitignore`
- Delete: `public/index.html` (content moves to root `index.html`), `src/index.js`

**Interfaces:**
- Produces: `npm run dev|build|test` working on Node >= 20; `src/main.jsx` mounts `<App/>`.

- [ ] **Step 1: Install tooling** (use Node 24)

```bash
export PATH=/usr/local/bin:$PATH && node -v   # expect v24.x
npm install --save-dev vite @vitejs/plugin-react vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install react@19 react-dom@19
```

- [ ] **Step 2: Write config**

`vite.config.js`:
```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: { outDir: "build" },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.js",
    css: false,
  },
});
```
`vitest.setup.js`: `import "@testing-library/jest-dom/vitest";`

Root `index.html`: copy `public/index.html`, remove `%PUBLIC_URL%`, and add `<script type="module" src="/src/main.jsx"></script>` before `</body>`.

- [ ] **Step 3: Update `package.json`** scripts to `"dev": "vite"`, `"start": "vite"`, `"build": "vite build"`, `"preview": "vite preview"`, `"test": "vitest run"`, `"test:watch": "vitest"`; set `"type": "module"`, `"engines": {"node": ">=20"}`; remove `react-scripts`, `eslintConfig`, `browserslist`, `gh-pages`/`predeploy`/`deploy` scripts.

- [ ] **Step 4: Write a baseline smoke test** `src/App.test.jsx` that renders `<App/>` inside `MemoryRouter` with mocked Firebase (`vi.mock("./firebase/config")`) and asserts the nav landmark renders. (Initially this will fail until Tasks 2-3 land; it is un-skipped at Task 3.) For Task 1 use a trivial `expect(true)` test file `src/smoke.test.jsx` so `npm test` is green.

- [ ] **Step 5: Verify**

Run: `npm test` -> PASS. `npx vite build` may fail until the entry is migrated; that is fixed in Task 2.

---

### Task 2: Firebase v10 service layer

**Files:**
- Create: `src/firebase/config.js`, `src/services/{authService,usersService,ordersService,projectsService,storageService}.js`, `src/constants/roles.js`, `src/services/__tests__/ordersService.test.js`
- Delete (end of task): `src/firebase/index.js`

**Interfaces:**
- Produces (all async unless noted; Firestore data shapes identical to the old thunks in `src/store/actions/*`):
  - `signIn(email, password)`, `signUp({email,password,firstName,lastName,telephone,city,imageurl})`, `signOut()`, `resetPassword(email)`
  - `getUser(uid)`, `updateUser(uid, data)`, `subscribeUsers(cb) -> unsubscribe`
  - `createOrder({profile, uid, order})` (writes `authorFirstName, authorLastName, userId, createdAt, order, status:[{value:"Submitted",label:"Submitted"}]`), `updateOrder(id, data)`, `deleteOrder(id)`, `subscribeOrders({uid?}, cb) -> unsubscribe`
  - `createProject(project, {profile, uid})`, `deleteProject(id)`, `updateProject(id, data)`, `getProject(id)`, `sendMessage(message, {profile, uid})`, `saveCoordinates(coords, {profile, uid})`
  - `uploadFile(path, file, onProgress) -> Promise<url>`, `listFolder(path)`

- [ ] **Step 1: Failing test** for `createOrder` mocking `firebase/firestore`:

```js
import { vi, it, expect } from "vitest";
const addDoc = vi.fn().mockResolvedValue({ id: "o1" });
vi.mock("firebase/firestore", () => ({
  collection: (_db, name) => name, addDoc, serverTimestamp: () => "ts",
  getFirestore: vi.fn(),
}));
vi.mock("../../firebase/config", () => ({ db: {} }));
import { createOrder } from "../ordersService";

it("writes an order with Submitted status", async () => {
  await createOrder({ profile: { firstName: "A", lastName: "B" }, uid: "u1", order: [1] });
  expect(addDoc).toHaveBeenCalledWith("orders", expect.objectContaining({
    userId: "u1", authorFirstName: "A", order: [1],
    status: [{ value: "Submitted", label: "Submitted" }],
  }));
});
```

- [ ] **Step 2:** Run `npx vitest run src/services` -> FAIL (module missing).
- [ ] **Step 3:** Implement `config.js` (`initializeApp` from `import.meta.env.VITE_FIREBASE_*`, `getAuth`, `getFirestore`, `getStorage`) and the services using modular imports (`collection, addDoc, doc, setDoc, updateDoc, deleteDoc, getDoc, onSnapshot, query, where, orderBy`, `createUserWithEmailAndPassword`, etc.). `createdAt` stays `new Date()` (matches old data type). `signUp` writes `users/{uid}` with the exact fields from old `authActions.signUp`.
- [ ] **Step 4:** Create `.env.local` from the values currently in `src/firebase/index.js` (do not echo them), add `.env.example` with empty keys, add `.env.local` to `.gitignore`.
- [ ] **Step 5:** Run `npx vitest run src/services` -> PASS.

---

### Task 3: Auth context, hooks, routing, theme and app shell

**Files:**
- Create: `src/context/AuthContext.jsx`, `src/hooks/useCollection.js`, `src/theme/index.js`, `src/theme/ThemeModeProvider.jsx`, `src/components/layout/AppShell.jsx`, `src/components/layout/RequireAuth.jsx`, `src/context/__tests__/AuthContext.test.jsx`
- Modify: `src/main.jsx`, `src/App.jsx` (renamed from `App.js`), `src/i18n.js`

**Interfaces:**
- Consumes: services from Task 2.
- Produces: `useAuth() -> { user: FirebaseUser|null, profile: object|null, loading: boolean }`; `useCollection(queryFactory, deps) -> { data: Array<{id,...}>, loading, error }`; `useThemeMode() -> { mode, toggle }`; `<RequireAuth roles?>` redirecting to `/SignIn`; `<AppShell/>` rendering `<Outlet/>`.

- [ ] **Step 1: Failing test** – `AuthProvider` with mocked `onAuthStateChanged` yielding `{uid:"u1"}` and mocked `getUser` returning `{role:"Admin"}`; a consumer renders `profile.role`; expect "Admin" after load, and `loading` true initially.
- [ ] **Step 2:** Run -> FAIL. 
- [ ] **Step 3:** Implement `AuthProvider` (subscribe to `onAuthStateChanged`, fetch profile via `getUser`, expose context). Implement theme: primary earthy green (`#2e6b3a`), secondary soil brown (`#8a5a2b`), `shape.borderRadius: 12`, light/dark via `createTheme({palette:{mode}})`, persisted in `localStorage`.
- [ ] **Step 4:** Build `AppShell` (MUI `AppBar` + permanent/collapsible `Drawer` with links Home, New Order, My Orders, Profile, Pricing, Help, About, Contact, and Admin when `profile.role === Role.Admin`; language switcher en/bg and theme toggle in the app bar; sign-in/out button). Port `App.js` routes to React Router 6 (`<Routes>`, `element={...}`, layout route with `AppShell`, `RequireAuth` around `/Dashboard`, `/NewOrder`, `/MyOrders`, `/Profile`, `/AdminPanel` (roles `["Admin"]`), `/edit/:id`, `/editOrder/:id`). Replace `Footer`'s use of `connect`.
- [ ] **Step 5:** Port `i18n.js` (keep http-backend, `debug: false`, `useSuspense: true`); Replace `src/App.test.js` with the real smoke test from Task 1 and make it pass.
- [ ] **Step 6:** Run `npm test` -> PASS.

---

### Task 4: Auth, profile and static pages

**Files:**
- Modify (rewrite with MUI v6, `useAuth`, services, `useTranslation`): `src/components/auth/{SignIn,SignUp,ResetPassword}.js`, `src/components/Profile/profile.js`, `src/components/ContactForm/ContactForm.js`, `src/components/index/indexPage.js`, `src/components/About/AboutUs.js`, `src/components/Pricing/Pricing.js`, `src/components/Acknowledgements/Acknowledgements.js`, `src/components/Help/HelpPage.js`, `src/components/layout/NotFoundPage.js`, `src/components/projects/*`
- Test: `src/components/auth/__tests__/SignIn.test.jsx`

**Interfaces:** Consumes `signIn`, `signUp`, `resetPassword`, `sendMessage`, project services, `useAuth`.

- [ ] **Step 1: Failing test:** render `SignIn`, type email/password, click submit, expect mocked `signIn` called with the values; on rejection expect an error `Alert`.
- [ ] **Step 2:** Run -> FAIL. 
- [ ] **Step 3:** Rewrite the pages: centered `Card` forms, validation via `TextField` `error`/`helperText`, `Alert` for auth errors, redirect to `/Dashboard` when `user` exists. `ProjectDetails` uses `useCollection`/`getProject` instead of `firestoreConnect`; `EditProject`/`CreateProject` use `projectsService`. Remove inline Materialize/Bootstrap classes.
- [ ] **Step 4:** Run `npm test` -> PASS; manual: `npm run dev`, visit each route and confirm it renders.

---

### Task 5: Orders, wizard and map

**Files:**
- Modify: `src/components/Wizard/*`, `src/components/dashboard/*`, `src/components/MyOrders/*`, `src/leaflet.filelayer.js` (move to `src/components/dashboard/vendor/`)
- Test: `src/components/Wizard/__tests__/Wizard.test.jsx`, `src/components/MyOrders/__tests__/MyOrders.test.jsx`

**Interfaces:**
- Consumes: `createOrder`, `subscribeOrders`/`useCollection`, `updateOrder`, `deleteOrder`, `uploadFile`, `useAuth`.
- Produces: `<MapView onPolygonsChange(geojson[]) />` (full-height react-leaflet 4 map with draw, KML/GeoJSON upload, search, locate, fullscreen, layers control) used by `Wizard`.

- [ ] **Step 1: Failing tests:** (a) `MyOrders` with mocked `useCollection` returning two orders renders two rows and a delete button that calls `deleteOrder`; (b) `Wizard` "Next" is disabled with no polygon and enabled after `MapView` mock emits one, and final submit calls `createOrder`.
- [ ] **Step 2:** Run -> FAIL.
- [ ] **Step 3:** Map upgrade: `npm i react-leaflet@5 leaflet@1.9 leaflet-draw leaflet.locatecontrol leaflet.wms leaflet-geosearch @mapbox/togeojson tokml`. In react-leaflet 4+, `useLeaflet`/`withLeaflet` are gone: use `useMap()`; `MapContainer` replaces `Map`; `TileLayer`/`WMSTileLayer`/`LayersControl` stay. Replace `react-leaflet-draw` with a small `DrawControl` that registers `L.Control.Draw` on `useMap()` and forwards `draw:created|edited|deleted`. Replace `react-leaflet-search` with `leaflet-geosearch` (or Esri geocoder already in deps). Port `LocateControl`, `Legend`, `Metrics`, `CustomWMSLayer`, `KmlUpload` to `useMap()`. Keep all WMS/tile URLs from `AllLayers.js` unchanged.
- [ ] **Step 4:** Wizard: MUI `Stepper` kept; layout becomes map-first (full viewport height, floating `Paper` panel with step content on the left, summary `Card`s for selected crops). Port `NewCheckBoxes`, `SelectedCropsCards`, `Step2`, `Alert`, `AlertNoPoly`. Replace direct `firebase.firestore()` usage in `HorizontalLinearStepper.js:138` and `Dashboard.js` storage usage with services.
- [ ] **Step 5:** `MyOrders`/`EditOrder`/`OrdersTable`: MUI `Table` (or `DataGrid` only if needed), status chips, `useCollection` on `orders` where `userId == uid`.
- [ ] **Step 6:** Run `npm test` -> PASS; manual: draw polygon, upload a KML from `src/data`, submit an order against the dev Firebase project and confirm the Firestore document shape matches an existing order.

---

### Task 6: Admin panel

**Files:**
- Modify: `src/components/Admin/{AdminPanel,EditUser,Notifications,OrdersList,OrdersSummary,UsersList,UsersSummary}.js`
- Test: `src/components/Admin/__tests__/AdminPanel.test.jsx`

**Interfaces:** Consumes `useCollection` for `users`, `orders`, `notifications`; `updateUser`, `updateOrder`, `uploadFile`, `listFolder`.

- [ ] **Step 1: Failing test:** non-admin profile via mocked `useAuth` is redirected (RequireAuth `roles=["Admin"]`); admin sees tabs Users / Orders / Notifications with counts from mocked collections.
- [ ] **Step 2:** Run -> FAIL.
- [ ] **Step 3:** Rewrite with MUI tabs, summary stat `Card`s, and tables; replace `componentWillMount`/class lifecycle in `AdminPanel.js` with hooks; replace `getFirestore()`/`storageRef` usage with services; `EditUser` role select uses `constants/roles.js`.
- [ ] **Step 4:** Run `npm test` -> PASS.

---

### Task 7: Cleanup, backend alignment and docs

**Files:**
- Delete: `src/store/`, `src/serviceWorker.js`, `src/components/DrawerLeft/`, `src/components/Help/{TableTest,TestDrop,TestEkate}.js`, `dist/`, `src/firebase/index.js`
- Modify: `package.json` (remove unused deps), `functions/package.json` (`engines.node` 20, bump `firebase-functions`/`firebase-admin`), `src/components/server/server.js` (stop logging the API key), `README.md`, `CLAUDE.md`, `Dockerfile` (`FROM node:22-alpine`, run `npm run dev -- --host`), `firebase.json` (keep `public: build`)

- [ ] **Step 1:** `grep -rn "react-redux\|redux\|react-redux-firebase\|redux-firestore\|@material-ui\|materialize\|reactstrap\|bootstrap" src` must return nothing; remove those packages plus react-admin, material-table, ag-grid-*, react-table*, react-bootstrap-table, react-crud-table, react-materialize, react-dropdown, react-history, react-native-scale-bar, react-mailchimp-form (only if unused after grep), `concurrently`, `express`/`@sendgrid/mail` from the web app's dependencies if the email server keeps its own `package.json` (move them into `src/components/server/package.json`).
- [ ] **Step 2:** Run `npm run build` -> succeeds; `npm test` -> PASS; `npm audit --omit=dev` -> note remaining issues in the final report.
- [ ] **Step 3:** Update `README.md` and `CLAUDE.md` to the new commands, structure and Node requirement.
- [ ] **Step 4:** Report to the user: what changed, what could not be verified (anything needing the real Firebase project), and the recommendation to rotate the Sendgrid key and remove `sendgrid.env` from git history. Do not commit.

---

## Self-Review

- **Spec coverage:** Vite/React 19/Node (T1), Redux removal + Firebase v10 + context/hooks (T2-3), theme/app shell/dark mode/i18n (T3), pages (T4), map-first wizard + react-leaflet 4 (T5), admin (T6), dependency cleanup, functions/email alignment, docs (T7), tests throughout (T1-T6).
- **Placeholders:** None intentionally; ports in T4-T6 reference exact source files and the services they consume.
- **Type consistency:** Service names in T2 are the only ones referenced in T3-T6; `useAuth`/`useCollection` signatures defined in T3 are consumed in T4-T6.
