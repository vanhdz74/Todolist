import { CheckOutlined } from "@ant-design/icons";

import type { TodoListConfig } from "@/constants/todoLists";
import { CURRENT_USER_ID } from "@/constants/user";
import type { Task } from "@/types/task";
import {
  isSameDay,
  parseDate,
  startOfDay,
  toIsoAtLocalTime,
} from "@/utils/date";

export type SortKey = "importance" | "dueDate" | "alphabetical" | "createdAt";
export type GroupKey = "none" | "dueDate" | "importance" | "list";
export type FilterKey =
  | "all"
  | "active"
  | "completed"
  | "important"
  | "planned"
  | "assigned"
  | "myDay"
  | "reminder"
  | "repeating";

export type GroupInfo = {
  key: string;
  title: string;
  order: number;
};

export const sortLabels: Record<SortKey, string> = {
  importance: "Importance",
  dueDate: "Due date",
  alphabetical: "Alphabetically",
  createdAt: "Creation date",
};

export const sortIndicatorLabels: Record<SortKey, string> = {
  importance: "importance",
  dueDate: "due date",
  alphabetical: "alphabetically",
  createdAt: "creation date",
};

export const groupLabels: Record<GroupKey, string> = {
  none: "None",
  dueDate: "Due date",
  importance: "Importance",
  list: "List",
};

export const filterLabels: Record<FilterKey, string> = {
  all: "All tasks",
  active: "Active",
  completed: "Completed",
  important: "Important",
  planned: "Planned",
  assigned: "Assigned to me",
  myDay: "My Day",
  reminder: "Has reminder",
  repeating: "Repeating",
};

const priorityOrder: Record<Task["priority"], number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
};

export const getDefaultSortBy = (list: TodoListConfig): SortKey => {
  return list.key === "planned" ? "dueDate" : "createdAt";
};

type SortPreference = {
  sortBy: SortKey;
  indicatorVisible: boolean;
};

const sortPreferences = new Map<TodoListConfig["key"], SortPreference>();

export const getSortPreference = (list: TodoListConfig): SortPreference => {
  return (
    sortPreferences.get(list.key) ?? {
      sortBy: getDefaultSortBy(list),
      indicatorVisible: false,
    }
  );
};

export const setSortPreference = (
  list: TodoListConfig,
  preference: SortPreference,
) => {
  sortPreferences.set(list.key, preference);
};

export const getReminderDate = (value: string | null | undefined) => {
  if (!value) return null;

  const today = startOfDay(new Date());

  if (value === "later-today") {
    const reminderDate = new Date(today);
    reminderDate.setHours(18, 0, 0, 0);

    return reminderDate.toISOString();
  }

  if (value === "tomorrow-morning") {
    const reminderDate = new Date(today);
    reminderDate.setDate(reminderDate.getDate() + 1);
    reminderDate.setHours(9, 0, 0, 0);

    return reminderDate.toISOString();
  }

  if (value === "next-week") {
    const reminderDate = new Date(today);
    reminderDate.setDate(reminderDate.getDate() + 7);
    reminderDate.setHours(9, 0, 0, 0);

    return reminderDate.toISOString();
  }

  const customReminderDate = new Date(value.replace(" ", "T"));

  return Number.isNaN(customReminderDate.getTime())
    ? null
    : customReminderDate.toISOString();
};

export const getRepeatValue = (
  value: string | null | undefined,
): Task["repeat"] => {
  if (!value) return "NONE";

  if (value.startsWith("every-")) {
    return value.toUpperCase().replaceAll("-", "_");
  }

  const repeatMap: Record<string, Task["repeat"]> = {
    daily: "DAILY",
    weekdays: "WEEKDAYS",
    weekly: "WEEKLY",
    monthly: "MONTHLY",
  };

  return repeatMap[value] ?? "NONE";
};

const compareCreatedDesc = (first: Task, second: Task) => {
  return (
    (parseDate(second.createdAt)?.getTime() ?? 0) -
    (parseDate(first.createdAt)?.getTime() ?? 0)
  );
};

