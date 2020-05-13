import { useLeaflet } from "react-leaflet";
import * as WMS from "leaflet.wms";

function CustomWMSLayer(props) {
  const { url, options, layers } = props;
  const ctx = useLeaflet();
  const map = ctx.map;

  // Add WMS source/layers
  const source = WMS.source(url, options);

  for (let name of layers) {
    source.getLayer(name).addTo(map);
  }

  return null;
}

export default CustomWMSLayer;
