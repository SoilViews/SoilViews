import authReducer from './authReducer'
import projectReducer from './projectReducer'
import { videos } from './youtubeReducer'

import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'


const reducers = combineReducers({
    auth: authReducer,
    project: projectReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer,
    videos
})

export default reducers