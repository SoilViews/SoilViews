import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.locatecontrol";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";

const LocateControl = ({ options, startDirectly = false }) => {
  const map = useMap();

  useEffect(() => {
    const lc = L.control.locate(options);
    lc.addTo(map);
    if (startDirectly) lc.start();
    return () => {
      // the map may already be torn down when this cleanup runs
      if (lc._map) {
        lc.stop();
        lc.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
};

export default LocateControl;
