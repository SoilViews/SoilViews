import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { deleteProject } from '../../store/actions/projectActions'
import { withRouter } from "react-router-dom";
import { Link } from 'react-router-dom'

class ProjectSummary extends React.Component {

    render() {
        const { project, deleteProject } = this.props


        return (
            <React.Fragment>
                <button className="btn waves-effect waves-light" type="submit" name="action" onClick={(e) => deleteProject(e, project.id)}>Delete<i className="large material-icons">delete_forever</i></button>
                <div className="card grey lighten-4">
                    <div className="card-content black-text">
                        <span className="card-title">{project.title}</span>
                        <p>{project.content}</p>
                    </div>
                    <div className="card-action">
                        <p> <span>Posted by: </span>{project.authorFirstName} {project.authorLastName}</p>
                        <p> <span>Posted at: </span>{moment(project.createdAt.toDate()).calendar()}</p>
                    </div>
                </div>
                <Link className="btn waves-effect waves-light"  to={'edit/' + project.id}  title="More Info">Edit</Link>
            </React.Fragment>
        )
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        deleteProject: (e, id) => { e.preventDefault(); dispatch(deleteProject(id)) }
    }
}

export default connect(null, mapDispatchToProps)(withRouter(ProjectSummary))