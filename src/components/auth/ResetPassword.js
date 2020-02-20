import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sendPasswordResetEmail } from '../../store/actions/authActions'
import { Redirect } from 'react-router-dom'
import InputEmail from './InputEmail'

class ResetPassword extends Component {
  state = {
    email: '',
    errors: []
  }
  errorClass = () => {
    return (this.state.errors.length === 0 ? '' : 'c-error c-validation');
}
  validate = (email) => {
    const errors = [];
    if (email.length < 5) {
        errors.push("Email should be at least 5 charcters long");
    }
    if (email.split("").filter(x => x === "@").length !== 1) {
        errors.push("Email should contain a @");
    }
    if (email.indexOf(".") === -1) {
        errors.push("Email should contain at least one dot");
    }

    return errors;
}
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }
  
  handleSubmit = (e) => {
    const {email } = this.state;
    const errors = this.validate(email);
    if (errors.length > 0) {
        this.setState({ errors });
        return;
    }
    // e.preventDefault();
   
        this.props.sendPasswordResetEmail(this.state.email);
        window.alert("Email has been sent to you,Please check and verify.");
  
    
               
  }

  render() {
    const { auth, authError } = this.props;
    const { errors } = this.state;
    if (auth.uid) return <Redirect to='/profile' /> 
    return (
      <div className="container">
        <span>Please enter your email address below and we will send you information to recover your account</span>
        <form onSubmit={this.handleSubmit} className="white">   
            <h5 className="grey-text text-darken-3">Password Reset</h5>
               
            <InputEmail handleChange={this.handleChange.bind(this)}/>
            <span style={{ color: "red" }}>{this.state.errors["email"]}</span>
            <div className="input-field">
            <button className="btn waves-effect waves-light" type="submit" name="action">Submit <i className="material-icons right">send</i> </button>
                <div className="red-text center">
                  { authError ? <p>{authError}</p> : null }
                </div>
                <div className={`${this.errorClass()} error`}>
                                        {errors.map(error => (
                                            <p key={error}>Error: {error}</p>
                                        ))}
                                    </div>
            </div>
        </form>
      </div>
    )
  }
}
const mapStateToProps = (state) =>{
  return{
    authError: state.auth.authError,
    auth: state.firebase.auth
  }
}
const mapDispatchToProps = (dispatch) => {
  return{
    sendPasswordResetEmail: (emailAddress) => dispatch(sendPasswordResetEmail(emailAddress)),
  }
}
export default connect (mapStateToProps, mapDispatchToProps)(ResetPassword)