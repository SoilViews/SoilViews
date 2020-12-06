import { useLeaflet } from "react-leaflet";
import L from "leaflet";

const Metrics = () => {
  const { map } = useLeaflet();
  console.log(map);

  //   ADDED NEW TOOLBAR
  //   new L.Control.Draw({
  //     draw: {
  //       polyline: false,
  //       rectangle: false,
  //       marker: false,
  //       circleMarker: false,
  //       circle: false,
  //       circlemarker: false,
  //       toolbar: {
  //         buttons: {
  //           polygon: "v",
  //         },
  //       },
  //     },
  //   }).addTo(map);

  L.drawLocal = {
    draw: {
      polyline: false,
      rectangle: false,
      marker: false,
      circleMarker: false,
      circle: false,
      circlemarker: false,
      toolbar: {
        actions: {
          title: "Cancel drawing",
          text: "Cancel",
        },
        finish: {
          title: "Finish drawing",
          text: "Finish",
        },
        undo: {
          title: "Delete last point drawn",
          text: "Delete last point",
        },
        buttons: {
          polygon: "Draw e beatufull polygon",
        },
      },
      handlers: {
        circle: {
          tooltip: {
            start: "Click and drag to draw circle.",
          },
          radius: "Radius",
        },
        circlemarker: {
          tooltip: {
            start: "Click map to place circle marker.",
          },
        },
        marker: {
          tooltip: {
            start: "Click map to place marker.",
          },
        },
        polygon: {
          tooltip: {
            start: "Click to start drawing a beautifull shape.",
            cont: "Click to continue drawing shape.",
            end: "Click first point to close this shape.",
          },
        },
        polyline: {
          error: "<strong>Error:</strong> shape edges cannot cross!",
          tooltip: {
            start: "Click to start drawing line.",
            cont: "Click to continue drawing line.",
            end: "Click last point to finish line.",
          },
        },
        rectangle: {
          tooltip: {
            start: "Click and drag to draw rectangle.",
          },
        },
        simpleshape: {
          tooltip: {
            end: "Release mouse to finish drawing.",
          },
        },
      },
    },
    edit: {
      toolbar: {
        actions: {
          save: {
            title: "Save changes",
            text: "Save",
          },
          cancel: {
            title: "Cancel editing, discards all changes",
            text: "Cancel",
          },
          clearAll: {
            title: "Clear all layers",
            text: "Clear All",
          },
        },
        buttons: {
          edit: "Edit layers",
          editDisabled: "No layers to edit",
          remove: "Delete layers",
          removeDisabled: "No layers to delete",
        },
      },
      handlers: {
        edit: {
          tooltip: {
            text: "Drag handles or markers to edit features.",
            subtext: "Click cancel to undo changes.",
          },
        },
        circle: true,
        remove: {
          tooltip: {
            text: "Click on a feature to remove.",
          },
        },
      },
    },
  };

  return null;
};

export default Metrics;
