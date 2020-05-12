import React, { createRef } from "react";
import {
  Map,
  TileLayer,
  FeatureGroup,
  Polygon,
  GeoJSON,
  Marker,
  Popup,
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
import firebase from "../../firebase";
L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";
// import JSZip from 'jszip'
// import {  getFirestore } from 'redux-firestore'
// import sophia_postcodes from '../Files/rpu_sofia.geojson'

//Hardcoded cordinates of polygons
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
      cordinates: [],
      cordinatesCenter: [42.696295, 23.303643],
      zoom: 10,
      showMarkers: false,
      showPolygons: false,
      geojsonvisible: false,
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
    console.log("Polygon Cordinates", layer.getLatLngs());
    console.log("Log_Create_Shape: ", e);
    //get cordinates to geojson format
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
    FileSaver.saveAs(blob, "cordinates.kml");

    //Save kml file with formated filename
    var date = new Date();
    var formattedDate = format(date, "DD-MM-YYYY_H:mma");
    console.log(formattedDate);
    const filename = formattedDate + "_" + this.props.profile.firstName;
    console.log(filename);
    storage.ref(`files/${filename}.kml`).put(blob);

    //Save arean and cordinates
    var Area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
    var area1 = L.GeometryUtil.formattedNumber(Area * 0.001) + "  m²";
    console.log(area1);
    this.setState({
      area: area1,
    });

    for (const result of drawedCord) this.state.cordinates.push(result);
    console.log(this.state.cordinates[0]);
    console.log(Object.values(this.state.cordinates));
    const db = firebase.firestore();
    db.collection("cordinates").add({
      authorFirstName: this.props.profile.firstName,
      authorLastName: this.props.profile.lastName,
      userId: this.props.auth,
      area: this.state.area,
      createdAt: new Date(),
      ...this.state.cordinates[0],
    });
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
      cordinatesCenter: feature.properties.coordinates,
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
      cordinatesCenter: coords,
    });
  };

  render() {
    const position = this.state.cordinatesCenter;
    const { profile } = this.props;
    if (profile.role === "User" || profile.role === "Admin") {
      console.log("User role", profile.role);
      const basemapsDict = {
        osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        hot: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        cycle: "https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
        sentinel:
          "http://services.sentinel-hub.com/ogc/wms/bb1c8a2f-5b11-42bb-8ce4-dbf7f5300663?REQUEST=GetMap&BBOX=3238005,5039853,3244050,5045897&LAYERS=TRUE_COLOR&MAXCC=20&WIDTH=320&HEIGHT=320&FORMAT=image/jpeg&TIME=2018-03-29/2018-05-29",
      };
      return (
        <div id="map" className="dashboard container">
          <br />
          <HorizontalLinearStepper />
          <br />
          <hr />
          <Map
            style={{ height: "50vh" }}
            center={position}
            zoom={13}
            onClick={this.handleClick}
            onCreate={this.onCreate}
            onLocationfound={this.handleLocationFound}
          >
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
    saveData: (cordinates) => dispatch(saveData(cordinates)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
