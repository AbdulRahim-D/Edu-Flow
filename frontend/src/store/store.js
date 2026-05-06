import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import classReducer from "../features/classSlice"
import {authAPI} from "../services/authAPI"
import { classAPI } from "../services/classAPI";
export const store=configureStore({
    reducer:{
        auth:authReducer,
        class:classRedcer,
        [classAPI.reducerPath]:classAPI.reducer,
        [authAPI.reducerPath]:authAPI.reducer,
        
},
middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware().concat(authAPI.middleware,classAPI.middleware),

})