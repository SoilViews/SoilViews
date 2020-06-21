import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signIn } from '../../store/actions/authActions'
import { Redirect } from 'react-router-dom'
import { NavLink } from "react-router-dom";
import { withTranslation } from 'react-i18next'; // for class component

class SignIn extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: ''
        }

    }

    onChangeInput = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    onSubmitForm = (e) => {
        e.preventDefault();
        this.props.signIn(this.state)
    }

    render() {
        const { authError, auth } = this.props;
 
        if (auth.uid) return <Redirect to="/" />
        const { t } = this.props;
        return (
            <div>
                <div className="row">
                    <div className="col s12 l4 offset-l4">
                        <div className="card grey lighten-3">
                            <div className="card-content">
                                <h4 className="card-title center-align">SoilViews {t('Login')}</h4>
                                <form onSubmit={this.onSubmitForm}>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <i className="material-icons prefix">mail</i>
                                            <input type="email" placeholder='Email' id="email" className="validate" onChange={this.onChangeInput} />

                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <i className="material-icons prefix">vpn_key</i>
                                            <input type="password" placeholder="Password" id="password" className="validate" onChange={this.onChangeInput} />

                                        </div>
                                    </div>
                                    <div className="row center-align">
                                        <button className="btn waves-effect waves-light" type="submit" name="action">{t('Login')}<i className="material-icons right">send</i> </button>
                                        <div className="red-text center">
                                            {authError ? <p>{authError}</p> : null}
                                        </div>
                                    </div>
                                    <span><NavLink to='/signup'>{t('Register')}</NavLink></span>
                                    <span style={{ float: "right" }}><NavLink to='/ResetPassword'>{t('Forgot password?')}</NavLink></span>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        authError: state.auth.authError,
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signIn: (creds) => dispatch(signIn(creds))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (withTranslation()(SignIn));