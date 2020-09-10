import React from 'react';
import { compose } from 'redux';

// import styles from "./Acknowledgements.module.css"

const Acknowledgements = () => {
    return (
        <div className="container">
            <div className="row">
                <p>This is Acknowledgement us page</p>
                <ul>
                    <li>
                        Copernicus
                    </li>
                    <li>
                        Layers
                    </li>
                    <li>
                        Technologies used
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default compose()(Acknowledgements);