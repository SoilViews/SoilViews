import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

// Minimal fullscreen toggle (Fullscreen API on the map's wrapper element).
const FullscreenControl = ({ position = "topright", title = "Fullscreen" }) => {
  const map = useMap();

  useEffect(() => {
    const target = () => map.getContainer().parentElement || map.getContainer();
    const control = L.control({ position });
    control.onAdd = () => {
      const bar = L.DomUtil.create("div", "leaflet-bar");
      const link = L.DomUtil.create("a", "", bar);
      link.href = "#";
      link.title = title;
      link.setAttribute("role", "button");
      link.setAttribute("aria-label", title);
      link.style.fontSize = "18px";
      link.style.textAlign = "center";
      link.textContent = "⛶";
      L.DomEvent.disableClickPropagation(bar);
      L.DomEvent.on(link, "click", (e) => {
        L.DomEvent.preventDefault(e);
        if (document.fullscreenElement) document.exitFullscreen();
        else target().requestFullscreen?.();
      });
      return bar;
    };
    const onChange = () => map.invalidateSize();
    document.addEventListener("fullscreenchange", onChange);
    control.addTo(map);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      control.remove();
    };
  }, [map, position, title]);

  return null;
};

export default FullscreenControl;
