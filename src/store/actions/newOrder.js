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
        status: [{ value: "Submitted", label: "Submitted" }],
      })
      .then(() => {
        dispatch({ type: "save_orders", selectedBoxes });
      })
      .catch((err) => {
        dispatch({ type: "save_orders_ERROR", err });
      });
  };
};

export const deleteOrder = (selectedBoxes) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // TODO: Set types and bindActionCreators
    const firestore = getFirestore();
    firestore
      .collection("orders")
      .doc(selectedBoxes)
      .delete()
      .then(() => {
        dispatch({ type: "DELETE_ORDER" });
      })
      .catch((err) => {
        dispatch({ type: "DELETE_ORDER_ERROR", err });
      });
  };
};
