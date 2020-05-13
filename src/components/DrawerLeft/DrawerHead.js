import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core/";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EcoIcon from "@material-ui/icons/Eco";

import styles from "./DrawerHead.module.css";

const DrawerHead = (props) => {
  const profileState = props.auth.uid ? (
    <div>
      <List className={styles.loggedInItems}>
        <Link to="/Profile" onClick={props.handleDrawerClose}>
          <ListItem button>
            <ListItemIcon>
              <AccountCircleIcon className={styles.iconColor}/>
            </ListItemIcon>
            <ListItemText primary="My Profile" />
          </ListItem>
        </Link>
        <Link to="/MyOrders" onClick={props.handleDrawerClose}>
            <ListItem button>
              <ListItemIcon>
                <EcoIcon className={styles.iconColor} />
              </ListItemIcon>
              <ListItemText primary="My Orders" />
            </ListItem>
          </Link>
      </List>
    </div>
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