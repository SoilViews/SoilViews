import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core/";
import { withTranslation } from 'react-i18next'; // for class component
import styles from './indexPage.module.css'

export class indexPage extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <div className="section no-pad-bot" id="index-banner">
        <div className="container">
          <div className="row center">
            <Typography variant="h1" className={styles.orangeText} >{t('welcome')}</Typography>
            <Typography varian="body1" className={styles.statement} >{t('Get your soil analysis today')}</Typography>
            <Typography varian="body1" className={styles.statement} >{t('Increase your predictability and crop yields')}</Typography>
            <Typography variant="body1" className={styles.statement} >{t('we combine soil samples and Copernicus satelite imaging')}</Typography>
          </div>
        </div>
        <div className="container">
          <div className="section">
            <div className="row center">
              <Link to="/Dashboard">
                <h5 className="center btn waves-effect waves-light">
                {t('Start Here')}
                  </h5>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withTranslation()(indexPage);
