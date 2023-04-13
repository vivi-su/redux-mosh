This app is using Redux toolkit, so in configureStore.js we don't need createStore, instead we pass configuration obj and set reducer to rudeucer.

in bugs.js, because we have Redux toolkit. we can import createAction from Redux toolkit. By using this function, we can get type and pay load.

*createAction example:
  export const bugAdded = createAction("bugAdded");

*Instead manually set it up

  const BUG_ADDED = "bugAdded";

  export const bugAdded = (description) => ({
    type: BUG_ADDED,
    payload: {
      description,
    },
  });


*createReducer example

  export default createReducer([],{
    
    //key:value
    //actions:functions(event=>event handler)

    [bugAdded.type]:(bugs, action) =>{
      bugs.push({
        id: ++lastId,
        description: action.payload.description,
        rsolved: false,
      });
    }

  }

*Instead use switch and case, and also remember default.

  export default function reducer(state = [], action){
      switch(action.type){
          case BUG_ADDED:
          return[
              ...state,
              {
                  id:++lastId,
                  description:action.payload.description,
                  rsolved:false
              }
          ];
          
          default:
              return state;
      }
  }
