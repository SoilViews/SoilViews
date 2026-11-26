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
      // The plugin binds `_unload` to the map's "unload" event and never unbinds it on remove().
      // Without this, a StrictMode mount/unmount/mount leaves a stale listener that throws
      // (`this._map` is null) when the map is later destroyed, blanking the whole app.
      map.off("unload", lc._unload, lc);
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
