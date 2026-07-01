import type { ReactNode } from "react";

export type AddTaskOptions = {
  dueDate: string | null;
  reminder: string | null;
  repeat: string | null;
};

export type OptionItem = {
  key: string;
  label: string;
  value: string | null;
  icon: ReactNode;
  suffix?: string;
};

export type CustomType = "due" | "reminder" | "repeat" | null;

export type RepeatUnit = "day" | "week" | "month" | "year";
