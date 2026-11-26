import { vi, it, expect, beforeEach, beforeAll } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../../../../public/locales/en/translation.json";

const deleteOrder = vi.fn();
vi.mock("../../../services/ordersService", () => ({
  ordersQuery: vi.fn(() => "q"),
  deleteOrder: (...a) => deleteOrder(...a),
}));
vi.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "u1" }, profile: { role: "User" }, loading: false }),
}));
const orders = [
  {
    id: "o1",
    authorFirstName: "Ann",
    createdAt: { toDate: () => new Date("2024-03-01T10:00:00Z") },
    order: ["Fruits", "Grains"],
    area: "120  m²",
    status: [{ value: "Submitted", label: "Submitted" }],
  },
  {
    id: "o2",
    authorFirstName: "Ann",
    createdAt: { toDate: () => new Date("2024-02-01T10:00:00Z") },
    order: ["Berries"],
    area: "30  m²",
    status: [{ value: "Completed", label: "Completed" }],
  },
];
vi.mock("../../../hooks/useCollection", () => ({
  useCollection: () => ({ data: orders, loading: false, error: null }),
}));

import MyOrders from "../MyOrders";

beforeAll(async () => {
  await i18n.use(initReactI18next).init({ lng: "en", keySeparator: false, resources: { en: { translation: en } }, interpolation: { escapeValue: false } });
});
beforeEach(() => {
  deleteOrder.mockReset();
  deleteOrder.mockResolvedValue();
});

it("renders one row per order with status chips", () => {
  render(
    <MemoryRouter>
      <MyOrders />
    </MemoryRouter>
  );
  // header row + two orders
  expect(screen.getAllByRole("row")).toHaveLength(3);
  expect(screen.getByText("Submitted")).toBeInTheDocument();
  expect(screen.getByText("Completed")).toBeInTheDocument();
  expect(screen.getByText("Fruits, Grains")).toBeInTheDocument();
});

it("deletes an order after confirmation", async () => {
  render(
    <MemoryRouter>
      <MyOrders />
    </MemoryRouter>
  );
  const rows = screen.getAllByRole("row");
  await userEvent.click(within(rows[1]).getByRole("button", { name: "Delete" }));
  const dialog = await screen.findByRole("dialog");
  await userEvent.click(within(dialog).getByRole("button", { name: "Delete" }));
  expect(deleteOrder).toHaveBeenCalledWith("o1");
});
