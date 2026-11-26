import { vi, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("./firebase/config", () => ({ app: {}, auth: {}, db: {}, storage: {} }));
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (_a, cb) => {
    cb(null);
    return () => {};
  },
}));
vi.mock("./services/usersService", () => ({ getUser: vi.fn() }));
vi.mock("./services/authService", () => ({ signOut: vi.fn() }));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k) => k, i18n: { language: "en", changeLanguage: vi.fn() } }),
}));
// Pages are migrated in later tasks; stub them so this test covers the shell + routing only.
vi.mock("./components/index/indexPage", () => ({ default: () => <div>index page</div> }));
vi.mock("./components/auth/SignIn", () => ({ default: () => <div>sign in page</div> }));
for (const p of [
  "auth/ResetPassword", "auth/SignUp", "projects/CreateProject", "Profile/profile",
  "ContactForm/ContactForm", "Help/HelpPage", "Admin/AdminPanel", "Admin/EditUser",
  "MyOrders/EditOrder", "MyOrders/MyOrders", "About/AboutUs",
  "Wizard/HorizontalLinearStepper", "Acknowledgements/Acknowledgements", "Pricing/Pricing",
]) {
  vi.doMock(`./components/${p}`, () => ({ default: () => <div>{p}</div> }));
}

// Desktop viewport so the persistent drawer is rendered.
window.matchMedia = (query) => ({
  matches: true, media: query, onchange: null,
  addEventListener: () => {}, removeEventListener: () => {},
  addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
});

import { ThemeModeProvider } from "./theme/ThemeModeProvider";
import { AuthProvider } from "./context/AuthContext";
const { AppRoutes } = await import("./App");

const renderAt = (path) =>
  render(
    <ThemeModeProvider>
      <AuthProvider>
        <MemoryRouter initialEntries={[path]}>
          <AppRoutes />
        </MemoryRouter>
      </AuthProvider>
    </ThemeModeProvider>
  );

it("renders the navigation landmark and home page", async () => {
  renderAt("/");
  expect(screen.getByRole("navigation", { name: "nav.main" })).toBeInTheDocument();
  expect(await screen.findByText("index page")).toBeInTheDocument();
});

it("redirects unauthenticated users from protected routes to /SignIn", async () => {
  renderAt("/MyOrders");
  expect(await screen.findByText("sign in page")).toBeInTheDocument();
});
