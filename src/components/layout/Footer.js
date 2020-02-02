import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const Footer = (props) => {




    return (
        <React.Fragment>
            <footer className="page-footer">
                <div className="container">
                    <div className="row">
                       
                       
                    </div>
                </div>
                <div className="footer-copyright">
                    <div className="container">
                        © 2020 Copyright by Team HAG
                        <Link className="grey-text text-lighten-4 right" to={'dashboard'} title="dashboard">DashBoard</Link>
                    </div>
                </div>
            </footer>
        </React.Fragment >
    )
}


const mapStateToProps = (state) => {
    console.log(state)
    return {
        projects: state.firestore.ordered.projects,
        profile: state.firebase.profile,
        auth: state.firebase.auth
    }
}

export default connect(
    (mapStateToProps)
)(Footer)
