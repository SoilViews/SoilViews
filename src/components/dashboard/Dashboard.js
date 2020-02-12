import React,{createRef}from "react";
import { Map, TileLayer, FeatureGroup,Polygon } from "react-leaflet";
import { compose } from "redux";
import "leaflet/dist/leaflet.css";
import { EditControl } from "react-leaflet-draw";
// import L from "leaflet";

//Hardcoded cordinates of polygons
const polygon = [
  [42.696295, 23.303643],
  [42.699295, 23.303643],
  [42.699295, 23.313643],
  [42.679295, 23.313643],
]

export class Dashboard extends React.Component {

    //Set location when the map is visualized
    state = {
      lat: 42.696295,
      lng: 23.303643,
      zoom: 10
    }
    
  mapRef = createRef()

  handleClick = () => {
    const map = this.mapRef.current
    if (map != null) {
      map.leafletElement.locate()
      
    }
    console.log("CatchHandleClick",Polygon.latlng);
  }

  //TODO
  handleLocationFound = (e) => {
    this.setState({
      hasLocation: true,
      latlng: e.latlng,
      
    }
 
    )
    console.log("e")
  }

  

  render() {
    const position = [this.state.lat, this.state.lng];

    return (
      <div id="map" className="dashboard container">
        <Map style={{ height: "50vh" }} center={position} zoom={13}
          onClick={this.handleClick}
          onLocationfound={this.handleLocationFound}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <FeatureGroup>
            <EditControl
              position="topright"
              onEdited={this._onEditPath}
              onCreated={this._onCreate}
              onDeleted={this._onDeleted}
              onMounted={this._mounted}
              onEditStart={this._onEditStart}
              onEditStop={this._onEditStop}
              onDeleteStart={this._onDeleteStart}
              onDeleteStop={this._onDeleteStop}
              draw={{
                rectangle: false
              }}
            />
          </FeatureGroup>
          <Polygon color="purple" positions={polygon} />
        </Map>
      </div>
    );
  }
}

export default compose()(Dashboard);
