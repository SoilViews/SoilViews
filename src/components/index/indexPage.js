import React from "react";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core/";

import styles from './indexPage.module.css'

export class indexPage extends React.Component {
  render() {
    return (
      <div className="section no-pad-bot" id="index-banner">
        <div className="container">
        <div className="row center">
          <Typography variant="h1" className={styles.orangeText} >Welcome to SoilViews Web App</Typography>
          <Typography varian="body1" className={styles.statement} >Get your soil analysis today</Typography>
          <Typography varian="body1" className={styles.statement} >Increase your predictability and crop yields</Typography>
          <Typography variant="body1" className={styles.statement} >Not magic: we combine soil samples and Copernicus satelite imaging</Typography>
</div>
         
          </div>
          <div className="container">
            <div className="section">
              <div className="row center">
                <Link to="/Dashboard">
                  <h5 className="center btn waves-effect waves-light">
                    Start Here
                  </h5>
                </Link>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
export default compose()(indexPage);
