import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { Redirect } from "react-router-dom";
import UsersList from "./UsersList";
import OrdersList from "./OrdersList";
import Notifications from "./Notifications";
import { getFirestore } from "redux-firestore";
import { storageRef } from "../../firebase/index";
import { Button } from "@material-ui/core";
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
          <UsersList id={this.props.uid} users={users}></UsersList>
        </div>
        <div className="col s12 m3 offset-m1">
          <h2>Orders:</h2>
          <hr />
          <OrdersList orders={orders}></OrdersList>
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
    // orders: state.firestore.ordered.orders.filter(
    //   (orders) => userid === props.auth.uid
    // ),
  };
};

export default compose(
  connect(mapStateToProps),

  firestoreConnect((props) => [
    { collection: "orders", where: [["userId", "==", props.uid]] },
    { collection: "notifications", limit: 5, orderBy: ["time", "desc"] },
    { collection: "users" },
  ])
)(AdminPanel);
