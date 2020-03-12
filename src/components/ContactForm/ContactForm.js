import React from "react";
import { connect } from 'react-redux'
import { sendMessage } from '../../store/actions/authActions'
class ContactForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            email:'',
            message:'',
            errors: []
        }

    }

    validate = (name, email, message) => {
        const errors = [];
        if (name.length === 0) {
            errors.push("First Name can't be empty");
        }
        if (email.length < 5) {
            errors.push("Email should be at least 5 charcters long");
        }
        if (email.split("").filter(x => x === "@").length !== 1) {
            errors.push("Email should contain a @");
        }
        if (email.indexOf(".") === -1) {
            errors.push("Email should contain at least one dot");
        }
        if (message.length === 0) {
            errors.push("Message can't be empty");
        }

        return errors;
    }

    errorClass = () => {
        return (this.state.errors.length === 0 ? '' : 'c-error c-validation');
    }
    
    onSubmitForm = (e) => {
        e.preventDefault();

        const { name,email,message } = this.state;

        const errors = this.validate(name,email,message);
        // const { firstName, email,message } = this.state;

        if (errors.length > 0) {
            this.setState({ errors });
            return;
        }

        this.props.sendMessage(this.state);
        this.props.history.push('/')
        window.alert("Thank you for your message, we'll get in touch soon.");
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
                                <form onSubmit={this.onSubmitForm}>

                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input type="text" placeholder='name' id="name" onChange={this.onChangeInput} />
                                            
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input type="text" placeholder='email' id="email" onChange={this.onChangeInput} />
                                            
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <textarea id="message" placeholder='message' onChange={this.onChangeInput}></textarea>
                                           
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