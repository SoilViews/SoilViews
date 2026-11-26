import { vi, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

let state;
const ordersQuery = vi.fn(() => "q");
vi.mock("../useCollection", () => ({ useCollection: (f) => { f(); return state; } }));
vi.mock("../../services/ordersService", () => ({ ordersQuery: (...a) => ordersQuery(...a) }));
vi.mock("../../context/AuthContext", () => ({ useAuth: () => ({ user: { uid: "u1" } }) }));
import { useMyShapes } from "../useMyShapes";

const ring = [[23.3, 42.69], [23.31, 42.69], [23.31, 42.7], [23.3, 42.69]];
const fc = (n) => JSON.stringify({
  type: "FeatureCollection",
  features: Array.from({ length: n }, () => ({ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [ring] } })),
});
const created = { toDate: () => new Date("2024-03-01T10:00:00Z") };

beforeEach(() => { ordersQuery.mockClear(); });

it("parses shapes, queries non-admin", () => {
  state = { data: [{ id: "o1", createdAt: created, status: [{ value: "Completed" }], shapes: fc(2) }], loading: false };
  const { result } = renderHook(() => useMyShapes());
  expect(ordersQuery).toHaveBeenCalledWith({ uid: "u1", isAdmin: false });
  expect(result.current.shapes).toHaveLength(2);
  expect(result.current.shapes[0]).toMatchObject({ orderId: "o1", status: "Completed" });
  expect(result.current.shapes[0].createdAt).toEqual(new Date("2024-03-01T10:00:00Z"));
  expect(result.current.shapes[0].feature.geometry.type).toBe("Polygon");
  expect(result.current.loading).toBe(false);
});

it("falls back to legacy ring keys as [lng,lat]", () => {
  state = { data: [{ id: "o2", createdAt: created, status: [{ value: "Submitted" }], area: "1 m²", 0: ring[0], 1: ring[1], 2: ring[2], 3: ring[3] }], loading: false };
  const { result } = renderHook(() => useMyShapes());
  expect(result.current.shapes).toHaveLength(1);
  const coords = result.current.shapes[0].feature.geometry.coordinates;
  expect(coords).toEqual([ring]);
});

it("skips bad data without throwing", () => {
  state = { data: [
    { id: "bad1", shapes: "{not json" },
    { id: "bad2", shapes: JSON.stringify({ foo: 1 }) },
    { id: "none" },
    { id: "ok", shapes: fc(1) },
  ], loading: false };
  const { result } = renderHook(() => useMyShapes());
  expect(result.current.shapes.map((s) => s.orderId)).toEqual(["ok"]);
});
