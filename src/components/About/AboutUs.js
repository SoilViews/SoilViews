import React from 'react';
import { compose } from 'redux'

const AboutUs = () => {
    return (
        <div className="container">
            <div className="row">
                <p>This is about us page</p>
                <p>About the team text goes here</p>
                <p>team photo</p>
                <p>individual about info</p>
                <p>Link to the blog</p>
            </div>
        </div>
    );
};

export default compose()(AboutUs);