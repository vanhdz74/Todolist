import {
  CalendarOutlined,
  HomeOutlined,
  StarOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";

import type { Task } from "@/types/task";

export type TodoListKey =
  | "my-day"
  | "important"
  | "planned"
  | "assigned"
  | "tasks"
  | "personal"
  | "work";

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

const today = new Date().toISOString().slice(0, 10);

const hasKeyword = (task: Task, keyword: string) => {
  const text = `${task.title} ${task.description}`.toLowerCase();

  return text.includes(keyword);
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
    accentClassName: "text-[#2564cf]",
    defaultView: "grid",
    group: "smart",
    filter: (task) => task.dueDate?.slice(0, 10) === today,
  },
  {
    key: "important",
    path: "/important",
    title: "Important",
    subtitle: "Tasks marked as high priority",
    icon: <StarOutlined />,
    accentClassName: "text-[#e33e5a]",
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
    accentClassName: "text-[#107c10]",
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
    accentClassName: "text-[#8764b8]",
    defaultView: "grid",
    group: "smart",
    filter: () => true,
  },
  {
    key: "tasks",
    path: "/tasks",
    title: "Tasks",
    subtitle: "Manage your tasks",
    icon: <HomeOutlined />,
    accentClassName: "text-[#2564cf]",
    defaultView: "grid",
    group: "smart",
    filter: () => true,
  },
  {
    key: "personal",
    path: "/personal",
    title: "Personal",
    subtitle: "Personal list",
    icon: <HomeOutlined />,
    accentClassName: "text-[#498205]",
    defaultView: "list",
    group: "custom",
    filter: (task) => hasKeyword(task, "personal"),
  },
  {
    key: "work",
    path: "/work",
    title: "Work",
    subtitle: "Work list",
    icon: <HomeOutlined />,
    accentClassName: "text-[#0078d4]",
    defaultView: "list",
    group: "custom",
    filter: (task) => hasKeyword(task, "work") || hasKeyword(task, "react"),
  },
];

export const getTodoListByPath = (path: string) =>
  todoLists.find((list) => list.path === path);

export const getTodoListByKey = (key: TodoListKey) =>
  todoLists.find((list) => list.key === key);
