import { vi, it, expect } from "vitest";
const addDoc = vi.hoisted(() => vi.fn().mockResolvedValue({ id: "o1" }));
vi.mock("firebase/firestore", () => ({
  collection: (_db, name) => name, addDoc, serverTimestamp: () => "ts",
  getFirestore: vi.fn(),
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
