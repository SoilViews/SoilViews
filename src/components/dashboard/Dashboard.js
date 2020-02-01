import React from 'react'
import Notifications from './Notifications'
import ProjectLists from '../projects/ProjectList'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'

export class Dashboard extends React.Component{
    
    render(){
        const {projects, notifications, auth} = this.props

        if(!auth.uid) return <Redirect to="/signIn"/>
         
        return(
            <div className='dashboard container'>
                <div className='row'>
                    <div className="col s12 m8">
                    <h2>Projects:</h2>
                    </div>
                    <div className='col s12 m8'>
                      <ProjectLists  id={this.props.uid} projects={projects}></ProjectLists>
                    </div>
                    <div className='col s12 m3 offset-m1'>
                        <Notifications notifications={notifications}></Notifications>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        uid: state.firebase.auth.uid,
        projects: state.firestore.ordered.projects ,
        notifications: state.firestore.ordered.notifications,
        auth: state.firebase.auth
    }
}

export default compose(
	connect(mapStateToProps),
	firestoreConnect([
		{ collection: "projects", orderBy: ['createdAt', 'desc'] },
		{ collection: "notifications", limit: 5, orderBy: ['time', 'desc'] },
	])
)(Dashboard);