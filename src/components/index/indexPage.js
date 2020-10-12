import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core/";
import { withTranslation } from "react-i18next"; // for class component
import styles from "./indexPage.module.css";
import style from "./style.css";
import Mailchimp from "react-mailchimp-form";

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

            <div className="row">
              <div className="col s4">
                <div className="card border">
                  <div className="card-head green">
                    <div className={style.orangeText}>
                      <span>FREE</span>
                      <br />
                      <span className="price">FREE!</span>
                    </div>
                  </div>
                  <div className="card-content no-padding">
                    <p className="item-pricing-table">Lorem ipsum dolor.</p>
                    <p className="item-pricing-table">Lorem ipsum dolor.</p>
                    <p className="item-pricing-table">Lorem ipsum dolor.</p>
                    <div align="center">
                      <button
                        align="center"
                        className="btn waves-effect waves-light green purchase-btn"
                      >
                        register
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col s4">
                <div className="card border">
                  <div className="card-head blue">
                    <div className="card-head-content">
                      <span>MONTH</span>
                      <br />
                      <span className="price">$ 23.43</span>
                    </div>
                  </div>
                  <div className="card-content no-padding">
                    <p className="item-pricing-table">Lorem ipsum dolor.</p>
                    <p className="item-pricing-table">Lorem ipsum dolor.</p>
                    <p className="item-pricing-table">Lorem ipsum dolor.</p>
                    <div align="center">
                      <button
                        align="center"
                        className="btn waves-effect waves-light blue purchase-btn"
                      >
                        purchase
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col s4">
                <div className="card border">
                  <div className="card-head orange">
                    <div className="card-head-content">
                      <span>YEAR</span>
                      <br />
                      <span className="price">$ 239.43</span>
                    </div>
                  </div>
                  <div className="card-content no-padding">
                    <p className="item-pricing-table">Lorem ipsum dolor.</p>
                    <p className="item-pricing-table">Lorem ipsum dolor.</p>
                    <p className="item-pricing-table">Lorem ipsum dolor.</p>
                    <div align="center">
                      <button
                        align="center"
                        className="btn waves-effect waves-light orange purchase-btn"
                      >
                        purchase
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="row center">
            <h1 className={styles.orangeText}>Team</h1>
            <p className="text-center">
              SoilViews helps people make use of the satellite data that is
              being generated every day.
            </p>
            <h1>Place our picture here.....</h1>
          </div>
          <hr />
          <div className="row center">
            <h1 className={styles.orangeText}>Want to know when we launch?</h1>
            <Mailchimp
              action="https://soilviews.us19.list-manage.com/subscribe/post?u=6c2d9042d080c53e50bee4a40&amp;id=3b6e268c42"
              fields={[
                {
                  name: "EMAIL",
                  placeholder: "Email",
                  type: "email",
                  required: true,
                },
                {
                  name: "FNAME",
                  placeholder: "Name",
                  type: "text",
                  required: true,
                },
              ]}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default withTranslation()(indexPage);
