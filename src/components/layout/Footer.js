import React from "react";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";

const Footer = (props) => {
  return (
    <React.Fragment>
      <footer className="page-footer orange">
        <div className="container">
          <div className="row">
            <div className="col l6 s12">
              <h5 className="white-text">About SoilViews Web App</h5>
              <p className="grey-text text-lighten-4">
                We deliver soil analysis combining Satelite imaging and soil
                samples.
                <Link to="/AboutUs" className="white-text" href="#!">
                  (Read more)
                </Link>
                {/* SoilViews Web App gives you analylisis on what crops could grow best on any specific land. Based on quality hyperspectral saatelite imaging and close work with soil specialists we deliver insights that would help you increase your crop yeilds. */}
              </p>
            </div>
            <div className="col l3 s12">
              <h5 className="white-text">Settings</h5>
              <ul>
                <li>
                  <Link to="/ContactForm" className="white-text" href="#!">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/Dashboard" className="white-text" href="#!">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col l3 s12">
              <h5 className="white-text">Connect</h5>
              <ul>
                <li>
                  <NavLink to="/SignIn" className="white-text" href="#!">
                    SignIn
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/SignUp" className="white-text" href="#!">
                    SignUp
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="container">
            Created by{" "}
            <a className="white-text" href="#!" href="https://soilviews.com/">
              {" "}
              SoilViews{" "}
            </a>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  console.log(state);
  return {
    projects: state.firestore.ordered.projects,
    profile: state.firebase.profile,
    auth: state.firebase.auth,
  };
};

export default connect(mapStateToProps)(Footer);
