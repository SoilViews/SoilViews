import React from 'react'
import UsersSummary from './UsersSummary'
import { Link } from 'react-router-dom'
const UsersList = (props) => {
    const { users,id  } = props;
    return (
        <div className="row project-lists">
        {users && users.map(user => {
        
            return (
            // <Link to={'edit/' + user.id} key={user.id} title="More Info">
                <UsersSummary user={user} />
            // </Link>
            )
          
        }
        )}
      </div>
    )
}

export default UsersList