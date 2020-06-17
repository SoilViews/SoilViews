import React from "react";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import LanguageBar from "./LanguageBar"
import { useTranslation } from 'react-i18next';

import styles from "./styles/Footer.module.css"

const Footer = (props) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <footer className="page-footer orange">
        <div className="container">
          <div className="row">
            <div className="col l6 s12">
              <h5 className="white-text">{t('About SoilViews Web App')}</h5>
              <p className="grey-text text-lighten-4">
                {t('We deliver soil analysis combining Satelite imaging and soil samples.')}
                <Link to="/AboutUs" className="white-text" href="#!">
                  ({t('Read more')})
                </Link>
                {/* SoilViews Web App gives you analylisis on what crops could grow best on any specific land. Based on quality hyperspectral saatelite imaging and close work with soil specialists we deliver insights that would help you increase your crop yeilds. */}
              </p>
            </div>
            <div className="col l3 s12">
              <h5 className="white-text">{t('Settings')}</h5>
              <ul>
                <li>
                  <Link to="/Profile" className="white-text" href="#!">
                    {t('My Profile')}
                  </Link>
                </li>
                <li>
                  <Link to="/Dashboard" className="white-text" href="#!">
                    {t('Dashboard')}
                  </Link>
                </li>
                <li>
                  <Link to="/HelpPage" className="white-text" href="#!">
                    {t('Documentation')}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col l3 s12">
              <h5 className="white-text">{t('Connect')}</h5>
              <ul>
                <li>
                  <NavLink to="/SignIn" className="white-text" href="#!">
                    {t('SignIn')}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/SignUp" className="white-text" href="#!">
                    {t('SignUp')}
                  </NavLink>
                </li>
                <li>
                  <Link to="/ContactForm" className="white-text" href="#!">
                    {t('Contact Us')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="container">
            <div className={styles.position}>
              <LanguageBar />
            </div>
            {t('Created by')} <a href="https://soilviews.com/"> SoilViews </a>
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
