import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

// Address / place search (OpenStreetMap Nominatim) replacing react-leaflet-search.
const SearchControl = ({ position = "topright", label = "Search address" }) => {
  const map = useMap();

  useEffect(() => {
    const control = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      style: "button",
      position,
      searchLabel: label,
      autoClose: true,
      keepResult: false,
      showMarker: true,
    });
    map.addControl(control);
    return () => {
      map.removeControl(control);
    };
  }, [map, position, label]);

  return null;
};

export default SearchControl;
