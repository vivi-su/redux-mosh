import { createSlice } from "@reduxjs/toolkit";
import {createSelector} from 'reselect';
import {apiCallBegan} from './api';
import  moment from 'moment';
import api from "./middleware/api"; 
import axios from "axios";

// let lastId = 0;

const slice = createSlice({
  name: "bugs",
  initialState: {
    list:[], //array of bugs
    loading:false,
    lastFetch:null //to implement caching
  },
  reducers: {
    //actions =>action handlers
    bugsRequested: (bugs, action) =>{
      bugs.loading = true;
    },

    bugsReceived:(bugs,action) =>{
      bugs.list = action.payload;
      bugs.loading = false;
      bugs.lastFetch = Date.now(); // return current time stamp
    },

    // set loading to false when apiCallfailed
    bugsRequestFailed:(bugs, action) =>{
      bugs.loading = false;
    },

    bugsAssignedToUser: (bugs, action) =>{
      const {id:bugId, userId} = action.payload;
      const index = bugs.list.findIndex(bug =>bug.id === bugId);
      bugs.list[index].userId = userId;
    },

    //command - event
    //addBug - bugAdded

    bugAdded: (bugs, action) => {
      // bugs.list.push({
      //   id: ++lastId,
      //   description: action.payload.description,
      //   resolved: false,
      // });

      // // instead of push new obj to list, use action.payload
      bugs.list.push(action.payload);
    },

    // resolveBug(command) - bugResolved (event)

    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[index].resolved = true;
    },
  },
});


export const {
  bugAdded,
  bugResolved,
  bugsAssignedToUser,
  bugsRequested,
  bugsReceived,
  bugsRequestFailed,
} = slice.actions;
export default slice.reducer;
//delete export to have remote control priciple 


//Action Creators
const url = "/bugs"; 

export const resolveBug = id =>
  apiCallBegan({
    url: url + '/' +id,
    method: "patch",
    data: {resolved:true},
    onSuccess: bugResolved.type,
  });

export const assignBugToUser = (bugId, userId) =>
  apiCallBegan({
    url: url + '/'+ bugId,
    method: "patch",
    data: {userId},
    onSuccess: bugsAssignedToUser.type,
  });

// // make an api call
// // promise resolved => dispatch(success)
// // example 1:
// export const addBug = async bug =>{
//   try{
//   const response = await axios.post(url, bug);
//   dispatch(bugAdded(bug))
//   }catch{
//   dispatch({type:"error"});
//   }
// }
// // However, if we rewrite addBug by calling api here, jest test will fail, but we didn't change the behavior. It should not fail -> do socail test

// //example 2
// export const addBug = bug => async dispatch =>{
//  const response = await axios.request({
//     baseURL:'http://localhost:9001/api',
//     url:'/bugs',
//     method:'post',
//     data:bug
//   });
//   dispatch(bugAdded(response.data));// bug=>response.data because server changes the response
// }

export const addBug = bug => apiCallBegan({
  url,
  method:"post",
  data:bug,
  onSuccess:bugAdded.type
})

// ()=>fn(dispatch, getState)
export const loadBugs = () => (dispatch, getState) =>{
  const {lastFetch} = getState().entities.bugs;

  const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
  if(diffInMinutes<10) return;

return   dispatch(apiCallBegan({
      url,
      onStart: bugsRequested.type,
      onSuccess: bugsReceived.type,
      onError: bugsRequestFailed.type,
    }));
}

// // ()=>{} loadBugs is a function return object, it can not return function
// export const loadBugs = () =>
//   apiCallBegan({
//     url,
//     onStart: bugsRequested.type,
//     onSuccess: bugsReceived.type,
//     onError: bugsRequestFailed.type
//   })

//Selector function

// export const getUnresolvedBugs = state =>
//   state.entities.bugs.filter(bug =>!bug.resolved);

  // return new array-->it will be expensive, if there is no need to reRender it.-->use memolization
  // bugs =>get unresolves bugs from cache

  // What is createSelector? get bunch of states, and return unresolvedBugs, state => unresolvedBugs
  // export const getUnresolvedBugs = state => ...

export const getUnresolvedBugs = createSelector(
  state =>state.entities.bugs,
  state =>state.entities.projects,
 (bugs, projects) => bugs.list.filter(bug => !bug.resolved) 
);

// const selector = getBugsByUser(1);
// selector(state) => return the compute state

export const getBugsbyUser = userId => createSelector(
  state => state.entities.bugs,
  bugs =>bugs.list.filter(bug => bug.userId === userId)
)