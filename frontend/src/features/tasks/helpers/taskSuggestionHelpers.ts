import type { Task } from "@/types/task";
import { isSameDay, parseDate, startOfDay } from "@/utils/date";

export type SuggestionSection = {
  key: string;
  title: string;
  tasks: Task[];
};

export const formatSuggestionDueDate = (value?: string | null) => {
  const date = parseDate(value);
  if (!date) return "";

  const today = startOfDay(new Date());
  const taskDay = startOfDay(date);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (taskDay < today) return "Overdue";
  if (isSameDay(taskDay, today)) return "Today";
  if (isSameDay(taskDay, tomorrow)) return "Tomorrow";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

export const sortByCreatedDesc = (first: Task, second: Task) => {
  return (
    (parseDate(second.createdAt)?.getTime() ?? 0) -
    (parseDate(first.createdAt)?.getTime() ?? 0)
  );
};

export const sortByDueDate = (first: Task, second: Task) => {
  const firstTime =
    parseDate(first.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
  const secondTime =
    parseDate(second.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;

  return firstTime - secondTime;
};

export const getSuggestionSections = (tasks: Task[]): SuggestionSection[] => {
  const today = startOfDay(new Date());
  const candidates = tasks.filter((task) => !task.completed && !task.myDay);
  const usedIds = new Set<number>();

  const take = (items: Task[]) => {
    const result = items.filter((task) => !usedIds.has(task.id));
    result.forEach((task) => usedIds.add(task.id));

    return result.slice(0, 6);
  };

  const overdue = take(
    candidates
      .filter((task) => {
        const dueDate = parseDate(task.dueDate);

        return dueDate ? startOfDay(dueDate) < today : false;
      })
      .sort(sortByDueDate),
  );
  const dueToday = take(
    candidates
      .filter((task) => {
        const dueDate = parseDate(task.dueDate);

        return dueDate ? isSameDay(startOfDay(dueDate), today) : false;
      })
      .sort(sortByDueDate),
  );
  const important = take(
    candidates
      .filter((task) => task.priority === "HIGH")
      .sort(sortByCreatedDesc),
  );
  const recent = take([...candidates].sort(sortByCreatedDesc));

  return [
    { key: "overdue", title: "Earlier", tasks: overdue },
    { key: "today", title: "Today", tasks: dueToday },
    { key: "important", title: "Important", tasks: important },
    { key: "recent", title: "Recently added", tasks: recent },
  ].filter((section) => section.tasks.length > 0);
};
