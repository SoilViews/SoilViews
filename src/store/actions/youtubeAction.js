import axios from 'axios';

const YOUTUBE_URL = 'https://www.googleapis.com/youtube/v3/search';
const API_KEY = "AIzaSyDXQ1H2iW0GC1wlN5X_U55Lhv2VX3QSjc4";

export function fetchTube(term) {
  const params = {
    part: 'snippet',
    key: API_KEY,
    q: term,
    type: 'video',
    maxResults: 3
  };

  const request = axios.get(YOUTUBE_URL, { params: params });

  return {
    type: "fetch",
    payload: request
  };
}


