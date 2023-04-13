import configureStore from "./store/configureStore";
import {addBug} from "./store/bugs";
import { loadBugs, resolveBug, assignBugToUser, getUnresolvedBugs} from "./store/bugs";

// import {bugAdded, bugResolved, bugsAssignedToUser, getUnresolvedBugs, getBugsbyUser} from './store/bugs';
// import { projectAdded } from "./store/projects";
// import { userAdded } from "./store/users";


const store = configureStore();

// store.dispatch(addBug({discription:"a"}));
// store.dispatch(loadBugs());

// setTimeout(()=>store.dispatch(resolveBug(1)), 2000); // after 2s, resolved bug 1

// setTimeout(()=>store.dispatch(assignBugToUser(1,4),2000));



// store.dispatch((dispatch, getState)=>{
//     // Call an API
//     // When the promise is resolved => dispatch()
//   dispatch({type:'bugs/bugsReceived', bugs:[1, 2, 3]});
//     // If the promise is rejected => dispatch()
// });

// store.dispatch({
//   type:"error",
//   payload:{message:"An error occured"}
// })

// store.subscribe(()=>{
//     console.log('store changed!');
// });

store.dispatch(userAdded({ name: "user 1" }));
store.dispatch(userAdded({ name: "user 2" }));
// store.dispatch(projectAdded({name:"Project 1"}));
store.dispatch(bugAdded({description:"Bug 1"}));
store.dispatch(bugAdded({description:"Bug 2"}));
store.dispatch(bugAdded({description:"Bug 3"}));
store.dispatch(bugsAssignedToUser({bugId:1, userId:1}));
// store.dispatch(bugResolved({id:1}));

console.log(bugs);

const bugs = getBugsbyUser(1)(store.getState());
// we pass userId 1 to getBugsbyUser, this function will get current state, and it will return bugs that are assigned to this user.