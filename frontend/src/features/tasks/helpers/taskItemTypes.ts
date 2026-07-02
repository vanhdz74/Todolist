import type { ReactNode } from "react";

import type { Task } from "@/types/task";

export type TaskItemVariant = "grid" | "list";

export type TaskItemProps = {
  task: Task;
  variant: TaskItemVariant;
  selected: boolean;
  onSelect: (task: Task) => void;
};

export type TaskMetadataTone = "default" | "accent" | "danger";

export type TaskMetadataItem = {
  key: string;
  label: string;
  icon: ReactNode;
  tone?: TaskMetadataTone;
};
