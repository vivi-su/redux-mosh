import axios from "axios";
import * as actions from "../api";

const api = ({dispatch}) => next => async action =>{
    if(action.type !== actions.apiCallBegan.type) return next(action);
    // because apiCallBegan is a function, we need to specify type property

    // when gets to this line, it means we are calling API
    const {url, method, data, onStart, onSuccess, onError} = action.payload;
    
    if(onStart) dispatch({type:onStart});
    next(action); //so it doesn't swollow origin action

    try{
        const response = await axios.request({
        baseURL:"http://localhost:9001/api",
        url,
        method,
        data
    });
        //General
        dispatch(actions.apiCallSuccess(response.data));
        //Specific
        if(onSuccess)
        dispatch({type:onSuccess, payload:response.data});

    }catch(error){
        // General
        // add .message to make error function steralizable  
        dispatch(actions.apiCallFailed(error.message));
        // Specific
        if(onError) dispatch({type:onError, payload:error.message});
    }
}

export default api;