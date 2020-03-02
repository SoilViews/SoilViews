
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCaIrtat0fd8si1o80cA9W2RIL6bn77YpI',
  authDomain: 'robust-solution-221513.firebaseapp.com',
  databaseURL: 'https://robust-solution-221513.firebaseio.com',
  projectId: 'robust-solution-221513',
  storageBucket: 'gs://robust-solution-221513.appspot.com',
  messagingSenderId: '8658609726',
  appId: '1:8658609726:web:70e9e4e7190b615aa3136f',
  measurementId: 'G-KZCRXQYB7Y'
};


  firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings({});


 firebase.database();
  
  export default firebase