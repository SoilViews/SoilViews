import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose } from 'redux'
import reducers from './store/reducers'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { reduxFirestore, getFirestore } from 'redux-firestore'
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase'
import firebase from './firebase'
import ReduxPromise from 'redux-promise';
// import {I18nextProvider} from 'react-i18next';
// import i18next from 'i18next';

import './i18n'; //languages
// import { I18nextProvider } from 'react-i18next'

// const Loader = () => <div>Loading...</div>
const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);
const store = createStoreWithMiddleware(
	reducers,
	compose(
		applyMiddleware(
			thunk.withExtraArgument({
				getFirebase,
				getFirestore
			})
		),
		reduxFirestore(firebase),
		reactReduxFirebase(firebase, { useFirestoreForProfile: true, userProfile: 'users', attachAuthIsReady: true })
	)
);

store.firebaseAuthIsReady.then(() => {
	ReactDOM.render(
		// <I18nextProvider i18n={i18next}>			</I18nextProvider>
			<Provider store={store}>
				<App />
			</Provider>,document.getElementById('root'));

	serviceWorker.unregister();
})

