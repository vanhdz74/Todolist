import type { Task } from "@/types/task";

export const taskRepeatLabels: Record<Task["repeat"], string> = {
  NONE: "",
  DAILY: "Daily",
  WEEKDAYS: "Weekdays",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
};

export const taskCategoryColorMap: Record<string, string> = {
  blue: "#2564cf",
  green: "#107c10",
  purple: "#8764b8",
  volcano: "#d83b01",
};
