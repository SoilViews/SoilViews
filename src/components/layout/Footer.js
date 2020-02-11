import React from 'react';
import { connect } from 'react-redux'

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
