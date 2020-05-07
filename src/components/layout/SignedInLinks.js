/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";

const SignedInLinks = (props, profile) => {
  if (props.profile.role === "Admin") {
    console.log("User role", profile.role);
    return (
      <React.Fragment>
        <li>
          <NavLink to="/MyOrders">MyOrders</NavLink>
        </li>
        <li>
          <NavLink to="/AdminPanel">AdminPanel</NavLink>
        </li>
        <li>
          <a onClick={props.signOut}>Log Out</a>
        </li>
        <li>
          <NavLink to="/Profile" className="btn btn-floating grey pulse">
            {props.profile.initials}
          </NavLink>
        </li>
        <i className="large material-icons">account_circle</i>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <li>
          <NavLink to="/MyOrders">MyOrders</NavLink>
        </li>
        <li>
          <a onClick={props.signOut}>Log Out</a>
        </li>
        <li>
          <NavLink to="/Profile" className="btn btn-floating grey pulse">
            {props.profile.initials}
          </NavLink>
        </li>
        <i className="large material-icons">account_circle</i>
      </React.Fragment>
    );
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut()),
  };
};
const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SignedInLinks);
