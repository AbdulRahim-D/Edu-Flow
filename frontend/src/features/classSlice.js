import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentClass: null,
    classes:[],
    totalClasses:0,
};
const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {
    setClasses:(state,action)=>{
        state.classes=action.payload
    },
    updateTotalClass:(state,action)=>{
        state.totalClasses=action.payload
    },
    updateCurrentClass: (state, action) => {
      state.currentClass = action.payload;
    },
    clearClassStatus:(state)=>{
        state.classes=[],
        state.currentClass=null,
        state.totalClasses=0
    }
  },
});

export const { updateCurrentClass,updateTotalClass, setClasses,clearClassStatus } = classSlice.actions;
export default classSlice.reducer;
