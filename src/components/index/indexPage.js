import React  from 'react'
import { compose } from "redux";
export class indexPage extends React.Component {

    render() {
        return (
            <h4 className="card-title center-align">Loginn</h4>
        )
        
    }

}
export default compose()(indexPage);