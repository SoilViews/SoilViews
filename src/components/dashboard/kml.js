import tokml from "tokml";
import { saveAs } from "file-saver";

export const KML_MIME = "application/vnd.google-earth.kml+xml";
export const KML_FILENAME = "soilviews-shapes.kml";

// items: [{ name, area, feature }] -> KML string with one Placemark each, or null when empty.
export function buildKml(items) {
  if (!items.length) return null;
  const features = items.map(({ name, area, feature }) => ({
    ...feature,
    properties: { ...(feature.properties || {}), name, description: area },
  }));
  return tokml({ type: "FeatureCollection", features }, { name: "name", description: "description" });
}

export const kmlBlob = (kml) => new Blob([kml], { type: KML_MIME });

export function downloadKml(kml, filename = KML_FILENAME) {
  saveAs(kmlBlob(kml), filename);
}

// Selection keyed by stable id. Ids never seen before are ticked; ids that disappeared are dropped;
// manual unticks of already-seen ids persist.
export function syncSelection(selected, seen, ids) {
  const present = new Set(ids);
  const nextSelected = new Set([...selected].filter((id) => present.has(id)));
  ids.forEach((id) => {
    if (!seen.has(id)) nextSelected.add(id);
  });
  return { selected: nextSelected, seen: present };
}

export function toggleId(selected, id) {
  const next = new Set(selected);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

export function setAll(selected, ids, on) {
  const next = new Set(selected);
  ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
  return next;
}
