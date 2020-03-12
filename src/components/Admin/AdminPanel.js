import React from "react";
import { compose } from "redux";
import {getFirestore } from 'redux-firestore';


var UserData= [];
export class AdminPanel extends React.Component {
 
  onLoad  ()  {
    const firestore = getFirestore();
    var docRef = firestore.collection("users").doc("1M6e9zhW8PSn8mvStzTK8mU5e652");

    docRef.get().then(function(doc) {
        if (doc.exists) {
            // console.log("Get user  data:", doc.data());
            UserData.push(doc.data());
            console.log("Get user  data:", UserData);
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
  var userData = firestore.collection("users").get().then(data => {

    data.forEach(doc => {
      
      // console.log( "User",doc.data());
      UserData.push(doc.data());   
     
  
    });
    console.log("User:", UserData); 
  });
  }
  
  componentDidMount() {
    const firestore = getFirestore();
    firestore.collection("users").get().then(data => {
  
      data.forEach(doc => {
        
        // console.log( "User",doc.data());
        UserData.push(doc.data());   
       
    
      });
      UserData.map((user) => { return (console.log(user.city));});
      console.log("User:", UserData); 
    });
    
  
  
  }



  render() {

    return(
       <div>
          <button onClick={this.onLoad}>Get specific user data</button>
          <button onClick={this.onLoad1}>Get all user data</button>
          <table>
          <tbody>
            
              {UserData.map((user) => {
                            return  (<tr>
                                 <td>{user.city}</td>
                                 <td>{user.email}</td>
                                 <td>{user.firstName}</td>
                                 <td>{user.initials}</td>
                                 <td>{user.lastName}</td>
                              </tr>);}
              )}     
        </tbody>
      </table>
       </div>
  
    );
  }
  }
  export default compose()(AdminPanel);
  