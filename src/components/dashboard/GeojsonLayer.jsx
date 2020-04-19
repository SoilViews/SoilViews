import React from "react";
import { GeoJSON, FeatureGroup, Popup } from "react-leaflet";
import "../dashboard/GeojsonLayer.css";
import london_postcodes from "../Files/london_postcodes.json";

export default class GeojsonLayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };

    console.log("contructor");
  }

  myStyle = () => {
    return {
      color: "green",
      weight: 3,
      opacity: 1,
      fillColor: "red",
      dashArray: "8 5",
    };
  };

  render() {
    console.log("render");

    console.info(this.state.data);
    return (
      <FeatureGroup>
        {this.state.data.map((f) => {
          return (
            <GeoJSON key={f.properties.id} data={f} style={this.myStyle}>
              <Popup>{f.properties.name}</Popup>
            </GeoJSON>
          );
        })}
      </FeatureGroup>
    );
  }

  componentDidMount() {
    if (this.props.url) {
      this.fetchData(this.props.url);
    }
    console.log("did mount");
  }

  componentWillUnmount() {
    console.log("will unmount");
  }

  fetchData(url) {
    let request = fetch(london_postcodes);
    console.log("asdasdsad", london_postcodes);

    request
      .then((r) => r.text())
      .then((text) => console.log(text))
      .then(
        (data) => {
          var drawedCord = data.toGeoJSON().geometry.coordinates;
          console.log(drawedCord);
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
