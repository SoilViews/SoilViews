import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";

const OrdersTable = () => {
  return (
        <div className="row">
          <p>Hi, I'm Table!</p>
      </div>
  );
};

const mapStateToProps = (state) => {
  return {
    uid: state.firebase.auth.uid,
    projects: state.firestore.ordered.projects,
    notifications: state.firestore.ordered.notifications,
    users: state.firestore.ordered.users,
    auth: state.firebase.auth,
    orders: state.firestore.ordered.orders,
    profile: state.firebase.profile,
    // orders: state.firestore.ordered.orders.filter(
    //   (orders) => userid === props.auth.uid
    // ),
  };
};

// export default compose(
//   connect(mapStateToProps),

//   firestoreConnect((props) => [
//     { collection: "orders", where: [["userId", "==", props.uid]] },
//     { collection: "notifications", limit: 5, orderBy: ["time", "desc"] },
//     { collection: "users" },
//   ])

//IF ADMIN SEEL ALL ORDERS, ELSE SEE ONLY YOURS
export default compose(
  connect(mapStateToProps),
  firestoreConnect((props) => {
    if (props.profile.role === "Admin")
      return [
        {
          collection: "orders",
        },
        {
          collection: "users",
        },
        {
          collection: "notifications",
          limit: 5,
          orderBy: ["time", "desc"],
        },
      ];
    return [
      {
        collection: "orders",
        where: ["userId", "==", props.uid],
      },
      {
        collection: "users",
      },
      {
        collection: "notifications",
        limit: 5,
        orderBy: ["time", "desc"],
      },
    ];
  })
)(OrdersTable);