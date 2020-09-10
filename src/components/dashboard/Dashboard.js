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
// import HorizontalLinearStepper from "../Wizard/HorizontalLinearStepper";
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
import { popupContent, popupHead } from "./popupStyles";
import { Typography } from "@material-ui/core";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import LockIcon from "@material-ui/icons/Lock";
import AllLayers from "./AllLayers"
import LocationOnIcon from '@material-ui/icons/LocationOn';

import styles from "./Dashboard.module.css";

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
      area: null,
      coordinates: [],
      coordinatesCenter: [42.696295, 23.303643],
      zoom: 10,
      showMarkers: false,
      showPolygons: false,
      geojsonvisible: false,
      viewToolbar: false,
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
      kmlNameDescription: tokml(data, {
        name: "name",
        description: "description",
      }),
    });

    var convertedData = JSON.stringify(data);
    console.log(convertedData);
    // var FileSaver = require("file-saver");
    var blob = new Blob([this.state.kmlNameDescription], {
      type: "text/plain;charset=utf-8",
    });
    // FileSaver.saveAs(blob, "coordinates.kml");

    //Save kml file with formated filename
    var date = new Date();
    var formattedDate = format(date, "dd-mm-yyyy_h:mma");
    console.log(formattedDate);
    const filename = formattedDate + "_" + this.props.profile.firstName;
    console.log(filename);
    storage.ref(`files/${filename}.kml`).put(blob);

    //Save arean and coordinates

    var Area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
    var areaFormatted = L.GeometryUtil.formattedNumber(Area * 0.001) + "  m²";
    console.log(areaFormatted);
    this.setState({
      area: areaFormatted,
    });
    this.props.areaHandler(areaFormatted);

    for (const result of drawedCord) this.state.coordinates.push(result);
    console.log(this.state.coordinates[0]);
    this.props.coordinatesHandler(this.state.coordinates);
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

  componentDidMount() { }

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

  resetMap = (e) => {
    this.setState({ keyMAP: Math.random(), area: null });
    var areaReset = null;
    this.props.areaHandler(areaReset);
  };

  render() {
    //Here we shorten the area and the coordinated definition
    const { viewMap } = this.props;
    //
    const locateOptions = {
      position: "bottomleft",
      strings: {
        title: "Your location ",
      },
      onActivate: () => { }, // callback before engine starts retrieving locations
    };
    const position = this.state.coordinatesCenter;
    const { profile } = this.props;
    //This is for the translation
    const { t } = this.props;
    if (profile.role === "User" || profile.role === "Admin") {
      return (
        <div id="map" className="dashboard container">
          <br />
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
            <AllLayers />
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

            <Marker position={position}>
              <Popup className="request-popup">
                <div style={popupContent}>
                  <img
                    src="https://cdn3.iconfinder.com/data/icons/basicolor-arrows-checks/24/149_check_ok-512.png"
                    width="150"
                    height="150"
                    alt="no img"
                  />
                  <div className="m-2" style={popupHead}>
                    Success!
                  </div>
                </div>
              </Popup>
            </Marker>
            {this.state.geojsonvisible && (
              <GeoJSON
                data={points}
                onEachFeature={this.onEachFeaturePoint.bind(this)}
              // pointToLayer={this.pointToLayer.bind(this)}
              />
            )}
            <FeatureGroup>
              {viewMap && (
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
              )}
            </FeatureGroup>
            <Polygon color="purple" positions={polygon} />
            <GeoJSON
              data={london_postcodes}
              style={this.geoJSONStyle}
              onEachFeature={this.onEachFeature}
            />
          </Map>
          {/* <button
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
          <br /> */}
          <Typography>
            Click on the <LocationOnIcon className={styles.centered}></LocationOnIcon>
            icon to use your current location.
           <Typography variant="caption" > Device location must be enabled</Typography>
          </Typography>

          <div className={styles.whiteSpace15}>
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
            >Clear map</button>
          </div>
        </div >
      );
    } else {
      return (
        <div className={styles.container}>
          <NavLink to="/signin">
            <Typography>
              <LockIcon className={styles.centered}></LockIcon>
              {t("Please login to continue")}
            </Typography>
          </NavLink>
        </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Dashboard));
