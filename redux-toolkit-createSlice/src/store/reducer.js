import { combineReducers } from "redux";
import entitiesReducer from "./entities";

export default combineReducers({
    entities:entitiesReducer
})

// reducer's job: get current state, return next state, 
// reducer is not for make API calls

// actionCreator is the one to deal with side effects