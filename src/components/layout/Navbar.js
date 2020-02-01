import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'

const Navbar = (props) => {
    const {auth, profile} = props;
    const links = auth.uid ? <SignedInLinks profile={profile}/> : <SignedOutLinks/>
    return (
        <React.Fragment>
            <nav>
                <div className='nav-wrapper'>
                    <div className='container'>
                        <Link to='/' className='brand-logo'>Logo</Link>
                        <ul id='nav-mobile' className='right hide-on-med-and-down'>
                            {links}
                        </ul>
                    </div>
                </div>
            </nav>
        </React.Fragment>
    )
}


const mapStateToProps = (state) => {
    return{
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}

export default connect(mapStateToProps)(Navbar)