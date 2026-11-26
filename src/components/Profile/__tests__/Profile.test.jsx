import { vi, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../../../../public/locales/en/translation.json";

vi.mock("../../../context/AuthContext", () => ({ useAuth: () => ({ profile: { firstName: "Ann" } }) }));
const ring = [[23.3, 42.69], [23.31, 42.69], [23.31, 42.7], [23.3, 42.7], [23.3, 42.69]];
const feature = { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [ring] } };
vi.mock("../../../hooks/useMyShapes", () => ({
  useMyShapes: () => ({
    loading: false,
    shapes: [{ orderId: "a", feature }, { orderId: "b", feature }],
  }),
}));
vi.mock("../../dashboard/MapView", () => ({
  default: ({ savedShapes, editable }) => <div data-testid="map">{savedShapes.length}-{String(editable)}</div>,
}));
import Profile from "../profile";

beforeAll(async () => {
  await i18n.use(initReactI18next).init({ lng: "en", keySeparator: false, resources: { en: { translation: en } }, interpolation: { escapeValue: false } });
});

it("shows my fields count, area and a read-only map", () => {
  render(<Profile />);
  expect(screen.getByText(en["profile.fields"])).toBeInTheDocument();
  expect(screen.getByText(/Fields: 2/)).toBeInTheDocument();
  expect(screen.getByText(/Total area: \d+\s+m²/)).toBeInTheDocument();
  expect(screen.getByTestId("map")).toHaveTextContent("2-false");
});
