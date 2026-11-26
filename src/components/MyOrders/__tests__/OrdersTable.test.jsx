import { vi, it, expect, beforeAll } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../../../../public/locales/en/translation.json";

vi.mock("../../dashboard/MapView", () => ({
  default: ({ editable, initialFeatures }) => (
    <div data-testid="map" data-editable={String(editable)} data-count={initialFeatures?.length ?? 0} />
  ),
}));
import OrdersTable from "../OrdersTable";

const ring = [[23.3, 42.69], [23.31, 42.69], [23.31, 42.7], [23.3, 42.69]];
const orders = [{
  id: "o1", authorFirstName: "Ann", order: ["Fruits"], area: "120  m²", status: [{ value: "Submitted" }],
  shapes: JSON.stringify({ type: "FeatureCollection", features: [{ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [ring] } }] }),
}];

beforeAll(async () => {
  await i18n.use(initReactI18next).init({ lng: "en", keySeparator: false, resources: { en: { translation: en } }, interpolation: { escapeValue: false } });
});

it("opens a read-only map dialog with the area from the View button", async () => {
  render(<MemoryRouter><OrdersTable orders={orders} onDelete={vi.fn()} /></MemoryRouter>);
  expect(screen.queryByTestId("map")).toBeNull();
  await userEvent.click(screen.getByRole("button", { name: en["orders.viewOnMap"] }));
  const dialog = await screen.findByRole("dialog");
  const map = within(dialog).getByTestId("map");
  expect(map).toHaveAttribute("data-editable", "false");
  expect(map).toHaveAttribute("data-count", "1");
  expect(within(dialog).getByText(/120\s+m²/)).toBeInTheDocument();
});
