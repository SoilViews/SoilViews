import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { useTranslation } from "react-i18next";
import { applyDrawLocale } from "./drawLocale";

// Small replacement for react-leaflet-draw: registers L.Control.Draw on the map and forwards
// draw:created / draw:edited / draw:deleted. Created layers are added to `featureGroup`.
const DrawControl = ({ featureGroup, color, onCreated, onEdited, onDeleted, position = "topleft" }) => {
  const map = useMap();
  const { t } = useTranslation();
  // Keep callbacks fresh without re-creating the control.
  const handlers = useRef({});
  handlers.current = { onCreated, onEdited, onDeleted };

  useEffect(() => {
    applyDrawLocale(t);
    const control = new L.Control.Draw({
      position,
      draw: {
        polyline: false,
        rectangle: false,
        marker: false,
        circle: false,
        circlemarker: false,
        polygon: { allowIntersection: false, shapeOptions: { color } },
      },
      edit: { featureGroup },
    });
    map.addControl(control);

    const created = (e) => {
      featureGroup.addLayer(e.layer);
      handlers.current.onCreated?.(e);
    };
    const edited = (e) => handlers.current.onEdited?.(e);
    const deleted = (e) => handlers.current.onDeleted?.(e);
    map.on(L.Draw.Event.CREATED, created);
    map.on(L.Draw.Event.EDITED, edited);
    map.on(L.Draw.Event.DELETED, deleted);

    return () => {
      map.off(L.Draw.Event.CREATED, created);
      map.off(L.Draw.Event.EDITED, edited);
      map.off(L.Draw.Event.DELETED, deleted);
      map.removeControl(control);
    };
  }, [map, featureGroup, position, color, t]);

  return null;
};

export default DrawControl;
