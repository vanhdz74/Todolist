import type { RepeatUnit } from "./addTaskTypes";

export const formatDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getWeekday = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
  });
};

export const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return date;
};

export const getRepeatLabel = (every: number, unit: RepeatUnit) => {
  const unitText = every > 1 ? `${unit}s` : unit;

  return `Every ${every} ${unitText}`;
};
