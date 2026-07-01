import {
  CalendarOutlined,
  HomeOutlined,
  StarOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";

import type { Task } from "@/types/task";
import { CURRENT_USER_ID } from "./user";

export type TodoListKey =
  | "my-day"
  | "important"
  | "planned"
  | "assigned"
  | "tasks"
  | `list-${number}`;

export type ViewMode = "grid" | "list";

export type TodoListConfig = {
  key: TodoListKey;
  path: string;
  title: string;

  // Định nghĩa ngắn
  subtitle?: string;
  icon: React.ReactNode;
  accentClassName: string;
  defaultView: ViewMode;
  group: "smart" | "custom";
  filter: (task: Task) => boolean;
};

// Sidebar
export const todoLists: TodoListConfig[] = [
  {
    key: "my-day",
    path: "/my-day",
    title: "My Day",
    subtitle: new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(new Date()),
    icon: <SunOutlined />,
    accentClassName: "text-[var(--primary)]",
    defaultView: "grid",
    group: "smart",
    filter: (task) => task.myDay,
  },
  {
    key: "important",
    path: "/important",
    title: "Important",
    subtitle: "Tasks marked as high priority",
    icon: <StarOutlined />,
    accentClassName: "text-[var(--task-important)]",
    defaultView: "grid",
    group: "smart",
    filter: (task) => task.priority === "HIGH",
  },
  {
    key: "planned",
    path: "/planned",
    title: "Planned",
    subtitle: "Tasks with due dates",
    icon: <CalendarOutlined />,
    accentClassName: "text-[var(--task-complete)]",
    defaultView: "grid",
    group: "smart",
    filter: (task) => Boolean(task.dueDate),
  },
  {
    key: "assigned",
    path: "/assigned",
    title: "Assigned to me",
    subtitle: "Tasks assigned to your account",
    icon: <UserOutlined />,
    accentClassName: "text-[var(--assigned)]",
    defaultView: "grid",
    group: "smart",
    filter: (task) => task.assignedTo === CURRENT_USER_ID,
  },
  {
    key: "tasks",
    path: "/tasks",
    title: "Tasks",
    subtitle: "Manage your tasks",
    icon: <HomeOutlined />,
    accentClassName: "text-[var(--primary)]",
    defaultView: "grid",
    group: "smart",
    filter: () => true,
  },
];

export const getTodoListByPath = (path: string) =>
  todoLists.find((list) => list.path === path);

export const getTodoListByKey = (key: TodoListKey) =>
  todoLists.find((list) => list.key === key);
