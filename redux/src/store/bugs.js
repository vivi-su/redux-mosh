//Action types
const BUG_ADDED = "bugAdded";
const BUG_REMOVED = "bugRemoved";
const BUG_RESOLVED = "bugResolved";

//Action Creater
export const bugAdded = (description) => ({
  type: BUG_ADDED,
  payload: {
    description,
  },
});

export const bugResolved = (id) => ({
  type: BUG_RESOLVED,
  payload: {
    id,
  },
});

//Reducer (reducer has to be default export)
//[]  <---initial state
let lastId=0;

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
        case BUG_REMOVED:
             return state.filter(bug => bug.id !== action.payload.id);
        case BUG_RESOLVED:
             return state.map(bug => bug.id !== action.payload.id?bug:{...bug,resolved:true});
        default:
            return state;
    }

}