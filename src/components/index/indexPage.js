import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core/";
import { withTranslation } from "react-i18next"; // for class component
import styles from "./indexPage.module.css";

export class indexPage extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <div className="section no-pad-bot" id="index-banner">
        <div className="container">
          <div className="row center">
            <Typography variant="h1" className={styles.orangeText}>
              {t("welcome")}
            </Typography>
            <Typography variant="body1" className={styles.statement}>
              {t("Get your soil analysis today")}
            </Typography>
            <Typography variant="body1" className={styles.statement}>
              {t("Increase your predictability and crop yields")}
            </Typography>
            <Typography variant="body1" className={styles.statement}>
              {t("we combine soil samples and Copernicus satelite imaging")}
            </Typography>
          </div>
        </div>
        <div className="container">
          <div className="section">
            <div className="row center">
              <Link to="/Dashboard">
                <h5 className="center btn waves-effect waves-light">
                  {t("Start Here")}
                </h5>
              </Link>
            </div>
            <br />
            <hr />
            <div className="row center">
              <h1 variant="h1" className={styles.orangeText}>
                Pricing
              </h1>
            </div>
            <div class="section">
              <div class="row">
                <div class="col s12 m4">
                  <div class="icon-block">
                    <h2 class="center light-blue-text">
                      <i class="material-icons">flash_on</i>
                    </h2>
                    <h5 class="center">
                      Individual Entrepreneurs/Farmers & Scientists
                    </h5>
                  </div>
                  <div className="card-body">
                    <h3 class="center">
                      <h3>€20</h3>
                      <small className="text-muted">/ mo</small>
                    </h3>
                    <ul class="center">
                      <li>Use of existing models</li>
                      <li>Satellite imagery and data overlays</li>
                      <li>Possible upgrades:</li>
                      <ul className="center">
                        <li>
                          Land area monitoring and notifications based on model
                          and location (0,1-0,8 eur/km2)
                        </li>
                        <li>Upload and intersection functionality</li>
                      </ul>
                    </ul>
                  </div>
                </div>

                <div class="col s12 m4">
                  <div class="icon-block">
                    <h2 class="center light-blue-text">
                      <i class="material-icons">flash_on</i>
                    </h2>
                    <h5 class="center">Governments & NGOs</h5>
                  </div>
                  <div className="card-body">
                    <h3 class="center">
                      <h3>€20</h3>
                      <small className="text-muted">/ mo</small>
                    </h3>
                    <ul class="center">
                      <li>Use of existing models</li>
                      <li>Satellite imagery and data overlays</li>
                      <li>Possible upgrades:</li>
                      <ul className="center">
                        <li>
                          Land area monitoring and notifications based on model
                          and location (0,1-0,8 eur/km2)
                        </li>
                        <li>Upload and intersection functionality</li>
                      </ul>
                    </ul>
                  </div>
                </div>

                <div class="col s12 m4">
                  <div class="icon-block">
                    <h2 class="center light-blue-text">
                      <i class="material-icons">flash_on</i>
                    </h2>
                    <h5 class="center">Private companies</h5>
                  </div>
                  <div className="card-body">
                    <h3 class="center">
                      <h3>€20</h3>
                      <small className="text-muted">/ mo</small>
                    </h3>
                    <ul class="center">
                      <li>Use of existing models</li>
                      <li>Satellite imagery and data overlays</li>
                      <li>Possible upgrades:</li>
                      <ul className="center">
                        <li>
                          Land area monitoring and notifications based on model
                          and location (0,1-0,8 eur/km2)
                        </li>
                        <li>Upload and intersection functionality</li>
                      </ul>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div>
            <h1 className="text-center">Team</h1>
            <p className="text-center">
              SoilViews helps people make use of the satellite data that is
              being generated every day.
            </p>
            <h1>Place our picture here.....</h1>
          </div>
        </div>
      </div>
    );
  }
}
export default withTranslation()(indexPage);
