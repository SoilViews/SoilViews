import L from "leaflet";
import toGeoJSON from "@mapbox/togeojson";
// Vendored + modernised copy of leaflet-filelayer (Leaflet 1.9: L.Evented instead of the removed
// L.Mixin.Events, per-instance DOM container, listener cleanup, optional `target` layer group).
var zoomName = "leaflet-control-filelayer leaflet-control-zoom";
var barName = "leaflet-bar";
var partName = barName + "-part";
var FileLoader = L.Evented.extend({
  options: {
    layerOptions: {},
  },

  initialize: function (map, options) {
    this._map = map;
    L.Util.setOptions(this, options);

    this._parsers = {
      geojson: this._loadGeoJSON,
      gpx: this._convertToGeoJSON,
      kml: this._convertToGeoJSON,
      kmz: this._convertToGeoJSON,
    };
  },

  load: function (file /* File */) {
    // Check file extension
    var ext = file.name.split(".").pop(),
      parser = this._parsers[ext];
    if (!parser) {
      this.fire("data:error", { filename: file.name, format: ext });
      return;
    }
    // Read selected file using HTML5 File API
    var reader = new FileReader();
    reader.onload = L.Util.bind(function (e) {
      this.fire("data:loading", { filename: file.name, format: ext });
      var layer = parser.call(this, e.target.result, ext);
      this.fire("data:loaded", {
        layer: layer,
        filename: file.name,
        format: ext,
      });
    }, this);
    reader.readAsText(file);
  },

  _loadGeoJSON: function (content) {
    if (typeof content == "string") {
      content = JSON.parse(content);
    }
    return L.geoJson(content, this.options.layerOptions).addTo(
      this.options.target || this._map
    );
  },

  _convertToGeoJSON: function (content, format) {
    // Format is either 'gpx' or 'kml'
    if (typeof content == "string") {
      content = new window.DOMParser().parseFromString(content, "text/xml");
    }
    var geojson = toGeoJSON[format](content);
    return this._loadGeoJSON(geojson);
  },
});

L.Control.FileLayerLoad = L.Control.extend({
  statics: {
    TITLE: "Load local file (GPX, KML, GeoJSON)",
    LABEL: "&#8965;",
  },
  options: {
    position: "topleft",
    fitBounds: true,
    layerOptions: {},
  },

  initialize: function (options) {
    L.Util.setOptions(this, options);
    this.loader = null;
  },

  onAdd: function (map) {
    this.loader = new FileLoader(map, {
      layerOptions: this.options.layerOptions,
      target: this.options.target,
    });

    this.loader.on(
      "data:loaded",
      function (e) {
        // Fit bounds after loading
        if (this.options.fitBounds) {
          window.setTimeout(function () {
            map.fitBounds(e.layer.getBounds()).zoomOut();
          }, 500);
        }
      },
      this
    );

    // Initialize Drag-and-drop
    this._initDragAndDrop(map);
    this._map = map;

    // Initialize map control
    return this._initContainer();
  },

  onRemove: function (map) {
    var dropbox = map._container;
    for (var name in this._dropCallbacks || {})
      dropbox.removeEventListener(name, this._dropCallbacks[name], false);
    this._dropCallbacks = null;
  },

  _initDragAndDrop: function (map) {
    var fileLoader = this.loader,
      dropbox = map._container;

    var callbacks = {
      dragenter: function () {
        map.scrollWheelZoom.disable();
      },
      dragleave: function () {
        map.scrollWheelZoom.enable();
      },
      dragover: function (e) {
        e.stopPropagation();
        e.preventDefault();
      },
      drop: function (e) {
        e.stopPropagation();
        e.preventDefault();

        var files = Array.prototype.slice.apply(e.dataTransfer.files);
        files.forEach(function (f, i) {
          setTimeout(function () {
            fileLoader.load(f);
          }, 25 * (i + 1));
        });
        map.scrollWheelZoom.enable();
      },
    };
    this._dropCallbacks = callbacks;
    for (var name in callbacks)
      dropbox.addEventListener(name, callbacks[name], false);
  },

  _initContainer: function () {
    var container = L.DomUtil.create("div", zoomName + " " + barName);
    // Create an invisible file input
    var fileInput = L.DomUtil.create("input", "hidden", container);
    fileInput.type = "file";
    fileInput.accept = ".gpx,.kml,.geojson,.kmz";
    fileInput.style.display = "none";
    // Load on file change
    var fileLoader = this.loader;
    fileInput.addEventListener(
      "change",
      function (e) {
        fileLoader.load(this.files[0]);
      },
      false
    );

    // Create a button, and bind click on hidden file input
    var link = L.DomUtil.create("a", zoomName + "-in " + partName, container);
    link.innerHTML = L.Control.FileLayerLoad.LABEL;
    link.href = "#";
    link.title = this.options.title || L.Control.FileLayerLoad.TITLE;

    var stop = L.DomEvent.stopPropagation;
    L.DomEvent.on(link, "click", stop)
      .on(link, "mousedown", stop)
      .on(link, "dblclick", stop)
      .on(link, "click", L.DomEvent.preventDefault)
      .on(link, "click", function (e) {
        fileInput.click();
        e.preventDefault();
      });
    return container;
  },
});

L.Control.fileLayerLoad = function (options) {
  return new L.Control.FileLayerLoad(options);
};
