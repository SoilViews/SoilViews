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
import Basemap from "./Basemap";
import "./Map.css";
import L from "leaflet";
import { storage } from "../../firebase/index";
import { format } from "date-fns";

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
      basemap: "osm",
      downloadURLs: [],
      area: "",
      coordinates: [],
      coordinatesCenter: [42.696295, 23.303643],
      zoom: 10,
      showMarkers: false,
      showPolygons: false,
      geojsonvisible: false,
      keyMAP: Math.random(),
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
    var kmlNameDescription = tokml(data, {
      name: "name",
      description: "description",
    });
    console.log("kmlNameDescription", kmlNameDescription);
    var convertedData = JSON.stringify(data);
    console.log(convertedData);
    var FileSaver = require("file-saver");
    var blob = new Blob([kmlNameDescription], {
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
    // console.log(this.state.coordinates[0]);
  };

  saveToFile() {
    var FileSaver = require("file-saver");
    var blob = new Blob(["Greetings from SoilViews!"], {
      type: "text/plain;charset=utf-8",
    });
    FileSaver.saveAs(blob, "Greetings from SoilViews.txt");
  }

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
  onBMChange = (bm) => {
    // console.log(this);
    this.setState({
      basemap: bm,
    });
  };

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

  render() {
    //Here we shorten the area and the coordinated definition
    const { area, coordinates, coordinates2 } = this.state;

    //
    const position = this.state.coordinatesCenter;
    const { profile } = this.props;
    if (profile.role === "User" || profile.role === "Admin") {
      console.log("User role", profile.role);
      const basemapsDict = {
        osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        BGMountains: "https://bgmtile.kade.si/{z}/{x}/{y}.png",
        GoogleHybrid: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        Sentinel2:
          "https://kade.si/cgi-bin/mapserv?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/jpeg&TRANSPARENT=true&LAYERS=Landsat-8&TILED=true&format=image%2Fvnd.jpeg-png&WIDTH=320&HEIGHT=320&CRS=EPSG%3A3857&STYLES=&MAP_RESOLUTION=112.5&BBOX={x}{y}{x}{y}",
        Sentinel3: "https://kade.si/cgi-bin/mapserv?",
        OpenTopoMap: "https:/opentopomap.org/{z}/{x}/{y}.png",
        hot: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        cycle: "https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
        sentinel:
          "http://services.sentinel-hub.com/ogc/wms/bb1c8a2f-5b11-42bb-8ce4-dbf7f5300663?REQUEST=GetMap&BBOX=3238005,5039853,3244050,5045897&LAYERS=TRUE_COLOR&MAXCC=20&WIDTH=320&HEIGHT=320&FORMAT=image/jpeg&TIME=2018-03-29/2018-05-29",
      };
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
              <Search />

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
                url={basemapsDict[this.state.basemap]}
                layers="NDVI"
                // baseUrl="https://services.sentinel-hub.com/ogc/wms/bb1c8a2f-5b11-42bb-8ce4-dbf7f5300663"
              />
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
            <Basemap
              style={{ select: "yes" }}
              basemap={this.state.basemap}
              onChange={this.onBMChange}
            />
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
            Download file
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
