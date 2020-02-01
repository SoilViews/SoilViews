import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'

const Footer = (props) => {



    const { projects, profile, auth } = props;

    return (
        <React.Fragment>
            <footer className="page-footer">
                <div className="container">
                    <div className="row">
                        <div className="col l6 s12">
                            <h5 className="white-text">Hello <strong>{profile.firstName || 'Stranger'}</strong><br></br> with email: <strong>{profile.email || 'you did not have yet'}</strong> and initials <strong>{profile.initials || 'unknown'}</strong></h5>
                            <p className="grey-text text-lighten-4"></p>
                        </div>
                        <div className="col l4 offset-l2 s12">
                            {
                                auth.uid ?
                                    <ul>
                                        <h5 className="white-text">Current Projects:</h5>
                                        {projects && projects.map(project => {
                                            return (
                                                <li key={project.id}>
                                                    <a className="grey-text text-lighten-3" href="#!">

                                                        <span>Created by: <strong>{project.authorFirstName} </strong>at </span>
                                                        <span>Created date: <strong>{moment(project.createdAt.toDate()).calendar()}</strong></span>

                                                    </a>
                                                </li>
                                            )
                                        })}

                                    </ul>
                                    :
                                    <h5><strong>Register to see all available projects</strong></h5>
                            }
                        </div>
                    </div>
                </div>
                <div className="footer-copyright">
                    <div className="container">
                        © 2019 Copyright by DM
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
