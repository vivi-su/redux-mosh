This app is useing Redux toolkit. Instead using createStore and createReducer to set up action and payloads, here we use createSlice.

* createSlice example:
    const slice = createSlice({
        name: "bugs",
        initialState: {
            list:[],
            loading:false,
            lastFetch:null
        },
        reducers: {
            bugAdded: (bugs, action) => {
                bugs.list.push(action.payload);
            }
    })

    export const {bugAdded,} = slice.actions;
    export default slice.reducer;

* to have more than one slice, we use combineReducers.

in reducer.js
-------------------------
export default combineReducers({
    entities:entitiesReducer
})
--------------------------


in entities.js 
--------------------------
export default combineReducer({
    bugs:bugsReducer,
    projects:projectsReducer,
    users:userReducer
});
--------------------------

* Assigning a bug: 
    - assign a bug to a team member
    - get the list of bugs assigned to a team member

    Steps:
    1. create a slice for users. {id, name}
    2. create an action for adding a user.
    3. create an action for assigning a bug to a user.
    4. create a selector for getting bugs by a user.

* Loading Indicators:

    steps:
        1. action:bugsRequested
        2. reducer:loading =true
        3. middleware: dispatch new atcion

* Saving Data to the Server
(instead dispatch API call, use api middleware -> actionCreator)
    1. Make an API call
    2. Promise resolved => dispatch(successs)
    3. Promise rejected => dispatch(error)

    * Save the data when 
    - Assigning a bug to a user
    - Resolving a bug

* Run Test
    npm test or npx jest

- Test Coverage
    npx jest --coverage

* Test Exercise
    - getting unresolved bugs
    - resolving a bug
    - loading bugs:
        - if they exist in the cache
        * they should come from the cache
        - if they don't exist in the cache
        * they should be fetched from the server
            - loading indicator
                * should be true while fetching
                * should be false after bugs are fetched
                * should be false if the server fails
    - assigning a bug to a user

* Use Redux to store all State instead of local state to get full advantage (ex. testing) since we are using it for big application. 

Exception: form state
    - Temporary values
    - Too many dispatches
    - Harder debugging

=========================
Structuring a Redux store
=========================
For
fast look up - use object
order date - use array

use both:
{
    byId:{
        1:{...},
        2:{...},
        3:{...}
    },
    allIds:[3, 1, 2]
}

-----------------------------
Instead of just having slices
{
    bugs:[],
    projects:[],
    tags:[]
}

we put these slices under parent entities

{
    entities:{
        bugs:[],
        projects:[],
        tags:[]
    },
    auth:{userId:1, name:"John},
    ui:{
        bugs:{query:"...", sortBy:"..."}
    }   
}

same token for auth, ui