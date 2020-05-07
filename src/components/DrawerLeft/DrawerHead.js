import React from "react";
import { connect } from "react-redux";
import SignedInLinks from "../layout/SignedInLinks";
import SignedOutLinks from "../layout/SignedOutLinks";

const DrawerHead = (profile, auth) => {
    const links = auth.uid ? (
        <SignedOutLinks />
        ) : (
            <SignedInLinks profile={profile} />
      );
    return ( 
        // <p>Profile Details | Logout</p>
        <div>
        {links}
        </div>
     );
}

const mapStateToProps = (state) => {
    return {
      auth: state.firebase.auth,
      profile: state.firebase.profile,
    };
  };
  export default connect(mapStateToProps)(DrawerHead);
  