import { useLeaflet } from "react-leaflet";
import L from "leaflet";

const KmlUpload = () => {
  const { map } = useLeaflet();
  console.log(map);

  // var legend = L.control({ position: "bottomright" });

  L.Control.fileLayerLoad({
    layer: L.geoJson,
    layerOptions: { style: { color: "red" } },
    addToMap: true,
    fileSizeLimit: 1024,
    formats: [".geojson", ".kml"],
  }).addTo(map);

  return null;
};

export default KmlUpload;