export const applyFilter = (task: Task, filterBy: FilterKey) => {
  switch (filterBy) {
    case "active":
      return !task.completed;
    case "completed":
      return task.completed;
    case "important":
      return task.priority === "HIGH";
    case "planned":
      return Boolean(task.dueDate);
    case "assigned":
      return task.assignedTo === CURRENT_USER_ID;
    case "myDay":
      return task.myDay;
    case "reminder":
      return Boolean(task.reminderDate);
    case "repeating":
      return task.repeat !== "NONE";
    case "all":
    default:
      return true;
  }
};

export const normalizeTaskSearchValue = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d");
};

const matchesSearchTerms = (
  values: Array<string | null | undefined>,
  query: string,
) => {
  const terms = normalizeTaskSearchValue(query).split(/\s+/).filter(Boolean);

  if (terms.length === 0) return true;

  const haystack = normalizeTaskSearchValue(values.filter(Boolean).join(" "));

  return terms.every((term) => haystack.includes(term));
};

export const matchesTaskMainSearch = (
  task: Task,
  searchQuery: string,
  listName?: string | null,
) => {
  return matchesSearchTerms(
    [
      task.title,
      task.priority,
      task.completed ? "completed complete done" : "active incomplete",
      task.myDay ? "my day today" : "",
      task.dueDate ?? "",
      task.reminderDate ?? "",
      listName ?? "",
      ...(task.steps ?? []).map((step) => step.title),
      ...(task.categories ?? []).map((category) => category.name),
      ...(task.attachments ?? []).map((attachment) => attachment.name),
    ],
    searchQuery,
  );
};

export const matchesTaskNoteSearch = (task: Task, searchQuery: string) => {
  return matchesSearchTerms([task.description], searchQuery);
};

export const matchesTaskSearch = (
  task: Task,
  searchQuery: string,
  listName?: string | null,
) => {
  return (
    matchesTaskMainSearch(task, searchQuery, listName) ||
    matchesTaskNoteSearch(task, searchQuery)
  );
};

export const sortTasks = (tasks: Task[], sortBy: SortKey) => {
  return [...tasks].sort((first, second) => {
    switch (sortBy) {
      case "importance": {
        const priorityDiff =
          priorityOrder[first.priority] - priorityOrder[second.priority];

        return priorityDiff || compareCreatedDesc(first, second);
      }

      case "dueDate": {
        const firstDate =
          parseDate(first.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const secondDate =
          parseDate(second.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;

        return firstDate - secondDate || compareCreatedDesc(first, second);
      }

      case "alphabetical":
        return (
          first.title.localeCompare(second.title, undefined, {
            sensitivity: "base",
          }) || compareCreatedDesc(first, second)
        );

      case "createdAt":
      default:
        return compareCreatedDesc(first, second);
    }
  });
};

export const getDueDateGroup = (task: Task): GroupInfo => {
  const dueDate = parseDate(task.dueDate);

  if (!dueDate) {
    return { key: "no-date", title: "No date", order: 4 };
  }

  const today = startOfDay(new Date());
  const taskDay = startOfDay(dueDate);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (taskDay < today) return { key: "earlier", title: "Earlier", order: 0 };
  if (isSameDay(taskDay, today)) {
    return { key: "today", title: "Today", order: 1 };
  }
  if (isSameDay(taskDay, tomorrow)) {
    return { key: "tomorrow", title: "Tomorrow", order: 2 };
  }

  return { key: "later", title: "Later", order: 3 };
};

export const getImportanceGroup = (task: Task): GroupInfo => {
  const labels: Record<Task["priority"], string> = {
    HIGH: "Important",
    MEDIUM: "Medium",
    LOW: "Not important",
  };

  return {
    key: task.priority,
    title: labels[task.priority],
    order: priorityOrder[task.priority],
  };
};

export const buildMenuItems = <Key extends string>(
  labels: Record<Key, string>,
  selectedKey: Key,
) => {
  return (Object.keys(labels) as Key[]).map((key) => ({
    key,
    label: (
      <span className="task-command-menu__item">
        <span>{labels[key]}</span>
        {selectedKey === key && <CheckOutlined />}
      </span>
    ),
  }));
};

export { toIsoAtLocalTime };
