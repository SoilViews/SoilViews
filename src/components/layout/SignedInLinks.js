/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";
import { Grid } from "@material-ui/core/";
import { useTranslation } from 'react-i18next';

const SignedInLinks = (props) => {

  const isAdmin = (props.profile.role === "Admin");
  const { t } = useTranslation();
  return (
    <div>
      <Grid container>
        {isAdmin ? (
          <Grid item >
            <NavLink to="/AdminPanel">{t('AdminPanel')}</NavLink>
          </Grid>
        )
          : (<li></li>)}
        <Grid item>
          <NavLink to="/MyOrders">{t('MyOrders')}</NavLink>
        </Grid>
        <Grid item >
          <a onClick={props.signOut}>{t('Log Out')}</a>
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