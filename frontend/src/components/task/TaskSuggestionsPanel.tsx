import {
  CalendarOutlined,
  CloseOutlined,
  PlusOutlined,
  StarFilled,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Empty } from "antd";
import { useMemo } from "react";

import type { TodoList } from "@/types/list";
import type { Task } from "@/types/task";

import "./TaskSuggestionsPanel.css";

type Props = {
  open: boolean;
  tasks: Task[];
  lists: TodoList[];
  onClose: () => void;
  onAddToMyDay: (task: Task) => void;
};

type SuggestionSection = {
  key: string;
  title: string;
  tasks: Task[];
};

const startOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);

  return result;
};

const parseDate = (value?: string | null) => {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const isSameDay = (first: Date, second: Date) => {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
};

const formatDueDate = (value?: string | null) => {
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

const sortByCreatedDesc = (first: Task, second: Task) => {
  return (
    (parseDate(second.createdAt)?.getTime() ?? 0) -
    (parseDate(first.createdAt)?.getTime() ?? 0)
  );
};

const sortByDueDate = (first: Task, second: Task) => {
  const firstTime = parseDate(first.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
  const secondTime =
    parseDate(second.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;

  return firstTime - secondTime;
};

export default function TaskSuggestionsPanel({
  open,
  tasks,
  lists,
  onClose,
  onAddToMyDay,
}: Props) {
  const listNameById = useMemo(() => {
    return new Map(lists.map((list) => [list.id, list.name]));
  }, [lists]);

  const sections = useMemo<SuggestionSection[]>(() => {
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
  }, [tasks]);

  return (
    <aside className={`task-suggestions ${open ? "is-open" : ""}`}>
      <header className="task-suggestions__header">
        <h3>Suggestions</h3>

        <Button
          type="text"
          aria-label="Close suggestions"
          icon={<CloseOutlined />}
          onClick={onClose}
        />
      </header>

      <div className="task-suggestions__body">
        {sections.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No suggestions"
            className="task-suggestions__empty"
          />
        ) : (
          sections.map((section) => (
            <section className="task-suggestions__section" key={section.key}>
              <div className="task-suggestions__section-title">
                {section.title}
              </div>

              {section.tasks.map((task) => {
                const listName = task.listId
                  ? listNameById.get(task.listId)
                  : null;
                const dueDateLabel = formatDueDate(task.dueDate);

                return (
                  <div className="task-suggestion-item" key={task.id}>
                    <span className="task-suggestion-item__check" />

                    <div className="task-suggestion-item__content">
                      <div className="task-suggestion-item__title">
                        {task.title}
                      </div>

                      <div className="task-suggestion-item__meta">
                        <span>
                          <UnorderedListOutlined />
                          {listName ?? "Tasks"}
                        </span>

                        {dueDateLabel && (
                          <span
                            className={
                              dueDateLabel === "Overdue" ? "is-overdue" : ""
                            }
                          >
                            <CalendarOutlined />
                            {dueDateLabel}
                          </span>
                        )}

                        {task.priority === "HIGH" && (
                          <span className="is-important">
                            <StarFilled />
                            Important
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      type="text"
                      size="small"
                      aria-label={`Add ${task.title} to My Day`}
                      icon={<PlusOutlined />}
                      onClick={() => onAddToMyDay(task)}
                    />
                  </div>
                );
              })}
            </section>
          ))
        )}
      </div>
    </aside>
  );
}
