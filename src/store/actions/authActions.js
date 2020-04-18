import { Role } from "./Role";

export const signIn = (credentials) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    firebase
      .auth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        dispatch({ type: "LOGIN_SUCCESS" });
      })
      .catch((err) => {
        dispatch({ type: "LOGIN_ERROR", err });
      });
  };
};

export const signOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: "SIGNOUT_SUCCESS" });
      });
  };
};

export const sendPasswordResetEmail = (emailAddress) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();

    firebase
      .auth()
      .sendPasswordResetEmail(emailAddress)
      .then(() => {
        dispatch({ type: "PASSWORD_RESET_SUCCESS" });
      })
      .catch((err) => {
        dispatch({ type: "PASSWORD_RESET_ERROR", err });
      });
  };
};

export const sendEmailVerification = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    firebase
      .auth()
      .newUser.sendEmailVerification()
      .then(() => {
        dispatch({ type: "sendEmailVerification" });
      });
  };
};
export const sendMessage = (message) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // TODO: Set types and bindActionCreators
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;
    firestore
      .collection("messages")
      .add({
        ...message,
        authorFirstName: profile.firstName,
        authorLastName: profile.lastName,
        authorId: authorId,
        createdAt: new Date(),
      })
      .then(() => {
        dispatch({ type: "send_message", message });
      })
      .catch((err) => {
        dispatch({ type: "send_message_ERROR", err });
      });
  };
};

//Save the map coordinated to the filestore
export const saveData = (cordinates) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;
    firestore
      .collection("cordinates")
      .add({
        authorFirstName: profile.firstName,
        authorLastName: profile.lastName,
        authorId: authorId,
        createdAt: new Date(),
        ...cordinates,
      })
      .then(() => {
        dispatch({ type: "save_cordinates", cordinates });
      })
      .catch((err) => {
        dispatch({ type: "save_cordinates_ERROR", err });
      });
  };
};

//Save New Users to the firestore
export const signUp = (newUser) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    // firebase.auth().newUser.sendEmailVerification();
    firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then((resp) => {
        return firestore
          .collection("users")
          .doc(resp.user.uid)
          .set({
            userId: resp.user.uid,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            initials: newUser.firstName[0] + newUser.lastName[0],
            email: newUser.email,
            telephone: newUser.telephone,
            city: newUser.city,
            role: Role.User,
            imageurl: newUser.imageurl,
            createdDate: new Date(),
          });
      })
      .then(() => {
        dispatch({ type: "SIGNUP_SUCCESS" });
      })
      .catch((err) => {
        dispatch({ type: "SIGNUP_ERROR", err });
      });
  };
};

//Moved to newOrder.js

// //Save Orders Data to the firestore
// export const saveOrderData = (orders) =>{
//   return(dispatch, getState, { getFirebase, getFirestore }) =>{
//       const firestore = getFirestore();
//       const profile = getState().firebase.profile;
//       const authorId = getState().firebase.auth.uid;
//       firestore.collection('orders').add({
//         authorFirstName: profile.firstName,
//         authorLastName: profile.lastName,
//         authorId: authorId,
//         createdAt: new Date(),
//         ...orders
//       }).then(() =>{
//         dispatch({type:'save_orders', orders})
//       }).catch((err)=>{
//         dispatch({type:'save_orders_ERROR', err})
//       })
//     }
// }
