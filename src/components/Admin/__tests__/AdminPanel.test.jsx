import { vi, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../../../../public/locales/en/translation.json";

let role = "Admin";
vi.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "a1" }, profile: { role }, loading: false }),
}));
vi.mock("../../../services/usersService", () => ({
  usersQuery: vi.fn(() => "users"),
  getUser: vi.fn(),
  updateUser: vi.fn(),
}));
vi.mock("../../../services/ordersService", () => ({
  ordersQuery: vi.fn(() => "orders"),
  deleteOrder: vi.fn(),
}));
vi.mock("../../../services/notificationsService", () => ({
  notificationsQuery: vi.fn(() => "notifications"),
}));
vi.mock("../../../services/storageService", () => ({
  listFolder: vi.fn().mockResolvedValue([]),
  uploadFile: vi.fn(),
}));
const data = {
  users: [
    { id: "u1", firstName: "Ann", lastName: "A", email: "ann@x.com", city: "Sofia" },
    { id: "u2", firstName: "Bob", lastName: "B", email: "bob@x.com", city: "Varna" },
  ],
  orders: [
    {
      id: "o1",
      authorFirstName: "Ann",
      createdAt: { toDate: () => new Date("2024-03-01T10:00:00Z") },
      order: ["Fruits"],
      status: [{ value: "Submitted", label: "Submitted" }],
    },
  ],
  notifications: [
    { id: "n1", user: "Ann", content: "Joined", time: { toDate: () => new Date() } },
    { id: "n2", user: "Bob", content: "Ordered", time: { toDate: () => new Date() } },
    { id: "n3", user: "Cy", content: "Left", time: { toDate: () => new Date() } },
  ],
};
vi.mock("../../../hooks/useCollection", () => ({
  useCollection: (factory) => {
    const key = factory();
    return { data: data[key] ?? [], loading: false, error: null };
  },
}));

import AdminPanel from "../AdminPanel";
import RequireAuth from "../../layout/RequireAuth";

beforeAll(async () => {
  await i18n.use(initReactI18next).init({ lng: "en", keySeparator: false, resources: { en: { translation: en } }, interpolation: { escapeValue: false } });
});

const renderApp = () =>
  render(
    <MemoryRouter initialEntries={["/AdminPanel"]}>
      <Routes>
        <Route path="/" element={<div>home page</div>} />
        <Route element={<RequireAuth roles={["Admin"]} />}>
          <Route path="/AdminPanel" element={<AdminPanel />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

it("redirects non-admins away", () => {
  role = "User";
  renderApp();
  expect(screen.getByText("home page")).toBeInTheDocument();
  expect(screen.queryByRole("tab", { name: /users/i })).not.toBeInTheDocument();
});

it("shows tabs and counts for admins", async () => {
  role = "Admin";
  renderApp();
  expect(screen.getByRole("tab", { name: /users/i })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: /orders/i })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: /notifications/i })).toBeInTheDocument();
  expect(screen.getByTestId("count-users")).toHaveTextContent("2");
  expect(screen.getByTestId("count-orders")).toHaveTextContent("1");
  expect(screen.getByTestId("count-notifications")).toHaveTextContent("3");
  expect(screen.getByText("ann@x.com")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("tab", { name: /notifications/i }));
  expect(screen.getByText(/Joined/)).toBeInTheDocument();
});
