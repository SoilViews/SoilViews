const initState = {
   
}

const projectReducer = (state = initState, action) => {
    switch (action.type){
        case 'CREATE_PROJECT' :
            console.log('created project', action.project)
            return state;
        case 'CREATE_PROJECT_ERROR' :
                console.log('created project-error', action.err)
                return state;
       case 'DELETE_PROJECT' :
                console.log('delete-error',)
                 return state;
        default:
            return state
    }
}

export default projectReducer