import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalTasks: 0,
  tasks: [],
  currentTask: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTotalTasks: (state, action) => {
      state.totalTasks = action.payload;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    clearTasksData: (state) => {
      state.totalTasks = 0;
      state.tasks = [];
      state.currentTask = null;
    },
  },
});

export const { setCurrentTask, setTotalTasks, setTasks, clearTasksData } =
  taskSlice.actions;
export default taskSlice.reducer;
