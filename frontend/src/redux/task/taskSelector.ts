import type { RootState } from "@/app/store";

// Các select
export const selectTasks = (state: RootState) => state.task.tasks;
export const selectLoading = (state: RootState) => state.task.loading;
export const selectLoaded = (state: RootState) => state.task.loaded;
