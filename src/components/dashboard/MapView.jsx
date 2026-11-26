import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import tokml from "tokml";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useAuth } from "../../context/AuthContext";
import { uploadFile } from "../../services/storageService";
import AllLayers from "./AllLayers";
import DrawControl from "./DrawControl";
import FullscreenControl from "./FullscreenControl";
import KmlUpload from "./KmlUpload";
import LocateControl from "./LocateControl";
import SearchControl from "./SearchControl";
import ShapeList from "./ShapeList";
import { toPolygonFeatures, geodesicArea, formatArea } from "./geo";
import { KML_MIME, buildKml, downloadKml, syncSelection, toggleId, setAll } from "./kml";
import demoPolygons from "../Files/geojson.json";
import demoPoints from "../Files/points.json";

// Bundlers break Leaflet's default marker icon URL detection.
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

const DEFAULT_CENTER = [42.696295, 23.303643];

// Adds the drawn/uploaded layer groups to the map for the lifetime of the map.
function Groups({ groups }) {
  const map = useMap();
  useEffect(() => {
    groups.forEach((g) => g.addTo(map));
    return () => groups.forEach((g) => g.remove());
  }, [map, groups]);
  return null;
}

// Loads `features` ONCE (first non-empty value; later prop changes and StrictMode re-runs are ignored) into the
// editable group so leaflet-draw can reshape/delete them, then reports via onLoaded and fits the map to them.
function InitialFeatures({ features, group, color, onLoaded, fitRef }) {
  const map = useMap();
  const done = useRef(false);
  useEffect(() => {
    if (done.current || !features?.length) return;
    done.current = true;
    L.geoJSON(features, { style: () => ({ color }) }).eachLayer((layer) => group.addLayer(layer));
    const fit = () => {
      const bounds = group.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [30, 30] });
    };
    fit();
    fitRef.current = fit;
    onLoaded();
  }, [map, features, group, color, onLoaded, fitRef]);
  return null;
}

// Re-measures the map when its container is resized (e.g. inside a Dialog that has just opened) and, until the
// user interacts with the map, re-fits to the initial features.
function SizeWatcher({ fitRef }) {
  const map = useMap();
  useEffect(() => {
    const el = map.getContainer();
    let touched = false;
    const touch = () => {
      touched = true;
    };
    el.addEventListener("pointerdown", touch);
    el.addEventListener("wheel", touch);
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        map.invalidateSize();
        if (!touched) fitRef.current?.();
      });
      ro.observe(el);
    }
    return () => {
      ro?.disconnect();
      el.removeEventListener("pointerdown", touch);
      el.removeEventListener("wheel", touch);
    };
  }, [map, fitRef]);
  return null;
}

function FlyTo({ target, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, zoom);
  }, [map, target, zoom]);
  return null;
}

// Temporary non-interactive outline of the hovered shape; removed on change/unmount.
function Highlight({ feature, color }) {
  const map = useMap();
  useEffect(() => {
    if (!feature) return undefined;
    const layer = L.geoJSON(feature, {
      interactive: false,
      style: () => ({ color, weight: 5, fillOpacity: 0.35 }),
    }).addTo(map);
    return () => {
      layer.remove();
    };
  }, [map, feature, color]);
  return null;
}

const areaOf = (feature) => formatArea(geodesicArea(feature.geometry?.coordinates?.[0] ?? []));

// Read-only layer of the user's previously saved shapes. Not part of the drawn/uploaded groups,
// so it never reaches onPolygonsChange or the new order's area. Fits bounds once, if nothing is drawn yet.
function SavedShapes({ shapes, color, hasDrawn, t }) {
  const map = useMap();
  const fitted = useRef(false);
  const hasDrawnRef = useRef(hasDrawn);
  hasDrawnRef.current = hasDrawn;

  useEffect(() => {
    if (!shapes?.length) return undefined;
    const row = (label, value) => {
      const p = document.createElement("div");
      p.textContent = `${label}: ${value}`;
      return p;
    };
    const layer = L.geoJSON(
      shapes.map((s) => s.feature),
      {
        interactive: true,
        style: () => ({ color, weight: 2, fillOpacity: 0.25, dashArray: "4" }),
        onEachFeature: (feature, l) => {
          const s = shapes.find((x) => x.feature === feature);
          const box = document.createElement("div");
          const title = document.createElement("strong");
          title.textContent = t("map.savedField");
          box.append(title);
          if (s?.createdAt) box.append(row(t("map.orderDate"), s.createdAt.toLocaleDateString()));
          if (s?.status) box.append(row(t("map.orderStatus"), t(s.status, { defaultValue: s.status })));
          l.bindPopup(box);
        },
      }
    ).addTo(map);
    if (!fitted.current && !hasDrawnRef.current) {
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [30, 30] });
        fitted.current = true;
      }
    }
    return () => {
      layer.remove();
    };
  }, [map, shapes, color, t]);
  return null;
}

