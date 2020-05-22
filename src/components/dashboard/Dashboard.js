import React, { createRef } from "react";
import {
  Map,
  TileLayer,
  FeatureGroup,
  Polygon,
  GeoJSON,
  Marker,
  Popup,
  WMSTileLayer,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { EditControl } from "react-leaflet-draw";
import london_postcodes from "../Files/london_postcodes.json";
import geojson from "../Files/geojson.json";
import points from "../Files/points.json";
import "../../leaflet.filelayer";
import { connect } from "react-redux";
import { saveData } from "../../store/actions/authActions";
import { saveAs } from "file-saver";
import HorizontalLinearStepper from "../Wizard/HorizontalLinearStepper";
import "../dashboard/GeojsonLayer.css";
import Search from "react-leaflet-search";
import "./Map.css";
import L from "leaflet";
import { storage } from "../../firebase/index";
import { format } from "date-fns";
import LocateControl from "./LocateControl";
import NmScale from "@marfle/react-leaflet-nmscale";
import FullscreenControl from "react-leaflet-fullscreen";
import "react-leaflet-fullscreen/dist/styles.css";

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";
// import JSZip from 'jszip'
// import {  getFirestore } from 'redux-firestore'
// import sophia_postcodes from '../Files/rpu_sofia.geojson'
// import CustomWMSLayer from "./CustomWMSLayer";

//Hardcoded coordinates of polygons
const polygon = [
  [42.696295, 23.303643],
  [42.699295, 23.303643],
  [42.699295, 23.313643],
  [42.679295, 23.313643],
];

export class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadURLs: [],
      area: "",
      coordinates: [],
      coordinatesCenter: [42.696295, 23.303643],
      zoom: 10,
      showMarkers: false,
      showPolygons: false,
      geojsonvisible: false,
      keyMAP: Math.random(),
      kmlNameDescription: "",
    };
  }
  //Set location when the map is visualized

  mapRef = createRef();

  handleClick = () => {
    const map = this.mapRef.current;
    if (map != null) {
      map.leafletElement.locate();
    }
    console.log("CatchMouseClick", Polygon.latlng);
  };

  onCreate = (e) => {
    var layer = e.layer;
    console.log("Polygon Coordinates", layer.getLatLngs());

    console.log("Log_Create_Shape: ", e);
    //get coordinates to geojson format

    var drawedCord = layer.toGeoJSON().geometry.coordinates;

    console.log("shape1", drawedCord);
    //Create kml file
    var data = layer.toGeoJSON();
    var tokml = require("tokml");
    var kml = tokml(data);
    console.log("KMLLLLLLLL", kml);
    this.setState({
      akmlNameDescriptionrea: tokml(data, {
        name: "name",
        description: "description",
      }),
    });

    var convertedData = JSON.stringify(data);
    console.log(convertedData);
    var FileSaver = require("file-saver");
    var blob = new Blob([this.state.kmlNameDescription], {
      type: "text/plain;charset=utf-8",
    });
    FileSaver.saveAs(blob, "coordinates.kml");
    //Save kml file with formated filename
    var date = new Date();
    var formattedDate = format(date, "DD-MM-YYYY_H:mma");
    console.log(formattedDate);
    const filename = formattedDate + "_" + this.props.profile.firstName;
    console.log(filename);
    storage.ref(`files/${filename}.kml`).put(blob);

    //Save arean and coordinates

    var Area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
    var area1 = L.GeometryUtil.formattedNumber(Area * 0.001) + "  m²";
    console.log(area1);
    this.setState({
      area: area1,
    });

    for (const result of drawedCord) this.state.coordinates.push(result);
    console.log(this.state.coordinates[0]);
  };

  saveToFile = (e) => {
    var FileSaver = require("file-saver");
    const { kmlNameDescription } = this.state;
    var blob = new Blob([kmlNameDescription], {
      type: "text/plain;charset=utf-8",
    });
    FileSaver.saveAs(blob, "coordinates.kml");
  };

  //for future upgrade
  saveToFile1(content, filename) {
    var file = filename + ".geojson";
    saveAs(
      new File([JSON.stringify(content)], file, {
        type: "text/plain;charset=utf-8",
      }),
      file
    );
  }

  onGeojsonPolygons = (e) => {
    this.setState({
      showPolygons: e.currentTarget.checked,
    });
  };

  onGeojsonMarkers = (e) => {
    this.setState({
      showMarkers: e.currentTarget.checked,
    });
  };

  onGeojsonToggleButton = (e) => {
    this.setState({
      geojsonvisible: e.currentTarget.click,
    });
  };

  componentDidMount() {}

  //same for polygon
  onEachFeaturePoint(feature, layer) {
    console.log("feature: ", feature);
    console.log("layer: ", layer);
    var popupContent =
      feature.properties.Name + "  " + feature.properties.Crops;
    console.log(feature.properties.coordinates);

    this.setState({
      coordinatesCenter: feature.properties.coordinates,
    });
    layer.bindPopup(popupContent);
    layer.on({
      click: function (e) {
        console.log("e: ", e);
        console.log("click");
      },
    });
  }

  pointToLayer(feature, latlng) {
    return L.circleMarker(latlng, null); // Change marker to circle
    // return L.marker(latlng, { icon: {}}); // Change the icon to a custom icon
  }

  onButtonClick = (coords) => {
    // const map = this.mapRef.current;
    // var group = new L.featureGroup([L.marker(coords)]);
    // if (map) map.leafletElement.fitBounds(group.getBounds());
    this.setState({
      coordinatesCenter: coords,
    });
  };

  resetMap() {
    console.log("Reset");
  }

  render() {
    //Here we shorten the area and the coordinated definition
    const { area, coordinates, coordinates2 } = this.state;

    //
    const locateOptions = {
      position: "bottomleft",
      strings: {
        title: "Your location ",
      },
      onActivate: () => {}, // callback before engine starts retrieving locations
    };
    const position = this.state.coordinatesCenter;
    const { profile } = this.props;
    if (profile.role === "User" || profile.role === "Admin") {
      console.log("User role", profile.role);

      return (
        <div id="map" className="dashboard container">
          <br />
          <HorizontalLinearStepper
            area={area}
            coordinates={coordinates}
            coordinates2={coordinates2}
          />
          <br />
          <hr />
          <Map
            key={this.state.keyMAP}
            style={{ height: "50vh" }}
            center={position}
            zoom={13}
            onClick={this.handleClick}
            onCreate={this.onCreate}
            onLocationfound={this.handleLocationFound}
          >
            {/* startDirectly */}
            <FullscreenControl position="topleft" />
            <LocateControl options={locateOptions}>
              <span className="fa fa-map-marker"></span>
            </LocateControl>
            <LayersControl position="bottomright">
              <LayersControl.BaseLayer name="OpenStreetMap.BlackAndWhite">
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Sentinel-2">
                <WMSTileLayer
                  layers={["Sentinel-2"]}
                  url="https://kade.si/cgi-bin/mapserv?"
                  format="image/vnd.jpeg-png"
                  transparent="true"
                  tiled="true"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Landsat-8">
                <WMSTileLayer
                  layers={["Landsat-8"]}
                  url="https://kade.si/cgi-bin/mapserv?"
                  format="image/vnd.jpeg-png"
                  transparent="true"
                  tiled="true"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="OpenTopoMap">
                <WMSTileLayer url="https:/opentopomap.org/{z}/{x}/{y}.png" />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="BGtopoVJ-50K">
                <WMSTileLayer
                  layers={["BGtopoVJ-raster-v3.00"]}
                  url="https://kade.si/cgi-bin/mapserv?"
                  format="image/vnd.jpeg-png"
                  transparent="true"
                  tiled="true"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Google Hybrid">
                <WMSTileLayer
                  layers={["BGtopoVJ-raster-v3.00"]}
                  url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                  format="image/vnd.jpeg-png"
                  transparent="true"
                  tiled="true"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="BGMountains">
                <WMSTileLayer
                  layers={["BGtopoVJ-raster-v3.00"]}
                  url="https://bgmtile.kade.si/{z}/{x}/{y}.png"
                  format="image/vnd.jpeg-png"
                  transparent="true"
                  tiled="true"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="OpenTopoMap">
                <WMSTileLayer
                  layers={["BGtopoVJ-raster-v3.00"]}
                  url="https:/opentopomap.org/{z}/{x}/{y}.png"
                  format="image/vnd.jpeg-png"
                  transparent="true"
                  tiled="true"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="OSM HOT">
                <WMSTileLayer
                  layers={["BGtopoVJ-raster-v3.00"]}
                  url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                  format="image/vnd.jpeg-png"
                  transparent="true"
                  tiled="true"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="CYCLE MAP">
                <WMSTileLayer
                  layers={["BGtopoVJ-raster-v3.00"]}
                  url="https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
                  format="image/vnd.jpeg-png"
                  transparent="true"
                  tiled="true"
                />
              </LayersControl.BaseLayer>
              <Search position="topright" />
              <div className="geojson-toggle">
                <label>Show Polygons </label>
                <input
                  style={{ opacity: 1, pointerEvents: "auto" }}
                  type="checkbox"
                  name="layertoggle"
                  id="layertoggle"
                  value={this.state.showPolygons}
                  onChange={this.onGeojsonPolygons}
                />
              </div>
              {this.state.showPolygons && (
                <GeoJSON
                  data={geojson}
                  style={this.geoJSONStyle}
                  value={this.state.showPolygons}
                />
              )}

              <div className="geojson-toggle1">
                <label>Show Markers </label>
                <input
                  style={{ opacity: 1, pointerEvents: "auto" }}
                  type="checkbox"
                  name="layertoggle"
                  id="layertoggle"
                  value={this.state.showMarkers}
                  onChange={this.onGeojsonMarkers}
                />
              </div>
              {this.state.showMarkers && (
                <GeoJSON
                  data={points}
                  style={this.geoJSONStyle}
                  value={this.state.showMarkers}
                  onEachFeature={this.onEachFeaturePoint.bind(this)}
                />
              )}
              {/* /////////////////////////////////////// */}
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                layers="NDVI"
                // baseUrl="https://services.sentinel-hub.com/ogc/wms/bb1c8a2f-5b11-42bb-8ce4-dbf7f5300663"
              />
              <NmScale />
              {/* <CustomWMSLayer
              layers={["Sentinel-2"]}
              options={{
                format: "image/vnd.jpeg-png",
                transparent: "true",
                tiled: "true",
                crossOrigin: null,
              }}
              url="https://kade.si/cgi-bin/mapserv?"
            /> */}
              {/* <WMSTileLayer
                layers={["Sentinel-2"]}
                url="https://kade.si/cgi-bin/mapserv?"
                format="image/vnd.jpeg-png"
                transparent="true"
                tiled="true"
              /> */}
            </LayersControl>
            <Marker position={position}>
              <Popup>Тест</Popup>
            </Marker>
            {this.state.geojsonvisible && (
              <GeoJSON
                data={points}
                onEachFeature={this.onEachFeaturePoint.bind(this)}
                // pointToLayer={this.pointToLayer.bind(this)}
              />
            )}
            <FeatureGroup>
              <EditControl
                position="topleft"
                onEdited={this._onEditPath}
                onCreated={this.onCreate}
                onDeleted={this._onDeleted}
                onMounted={this._mounted}
                onEditStart={this._onEditStart}
                onEditStop={this._onEditStop}
                onDeleteStart={this._onDeleteStart}
                onDeleteStop={this._onDeleteStop}
                draw={{
                  rectangle: false,
                  marker: false,
                  circleMarker: false,
                  circle: false,
                  circlemarker: false,
                }}
              />
            </FeatureGroup>
            <Polygon color="purple" positions={polygon} />
            <GeoJSON
              data={london_postcodes}
              style={this.geoJSONStyle}
              onEachFeature={this.onEachFeature}
            />
          </Map>
          <br />
          <br />
          <button
            className="waves-effect waves-light btn"
            onClick={this.onGeojsonToggleButton}
          >
            Парцел 1 --> показва всички маркери от json файл
          </button>
          <br />
          <button
            className="waves-effect waves-light btn"
            onClick={() => this.onButtonClick([41.9425557, 26.41389781])}
          >
            Парцел 2--> сочи към конкретен маркер
          </button>
          <br />
          <button
            className="waves-effect waves-light btn"
            onClick={this.saveToFile}
          >
            Download drawed shape in kml File
          </button>
          <br />
          <button
            className="waves-effect waves-light btn"
            onClick={this.resetMap}
          >
            Clear map
          </button>
          <br />
          <br />
        </div>
      );
    } else {
      return (
        <h1 className="header center orange-text">
          You don't have access to this page,please make account to access the
          page
        </h1>
      );
    }
  }
}
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth.uid,
    profile: state.firebase.profile,
  };
};

//at the moment this function is not used
const mapDispatchToProps = (dispatch) => {
  return {
    saveData: (coordinates) => dispatch(saveData(coordinates)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
