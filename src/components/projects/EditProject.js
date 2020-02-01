import React, { Component } from 'react';
import firebase from '../../firebase';
import { Link } from 'react-router-dom';
import  moment from 'moment'


class EditProject extends Component {

   date = new Date().getDate();
    constructor(props) {
        super(props);
        this.state = {
            key: '',
            title: '',
            content: '',
            authorFirstName: '',
            authorLastName: '',
            createdAt: moment().toDate(),
        };

    }

    onSubmit = (e) => {
        e.preventDefault();
        const { title, content } = this.state;
    
        const updateRef = firebase.firestore().collection('projects').doc(this.props.match.params.id);
        console.log(updateRef)
        updateRef.update({
            title,
            content,
            createdAt: new Date()
        }).then((docRef) => {
            this.setState({
                key: '',
                title: '',
                content: '',
            });
            this.props.history.push(`/dashboard`)
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }


    componentDidMount() {
        const ref = firebase.firestore().collection('projects').doc(this.props.match.params.id);
 
        ref.get().then((doc) => {
            if (doc.exists) {
                const projects = doc.data();
                this.setState({
                    key: doc.id,
                    title: projects.title,
                    content: projects.content,
                    authorFirstName: projects.authorFirstName,
                    authorLastName: projects.authorLastName,
                    createdAt: moment(projects.createdAt.toDate()).calendar()

                });

            } else {
                console.log("No such document!");
            }

        });

    }


    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState({ projects: state });
    }

    render() {
        console.log(this.props)
        return (
            <div class="container">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">
                            EDIT BOARD
                        </h3>
                    </div>
                    <div class="panel-body">
                        <h4><Link to={`/dashboard`} class="btn btn-primary">Board List</Link></h4>
                    <form onSubmit={this.onSubmit}>
                        <div class="form-group">
                            <label for="title">Title:</label>
                            <input type="text" class="form-control" name="title" value={this.state.title} onChange={this.onChange} placeholder="Title" />
                        </div>
                        <div class="form-group">
                            <label for="content">Content:</label>
                            <input type="text" class="form-control" name="content" value={this.state.content} onChange={this.onChange} placeholder="Content" />
                        </div>
                        <div class="form-group">
                            <label for="content">authorFirstName:</label>
                            <input type="text" class="form-control" name="authorFirstName" value={this.state.authorFirstName} onChange={this.onChange} placeholder="authorFirstName" />
                        </div>
                        <div class="form-group">
                            <label for="content">authorLastName:</label>
                            <input type="text" class="form-control" name="authorLastName" value={this.state.authorLastName} onChange={this.onChange} placeholder="authorLastName" />
                        </div>
                        <div class="form-group">
                            <label for="content">createdAt:</label>
                            <input type="text" class="form-control" name="createdAt" value={this.state.createdAt} onChange={this.onChange} placeholder="createdAt" />
                        </div>
                        <button type="submit" class="btn btn-success">Submit</button>
                    </form>
                </div>
            </div>
      </div >
    );

    }

}


export default EditProject;
