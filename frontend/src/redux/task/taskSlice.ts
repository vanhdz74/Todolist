import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "@/types/task";

interface TaskState {
  tasks: Task[];
  loading: boolean;
  loaded: boolean;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  loaded: false,
};

// Slice chỉ tạo Action và Reducer.
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    getTasksRequest(state) {
      state.loading = true;
    },

    getTasksSuccess(state, action: PayloadAction<Task[]>) {
      state.loading = false;
      state.loaded = true;
      state.tasks = action.payload;
    },

    getTasksFailure(state) {
      state.loading = false;
    },
  },
});

export const { getTasksRequest, getTasksSuccess, getTasksFailure } =
  taskSlice.actions;

export default taskSlice.reducer;
