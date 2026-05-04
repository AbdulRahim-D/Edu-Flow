import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import {authAPI} from "../services/authAPI"
export const store=configureStore({
    reducer:{
        auth:authReducer,
        [authAPI.reducerPath]:authAPI.reducer,
        
},
middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware().concat(authAPI.middleware),

})