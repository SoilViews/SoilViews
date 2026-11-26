import { vi, it, expect, beforeEach, beforeAll, describe } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../../../../public/locales/en/translation.json";
import bg from "../../../../public/locales/bg/translation.json";

const getOrder = vi.fn();
const updateOrder = vi.fn();
vi.mock("../../../services/ordersService", () => ({
  getOrder: (...a) => getOrder(...a),
  updateOrder: (...a) => updateOrder(...a),
  buildShapeUpdate: () => ({ shapes: "SHAPES", area: "AREA" }),
}));
let auth;
vi.mock("../../../context/AuthContext", () => ({ useAuth: () => auth }));
const ring = [[23.3, 42.69], [23.31, 42.69], [23.31, 42.7], [23.3, 42.69]];
vi.mock("../../dashboard/MapView", () => ({
  default: ({ editable, initialFeatures, onPolygonsChange }) => (
    <div data-testid="map" data-editable={String(editable)} data-count={initialFeatures?.length ?? 0}>
      <button type="button" onClick={() => onPolygonsChange([])}>clear-all</button>
    </div>
  ),
}));
import EditOrder from "../EditOrder";

const base = {
  id: "o1", userId: "u1", order: ["Fruits"], status: [{ value: "Submitted", label: "Submitted" }],
  shapes: JSON.stringify({ type: "FeatureCollection", features: [{ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [ring] } }] }),
};
const setup = async (order, a) => {
  auth = a;
  getOrder.mockResolvedValue(order);
  render(
    <MemoryRouter initialEntries={["/editOrder/o1"]}>
      <Routes>
        <Route path="/editOrder/:id" element={<EditOrder />} />
        <Route path="/MyOrders" element={<div>list</div>} />
      </Routes>
    </MemoryRouter>
  );
  return screen.findByTestId("map");
};
const owner = { user: { uid: "u1" }, profile: { role: "User" } };
const admin = { user: { uid: "a1" }, profile: { role: "Admin" } };

beforeAll(async () => {
  await i18n.use(initReactI18next).init({ lng: "en", keySeparator: false, resources: { en: { translation: en } }, interpolation: { escapeValue: false } });
});
beforeEach(() => {
  updateOrder.mockReset();
  updateOrder.mockResolvedValue();
});

it("has the new keys in both locales", () => {
  for (const k of ["orders.viewOnMap", "orders.edit.map", "orders.edit.readOnly", "orders.edit.noShape", "orders.edit.area"]) {
    expect(en[k]).toBeTruthy();
    expect(bg[k]).toBeTruthy();
  }
});

describe("EditOrder shape", () => {
  it("loads the shape; owner + Submitted is editable and saves shape fields", async () => {
    const map = await setup(base, owner);
    expect(map).toHaveAttribute("data-editable", "true");
    expect(map).toHaveAttribute("data-count", "1");
    expect(screen.queryByText(en["orders.edit.readOnly"])).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(updateOrder).toHaveBeenCalled());
    expect(updateOrder.mock.calls[0][1]).toMatchObject({ order: ["Fruits"], shapes: "SHAPES", area: "AREA" });
  });

  it("owner + Completed is read-only with an Alert and writes no shape fields", async () => {
    const map = await setup({ ...base, status: [{ value: "Completed" }] }, owner);
    expect(map).toHaveAttribute("data-editable", "false");
    expect(screen.getByText(en["orders.edit.readOnly"])).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(updateOrder).toHaveBeenCalled());
    const payload = updateOrder.mock.calls[0][1];
    expect("shapes" in payload).toBe(false);
    expect("area" in payload).toBe(false);
  });

  it("admin + Completed is editable", async () => {
    const map = await setup({ ...base, status: [{ value: "Completed" }] }, admin);
    expect(map).toHaveAttribute("data-editable", "true");
  });

  it("blocks Save when no polygons remain", async () => {
    await setup(base, owner);
    await userEvent.click(screen.getByText("clear-all"));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText(en["orders.edit.noShape"])).toBeInTheDocument();
    expect(updateOrder).not.toHaveBeenCalled();
  });
});
