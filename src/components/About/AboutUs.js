import React from 'react';
import { compose } from 'redux'
import styles from "./AboutUs.module.css";


const AboutUs = () => {
    return (
        <div className="container">
            <div className="row">
                <p>This is about us page</p>
                <p>About the team text goes here</p>
                <p>team photo</p>
                <p>individual about info</p>
                <p>Link to the blog</p>


                          <hr />
          <div className="row center">
            <h1 className={styles.orangeText}>Team</h1>
            <p className="text-center">
              SoilViews helps people make most of their soil by providing them crop sustainability report and tips.
            </p>
            <img class={styles.responsive} alt="team" width="640px" height="480px" src={require("./team.jpg")} />
          </div>
            </div>
        </div>
    );
};

export default compose()(AboutUs);