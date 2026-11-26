import { vi, it, expect } from "vitest";
const addDoc = vi.hoisted(() => vi.fn().mockResolvedValue({ id: "o1" }));
vi.mock("firebase/firestore", () => ({
  collection: (_db, name) => name, addDoc, serverTimestamp: () => "ts",
  getFirestore: vi.fn(), deleteField: () => "DEL",
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

it("stores drawn shapes as a rounded JSON string and keeps legacy fields", async () => {
  addDoc.mockClear();
  const features = [{
    type: "Feature", properties: {},
    geometry: { type: "Polygon", coordinates: [[[23.123456789, 42.1], [23.2, 42.2], [23.3, 42.3], [23.123456789, 42.1]]] },
  }];
  await createOrder({
    profile: { firstName: "A", lastName: "B" }, uid: "u1", order: ["Fruits"],
    extra: { area: "5  m²", 0: [23.1, 42.1] }, shapes: features,
  });
  const doc = addDoc.mock.calls[0][1];
  expect(typeof doc.shapes).toBe("string");
  const parsed = JSON.parse(doc.shapes);
  expect(parsed.type).toBe("FeatureCollection");
  expect(parsed.features[0].geometry.coordinates[0][0]).toEqual([23.123457, 42.1]);
  expect(doc.area).toBe("5  m²");
  expect(doc[0]).toEqual([23.1, 42.1]);
  expect(doc.userId).toBe("u1");
});

it("omits shapes when none are given", async () => {
  addDoc.mockClear();
  await createOrder({ profile: { firstName: "A", lastName: "B" }, uid: "u1", order: [] });
  expect("shapes" in addDoc.mock.calls[0][1]).toBe(false);
});

import { buildShapeUpdate } from "../ordersService";
const sq = (n) => ({
  type: "Feature", properties: {},
  geometry: { type: "Polygon", coordinates: [Array.from({ length: n - 1 }, (_, i) => [23 + i * 0.01, 42 + (i % 2) * 0.01]).concat([[23, 42]])] },
});

it("buildShapeUpdate writes shapes, area and ring keys; deletes stale numeric keys", () => {
  const old = { 0: [1, 1], 1: [2, 2], 2: [3, 3], 3: [4, 4], 4: [1, 1], area: "x", order: ["a"] };
  const features = [sq(4)];
  const u = buildShapeUpdate(old, features);
  const ring = features[0].geometry.coordinates[0];
  expect(JSON.parse(u.shapes).features).toHaveLength(1);
  expect(u.area).toMatch(/ m²$/);
  expect(u[0]).toEqual(ring[0]);
  expect(u[3]).toEqual(ring[3]);
  expect(u[4]).toBe("DEL");
  expect("order" in u).toBe(false);
  expect(Object.keys(u).filter((k) => /^\d+$/.test(k))).toHaveLength(5);
});

it("buildShapeUpdate converts a legacy order without shapes and leaves no deletes when ring grows", () => {
  const u = buildShapeUpdate({ 0: [1, 1], 1: [2, 2] }, [sq(5)]);
  expect(typeof u.shapes).toBe("string");
  expect(Object.values(u).includes("DEL")).toBe(false);
  expect(u[4]).toBeDefined();
});
