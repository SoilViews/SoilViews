import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import OrdersTable from "./OrdersTable";

export class MyOrders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    const { orders } = this.props;
    return (
      <div className="container">
        <div className="row">
          <h1 className="header center orange-text">My Orders</h1>
        </div>
        <div>
          <OrdersTable orders={orders} />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    uid: state.firebase.auth.uid,
    projects: state.firestore.ordered.projects,
    notifications: state.firestore.ordered.notifications,
    users: state.firestore.ordered.users,
    auth: state.firebase.auth,
    orders: state.firestore.ordered.orders,
    profile: state.firebase.profile,
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect((props) => {
    if (props.profile.role === "Admin")
      return [
        {
          collection: "orders",
        },
      ];
    return [
      {
        collection: "orders",
        where: ["userId", "==", props.uid],
      },
    ];
  })
)(MyOrders);
