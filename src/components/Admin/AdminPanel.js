import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { Redirect } from "react-router-dom";
// import UsersList from "./UsersList";
// import OrdersList from "./OrdersList";
import Notifications from "./Notifications";
import { getFirestore } from "redux-firestore";
import { storageRef } from "../../firebase/index";
import { Button } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
const urls = [];
export class AdminPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      UserData: [],
    };
  }

  componentWillMount() {
    const { UserData } = this.state;
    const firestore = getFirestore();
    firestore
      .collection("users")
      .get()
      .then((data) => {
        data.forEach((doc) => {
          // console.log( "User",doc.data());
          UserData.push(doc.data());
        });
        // UserData.map((user) => { return (console.log(user.city));});
        console.log("User:", UserData);
      });
    storageRef
      .child("UploadedFiles/")
      .listAll()
      .then(function (res) {
        res.items.forEach(function (folderRef) {
          folderRef.getDownloadURL().then(function (url) {
            console.log("Got download URL", url);
            urls.push(url);
          });
          console.log("folderRef", folderRef.toString());
          var blob = null;
          var xhr = new XMLHttpRequest();
          xhr.open("GET", "downloadURL");
          xhr.responseType = "blob";
          xhr.onload = function () {
            blob = xhr.response; //xhr.response is now a blob object
            console.log("BLOB", blob);

            // var path = storageRef.child('UploadedFiles/').getDownloadURL(folderRef);
            // var zip = new JSZip();
            // zip.file(path,blob);
          };

          xhr.send();
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const { users, notifications, auth, orders } = this.props;

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

    if (!auth.uid) return <Redirect to="/signIn" />;

    return (
      <div className="dashboard container">
        <div className="row">
          <div className="col s12 m8">
            <h2>Notifications:</h2>
            <hr />
          </div>
          <div className="col s12 m8">
            <Notifications notifications={notifications}></Notifications>
          </div>
        </div>
        <div className="col s12 m3 offset-m1">
          <h2>File storage urls:</h2>
          <hr />
        </div>
        <div className="col s12 m3 offset-m1">
          <table>
            <tbody>
              {urls.map((user) => {
                return (
                  <tr key={Math.random()}>
                    <td>
                      <a href={user} target="_blank" rel="noopener noreferrer">
                        <Button>
                          <i className="fas fa-download" />
                          {user}
                        </Button>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="col s12 m3 offset-m1">
          <h2>Users:</h2>
          <hr />
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>City</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>FirstName</StyledTableCell>
                <StyledTableCell>Initials</StyledTableCell>
                <StyledTableCell>LastName</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users &&
                users.map((user) => {
                  return (
                    <StyledTableRow key={Math.random()}>
                      <StyledTableCell>{user.city}</StyledTableCell>
                      <StyledTableCell>{user.email}</StyledTableCell>
                      <StyledTableCell>{user.firstName}</StyledTableCell>
                      <StyledTableCell>{user.initials}</StyledTableCell>
                      <StyledTableCell>{user.lastName}</StyledTableCell>
                      <StyledTableCell>
                        <Link
                          className="btn waves-effect waves-light"
                          to={"edit/" + user.id}
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
        <div className="col s12 m3 offset-m1">
          <h2>Orders:</h2>
          <hr />
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Client name</StyledTableCell>
                <StyledTableCell>Date ordered</StyledTableCell>
                <StyledTableCell>List of cultures selected</StyledTableCell>
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
)(AdminPanel);
