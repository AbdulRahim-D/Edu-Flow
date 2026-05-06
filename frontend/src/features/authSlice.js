import { createSlice } from "@reduxjs/toolkit";

const initialState={
    user:localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    isAuthenticated:localStorage.getItem("isAuthenticated")==="true"
}

 const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
       setCredentials:(state,action)=>{
        state.user=action.payload
        state.isAuthenticated=true

        localStorage.setItem("user",JSON.stringify(action.payload))
        localStorage.setItem("isAuthenticated","true")
       },
       
       logout:(state)=>{
        state.user=null
        state.isAuthenticated=false
        localStorage.removeItem("user")
        localStorage.removeItem("isAuthenticated")
       },
    }
})

export const{setCredentials,logout}=authSlice.actions;
export default authSlice.reducer;