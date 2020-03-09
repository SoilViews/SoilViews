import React from "react";
import { compose } from "redux";
export class LandNumberInput extends React.Component {
  render() {
    return (
        <div class="section no-pad-bot" id="index-banner">
        <div class="container">
         
          <h1 class="header center orange-text">Enter your Land number</h1>
          <div class="row center">
            <h5 class="header col s12 light">Input field</h5>
            <h5 class="header col s12 light">Next button</h5>
          </div>
              </div>
            </div>
    );
  }
}
export default compose()(LandNumberInput);
