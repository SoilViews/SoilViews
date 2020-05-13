/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";
import { Grid } from "@material-ui/core/";

const SignedInLinks = (props) => {

  const isAdmin = (props.profile.role === "Admin");

  return (
    <div>
      <Grid container>
          {isAdmin ? (
            <Grid item >
              <NavLink to="/AdminPanel">AdminPanel</NavLink>
            </Grid>
          )
            : (<li></li>)}
          <Grid item>
            <NavLink to="/MyOrders">MyOrders</NavLink>
          </Grid>
          <Grid item >
            <a onClick={props.signOut}>Log Out</a>
          </Grid>
        <Grid item >
            <NavLink to="/Profile" className="btn btn-floating grey">
              {props.profile.initials}
            </NavLink>
        </Grid>
      </Grid>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut()),
  };
};
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SignedInLinks);