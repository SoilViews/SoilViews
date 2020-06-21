import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/actions/authActions";
import { withTranslation } from 'react-i18next'; // for class component

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      city: "",
      telephone: "",
      email: "",
      password: "",
      imageurl: "",
      errors: [],
    };
  }

  errorClass = () => {
    return this.state.errors.length === 0 ? "" : "c-error c-validation";
  };

  onChangeInput = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  onSubmitForm = (e) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
      password,
      city,
      telephone,
    } = this.state;

    const errors = this.validate(
      firstName,
      lastName,
      email,
      password,
      city,
      telephone
    );

    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }

    this.props.signUp(this.state);
  };

  validate = (firstName, lastName, email, password, city, telephone) => {
    const errors = [];
    if (firstName.length === 0) {
      errors.push("First Name can't be empty");
    }
    if (city.length === 0) {
      errors.push("City can't be empty");
    }
    if (telephone.length === 0) {
      errors.push("Telephone number can't be empty");
    }

    if (telephone.length < 10) {
      errors.push("Telephone number should be at least 10 charcters long");
    }

    if (lastName.length === 0) {
      errors.push("Last Name can't be empty");
    }

    if (email.length < 5) {
      errors.push("Email should be at least 5 charcters long");
    }
    if (email.split("").filter((x) => x === "@").length !== 1) {
      errors.push("Email should contain a @");
    }
    if (email.indexOf(".") === -1) {
      errors.push("Email should contain at least one dot");
    }

    if (password.length < 6) {
      errors.push("Password should be at least 6 characters long");
    }

    return errors;
  };

  render() {
    const { auth, authError } = this.props;
    const { errors } = this.state;

    if (auth.uid) return <Redirect to="/Dashboard" />;

    const { t } = this.props;

    return (
      <React.Fragment>
        <div className="row">
          <div className="col s12 l4 offset-l4">
            <div className="card grey lighten-3">
              <div className="card-content">
                <h4 className="card-title center-align">{t('Register')}</h4>
                <form onSubmit={this.onSubmitForm} id="reg-form">
                  <div className="row">
                    <div className="input-field col s12">
                      <i className="material-icons prefix">email</i>
                      <input
                        type="text"
                        placeholder="First Name"
                        id="firstName"
                        className="validate"
                        onChange={this.onChangeInput}
                      />

                      <span style={{ color: "red" }}>
                        {this.state.errors["name"]}
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12">
                      <i className="material-icons prefix">email</i>
                      <input
                        type="text"
                        placeholder="Last Name"
                        id="lastName"
                        className="validate"
                        onChange={this.onChangeInput}
                      />

                      <span style={{ color: "red" }}>
                        {this.state.errors["name"]}
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12">
                      <i className="material-icons prefix">location_city</i>
                      <input
                        type="text"
                        placeholder="City"
                        id="city"
                        className="validate"
                        onChange={this.onChangeInput}
                      />

                      <span style={{ color: "red" }}>
                        {this.state.errors["city"]}
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12">
                      <i className="material-icons prefix">phone</i>
                      <input
                        type="text"
                        placeholder="telephone"
                        id="telephone"
                        className="validate"
                        onChange={this.onChangeInput}
                      />

                      <span style={{ color: "red" }}>
                        {this.state.errors["telephone"]}
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12">
                      <i className="material-icons prefix">email</i>
                      <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        className="validate"
                        onChange={this.onChangeInput}
                      />

                      <span style={{ color: "red" }}>
                        {this.state.errors["email"]}
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12">
                      <i className="material-icons prefix">vpn_key</i>
                      <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        className="validate"
                        onChange={this.onChangeInput}
                      />
                    </div>
                  </div>
                  <div className="row center-align">
                    <button
                      className="btn waves-effect waves-light"
                      type="submit"
                      name="action"
                    >
                      Register <i className="material-icons right">send</i>{" "}
                    </button>
                  </div>
                  <div className={`${this.errorClass()} error`}>
                    {errors.map((error) => (
                      <p key={error}>Error: {error}</p>
                    ))}
                  </div>
                  <div className="text-center">
                    <b>{authError ? <p>{authError}</p> : null}</b>
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

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError,
  };
};

const mapDispatchToProps = (dipsatch) => {
  return {
    signUp: (newUser) => dipsatch(signUp(newUser)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(SignUp));
