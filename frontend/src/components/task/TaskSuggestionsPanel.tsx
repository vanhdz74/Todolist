import {
  CalendarOutlined,
  CloseOutlined,
  PlusOutlined,
  StarFilled,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Empty } from "antd";
import { type KeyboardEvent, useMemo } from "react";

import {
  formatSuggestionDueDate,
  getSuggestionSections,
} from "@/features/tasks";
import type { TodoList } from "@/types/list";
import type { Task } from "@/types/task";

import "./TaskSuggestionsPanel.css";

type Props = {
  open: boolean;
  tasks: Task[];
  lists: TodoList[];
  onClose: () => void;
  onSelectTask: (task: Task) => void;
  onAddToMyDay: (task: Task) => void;
};

// Task panel
export default function TaskSuggestionsPanel({
  open,
  tasks,
  lists,
  onClose,
  onSelectTask,
  onAddToMyDay,
}: Props) {
  // không tạo lại Map mỗi lần component render
  const listNameById = useMemo(() => {
    return new Map(lists.map((list) => [list.id, list.name]));
  }, [lists]);

  const sections = useMemo(() => getSuggestionSections(tasks), [tasks]);

  const handleSuggestionKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    task: Task,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onSelectTask(task);
  };

  return (
    <aside className={`task-suggestions ${open ? "is-open" : ""} ml-5!`}>
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
                const dueDateLabel = formatSuggestionDueDate(task.dueDate);

                return (
                  <div
                    className="task-suggestion-item"
                    key={task.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open details for ${task.title}`}
                    onClick={() => onSelectTask(task)}
                    onKeyDown={(event) =>
                      handleSuggestionKeyDown(event, task)
                    }
                  >
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
                      onClick={(event) => {
                        event.stopPropagation();
                        onAddToMyDay(task);
                      }}
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
