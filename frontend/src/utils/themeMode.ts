export type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "todo-theme-mode";

export const getStoredThemeMode = (): ThemeMode => {
  if (typeof window === "undefined") return "light";

  return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark"
    ? "dark"
    : "light";
};

export const persistThemeMode = (mode: ThemeMode) => {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(THEME_STORAGE_KEY, mode);
};

export const applyThemeMode = (mode: ThemeMode) => {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("dark", mode === "dark");
};
