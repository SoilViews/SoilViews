import { useEffect } from "react";
import { useMap } from "react-leaflet";
import * as WMS from "leaflet.wms";

// Adds the named layers of a WMS source to the map. Not mounted by default.
function CustomWMSLayer({ url, options, layers }) {
  const map = useMap();

  useEffect(() => {
    const source = WMS.source(url, options);
    const added = layers.map((name) => source.getLayer(name).addTo(map));
    return () => added.forEach((layer) => map.removeLayer(layer));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, url]);

  return null;
}

export default CustomWMSLayer;
