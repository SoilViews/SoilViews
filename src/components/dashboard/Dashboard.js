import React, { createRef } from "react";
import { Map, TileLayer, FeatureGroup, Polygon, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { EditControl } from "react-leaflet-draw";
import london_postcodes from "../Files/london_postcodes.json";
import geojson from "../Files/geojson.json";
import "../../leaflet.filelayer";
import { connect } from "react-redux";
import { saveData } from "../../store/actions/authActions";
import { saveAs } from "file-saver";
import HorizontalLinearStepper from "../Wizard/HorizontalLinearStepper";
import "../dashboard/GeojsonLayer.css";
// import JSZip from 'jszip'
// import firebase from '../../firebase';
// import {  getFirestore } from 'redux-firestore'
// import sophia_postcodes from '../Files/rpu_sofia.geojson'
// import L from "leaflet";

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
      filenames: [],
      downloadURLs: [],
      lat: 42.696295,
      lng: 23.303643,
      zoom: 10,
      image: null,
      url: "",
      progress: 0,
      files: [],
      uploadValue: 0,
      filesMetadata: [],
      rows: [],
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

    var drawedCord = layer.toGeoJSON().geometry.coordinates;
    for (const result of drawedCord) this.props.saveData(result);

    console.log("shape1", drawedCord);

    var data = layer.toGeoJSON();
    var convertedData = "text/json;charset=utf-8," + JSON.stringify(data);
    console.log(convertedData);
    var FileSaver = require("file-saver");
    var blob = new Blob([convertedData], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, "cordinates.json");
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

  onGeojsonToggle = (e) => {
    this.setState({
      geojsonvisible: e.currentTarget.checked,
    });
  };

  componentDidMount() {}

  render() {
    const position = [this.state.lat, this.state.lng];
    const { profile } = this.props;
    if (profile.role === "User" || profile.role === "Admin") {
      console.log("User role", profile.role);
      console.log("URL", this.state.url);
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
            {/* <div className="geojson-toggle">
              <label htmlFor="layertoggle">Toggle Geojson </label>
              <input
                type="checkbox"
                name="layertoggle"
                id="layertoggle"
                value={this.state.geojsonvisible}
                onChange={this.onGeojsonToggle}
              />
            </div>
            {this.state.geojsonvisible && <GeojsonLayer url="geojson.json" />} */}
            {/* /////////////////WORK////////////////// */}
            <div className="geojson-toggle">
              <label>Show Geojson </label>
              <input
                style={{ opacity: 1 }}
                type="checkbox"
                name="layertoggle"
                id="layertoggle"
                value={this.state.geojsonvisible}
                onChange={this.onGeojsonToggle}
              />
            </div>
            {this.state.geojsonvisible && (
              <GeoJSON
                data={geojson}
                style={this.geoJSONStyle}
                value={this.state.geojsonvisible}
              />
            )}
            {/* /////////////////////////////////////// */}
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
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
    auth: state.firebase.auth,
    profile: state.firebase.profile,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    saveData: (cordinates) => dispatch(saveData(cordinates)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
