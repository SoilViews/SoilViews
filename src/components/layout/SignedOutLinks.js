import React from 'react';
import { NavLink } from 'react-router-dom'
 
const SignedOutLinks = () => {
    return (
        <React.Fragment>
            {/* <li><NavLink to='/signup'>SignUp</NavLink></li> */}
            <li><NavLink to='/signin'>Login</NavLink></li>
        </React.Fragment>
    )
}

export default SignedOutLinks