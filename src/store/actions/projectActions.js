export const createrProject = (project) =>{
    return(dispatch, getState, { getFirebase, getFirestore }) =>{
        // TODO: Set types and bindActionCreators
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;
        firestore.collection('projects').add({
          ...project,
          authorFirstName: profile.firstName,
          authorLastName: profile.lastName,
          authorId: authorId,
          createdAt: new Date()
        }).then(() =>{
          dispatch({type:'CREATE_PROJECT', project})
        }).catch((err)=>{
          dispatch({type:'CREATE_PROJECT_ERROR', err})
        })
      }
}

export const deleteProject = (project) =>{
  return(dispatch, getState, { getFirebase, getFirestore }) =>{
      // TODO: Set types and bindActionCreators
      const firestore = getFirestore();
      firestore.collection('projects').doc(project).delete().then(() =>{
        dispatch({type:'DELETE_PROJECT'})
      }).catch((err)=>{
        dispatch({type:'CREATE_PROJECT_ERROR', err})
      })
    }
}