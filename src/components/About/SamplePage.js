import React from 'react';
import { compose } from 'redux'

const AboutUs = () => {
    return (
        <div className="container">
            <div className="row">
                <p>This is about us page</p>
            </div>
        </div>
    );
};

export default compose()(AboutUs);