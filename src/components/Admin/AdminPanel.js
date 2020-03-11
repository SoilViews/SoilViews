import React from "react";
import { compose } from "redux";
import { getState, getFirestore,getFirebase } from 'redux-firestore';



export class AdminPanel extends React.Component {
 
  onLoad  ()  {
    const firestore = getFirestore();
    var docRef = firestore.collection("users").doc("1M6e9zhW8PSn8mvStzTK8mU5e652");

    docRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Get user  data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such user data!");
        }
    }).catch(function(error) {
        console.log("Error getting user data:", error);
    });

}

  onLoad1() {
   
  const firestore = getFirestore();
  var userData = firestore.collection("users").get().then(snapshot => {

    snapshot.forEach(doc => {
  
      console.log( "User",doc.data() );    
     
  
    });
    console.log("UserData",userData)
  
  });
  


}


render() {
  return (
    
     <div>
        <button onClick={this.onLoad}>Get specific user data</button>
        <button onClick={this.onLoad1}>Get all user data</button>
     </div>

  );
}
}
export default compose()(AdminPanel);
