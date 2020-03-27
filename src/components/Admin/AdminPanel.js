import React from "react";
import { compose } from "redux";
import {getFirestore } from 'redux-firestore';


var UserData1= [];
export class AdminPanel extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      UserData: []
    }

}

  onLoad  ()  {
    const firestore = getFirestore();
    var docRef = firestore.collection("users").doc("1M6e9zhW8PSn8mvStzTK8mU5e652");

    docRef.get().then(function(doc) {
        if (doc.exists) {
            // console.log("Get user  data:", doc.data());
            UserData1.push(doc.data());
            console.log("Get user  data:", UserData1);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such user data!");
        }
    }).catch(function(error) {
        console.log("Error getting user data:", error);
    });

}

  
  componentWillMount() {
    const { UserData } = this.state;
    const firestore = getFirestore();
    firestore.collection("users").get().then(data => {
  
      data.forEach(doc => {

        // console.log( "User",doc.data());
        UserData.push(doc.data());   
       
    
      });
      // UserData.map((user) => { return (console.log(user.city));});
      console.log("User:", UserData); 
    });
    
  
  
  }



  render() {
    const { UserData } = this.state;  
    
    return(
       <div>
          <button onClick={this.onLoad}>Get specific user data</button>
          <table>
          <th>city</th>
          <th>email</th>
          <th>firstName</th>
          <th>initials</th>
          <th>Order Status</th>
          <th>Actions</th>
          {UserData.map((user) => {
               
               return (
                 
                 <tr key={Math.random()}>
                    <td>{user.city}</td>
                    <td>{user.email}</td>
                    <td>{user.firstName}</td>
                    <td>{user.initials}</td>
                    <td>{user.lastName}</td>
                    <td>
                       <button>Edit</button>
                       <button>Delete</button>
                    </td>
                    
                 </tr>);}
 )}     
          <tbody>
            
             
        </tbody>
      </table>
       </div>
  
    );
  }
  }
  export default compose()(AdminPanel)
  