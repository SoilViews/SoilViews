import React from 'react'
import moment from 'moment'
const Notifications = (props) => {
    const { notifications } = props;
    return (
        <div className="notifications-list">
            <div className="card-content">
                <h2 className="card-title">Notifications</h2>
                <ul>
                    {notifications && notifications.map(item => {
                        return (
                            <li key={item.id}>
                                <span className="item-user">{item.user} - </span>
                                <span className="item-content">{item.content}</span>
                                <span className="item-date">{moment(item.time.toDate()).fromNow()}</span>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Notifications