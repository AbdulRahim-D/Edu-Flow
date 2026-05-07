import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import classReducer from "../features/classSlice";
import {authAPI} from "../services/authAPI";
import taskReducer from "../features/taskSlice";
import { taskAPI } from "../services/taskAPI";
import { classAPI } from "../services/classAPI";
export const store=configureStore({
    reducer:{
        auth:authReducer,
        class:classReducer,
        task:taskReducer,
        [taskAPI.reducerPath]:taskAPI.reducer,
        [classAPI.reducerPath]:classAPI.reducer,
        [authAPI.reducerPath]:authAPI.reducer,
        
},
middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware().concat(authAPI.middleware,taskAPI.middleware,classAPI.middleware),

})