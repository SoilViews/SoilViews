import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createrProject } from '../../store/actions/projectActions'
import { Redirect } from 'react-router-dom'

class CreateProject extends Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            content: '',
            errors: [],
        }
    }

    errorClass = () => {
        return(this.state.errors.length === 0 ? '' : 'c-error c-validation');
     }

     onSubmitForm = (e) => {
        e.preventDefault();

        const { title, content } = this.state;

        const errors = this.validate(title, content);
        if (errors.length > 0) {
            this.setState({ errors });
            return;
        }

        this.props.createrProject(this.state);
        this.props.history.push('/Dashboard')
    }

    validate = (title, content) => {
        const errors = [];
        if (title.length === 0) {
            errors.push("Title can't be empty");
        }

        if (content.length < 5) {
            errors.push("Content should be at least 15 charcters long");
        }

        return errors;
    }

    onChangeInput = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }


    render() {
        const { auth } = this.props
        const { errors } = this.state;

        if (!auth.uid) return <Redirect to="/signin" />

        return (
            <React.Fragment>
                <div className="title">
                    <h3 className="center-align grey-text">Welcome!</h3>
                </div>
                <div className="row">
                    <div className="col s12 l10 offset-l1">
                        <div className="card grey lighten-3">
                            <div className="card-content">
                                <h4 className="card-title center-align">Create Project</h4>
                                <form onSubmit={this.onSubmitForm}>

                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input type="text" placeholder='' id="title" onChange={this.onChangeInput} />
                                            <label htmlFor="title">Title</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <textarea id="content" className="materialize-textarea" onChange={this.onChangeInput}></textarea>
                                            <label htmlFor="content">Content</label>
                                        </div>
                                    </div>
                                    <div className={`${this.errorClass()} error`}>
                                        {errors.map(error => (
                                            <p key={error}>Error: {error}</p>
                                        ))}
                                    </div>
                                    <div className="row center-align">
                                        <button className="btn waves-effect waves-light" type="submit" name="action">Create <i className="material-icons right">send</i> </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.firebase.auth
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        createrProject: (project) => dispatch(createrProject(project))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProject)
