import { createAction, createReducer } from "@reduxjs/toolkit";

//Action Creater
export const bugAdded = createAction("bugAdded");
export const bugRemoved = createAction("bugRemoved");
export const bugResolved = createAction("bugResolved");

//Reducer (reducer has to be default export)
//[]  <---initial state
let lastId=0;

export default createReducer([],{
  //key:value
  //actions:functions(event=>event handler)
  [bugAdded.type]:(bugs, action) =>{
    bugs.push({
      id: ++lastId,
      description: action.payload.description,
      rsolved: false,
    });
  },

  [bugResolved.type]:(bugs, action)=>{
    const index=bugs.findIndex(bug =>bug.id ===action.payload.id);
    bugs[index].resolved = true;
  }

})

// produce(initialState, draftState=>{
//   draftState.x=1;
// })
