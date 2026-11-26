import { it, expect } from "vitest";
import { buildKml, syncSelection, toggleId, setAll, KML_MIME } from "../kml";

const poly = (o) => ({
  type: "Feature",
  properties: {},
  geometry: { type: "Polygon", coordinates: [[[o, 0], [o + 1, 0], [o + 1, 1], [o, 0]]] },
});
const items = [
  { id: "a", name: "Shape 1", area: "100  m²", feature: poly(0) },
  { id: "b", name: "Shape 2", area: "200  m²", feature: poly(2) },
  { id: "c", name: "Shape 3", area: "300  m²", feature: poly(4) },
];

it("builds one Placemark per selected shape with name and area", () => {
  const kml = buildKml([items[0], items[2]]);
  expect(kml.match(/<Placemark>/g)).toHaveLength(2);
  expect(kml).toContain("<name>Shape 1</name>");
  expect(kml).toContain("<name>Shape 3</name>");
  expect(kml).not.toContain("Shape 2");
  expect(kml).toContain("<description>100  m²</description>");
  expect(kml).toContain("<description>300  m²</description>");
});

it("returns null when nothing is selected", () => {
  expect(buildKml([])).toBeNull();
});

it("does not mutate the input features", () => {
  buildKml(items);
  expect(items[0].feature.properties).toEqual({});
});

it("exposes the KML mime type", () => {
  expect(KML_MIME).toBe("application/vnd.google-earth.kml+xml");
});

it("syncSelection ticks new ids, keeps manual unticks, drops removed ids", () => {
  const seen = new Set(["a", "b"]);
  const selected = new Set(["a"]); // b manually unticked
  const r = syncSelection(selected, seen, ["a", "b", "c"]);
  expect([...r.selected].sort()).toEqual(["a", "c"]);
  expect([...r.seen].sort()).toEqual(["a", "b", "c"]);
  const r2 = syncSelection(r.selected, r.seen, ["b", "c"]);
  expect([...r2.selected]).toEqual(["c"]);
});

it("toggleId and setAll are immutable", () => {
  const s = new Set(["a"]);
  expect([...toggleId(s, "b")].sort()).toEqual(["a", "b"]);
  expect([...toggleId(s, "a")]).toEqual([]);
  expect([...s]).toEqual(["a"]);
  expect([...setAll(s, ["x", "y"], true)].sort()).toEqual(["a", "x", "y"]);
  expect([...setAll(new Set(["a", "x"]), ["x"], false)]).toEqual(["a"]);
});
