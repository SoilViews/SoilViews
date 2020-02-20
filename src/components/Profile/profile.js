import React  from 'react'
import { connect } from 'react-redux'

const Profile = (props) => {
   
    return (
        
        <div className="card-action">
        <h4 className="card-title center-align">Profile</h4>
        <p> <span >Username: </span>{props.profile.firstName} </p>
        <p> <span >Last Name: </span>{props.profile.lastName} </p>
        <p> <span>Email: </span>{props.profile.email} </p>
        <p> <span>City: </span>{props.profile.city} </p>
        <p> <span>Telephone number: </span>{props.profile.telephone} </p>
  
    </div>
        
    )
}


const mapStateToProps = (state) => {
    return{
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}

export default connect(mapStateToProps)(Profile)