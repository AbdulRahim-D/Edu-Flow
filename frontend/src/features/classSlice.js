import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
  currentClass: null,
    class:[],
    totalClasses:0,
};
const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {
    setClasses:(state,action)=>{
        state.class=action.payload
    },
    updateTotalClass:(state,action)=>{
        state.totalClasses=action.payload
    },
    updateCurrentClass: (state, action) => {
      state.currentClass = action.payload;
    },
    clearClassStatus:(state)=>{
        state.class=[],
        currentClass=null
    }
  },
});

export const { updateCurrentClass,updateTotalClass, setClasses,clearClassStatus } = classSlice.actions;
export default classSlice.reducer;
