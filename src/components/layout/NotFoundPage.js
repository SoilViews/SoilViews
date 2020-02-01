import React from 'react';
import { Link } from 'react-router-dom';

class NotFoundPage extends React.Component {
    
    state={
        image: 'http://i.giphy.com/l117HrgEinjIA.gif' 
    }

    render() {
        
        return(

        <div className="page-not-found">

            <div className="bg" style={{ backgroundImage: 'url(' + this.state.image + ')' }}></div>
            <div className="code">404</div>
            <p className="goHomeLink" style={{ textAlign: "center" }}>
                <Link to="/">Go to Home </Link>
            </p>
        </div>
        )
    }
}
export default NotFoundPage