/**
 * Full-height map with draw, KML/GeoJSON upload, search, locate, fullscreen and layer switching.
 * onPolygonsChange(features[]) receives every Polygon feature currently on the map (drawn + uploaded)
 * `savedShapes` ([{ feature, createdAt, status }]) are drawn read-only and are never reported to onPolygonsChange.
 * `initialFeatures` (Polygon features) are loaded once into the editable drawn group and reported like drawn shapes.
 * after each create / edit / delete / upload / clear.
 */
export default function MapView({
  onPolygonsChange,
  editable = true,
  flyTo = null,
  center = DEFAULT_CENTER,
  zoom = 13,
  savedShapes = [],
  initialFeatures = null,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { profile } = useAuth();
  const [showPolygons, setShowPolygons] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);
  const [shapes, setShapes] = useState([]);
  const [selected, setSelected] = useState(() => new Set());
  const [hoverId, setHoverId] = useState(null);
  const seen = useRef(new Set());
  const fitRef = useRef(null);
  const numbers = useRef({ byId: new Map(), next: 1 });
  const count = shapes.length;

  const drawn = useMemo(() => new L.FeatureGroup(), []);
  const uploaded = useMemo(() => new L.FeatureGroup(), []);
  const groups = useMemo(() => [drawn, uploaded], [drawn, uploaded]);
  const selectedRef = useRef(selected);
  const callback = useRef(onPolygonsChange);
  callback.current = onPolygonsChange;

  const currentFeatures = useCallback(
    () => toPolygonFeatures([drawn.toGeoJSON(), uploaded.toGeoJSON()]),
    [drawn, uploaded]
  );

  // Shapes with ids stable across re-derivation: L.stamp of the top-level layer + index within it.
  const readShapes = useCallback(() => {
    const out = [];
    [drawn, uploaded].forEach((group) =>
      group.eachLayer((layer) =>
        toPolygonFeatures(layer.toGeoJSON()).forEach((feature, i) => {
          const id = `${L.stamp(layer)}-${i}`;
          const n = numbers.current;
          if (!n.byId.has(id)) n.byId.set(id, n.next++);
          out.push({ id, name: `${t("map.shape")} ${n.byId.get(id)}`, area: areaOf(feature), feature });
        })
      )
    );
    return out;
  }, [drawn, uploaded, t]);

  const emit = useCallback(() => {
    const list = readShapes();
    setShapes(list);
    const r = syncSelection(selectedRef.current, seen.current, list.map((s) => s.id));
    seen.current = r.seen;
    selectedRef.current = r.selected;
    setSelected(r.selected);
    callback.current?.(list.map((s) => s.feature));
  }, [readShapes]);

  const savedItems = useMemo(
    () =>
      savedShapes.map((s, i) => ({
        id: `saved-${s.orderId ?? ""}-${i}`,
        name: `${t("map.savedField")}${s.createdAt ? ` – ${s.createdAt.toLocaleDateString()}` : ""}`,
        area: areaOf(s.feature),
        feature: s.feature,
      })),
    [savedShapes, t]
  );
  // Saved ids are not ticked by default; just drop selections of saved shapes that no longer exist.
  useEffect(() => {
    const ids = new Set(savedItems.map((s) => s.id));
    const next = new Set([...selectedRef.current].filter((id) => !id.startsWith("saved-") || ids.has(id)));
    if (next.size !== selectedRef.current.size) {
      selectedRef.current = next;
      setSelected(next);
    }
  }, [savedItems]);

  const updateSelected = (next) => {
    selectedRef.current = next;
    setSelected(next);
  };
  const allItems = useMemo(() => [...(editable ? shapes : []), ...savedItems], [editable, shapes, savedItems]);
  const selectedItems = allItems.filter((i) => selected.has(i.id));
  const highlighted = allItems.find((i) => i.id === hoverId)?.feature ?? null;

  // Keep a KML copy of every drawn shape in Firebase Storage (as the legacy dashboard did).
  const saveKml = async (layer) => {
    try {
      const kml = tokml(layer.toGeoJSON(), { name: "name", description: "description" });
      const blob = new Blob([kml], { type: KML_MIME });
      const filename = `${format(new Date(), "dd-MM-yyyy_h:mma")}_${profile?.firstName ?? ""}`;
      await uploadFile(`KmlFiles/${filename}.kml`, blob);
    } catch (err) {
      console.error("KML upload failed", err);
    }
  };

  const handleCreated = (e) => {
    emit();
    saveKml(e.layer);
  };

  const handleDownload = () => {
    const kml = buildKml(selectedItems);
    if (kml) downloadKml(kml);
  };

  const handleClear = () => {
    drawn.clearLayers();
    uploaded.clearLayers();
    numbers.current = { byId: new Map(), next: 1 };
    emit();
  };

  const shapeColor = theme.palette.primary.main;
  const uploadColor = theme.palette.error.main;
  const savedColor = theme.palette.info.main;
  const geoStyle = { color: theme.palette.secondary.main, weight: 2 };

  return (
    <Box sx={{ position: "absolute", inset: 0 }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AllLayers />
        <Groups groups={groups} />
        <InitialFeatures features={initialFeatures} group={drawn} color={theme.palette.primary.main} onLoaded={emit} fitRef={fitRef} />
        <SizeWatcher fitRef={fitRef} />
        <SavedShapes shapes={savedShapes} color={savedColor} hasDrawn={count > 0} t={t} />
        <Highlight feature={highlighted} color={theme.palette.warning.main} />
        <FlyTo target={flyTo} zoom={13} />
        <FullscreenControl position="topright" title={t("map.fullscreen")} />
        <SearchControl position="topright" label={t("map.search")} />
        <LocateControl options={{ position: "topleft", strings: { title: t("map.locate") } }} />
        <KmlUpload
          target={uploaded}
          onLoaded={emit}
          onError={(e) => window.alert(`${t("map.unsupportedFile")} (${e.format})`)}
          title={t("map.upload")}
          color={uploadColor}
        />
        {editable && (
          <DrawControl featureGroup={drawn} color={shapeColor} onCreated={handleCreated} onEdited={emit} onDeleted={emit} />
        )}
        {showPolygons && <GeoJSON data={demoPolygons} style={geoStyle} />}
        {showMarkers && (
          <GeoJSON
            data={demoPoints}
            onEachFeature={(feature, layer) =>
              layer.bindPopup(`${feature.properties.Name}  ${feature.properties.Crops}`)
            }
          />
        )}
      </MapContainer>

      <Paper
        elevation={3}
        sx={{ position: "absolute", zIndex: 1001, top: 110, right: 10, p: 1, display: "flex", flexDirection: "column" }}
      >
        <FormControlLabel
          control={<Switch size="small" checked={showPolygons} onChange={(e) => setShowPolygons(e.target.checked)} />}
          label={t("map.showPolygons")}
        />
        <FormControlLabel
          control={<Switch size="small" checked={showMarkers} onChange={(e) => setShowMarkers(e.target.checked)} />}
          label={t("map.showMarkers")}
        />
        <ShapeList
          groups={[
            ...(editable ? [{ key: "shapes", title: t("map.shapes"), items: shapes }] : []),
            { key: "saved", title: t("map.savedFields"), items: savedItems },
          ]}
          selected={selected}
          onToggle={(id) => updateSelected(toggleId(selectedRef.current, id))}
          onSetMany={(ids, on) => updateSelected(setAll(selectedRef.current, ids, on))}
          onHover={setHoverId}
        />
        <Stack spacing={1} sx={{ mt: 1 }}>
          <Button size="small" variant="outlined" onClick={handleDownload} disabled={!selectedItems.length}>
            {t("map.downloadKmlCount", { count: selectedItems.length })}
          </Button>
          {editable && (
            <Button size="small" variant="outlined" color="inherit" onClick={handleClear} disabled={!count}>
              {t("map.clear")}
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
