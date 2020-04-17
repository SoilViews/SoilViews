import React from "react";
import { compose } from "redux";
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { Redirect } from 'react-router-dom'
import UsersList from './UsersList'
import Notifications from './Notifications'
export class AdminPanel extends React.Component{
    
  render(){
      const {users, notifications, auth} = this.props

      if(!auth.uid) return <Redirect to="/signIn"/>
       
      return(
          <div className='dashboard container'>
              <div className='row'>
                    <div className="col s12 m8">
                    <h2>Notifications:</h2>
                    </div>
                    <div className='col s12 m8'>
                    <Notifications notifications={notifications}></Notifications>
                    </div>
                
              </div>
                <div className='col s12 m3 offset-m1'>
                  <h2>Users:</h2>
                  <UsersList users={users}></UsersList>
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
      users: state.firestore.ordered.users,
      auth: state.firebase.auth
  }
}

export default compose(
connect(mapStateToProps),
firestoreConnect([
  { collection: "users"},
  { collection: "notifications", limit: 5, orderBy: ['time', 'desc'] },
])
)(AdminPanel);
