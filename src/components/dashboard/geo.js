// Pure helpers (no Leaflet) so they can be unit-tested and used by the Wizard.

const R = 6378137.0;
const D2R = Math.PI / 180;

// Same spherical-excess formula as L.GeometryUtil.geodesicArea. Ring = [[lng, lat], ...].
export function geodesicArea(ring) {
  const n = ring.length;
  if (n <= 2) return 0;
  let area = 0;
  for (let i = 0; i < n; i++) {
    const [lng1, lat1] = ring[i];
    const [lng2, lat2] = ring[(i + 1) % n];
    area += (lng2 - lng1) * D2R * (2 + Math.sin(lat1 * D2R) + Math.sin(lat2 * D2R));
  }
  return Math.abs((area * R * R) / 2.0);
}

// Legacy order format (kept so stored `area` values stay comparable): area * 0.001, no decimals, "m²" suffix.
export const formatArea = (squareMeters) => `${(squareMeters * 0.001).toFixed(0)}  m²`;

// Normalise any GeoJSON (Feature, FeatureCollection, geometry) to a flat list of Polygon features.
export function toPolygonFeatures(input) {
  const out = [];
  const visit = (node) => {
    if (!node) return;
    if (Array.isArray(node)) return node.forEach(visit);
    if (node.type === "FeatureCollection") return visit(node.features);
    if (node.type === "GeometryCollection") return visit(node.geometries);
    if (node.type === "Feature") {
      const g = node.geometry;
      if (g?.type === "Polygon") out.push(node);
      else if (g?.type === "MultiPolygon") {
        g.coordinates.forEach((coordinates) =>
          out.push({ type: "Feature", properties: node.properties || {}, geometry: { type: "Polygon", coordinates } })
        );
      }
      return;
    }
    if (node.type === "Polygon" || node.type === "MultiPolygon") {
      visit({ type: "Feature", properties: {}, geometry: node });
    }
  };
  visit(input);
  return out;
}

// Area string of the most recently added polygon (the legacy wizard used the last one drawn), or null.
export function polygonsArea(features) {
  const last = features[features.length - 1];
  const ring = last?.geometry?.coordinates?.[0];
  return ring ? formatArea(geodesicArea(ring)) : null;
}

// Legacy `coordinates` state: the rings of all polygons, concatenated.
export const polygonsCoordinates = (features) => features.flatMap((f) => f.geometry.coordinates);

const round6 = (n) => Math.round(n * 1e6) / 1e6;
const roundCoords = (c) => (typeof c === "number" ? round6(c) : Array.isArray(c) ? c.map(roundCoords) : c);

// Serialise drawn features as a FeatureCollection JSON string (Firestore forbids nested arrays),
// coordinates rounded to 6 decimals.
export function serializeShapes(features) {
  const list = Array.isArray(features) ? features : features?.features ?? [];
  return JSON.stringify({
    type: "FeatureCollection",
    features: list.map((f) => ({
      type: "Feature",
      properties: f.properties || {},
      geometry: { type: f.geometry.type, coordinates: roundCoords(f.geometry.coordinates) },
    })),
  });
}

// Sum of the outer-ring geodesic areas (m²) of Polygon features.
export const totalGeodesicArea = (features) =>
  features.reduce((sum, f) => sum + geodesicArea(f.geometry?.coordinates?.[0] ?? []), 0);
