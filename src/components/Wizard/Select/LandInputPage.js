import React from "react";
import { compose } from "redux";
import { Link } from 'react-router-dom';


export class LandInputPage extends React.Component {
  render() {
    return (
        <div class="section no-pad-bot" id="index-banner">
        <div class="container">
         
          <h1 class="header center orange-text">Please select an option</h1>
          <div class="row center">
            <Link to='/Dashboard'><h5 className="center btn waves-effect waves-light">Mark your land on the map</h5></Link>
            <Link to='/CoordinatesInput'><h5 className="center btn waves-effect waves-light">Enter your land coordinates</h5></Link>
            <Link to='/UploadFile'><h5 className="center btn waves-effect waves-light">Upload a File</h5></Link>
            <Link to='/LandNumberInput'><h5 className="center btn waves-effect waves-light">Enter your land number</h5></Link>
<br></br>
            <Link to='/'><h5 className="center btn waves-effect waves-light">back</h5></Link>

          </div>
              </div>
            </div>
    );
  }
}
export default compose()(LandInputPage);
