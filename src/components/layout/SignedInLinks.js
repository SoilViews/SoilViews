/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux' 
import { signOut } from '../../store/actions/authActions'

const SignedInLinks = (props) => {
    return (
        <React.Fragment>
            {/* <li><NavLink to='/createproject'>New Project</NavLink></li> */}
            <li><a onClick={props.signOut}>Log Out</a></li>
            <li><NavLink to='/Profile' className='btn btn-floating grey pulse'>{props.profile.initials}</NavLink></li>
            <i className="large material-icons">account_circle</i>
        </React.Fragment>
    )
}


const mapDispatchToProps = (dispatch) => {
    return{
        signOut: ()=> dispatch(signOut())
    }
}
export default connect(null,mapDispatchToProps)(SignedInLinks)