import React from "react";
import { connect } from 'react-redux'




  const ResetPassword = (props) => {
   
    return (
      <div className="row">
                    <div className="title">
                        <h3 className="center-align grey-text">Change password-НЕ РАБОТИ!</h3>
                    </div>
                    <div className="col s12 l4 offset-l4">
                        <div className="card grey lighten-3">
      <div className="input-field col s12">
          <i className="material-icons prefix">vpn_key</i>
          <input type="password" placeholder="New Password" id="password" className="validate"  />
       
      </div>
      <div className="input-field col s12">
          <i className="material-icons prefix">vpn_key</i>
          <input type="password" placeholder="Confirm Password" id="password" className="validate"  />
       
      </div>
  </div>
  <div className="row center-align">
     <button className="btn waves-effect waves-light" type="submit" name="action">Reset <i className="material-icons right">send</i> </button>
    </div>
  </div>
  </div>
        
    )
}
const mapStateToProps = (state) => {
  return{
      auth: state.firebase.auth,
      profile: state.firebase.profile
  }
}


export default connect(mapStateToProps)(ResetPassword)