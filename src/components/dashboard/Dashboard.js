import React from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { compose } from 'redux'
import "leaflet/dist/leaflet.css";



export class Dashboard extends React.Component{
    constructor() {
        super();
        this.state = {
          lat: 42.696295,
          lng:  23.303643,
          zoom: 10,
        };
      }

  render() {
    const position = [this.state.lat, this.state.lng]

    return(
        <div className='dashboard container'>
            <Map style={{ height: "50vh" }} center={position} zoom={13}>
            <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </Map>
        </div>
    )
    
  }
}

export default compose(
	
)(Dashboard);