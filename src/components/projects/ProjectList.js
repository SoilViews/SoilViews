import React, { useState } from 'react'
import ProjectSummary from './ProjectSummary'
import { Link } from 'react-router-dom'

const ProjectLists = ({ projects, id }) => {

  const [showProjects, setProjects] = useState(false);

  const render = () => {
    if (showProjects) {
      return (
        <div className="row project-lists">
          {projects && projects.map(project => {
            if (project.authorId == id) {
              return (
                <Link to={'project/' + project.id} key={project.id} title="More Info">
                  <ProjectSummary project={project} />
                </Link>
              )
            }
          }
          )}
        </div>
      )
    }
    else {
      return (
        <div className="row project-lists">
          {projects && projects.map(project => {
            return (
              <Link to={'project/' + project.id} key={project.id} title="More Info">
                <ProjectSummary project={project} />
              </Link>
            )
          })}
        </div>
      )
    }
  }

  return (

    <React.Fragment>


      <button className='btn waves-effect waves-light' onClick={() => setProjects(!showProjects)}>See only yours projects</button>

      {render()}

    </React.Fragment>
  )
}

export default ProjectLists