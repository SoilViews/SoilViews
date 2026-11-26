import { vi, it, expect } from "vitest";
import { render } from "@testing-library/react";
vi.mock("../../../context/AuthContext", () => ({ useAuth: () => ({ profile: { firstName: "A" } }) }));
vi.mock("../../../services/storageService", () => ({ uploadFile: vi.fn() }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (k) => k }) }));
import MapView from "../MapView";
it("mounts the map with all controls in jsdom", () => {
  const cb = vi.fn();
  const { container, rerender } = render(<MapView onPolygonsChange={cb} editable />);
  expect(container.querySelector(".leaflet-container")).toBeTruthy();
  expect(container.querySelector(".leaflet-draw-draw-polygon")).toBeTruthy();
  expect(container.querySelector(".leaflet-control-filelayer")).toBeTruthy();
  expect(container.querySelector(".leaflet-control-locate")).toBeTruthy();
  expect(container.querySelector(".leaflet-control-layers")).toBeTruthy();
  expect(container.querySelector(".leaflet-geosearch-button, .leaflet-control-geosearch")).toBeTruthy();
  rerender(<MapView onPolygonsChange={cb} editable={false} />);
  expect(container.querySelector(".leaflet-draw-draw-polygon")).toBeFalsy();
});

it("unmounts without throwing under StrictMode (leaving a map page must not crash the app)", async () => {
  const { StrictMode } = await import("react");
  const errors = [];
  const onErr = (e) => errors.push(e.error || e);
  window.addEventListener("error", onErr);
  const { unmount } = render(
    <StrictMode>
      <MapView onPolygonsChange={vi.fn()} editable />
    </StrictMode>
  );
  expect(() => unmount()).not.toThrow();
  window.removeEventListener("error", onErr);
  expect(errors).toEqual([]);
});
