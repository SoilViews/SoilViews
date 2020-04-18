import React, { Component } from "react";
import firebase from "../../firebase";
import { Link } from "react-router-dom";

class EditUser extends Component {
  date = new Date().getDate();
  constructor(props) {
    super(props);
    this.state = {
      key: "",
      city: "",
      email: "",
      firstName: "",
      lastName: "",
      telephone: "",
    };
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { city, email, firstName, lastName, telephone } = this.state;

    const updateRef = firebase
      .firestore()
      .collection("users")
      .doc(this.props.match.params.id);
    console.log(updateRef);
    updateRef
      .update({
        city,
        email,
        firstName,
        lastName,
        telephone,
      })
      .then((docRef) => {
        this.setState({
          key: "",
          city: "",
          email: "",
          firstName: "",
          lastName: "",
          telephone: "",
        });
        this.props.history.push(`/AdminPanel`);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  componentDidMount() {
    const ref = firebase
      .firestore()
      .collection("users")
      .doc(this.props.match.params.id);

    ref.get().then((doc) => {
      if (doc.exists) {
        const users = doc.data();
        this.setState({
          key: doc.id,
          city: users.city,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          telephone: users.telephone,
          initials: users.initials,
        });
      } else {
        console.log("No such document!");
      }
    });
  }

  onChange = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState({ users: state });
  };

  render() {
    console.log("City", this.state.city);
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h1 class="header center orange-text">Edit User</h1>
          </div>
          <div class="panel-body">
            <h4>
              <Link to={`/AdminPanel`} className="btn btn-default search">
                Back to admin panel
              </Link>
            </h4>
            <form onSubmit={this.onSubmit}>
              <div class="form-group">
                <label for="title">City:</label> <br />
                <input
                  type="text"
                  class="form-control"
                  name="city"
                  value={this.state.city}
                  onChange={this.onChange}
                  placeholder="Title"
                />
              </div>
              <div class="form-group">
                <label for="title">Email:</label> <br />
                <input
                  type="text"
                  class="form-control"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  placeholder="Title"
                />
              </div>
              <div class="form-group">
                <label for="title">First name:</label> <br />
                <input
                  type="text"
                  class="form-control"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.onChange}
                  placeholder="Title"
                />
              </div>
              <div class="form-group">
                <label for="title">Last name:</label> <br />
                <input
                  type="text"
                  class="form-control"
                  name="lastName"
                  value={this.state.lastName}
                  onChange={this.onChange}
                  placeholder="Title"
                />
              </div>
              <div class="form-group">
                <label for="title">Telephone:</label> <br />
                <input
                  type="text"
                  class="form-control"
                  name="telephone"
                  value={this.state.telephone}
                  onChange={this.onChange}
                  placeholder="Title"
                />
              </div>
              <div class="form-group">
                <label for="title">Initials:</label> <br />
                <p>{this.state.initials}</p>
              </div>
              <button type="submit" class="btn btn-success">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default EditUser;
