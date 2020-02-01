import React from 'react'
import Item from './Item'

const List = (props) => {
  return (
    <ul className="media-list">
      {props.videos.map((video) => {
        return <Item onVideoSelect={props.onVideoSelect} video={video} key={video.etag}  />
      })}
    </ul>
  )
}


export default List
