import type { Task } from "@/types/task";
import { isSameDay, parseDate, startOfDay } from "@/utils/date";

import { taskCategoryColorMap, taskRepeatLabels } from "./taskItemConstants";

export const cx = (...classes: Array<string | false | null | undefined>) => {
  return classes.filter(Boolean).join(" ");
};

export const formatTaskDate = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, tomorrow)) return "Tomorrow";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
  }).format(date);
};

export const formatGridDate = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

export const formatRepeat = (value: Task["repeat"]) => {
  const customRepeat = value.match(/^EVERY_(\d+)_(DAY|WEEK|MONTH|YEAR)$/);

  if (customRepeat) {
    const [, every, unit] = customRepeat;
    const unitText = unit.toLowerCase();
    const pluralUnitText = Number(every) > 1 ? `${unitText}s` : unitText;

    return `Every ${every} ${pluralUnitText}`;
  }

  return taskRepeatLabels[value] ?? "";
};

export const getCategoryColor = (color: string) => {
  return taskCategoryColorMap[color] ?? color;
};

export const getTaskStepStats = (task: Task) => {
  const completed = task.steps?.filter((step) => step.completed).length ?? 0;
  const total = task.steps?.length ?? 0;

  return { completed, total };
};

export const isTaskOverdue = (task: Task) => {
  if (!task.dueDate || task.completed) return false;

  const dueDate = parseDate(task.dueDate);
  if (!dueDate) return false;

  return startOfDay(dueDate) < startOfDay(new Date());
};

export const getTaskItemDateLabels = (task: Task) => {
  return {
    dueDateLabel: formatTaskDate(task.dueDate),
    gridDueDateLabel: formatGridDate(task.dueDate),
    reminderLabel: formatTaskDate(task.reminderDate),
    repeatLabel: formatRepeat(task.repeat),
  };
};
