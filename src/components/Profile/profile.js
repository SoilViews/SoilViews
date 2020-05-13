import React from "react";
import { connect } from "react-redux";

export class Profile extends React.Component {
  render() {
    return (
      <div>
        <div className="card-action">
          <h1 className="header center orange-text">My Profile</h1>
          <img
            src={
              this.props.profile.imageurl ||
              "https://via.placeholder.com/400x300"
            }
            alt="Uploaded Images"
            height="300"
            width="400"
          />
          <p>
            {" "}
            <span>Username: </span>
            {this.props.profile.firstName}{" "}
          </p>
          <p>
            {" "}
            <span>Last Name: </span>
            {this.props.profile.lastName}{" "}
          </p>
          <p>
            {" "}
            <span>Email: </span>
            {this.props.profile.email}{" "}
          </p>
          <p>
            {" "}
            <span>City: </span>
            {this.props.profile.city}{" "}
          </p>
          <p>
            {" "}
            <span>Telephone number: </span>
            {this.props.profile.telephone}{" "}
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
  };
};

export default connect(mapStateToProps)(Profile);
