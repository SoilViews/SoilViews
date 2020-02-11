import React, { Component } from 'react'
import { compose } from "redux";
import { connect } from 'react-redux' 
import { signIn } from '../../store/actions/authActions'
import { Redirect } from 'react-router-dom' 
export class indexPage extends React.Component {

    render() {
        return (
            <h4 className="card-title center-align">Login</h4>
        )
        
    }

}
export default compose()(indexPage);