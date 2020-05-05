//Save Orders Data to the firestore
export const saveOrderData = (selectedBoxes) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;
    firestore
      .collection("orders")
      .add({
        authorFirstName: profile.firstName,
        authorLastName: profile.lastName,
        userId: authorId,
        createdAt: new Date(),
        order: selectedBoxes,
      })
      .then(() => {
        dispatch({ type: "save_orders", selectedBoxes });
      })
      .catch((err) => {
        dispatch({ type: "save_orders_ERROR", err });
      });
  };
};
