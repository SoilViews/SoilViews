import React from "react";
import { connect } from "react-redux";

const Footer = props => {
  return (
    <React.Fragment>
      <footer class="page-footer orange">
        <div class="container">
          <div class="row">
            <div class="col l6 s12">
              <h5 class="white-text">Company Bio</h5>
              <p class="grey-text text-lighten-4">
                We are a team of college students working on this project like
                it's our full time job. Any amount would help support and
                continue development on this project and is greatly appreciated.
              </p>
            </div>
            <div class="col l3 s12">
              <h5 class="white-text">Settings</h5>
              <ul>
                <li>
                  <a class="white-text" href="#!">
                    Link 1
                  </a>
                </li>
                <li>
                  <a class="white-text" href="#!">
                    Link 2
                  </a>
                </li>
              </ul>
            </div>
            <div class="col l3 s12">
              <h5 class="white-text">Connect</h5>
              <ul>
                <li>
                  <a class="white-text" href="#!">
                    Link 1
                  </a>
                </li>
                <li>
                  <a class="white-text" href="#!">
                    Link 2
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="footer-copyright">
          <div class="container">
            Made by{" "}
            <a
              class="orange-text text-lighten-3"
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
