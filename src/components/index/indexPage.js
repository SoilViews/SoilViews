import React from "react";
import { compose } from "redux";
import { Link } from 'react-router-dom';
export class indexPage extends React.Component {
  render() {
    return (
        <div class="section no-pad-bot" id="index-banner">
        <div class="container">
         
          <h1 class="header center orange-text">Welcome to SoilViews Web App</h1>
          <div class="row center">
            <h5 class="header col s12 light">Get your soil analysis today</h5>
            <h5 class="header col s12 light">Increase your predictability and crop yields</h5> 
            <h5 class="header col s12 light">Not magic: we combine soil samples and Copernicus satelite imaging</h5>
          </div>
          {/* <div class="row center">
            <a href="https://soilviews.com/" id="download-button" class="btn-large waves-effect waves-light orange">Get Started</a>
          </div> */}

          <div class="container">
            <div class="section">
              <div class="row center">
                <div class="col s12 m4">
                  <div class="icon-block">
                    <h2 class="center light-blue-text">
                      {/* <i class="material-icons">account_circle</i> */}
                    </h2>
                    <Link to='/Profile'><h5 class="center btn-large waves-effect waves-light">My Profile</h5></Link>
                    {/* <i class="material-icons">account_circle</i> */}
                   
                  </div>
                </div>

                <div class="col s12 m4">
                  <div class="icon-block">
                    <h2 class="center light-blue-text">
                      {/* <i class="material-icons">add_circle_outline</i> */}
                    </h2>
                    <Link to='/CreateProject'><h5 class="center btn-large waves-effect waves-light">New Project</h5></Link>
                    {/* <i class="material-icons">add_circle_outline</i> */}
                    
                  </div>
                </div>

                <div class="col s12 m4">
                  <div class="icon-block">
                    <h2 class="center light-blue-text">
                      {/* <i class="material-icons">help_outline</i> */}
                    </h2>
                    <Link to='/HelpPage'><h5 class="center btn-large waves-effect waves-light">Documentation</h5></Link>
                    {/* <i class="material-icons">help_outline</i> */}
                    
                  </div>
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
