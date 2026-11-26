import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "./vendor/filelayer";

// Load GeoJSON / KML / GPX from disk (button or drag-and-drop) into `target` (a Leaflet layer group).
// onLoaded() fires after a file was added so the caller can re-read the target's features.
const KmlUpload = ({ target, onLoaded, onError, title, color }) => {
  const map = useMap();

  useEffect(() => {
    const control = L.Control.fileLayerLoad({
      layer: L.geoJson,
      layerOptions: { style: { color } },
      target,
      title,
      fitBounds: true,
      fileSizeLimit: 1024,
      formats: [".geojson", ".kml"],
    });
    control.addTo(map);
    const loaded = () => onLoaded?.();
    const failed = (e) => onError?.(e);
    control.loader.on("data:loaded", loaded);
    control.loader.on("data:error", failed);
    return () => {
      control.loader.off("data:loaded", loaded);
      control.loader.off("data:error", failed);
      control.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, target, title, color]);

  return null;
};

export default KmlUpload;
