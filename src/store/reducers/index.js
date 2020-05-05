import authReducer from "./authReducer";
import projectReducer from "./projectReducer";
import orderReducer from "./orderReducer";

import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";

const reducers = combineReducers({
  auth: authReducer,
  order: orderReducer,
  project: projectReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer,
});

export default reducers;
