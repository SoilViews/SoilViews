const initState = {};

const orderReducer = (state = initState, action) => {
  switch (action.type) {
    case "save_orders":
      console.log("created order", action.selectedBoxes);
      return state;
    case "save_orders_ERROR":
      console.log("created project-error", action.err);
      return state;
    default:
      return state;
  }
};

export default orderReducer;
