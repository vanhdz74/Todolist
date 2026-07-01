import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type {
  CreateTaskRequest,
  GetTasksRequest,
  Task,
  UpdateTaskRequest,
} from "@/types/task";

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

type UpdateTaskPayload = {
  id: number;
  data: UpdateTaskRequest;
};

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  loading: false,
  loaded: false,
  error: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    getTasksRequest(state, action: PayloadAction<GetTasksRequest | undefined>) {
      // void action; chỉ để tránh lỗi ESLint/TypeScript báo biến action không dùng.
      void action;
      state.loading = true;
      state.error = null;
    },

    getTasksSuccess(state, action: PayloadAction<Task[]>) {
      state.loading = false;
      state.loaded = true;
      state.tasks = action.payload;
    },

    getTasksFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error = action.payload ?? "Không thể tải danh sách task";
    },

    createTaskRequest(state, action: PayloadAction<CreateTaskRequest>) {
      void action;
      state.error = null;
    },

    createTaskSuccess(state, action: PayloadAction<Task>) {
      state.tasks.unshift(action.payload);
    },

    createTaskFailure(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload ?? "Không thể tạo task";
    },

    updateTaskRequest(state, action: PayloadAction<UpdateTaskPayload>) {
      state.error = null;

      const index = state.tasks.findIndex((task) => task.id === action.payload.id);

      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index],
          ...action.payload.data,
        };
      }

      if (state.selectedTask?.id === action.payload.id) {
        state.selectedTask = {
          ...state.selectedTask,
          ...action.payload.data,
        };
      }
    },

    updateTaskSuccess(state, action: PayloadAction<Task>) {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id,
      );

      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index],
          ...action.payload,
          steps: state.tasks[index].steps,
          categories: state.tasks[index].categories,
          attachments: state.tasks[index].attachments,
        };
      }

      if (state.selectedTask?.id === action.payload.id) {
        state.selectedTask = {
          ...state.selectedTask,
          ...action.payload,
          steps: state.selectedTask.steps,
          categories: state.selectedTask.categories,
          attachments: state.selectedTask.attachments,
        };
      }
    },

    updateTaskFailure(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload ?? "Không thể cập nhật task";
    },

    removeTaskRequest(state, action: PayloadAction<number>) {
      void action;
      state.error = null;
    },

    removeTaskSuccess(state, action: PayloadAction<number>) {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);

      if (state.selectedTask?.id === action.payload) {
        state.selectedTask = null;
      }
    },

    removeTaskFailure(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload ?? "Không thể xóa task";
    },

    selectTask(state, action: PayloadAction<Task | null>) {
      state.selectedTask = action.payload;
    },
  },
});

export const {
  getTasksRequest,
  getTasksSuccess,
  getTasksFailure,

  createTaskRequest,
  createTaskSuccess,
  createTaskFailure,

  updateTaskRequest,
  updateTaskSuccess,
  updateTaskFailure,

  removeTaskRequest,
  removeTaskSuccess,
  removeTaskFailure,

  selectTask,
} = taskSlice.actions;

export default taskSlice.reducer;
