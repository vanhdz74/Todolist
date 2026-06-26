import type { RootState } from "@/app/store";

export const selectTasks = (state: RootState) => state.task.tasks;

export const selectLoading = (state: RootState) => state.task.loading;
