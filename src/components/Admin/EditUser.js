import React, { Component } from "react";
import firebase from "../../firebase";
import { Link } from "react-router-dom";
import { storage } from "../../firebase/index";

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
      imageurl: "",
      imageName: "",
      errors: [],
    };
  }

  onSubmit = (e) => {
    e.preventDefault();
    const {
      city,
      email,
      firstName,
      lastName,
      telephone,
      imageurl,
    } = this.state;
    const errors = this.validate(firstName, lastName, email, city, telephone);

    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }
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
        imageurl,
      })
      .then((docRef) => {
        this.setState({
          key: "",
          city: "",
          email: "",
          firstName: "",
          lastName: "",
          telephone: "",
          imageurl: "",
        });
        this.props.history.push(`/AdminPanel`);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  handleChange = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      if (e.target.files.type < 1) {
        console.log("asdasd");
      } else {
        console.log("YYYYYYYYYYYY");
      }
      this.setState(() => ({ image, imageName: image.name }));
    }
  };
  errorClass = () => {
    return this.state.errors.length === 0 ? "" : "c-error c-validation";
  };

  validate = (firstName, lastName, email, city, telephone, image) => {
    const errors = [];
    if (firstName.length === 0) {
      errors.push("First Name can't be empty");
    }
    if (city.length === 0) {
      errors.push("City can't be empty");
    }
    if (telephone.length === 0) {
      errors.push("Telephone number can't be empty");
    }

    if (telephone.length < 10) {
      errors.push("Telephone number should be at least 10 charcters long");
    }

    if (lastName.length === 0) {
      errors.push("Last Name can't be empty");
    }

    if (email.length < 5) {
      errors.push("Email should be at least 5 charcters long");
    }
    if (email.split("").filter((x) => x === "@").length !== 1) {
      errors.push("Email should contain a @");
    }
    if (email.indexOf(".") === -1) {
      errors.push("Email should contain at least one dot");
    }
    // if (image == null) {
    //   errors.push("Please upload a file");
    // }

    return errors;
  };
  handleUpload = () => {
    const { image } = this.state;
    if (image == null) {
      console.log("There is no image for upload");
    } else {
      console.log("Upload");
      const filename = this.state.firstName + "_" + image.name;

      const uploadTask = storage.ref(`UploadedFiles/${filename}`).put(image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progress function ...
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState({ progress });
        },
        (error) => {
          // Error function ...
          console.log(error);
        },
        () => {
          // complete function ...
          storage
            .ref("UploadedFiles")
            .child(filename)
            .getDownloadURL()
            .then((imageurl) => {
              this.setState({
                key: "",
                imageurl: imageurl,
              });
              console.log(imageurl);
            });
        }
      );
    }
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
          imageurl: users.imageurl,
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
    const { errors } = this.state;
    return (
      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h1 className="header center orange-text">Edit User</h1>
          </div>
          <div className="panel-body">
            <h4>
              <Link to={`/AdminPanel`} className="btn btn-default search">
                Back to admin panel
              </Link>
            </h4>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="title">City:</label> <br />
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={this.state.city}
                  onChange={this.onChange}
                  placeholder="Title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="title">Email:</label> <br />
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  placeholder="Title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="title">First name:</label> <br />
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.onChange}
                  placeholder="Title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="title">Last name:</label> <br />
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={this.state.lastName}
                  onChange={this.onChange}
                  placeholder="Title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="title">Telephone:</label> <br />
                <input
                  type="text"
                  className="form-control"
                  name="telephone"
                  value={this.state.telephone}
                  onChange={this.onChange}
                  placeholder="Title"
                />
                <span style={{ color: "red" }}>
                  {this.state.errors["telephone"]}
                </span>
              </div>
              <div className="form-group">
                <label htmlFor="title">Initials:</label> <br />
                <p>{this.state.initials}</p>
              </div>
              <div className="form-group">
                <label htmlFor="title">ImageUrl:</label> <br />
                <p>{this.state.imageurl}</p>
              </div>
              <button type="submit" className="btn btn-success">
                Submit
              </button>
            </form>
          </div>
          <div className="center">
            <br />
            <h2 className="green-text">Soilview File Uploader</h2>
            <br />
            <br />
            <div className="file-field input-field">
              <div className="btn">
                <span>File</span>
                <input type="file" onChange={this.handleChange} />
              </div>
              <div className="file-path-wrapper">
                <input
                  className="file-path validate"
                  onChange={() => {}}
                  type="text"
                  value={this.state.imageName}
                />
              </div>
            </div>
            <button
              type="submit"
              onClick={this.handleUpload}
              className="waves-effect waves-light btn"
            >
              {" "}
              Upload{" "}
            </button>
            <br />
            <br />
            <img
              src={this.state.imageurl || "https://via.placeholder.com/400x300"}
              alt="Uploaded Images"
              height="300"
              width="400"
            />
          </div>
        </div>
        <div className={`${this.errorClass()} error`}>
          {errors.map((error) => (
            <p key={error}>Error: {error}</p>
          ))}
        </div>
      </div>
    );
  }
}

export default EditUser;
