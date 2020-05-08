import React, { Component } from "react";
import firebase from "../../firebase";
import { Link } from "react-router-dom";
import Select from "react-select";
const options = [
  { value: "Submitted", label: "Submitted" },
  { value: "In progress", label: "In progress" },
  { value: "Completed", label: "Completed" },
];
class EditOrder extends Component {
  date = new Date().getDate();
  constructor(props) {
    super(props);
    this.state = {
      key: "",
      order: "",
      status: "",
      selectedOption: null,
    };
  }

  handleChange = (status) => {
    this.setState({ status }, () =>
      console.log(`Option selected:`, this.state.status.value)
    );
    // alert('you selected' , this.state);
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { order, status } = this.state;

    const updateRef = firebase
      .firestore()
      .collection("orders")
      .doc(this.props.match.params.id);
    console.log(updateRef);
    updateRef
      .update({
        order,
        status,
      })
      .then((docRef) => {
        this.setState({
          key: "",
          order,
          status: this.state.status.value,
        });
        this.props.history.push(`/MyOrders`);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  componentDidMount() {
    const ref = firebase
      .firestore()
      .collection("orders")
      .doc(this.props.match.params.id);

    ref.get().then((doc) => {
      if (doc.exists) {
        const orders = doc.data();
        console.log("ORDER", orders.order);
        this.setState({
          key: doc.id,
          order: orders.order,
          status: orders.status,
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
    console.log("aaaaaaaaaaa", this.state.order);
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h1 class="header center orange-text">Edit Order</h1>
          </div>
          <div className="overlay"></div>
          <div class="panel-body">
            <h4>
              <Link to={`/MyOrders`} className="btn btn-default search">
                Back to MyOrder
              </Link>
            </h4>
            <form onSubmit={this.onSubmit}>
              <div class="form-group">
                <label for="title">Order:</label> <br />
                <input
                  type="text"
                  class="form-control"
                  name="order"
                  value={this.state.order}
                  onChange={this.onChange}
                  placeholder="Title"
                />
              </div>
              <div class="form-group">
                <label for="title">Status:</label> <br />
                <Select
                  value={this.state.status}
                  onChange={this.handleChange}
                  options={options}
                />
                <br />
                <br />
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

export default EditOrder;
