import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { getColor } from "./utils";
import "./Legend.css";

const GRADES = [0, 10, 20, 50, 100, 200, 500, 1000];

// Colour-scale legend + metric scale bar. Not mounted by default (kept for future layers).
const Legend = ({ position = "bottomright" }) => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position });
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      div.innerHTML = GRADES.map((from, i) => {
        const to = GRADES[i + 1];
        return `<i style="background:${getColor(from + 1)}"></i> ${from}${to ? "&ndash;" + to : "+"}`;
      }).join("<br>");
      return div;
    };
    const scale = L.control.scale({ metric: true, imperial: false });
    legend.addTo(map);
    scale.addTo(map);
    return () => {
      legend.remove();
      scale.remove();
    };
  }, [map, position]);

  return null;
};

export default Legend;
