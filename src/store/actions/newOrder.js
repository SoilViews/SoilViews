//Save Orders Data to the firestore
export const saveOrderData = (orders) =>{
    return(dispatch, getState, { getFirebase, getFirestore }) =>{
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;
        firestore.collection('orders').add({
          authorFirstName: profile.firstName,
          authorLastName: profile.lastName,
          authorId: authorId,
          createdAt: new Date(),
          ...orders
        }).then(() =>{
          dispatch({type:'save_orders', orders})
        }).catch((err)=>{
          dispatch({type:'save_orders_ERROR', err})
        })
      }
  }