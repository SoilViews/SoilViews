import { it, expect } from "vitest";
import { geodesicArea, polygonsArea, polygonsCoordinates, toPolygonFeatures } from "../geo";

const ring = [[0, 0], [0.01, 0], [0.01, 0.01], [0, 0.01], [0, 0]];
const poly = { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [ring] } };

it("computes a plausible geodesic area (~1.24 km2 for 0.01 deg square at the equator)", () => {
  expect(geodesicArea(ring)).toBeGreaterThan(1.2e6);
  expect(geodesicArea(ring)).toBeLessThan(1.3e6);
});

it("formats the area of the last polygon in the legacy format", () => {
  expect(polygonsArea([poly])).toMatch(/^\d+ {2}m²$/);
  expect(polygonsArea([])).toBeNull();
});

it("flattens FeatureCollections/MultiPolygons and drops non-polygons", () => {
  const multi = { type: "Feature", properties: {}, geometry: { type: "MultiPolygon", coordinates: [[ring], [ring]] } };
  const point = { type: "Feature", properties: {}, geometry: { type: "Point", coordinates: [0, 0] } };
  const out = toPolygonFeatures([{ type: "FeatureCollection", features: [poly, multi, point] }]);
  expect(out).toHaveLength(3);
  expect(polygonsCoordinates(out)).toHaveLength(3);
});

import { orderToFeatures as _orderToFeatures } from "../geo";
describe("orderToFeatures", () => {
  const ring = [[23.3, 42.69], [23.31, 42.69], [23.31, 42.7], [23.3, 42.69]];
  it("parses the shapes JSON string", () => {
    const shapes = JSON.stringify({ type: "FeatureCollection", features: [
      { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [ring] } },
    ] });
    expect(_orderToFeatures({ shapes })).toHaveLength(1);
  });
  it("falls back to legacy numeric ring keys and closes the ring", () => {
    const f = _orderToFeatures({ 0: ring[0], 1: ring[1], 2: ring[2] });
    expect(f).toHaveLength(1);
    expect(f[0].geometry.coordinates[0]).toEqual([...ring]);
  });
  it("returns [] for bad data", () => {
    expect(_orderToFeatures({ shapes: "{nope" })).toEqual([]);
    expect(_orderToFeatures({ shapes: JSON.stringify({ foo: 1 }) })).toEqual([]);
    expect(_orderToFeatures({})).toEqual([]);
    expect(_orderToFeatures({ 0: [1, 2], 1: "x" })).toEqual([]);
    expect(_orderToFeatures(null)).toEqual([]);
  });
});
