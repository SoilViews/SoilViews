import React from "react";
import { connect } from 'react-redux'
import { sendMessage } from '../../store/actions/authActions'
import { withTranslation } from 'react-i18next';
import { TextField, Grid } from "@material-ui/core";
class ContactForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            email: '',
            message: '',
            errors: []
        }

    }

    validate = (name, email, message) => {
        const errors = [];
        if (name.length === 0) {
            errors.push(this.props.t("FirstnameValid"));
        }
        if (email.length < 5) {
            errors.push(this.props.t("EmailValid"));
        }
        if (email.split("").filter(x => x === "@").length !== 1) {
            errors.push(this.props.t("EmailValid1"));
        }
        if (email.indexOf(".") === -1) {
            errors.push(this.props.t("EmailValid3"));
        }
        if (message.length === 0) {
            errors.push(this.props.t("SendMessageContactFormValid"));
        }

        return errors;
    }

    errorClass = () => {
        return (this.state.errors.length === 0 ? '' : 'c-error c-validation');
    }

    onSubmitForm = (e) => {
        e.preventDefault();

        const { name, email, message } = this.state;

        const errors = this.validate(name, email, message);
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
        const { t } = this.props;
        return (
            <React.Fragment>
                <div className="title">
                    <h3 className="center-align grey-text">{t('Contact Form')}</h3>
                </div>
                <div className="row">
                    <div className="col s12 l10 offset-l1">
                        <div className="card grey lighten-3">
                            <div className="card-content">
                                <form onSubmit={this.onSubmitForm}>

                                    <div className="row">
                                        <div className="input-field col s12">
                                            <Grid item xs={12}>
                                                <TextField
                                                    placeholder='Type your name here'
                                                    name='name'
                                                    label='Enter your name'
                                                    id="name"
                                                    type="text"
                                                    variant='outlined'
                                                    InputLabelProps={{
                                                        shrink: true
                                                    }}
                                                    onChange={this.onChangeInput}
                                                    required
                                                    inputProps={{
                                                        minLength: 3,
                                                        maxLength: 20
                                                    }}

                                                    fullWidth
                                                />
                                            </Grid>
                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <TextField
                                                placeholder='Type your email here'
                                                name='email'
                                                label='Enter your email'
                                                id="email"
                                                type="text"
                                                variant='outlined'
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                required
                                                inputProps={{
                                                    minLength: 3,
                                                    maxLength: 20
                                                }}
                                                error={!!errors["email"]}
                                                fullWidth
                                            />

                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <TextField
                                                placeholder='Type your message here'
                                                name='message'
                                                label='Enter your message'
                                                id="message"
                                                type="text"
                                                variant='outlined'
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                required
                                                inputProps={{
                                                    minLength: 3,
                                                    maxLength: 20
                                                }}
                                                error={!!errors["message"]}
                                                fullWidth
                                            />
                                        </div>
                                    </div>
                                    <div className={`${this.errorClass()} error`}>
                                        {errors.map(error => (
                                            <p key={error}>Error: {error}</p>
                                        ))}
                                    </div>
                                    <div className="row center-align">
                                        <button className="btn waves-effect waves-light" type="submit" name="action"><i className="material-icons right">send</i> </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ContactForm));