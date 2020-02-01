import React from 'react';
import { NavLink } from 'react-router-dom'
 
const SignedOutLinks = () => {
    return (
        <React.Fragment>
            <li><NavLink to='/signup'>SignUp</NavLink></li>
            <li><NavLink to='/signin'>LogIn</NavLink></li>
        </React.Fragment>
    )
}

export default SignedOutLinks