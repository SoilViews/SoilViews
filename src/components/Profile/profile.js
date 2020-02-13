import React  from 'react'
import { compose } from "redux";
export class Profile extends React.Component {

    render() {
        
        return (
            <h4 className="card-title center-align">Profile</h4>
        )
        
    }

}
export default compose()(Profile);