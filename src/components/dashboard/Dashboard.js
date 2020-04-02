import React,{createRef}from "react";
import { Map, TileLayer, FeatureGroup,Polygon,GeoJSON  } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { EditControl } from "react-leaflet-draw";
import london_postcodes from '../Files/london_postcodes.json'
import '../../leaflet.filelayer'
import { connect } from 'react-redux'
import { saveData } from '../../store/actions/authActions'
import { saveAs } from 'file-saver';  
import {storage,storageRef} from '../../firebase/index'
import firebase from 'firebase';
import FileUploader from "react-firebase-file-uploader";
import JSZip from 'jszip' 

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
]


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
      filesMetadata:[], 
      rows:  [] 
    };
  }
    //Set location when the map is visualized
   
  mapRef = createRef()

  handleClick = () => {
    const map = this.mapRef.current
    if (map != null) {
      map.leafletElement.locate()
      
    }
    console.log("CatchMouseClick",Polygon.latlng);
  }




  onCreate = (e) => {
    var layer = e.layer;
    console.log("Polygon Cordinates",layer.getLatLngs())
    console.log('Log_Create_Shape: ', e)

    var drawedCord = layer.toGeoJSON().geometry.coordinates;
    for (const result of drawedCord) this.props.saveData(result);
    
    console.log("shape1",drawedCord)

    var data = layer.toGeoJSON();
    var convertedData = 'text/json;charset=utf-8,' + JSON.stringify(data);
    console.log(convertedData);
    var FileSaver = require('file-saver');
    var blob = new Blob([convertedData], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "cordinates.json");

    }

    saveToFile() {
      var FileSaver = require('file-saver');
     var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
     FileSaver.saveAs(blob, "hello world.txt");
    }
    
    //for future upgrade
    saveToFile1(content, filename) {
      var file = filename + '.geojson';
      saveAs(new File([JSON.stringify(content)], file, {
        type: "text/plain;charset=utf-8"
      }), file);
    }

    loadFile(event) {

      var input = event.target;
var reader = new FileReader();

// Read the file
reader.readAsText(input.files[0]);
console.log("asd")

  }

  handleChange = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({ image }));
    }
  };

  handleUpload = () => {
    const { image } = this.state;
    const {profile } = this.props
    const filename= profile.firstName +"_"+ image.name;
    const uploadTask = storage.ref(`UploadedFiles/${filename}`).put(image);
    uploadTask.on(
      "state_changed",
      snapshot => {
        // progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress });
      },
      error => {
        // Error function ...
        console.log(error);
      },
      () => {
        // complete function ...
        storage
          .ref("UploadedFiles")
          .child(filename)
          .getDownloadURL()
          .then(url => {
            this.setState({ url });
          });
      }
    );
  };





  showFileUrl(){
   
   storageRef.child('UploadedFiles/').listAll().then(function(res) {
      res.items.forEach(function(folderRef) {
        console.log("folderRef",folderRef.toString());
        var blob = null;
        var xhr = new XMLHttpRequest(); 
        xhr.open("GET", "downloadURL"); 
        xhr.responseType = "blob";       
        xhr.onload = function() 
        {
        blob = xhr.response;//xhr.response is now a blob object
        console.log("BLOB",blob)
        
        // var path = storageRef.child('UploadedFiles/').getDownloadURL(folderRef);
        // var zip = new JSZip();
        // zip.file(path,blob);
    }
    
        xhr.open('GET', folderRef);
        xhr.send();
      });
      
    }).catch(function(error) {
      
    });
  }

  showFileUrl1(){
   
    storageRef.child('UploadedFiles/Alexander_Picture.png').getDownloadURL().then(function(url) {
      // `url` is the download URL for 'images/stars.jpg'
      console.log(url);
      // This can be downloaded directly:
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.response.set('Access-Control-Allow-Origin', '*'); 
      xhr.onload = function(event) {
        var blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();
    
      console.log(url)
    }).catch(function(error) {
      // Handle any errors
    });
   }


   showFileUrl3(){
   
    storageRef.child('UploadedFiles/').listAll().then(function(res) {
       res.items.forEach(function(folderRef) {
         console.log("folderRef",folderRef.toString());
         var blob = null;
         var xhr = new XMLHttpRequest(); 
         xhr.open("GET", "downloadURL"); 
         xhr.responseType = "blob";       
         xhr.onload = function() 
         {
         blob = xhr.response;//xhr.response is now a blob object
         console.log("BLOB",blob)
         
         // var path = storageRef.child('UploadedFiles/').getDownloadURL(folderRef);
         // var zip = new JSZip();
         // zip.file(path,blob);
     }
     
       
       });
       
     }).catch(function(error) {
       
     });
   }
//   componentDidMount() {
//      storageRef.child('UploadedFiles/').getDownloadURL().then(this.showFileUrl);

// }

  render() {
    const position = [this.state.lat, this.state.lng];
    const {profile } = this.props;
    if (profile.role ==='User' || profile.role ==='Admin' ) {
    console.log('User role',profile.role)
    console.log("URL",this.state.url)
    return (   
      
      <div id="map" className="dashboard container">
        <Map style={{ height: "50vh" }} center={position} zoom={13}
          onClick={this.handleClick}
          onCreate={this.onCreate}
          onLocationfound={this.handleLocationFound}>
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
                rectangle: false
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
        <button className="waves-effect waves-light btn-large" onClick={this.showFileUrl}>Export cordinates</button>
        <button className="waves-effect waves-light btn-large" onClick={this.showFileUrl1}>Export cordinates1</button>
        <button className="waves-effect waves-light btn-large" onClick={this.showFileUrl3}>Export cordinates3</button>
        <br />
        <br />
        <br />
        <div className="row">
      <label htmlFor="fileToUpload">Select a File to Upload</label><br />
      <input type="file"  id="fileToUpload"/>
   </div>
   <input type="button" onClick={this.loadFile} value="Upload" />
   <br />
        <br />
        <br />     
        <div className="center">
          <br/>
          <h2 className="green-text">Soilview Uploader</h2>
          <br/>
          <br/>
        <div className="row">
          <progress value={this.state.progress} max="100" className="progress" />
        </div>
        <br />
        <br />
        <br />
        <div className="file-field input-field">
          <div className="btn">
            <span>File</span>
            <input type="file" onChange={this.handleChange} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button onClick={this.handleUpload} className="waves-effect waves-light btn" > Upload  </button>
        <br />
        <br />
        <img src={this.state.url || "https://via.placeholder.com/400x300"}
          alt="Uploaded Images"
          height="300"
          width="400"
        />
      </div>
      </div>
    );
            } else{
              return (
                <h1 className="header center orange-text">You don't have access to this page,please make account to access the page</h1>
              )
            }
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
      auth: state.firebase.auth,
      profile: state.firebase.profile
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    saveData: (cordinates) => dispatch(saveData(cordinates))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)