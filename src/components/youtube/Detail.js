import React from 'react'

const Detail = ({ video }) => {
  if (!video) {
    return (
      <div className="container center">
        <div className="spinner">
          <div className="rect1">Se</div>
          <div className="rect2">le</div>
          <div className="rect3">ct</div>
        </div>
        <div className="spinner">
            <div className="rect4">Vid</div>
            <div className="rect5">eo</div>
        </div>
      </div>
    )
  }

  let videoId = video.id.videoId;
  console.log(videoId)
  let url = 'https://www.youtube.com/embed/' + videoId;

  return (
    <div className="embed-responsive embed-responsive-4by3">
      <iframe className="embed-responsive-item" src={url}></iframe>
      <h2>{video.snippet.title}</h2>
      <p>{video.snippet.description}</p>
    </div>
  );
}

export default Detail;
