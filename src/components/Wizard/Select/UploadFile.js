import React from "react";
import { compose } from "redux";
export class UploadFile extends React.Component {
  render() {
    return (
        <div class="section no-pad-bot" id="index-banner">
        <div class="container">
         
          <h1 class="header center orange-text">UploadFile page</h1>
          <div class="row center">
            <h5 class="header col s12 light">Button to upload file</h5>
          </div>
              </div>
            </div>
    );
  }
}
export default compose()(UploadFile);
