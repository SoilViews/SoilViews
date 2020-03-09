import React from "react";
import { compose } from "redux";
import { Link } from 'react-router-dom';

export class indexPage extends React.Component {
  render() {
    return (
        <div className="section no-pad-bot" id="index-banner">
        <div className="container">
         
          <h1 className="header center orange-text">Welcome to SoilViews Web App</h1>
          <div className="row center">
            <p className="header col s12 light">Get your soil analysis today</p>
            <p className="header col s12 light">Increase your predictability and crop yields</p> 
            <p className="header col s12 light">Not magic: we combine soil samples and Copernicus satelite imaging</p>
          </div>
          {/* <div class="row center">
            <a href="https://soilviews.com/" id="download-button" class="btn-large waves-effect waves-light orange">Get Started</a>
          </div> */}

          <div className="container">
            <div className="section">
              <div className="row center">
                <div className="col s12 m4">
                    <Link to='/Profile'><h5 className="center btn waves-effect waves-light">My Profile</h5></Link>
                    {/* <i class="material-icons">account_circle</i> */}
                </div>
                <div className="col s12 m4">
                    <Link to='/LandInput'><h5 className="center btn waves-effect waves-light">New Project</h5></Link>
                    {/* <i class="material-icons">add_circle_outline</i> */}
                </div>
                <div className="col s12 m4">
                    <Link to='/HelpPage'><h5 className="center btn waves-effect waves-light">Documentation</h5></Link>
                    {/* <i class="material-icons">help_outline</i> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
export default compose()(indexPage);
