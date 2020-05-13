import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core/";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EcoIcon from "@material-ui/icons/Eco";
import AddBox from "@material-ui/icons/AddBox";

import styles from "./DrawerHead.module.css";

const DrawerHead = (props) => {
  const handleDrawerClose = props.handleDrawerClose;
  const profileState = props.auth.uid ? (
    <div>
      <List className={styles.loggedInItems}>
        <Link to="/Profile" onClick={handleDrawerClose}>
          <ListItem button>
            <ListItemIcon>
              <AccountCircleIcon className={styles.iconColor}/>
            </ListItemIcon>
            <ListItemText primary="My Profile" />
          </ListItem>
        </Link>
        <Link to="/MyOrders" onClick={handleDrawerClose}>
            <ListItem button>
              <ListItemIcon>
                <EcoIcon className={styles.iconColor} />
              </ListItemIcon>
              <ListItemText primary="My Orders" />
            </ListItem>
          </Link>
          <Link to="/Dashboard" onClick={handleDrawerClose}>
            <ListItem button>
              <ListItemIcon>
                <AddBox className={styles.iconColor} />
              </ListItemIcon>
              <ListItemText primary="New Order" />
            </ListItem>
          </Link>
      </List>
    </div>
  ) : (
      <div>
        <List>
          <Link to="/signin" onClick={handleDrawerClose}>
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