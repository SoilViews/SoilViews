import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
// import OrdersTable from "./OrdersTable";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

export class MyOrders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    const { orders } = this.props;

    const StyledTableCell = withStyles((theme) => ({
      head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
      },
      body: {
        fontSize: 14,
      },
    }))(TableCell);

    const StyledTableRow = withStyles((theme) => ({
      root: {
        "&:nth-of-type(odd)": {
          backgroundColor: theme.palette.background.default,
        },
      },
    }))(TableRow);
    return (
      <div className="container">
        <div className="row">
          <h1 className="header center orange-text">My Orders</h1>
          <hr />
        </div>
        <div className="col s12 m3 offset-m1">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Client name</StyledTableCell>
                <StyledTableCell>Date ordered</StyledTableCell>
                <StyledTableCell>List of cultures selected</StyledTableCell>
                <StyledTableCell>Area of parcel</StyledTableCell>
                {/* <StyledTableCell>Cordinates of parcel</StyledTableCell> */}
                <StyledTableCell>Order Status</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders &&
                orders.map((order) => {
                  return (
                    <StyledTableRow key={Math.random()}>
                      <StyledTableCell>{order.authorFirstName}</StyledTableCell>
                      <StyledTableCell>
                        {order.createdAt.toDate().toDateString()}
                      </StyledTableCell>
                      <StyledTableCell>{order.order}</StyledTableCell>
                      <StyledTableCell>{order.area}</StyledTableCell>
                      <StyledTableCell>{order.status.value}</StyledTableCell>
                      <StyledTableCell>
                        <Link
                          className="btn waves-effect waves-light"
                          to={"editOrder/" + order.id}
                          title="More Info"
                        >
                          Edit
                        </Link>
                        <br />
                        <hr />
                        <br />
                        <button
                          className="btn waves-effect waves-light"
                          type="submit"
                          name="action"
                        >
                          Delete
                          <i className="large material-icons">delete_forever</i>
                        </button>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          </Table>
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
