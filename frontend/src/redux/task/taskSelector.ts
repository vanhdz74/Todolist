import type { RootState } from "@/app/store";
import type { TodoListConfig } from "@/constants/todoLists";
import { CURRENT_USER_ID } from "@/constants/user";

export const selectTasks = (state: RootState) => state.task.tasks;
export const selectSelectedTask = (state: RootState) => state.task.selectedTask;
export const selectLoading = (state: RootState) => state.task.loading;
export const selectLoaded = (state: RootState) => state.task.loaded;
export const selectTaskError = (state: RootState) => state.task.error;

export const selectTasksByList = (
  state: RootState,
  list: TodoListConfig,
) => state.task.tasks.filter((task) => list.filter(task));

export const selectIncompleteSmartListCounts = (state: RootState) => {
  const tasks = state.task.tasks.filter((task) => !task.completed);

  const counts: Record<string, number> = {
    "my-day": tasks.filter((task) => task.myDay).length,
    important: tasks.filter((task) => task.priority === "HIGH").length,
    planned: tasks.filter((task) => Boolean(task.dueDate)).length,
    assigned: tasks.filter((task) => task.assignedTo === CURRENT_USER_ID)
      .length,
    tasks: tasks.length,
  };

  return counts;
};

export const selectIncompleteTaskCountByListId = (state: RootState) => {
  return state.task.tasks.reduce<Record<number, number>>((result, task) => {
    if (!task.listId || task.completed) return result;

    result[task.listId] = (result[task.listId] ?? 0) + 1;

    return result;
  }, {});
};
