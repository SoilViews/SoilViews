import React from "react";
import { connect } from "react-redux";
import SignedInLinks from "../layout/SignedInLinks";
import SignedOutLinks from "../layout/SignedOutLinks";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText  } from "@material-ui/core/";
import VpnKeyIcon from '@material-ui/icons/VpnKey';


import styles from "./DrawerHead.module.css";

const DrawerHead = (props)  => {
  const profileState = props.auth.uid ? (
    <SignedInLinks profile={props.profile} />
  ) : (
    <div>
    <List>
      <Link to="/signin" onClick={props.handleDrawerClose}>
        <ListItem button>
          <ListItemIcon>
            <VpnKeyIcon className={styles.iconColor} />
          </ListItemIcon>
          <ListItemText primary="Login" />
        </ListItem>
      </Link>
    </List>
  </div>
  );
  return (
    <div>
      {profileState}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
  };
};

export default connect(mapStateToProps)(DrawerHead);
