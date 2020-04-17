import React from 'react'
import UsersSummary from './UsersSummary'
    
const UsersList = (props) => {
    const { users} = props;
    return (
        <div className="row project-lists">
        {users && users.map(user => {
        
            return (
                <UsersSummary user={user} />
            )
          
        }
        )}
      </div>
    )
}

export default UsersList