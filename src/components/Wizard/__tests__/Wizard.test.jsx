import { vi, it, expect, beforeEach, beforeAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../../../../public/locales/en/translation.json";

const createOrder = vi.fn();
vi.mock("../../../services/ordersService", () => ({ createOrder: (...a) => createOrder(...a) }));
vi.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { uid: "u1" },
    profile: { firstName: "Ann", lastName: "Lee", email: "ann@example.com", role: "User" },
    loading: false,
  }),
}));

const square = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [[[23.3, 42.69], [23.31, 42.69], [23.31, 42.7], [23.3, 42.7], [23.3, 42.69]]],
  },
};
vi.mock("../../dashboard/MapView", () => ({
  default: ({ onPolygonsChange }) => (
    <button type="button" onClick={() => onPolygonsChange([square])}>
      emit-polygon
    </button>
  ),
}));

vi.mock("../../../hooks/useMyShapes", () => ({ useMyShapes: () => ({ shapes: [], loading: false }) }));
import HorizontalLinearStepper from "../HorizontalLinearStepper";

beforeAll(async () => {
  await i18n.use(initReactI18next).init({ lng: "en", keySeparator: false, resources: { en: { translation: en } }, interpolation: { escapeValue: false } });
});

beforeEach(() => {
  createOrder.mockReset();
  createOrder.mockResolvedValue({ id: "o1" });
  global.fetch = vi.fn().mockResolvedValue({});
});

const setup = () =>
  render(
    <MemoryRouter>
      <HorizontalLinearStepper />
    </MemoryRouter>
  );

it("disables Next until a polygon exists, then walks through to createOrder", async () => {
  setup();
  await userEvent.click(screen.getByRole("button", { name: "Start" }));

  const next = screen.getByRole("button", { name: "Next" });
  expect(next).toBeDisabled();

  await userEvent.click(screen.getByRole("button", { name: "emit-polygon" }));
  expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
  await userEvent.click(screen.getByRole("button", { name: "Next" }));

  // crops step: Next disabled until one crop is ticked
  expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  await userEvent.click(screen.getByRole("checkbox", { name: /Fruits/ }));
  await userEvent.click(screen.getByRole("button", { name: "Next" }));

  await userEvent.click(screen.getByRole("button", { name: "Submit order" }));

  await waitFor(() => expect(createOrder).toHaveBeenCalledTimes(1));
  const arg = createOrder.mock.calls[0][0];
  expect(arg.uid).toBe("u1");
  expect(arg.profile.firstName).toBe("Ann");
  expect(arg.order).toEqual(["Fruits"]);
  // legacy doc shape: `area` plus the first ring spread as "0","1",... keys
  expect(arg.extra.area).toMatch(/m²$/);
  expect(arg.extra[0]).toEqual([23.3, 42.69]);
  expect(arg.shapes).toEqual([square]);
  expect(await screen.findByText(en["wizard.completed"])).toBeInTheDocument();
});
