import React, { Component } from 'react';

class LandInput extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }
    render(){
        return (
            <div>
                    <div className="row center">
                     <h5 className="center btn waves-effect waves-light">Mark your land on the map</h5>
                     <h5 className="center btn waves-effect waves-light">Enter your land coordinates</h5>
                     <h5 className="center btn waves-effect waves-light">Upload a File</h5>
                     <h5 className="center btn waves-effect waves-light">Enter your land number</h5>
                </div>

            </div>
        )
    }
}
export default LandInput