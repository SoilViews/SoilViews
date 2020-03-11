import React from "react";
import { compose } from "redux";
import { getState, getFirestore,getFirebase } from 'redux-firestore';



export class AdminPanel extends React.Component {
 
  onLoad  ()  {
    const firestore = getFirestore();
    var docRef = firestore.collection("users").doc("1M6e9zhW8PSn8mvStzTK8mU5e652");

    docRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

}

  onLoad1() {
   
  const firestore = getFirestore();
  var docRef = firestore.collection("users");
  docRef.get().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        console.log("asdasdsa",docRef)
      })
    })
  


}


render() {
  return (
    
     <div>
        <button onClick={this.onLoad}>Load Data</button>
        <button onClick={this.onLoad1}>Load Data1</button>
     </div>

  );
}
}
export default compose()(AdminPanel);
