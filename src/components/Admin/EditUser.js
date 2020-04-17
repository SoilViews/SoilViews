import React, { Component } from 'react';
import firebase from '../../firebase';
import { Link } from 'react-router-dom';



class EditUser extends Component {

   date = new Date().getDate();
    constructor(props) {
        super(props);
        this.state = {
            key: '',
            city: '',
           
        };

    }

    onSubmit = (e) => {
        e.preventDefault();
        const { city } = this.state;
    
        const updateRef = firebase.firestore().collection('users').doc(this.props.match.params.id);
        console.log(updateRef)
        updateRef.update({
            city,
        }).then((docRef) => {
            this.setState({
                key: '',
                city: '',
            });
            this.props.history.push(`/dashboard`)
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }


    componentDidMount() {
        const ref = firebase.firestore().collection('users').doc(this.props.match.params.id);
 
        ref.get().then((doc) => {
            if (doc.exists) {
                const users = doc.data();
                this.setState({
                    key: doc.id,
                    title: users.city

                });

            } else {
                console.log("No such document!");
            }

        });

    }


    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState({ users: state });
    }

    render() {
        console.log("City", this.state.city)
        return (
            <div class="container">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">
                            EDIT USER
                        </h3>
                    </div>
                    <div class="panel-body">
                        <h4><Link to={`/AdminPanel`} class="btn btn-primary">Back to admin panel</Link></h4>
                    <form onSubmit={this.onSubmit}>
                        <div class="form-group">
                            <label for="title">City:</label>
                            <input type="text" class="form-control" name="city" value={this.state.city} onChange={this.onChange} placeholder="Title" />
                        </div>
                        <button type="submit" class="btn btn-success">Submit</button>
                    </form>
                </div>
            </div>
      </div >
    );

    }

}


export default EditUser;
