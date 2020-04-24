import React from "react";
import { compose } from "redux";
import FoodTypeOptions from "./FoodTypeOptions"

export class HelpPage extends React.Component {
  render() {
    return (
      <div class="section no-pad-bot" id="index-banner">
        <div class="container">
          {/* <h1 class="header center orange-text">Help Page</h1> */}
          <div class="row center">
            {/* <h5 class="header col s12 light">Learn how to submit a project</h5>
            <h5 class="header col s12 light">How to work with mapping regions</h5> */}
            <FoodTypeOptions />
          </div>
        </div>
      </div>
    );
  }
}
export default compose()(HelpPage);
