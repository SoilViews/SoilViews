import React from "react";
import { connect } from 'react-redux'
import { sendMessage } from '../../store/actions/authActions'
class ContactForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            firstName: '',
            email:'',
            message:'',
            errors: []
        }

    }
    errorClass = () => {
        return (this.state.errors.length === 0 ? '' : 'c-error c-validation');
    }
    onSubmitForm = (e) => {
        e.preventDefault();

        const { firstName, email,message } = this.state;

        // const errors = this.validate(firstName, email);
        // if (errors.length > 0) {
        //     this.setState({ errors });
        //     return;
        // }

        this.props.sendMessage(this.state);
        this.props.history.push('/')
        window.alert("We will connect you as soon as possible");
    }
    onChangeInput = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
  
  render() {
    
    const { errors } = this.state;
   return(
    <React.Fragment>
                <div className="title">
                    <h3 className="center-align grey-text">Contact Form</h3>
                </div>
                <div className="row">
                    <div className="col s12 l10 offset-l1">
                        <div className="card grey lighten-3">
                            <div className="card-content">
                                <h4 className="card-title center-align">Contact us</h4>
                                <form onSubmit={this.onSubmitForm}>

                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input type="text" placeholder='' id="firstName" onChange={this.onChangeInput} />
                                            <label htmlFor="firstName">firstName</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <textarea id="email" className="materialize-textarea" onChange={this.onChangeInput}></textarea>
                                            <label htmlFor="email">email</label>
                                        </div>
                                    </div>
                                    <div className={`${this.errorClass()} error`}>
                                        {errors.map(error => (
                                            <p key={error}>Error: {error}</p>
                                        ))}
                                    </div>
                                    <div className="row center-align">
                                        <button className="btn waves-effect waves-light" type="submit" name="action">submit <i className="material-icons right">send</i> </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>

   );
  }
  
    
  }
  
  const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.firebase.auth
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        sendMessage: (message) => dispatch(sendMessage(message))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactForm)