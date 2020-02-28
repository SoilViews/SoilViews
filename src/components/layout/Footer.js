import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

const Footer = props => {
  return (
    <React.Fragment>
      <footer className="page-footer orange">
        <div className="container">
          <div className="row">
            <div className="col l6 s12">
              <h5 className="white-text">About SoilViews Web App</h5>
              <p className="grey-text text-lighten-4">
                We deliver soil analysis combining Satelite imaging and soil samples.
                <Link to='/AboutUs' className='brand-logo'>(Read more)</Link>
                {/* SoilViews Web App gives you analylisis on what crops could grow best on any specific land. Based on quality hyperspectral saatelite imaging and close work with soil specialists we deliver insights that would help you increase your crop yeilds. */}
              </p>
            </div>
            <div className="col l3 s12">
              <h5 className="white-text">Settings</h5>
              <ul>
                <li>
                  <Link to='/ContactForm' className='brand-logo'>Contact Us</Link>
                </li>
                <li>
                  <Link to='/Dashboard' className='brand-logo'>Dashboard</Link>
                </li>
              </ul>
            </div>
            <div className="col l3 s12">
              <h5 className="white-text">Connect</h5>
              <ul>
                <li>
                  <a className="white-text" href="#!">
                    Link 1
                  </a>
                </li>
                <li>
                  <a className="white-text" href="#!">
                    Link 2
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="container">
            Created by{" "}
            <a
              className="orange-text text-lighten-3"
              href="https://soilviews.com/"
            >
              SoilViews
            </a>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  console.log(state);
  return {
    projects: state.firestore.ordered.projects,
    profile: state.firebase.profile,
    auth: state.firebase.auth
  };
};

export default connect(mapStateToProps)(Footer);
