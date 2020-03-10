import React from "react";
import { compose } from "redux";
export class AdminPanel extends React.Component {
  render() {
    return (
        <h1 className="header center orange-text">Admin Panel</h1>
    );
  }
}
export default compose()(AdminPanel);
