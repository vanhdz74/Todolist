import {
  DEFAULT_LIST_COLOR,
  listThemes,
} from "@/constants/listThemes";
import type { ListThemeKey } from "@/constants/listThemes";

const TASKS_PAGE_THEME_STORAGE_KEY = "todo.tasksPageThemeColor";

export const getStoredTasksPageThemeColor = () => {
  if (typeof window === "undefined") return DEFAULT_LIST_COLOR;

  return localStorage.getItem(TASKS_PAGE_THEME_STORAGE_KEY) ?? DEFAULT_LIST_COLOR;
};

export const setStoredTasksPageThemeColor = (theme: ListThemeKey) => {
  const color = listThemes[theme].color;

  localStorage.setItem(TASKS_PAGE_THEME_STORAGE_KEY, color);

  return color;
};
