

export const videos = (state = [], action) =>{
  if (action.type === "fetch") {
      console.log(action.payload)
    return action.payload.data.items;
  }
  return state;
}

