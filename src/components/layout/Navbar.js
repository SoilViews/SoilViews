import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLinks";

export class Navbar extends React.Component {
  render() {
    const { profile, auth } = this.props;
    const links = auth.uid ? (
      <SignedInLinks profile={profile} />
    ) : (
      <SignedOutLinks />
    );
    return (
      <nav className="z-depth-0">
        <div className="nav-wrapper">
          <div className="container">
            <Link to="/" className="brand-logo">
              <img alt="logo" id="sv_logo" src={require("./logo.png")} />
            </Link>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              {links}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
  };
};

export default connect(mapStateToProps)(Navbar);
