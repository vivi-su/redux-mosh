import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import reducer from "./reducer";
import logger from './middleware/logger';
import toast from './middleware/toast';
import api from './middleware/api';

export default function(){
    return  configureStore({
        reducer,
        middleware:[
            ...getDefaultMiddleware(),
            logger({destination:"console"}),
            toast,
            api
        ],
    });
};

// Redux toolkit automatically bring middleware thunk,
// in order not to overwrite it with custom logger, 
// we need to import getDefaultMiddleware