/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";

const SignedInLinks = (props, profile) => {

  const isAdmin = (props.profile.role === "Admin");

    return (
      <div>
        <li>
          <NavLink to="/MyOrders">MyOrders</NavLink>
        </li>
        {isAdmin ? (
          <li>
            <NavLink to="/AdminPanel">AdminPanel</NavLink>
          </li>
        )
      : (<li></li>)}
        <li>
          <a onClick={props.signOut}>Log Out</a>
        </li>
        <li>
          <NavLink to="/Profile" className="btn btn-floating grey">
            {props.profile.initials}
          </NavLink>
        </li>
      </div>
    );

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
