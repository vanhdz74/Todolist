import {
  CalendarOutlined,
  InfoCircleOutlined,
  StarFilled,
  StarOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, DatePicker, Input } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";

import "./TaskItem.css";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { updateTaskRequest } from "@/redux/task/taskSlice";
import type { Task } from "@/types/task";
import {
  cx,
  getCategoryColor,
  getTaskItemDateLabels,
  getTaskMetadataItems,
  isTaskOverdue,
} from "@/features/tasks";
import type { TaskItemProps } from "@/features/tasks";

export default function TaskItem({
  task,
  variant,
  selected,
  onSelect,
}: TaskItemProps) {
  const dispatch = useAppDispatch();

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task.title);
  const [editingDueDate, setEditingDueDate] = useState(false);

  const isGrid = variant === "grid";
  const isImportant = task.priority === "HIGH";
  const { dueDateLabel, gridDueDateLabel } = getTaskItemDateLabels(task);
  const isOverdue = isTaskOverdue(task);
  const metadata = getTaskMetadataItems(task);

  // Toggle impotance
  const toggleImportant = () => {
    dispatch(
      updateTaskRequest({
        id: task.id,
        data: {
          priority: task.priority === "HIGH" ? "LOW" : "HIGH",
          updatedAt: new Date().toISOString(),
        },
      }),
    );
  };

  // Toggle completed
  const toggleCompleted = (completed: boolean) => {
    dispatch(
      updateTaskRequest({
        id: task.id,
        data: {
          completed,
          updatedAt: new Date().toISOString(),
        },
      }),
    );
  };

  // Call api update task
  const updateTask = (data: Partial<Task>) => {
    dispatch(
      updateTaskRequest({
        id: task.id,
        data: {
          ...data,
          updatedAt: new Date().toISOString(),
        },
      }),
    );
  };

  const commitTitle = () => {
    const nextTitle = titleDraft.trim();

    setEditingTitle(false);

    if (!nextTitle) {
      setTitleDraft(task.title);
      return;
    }

    if (nextTitle !== task.title) {
      updateTask({ title: nextTitle });
    }
  };

  const handleSelectByKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onSelect(task);
  };

  const handleCellKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onSelect(task);
  };

  const handleGridCellClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onSelect(task);
  };

  const handleTitleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();

    if (event.key === "Enter") {
      event.preventDefault();
      commitTitle();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setTitleDraft(task.title);
      setEditingTitle(false);
    }
  };

  const beginTitleEdit = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setTitleDraft(task.title);
    setEditingTitle(true);
  };

  const beginDueDateEdit = () => {
    if (!isGrid) return;

    setEditingDueDate(true);
  };

  const handleDueDateKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    beginDueDateEdit();
  };

  return (
    <div
      className={cx(
        "task-item",
        `task-item--${variant}`,
        "group grid cursor-pointer text-[var(--text-main)] transition-colors",
        isGrid
          ? "min-h-[40px] grid-cols-[var(--task-grid-columns)] items-center gap-0 border-b border-[var(--border)] bg-[var(--bg-surface)] px-3 py-0"
          : "min-h-[52px] grid-cols-[40px_minmax(0,1fr)_44px] items-center gap-2 rounded bg-[var(--bg-surface)] px-3 py-2 hover:bg-[var(--bg-hover)]",
        selected && "is-selected",
        task.completed && "is-completed",
      )}
      tabIndex={0}
      role="button"
      aria-label={`Open task ${task.title}`}
      onClick={() => onSelect(task)}
      onKeyDown={handleSelectByKeyboard}
    >
      <div
        className={cx(
          "task-item__cell flex items-center justify-center",
          isGrid ? "h-10" : "h-9",
        )}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <Checkbox
          className="task-item__checkbox"
          checked={task.completed}
          aria-label={task.completed ? "Mark as active" : "Mark as completed"}
          onChange={(event) => toggleCompleted(event.target.checked)}
        />
      </div>

      {/* Phần title data */}
      <div
        className={cx(
          "task-item__cell task-item__title-cell min-w-0 px-4!",
          isGrid ? "flex h-10 items-center py-0" : "py-3!",
        )}
        tabIndex={isGrid ? 0 : undefined}
        onClick={isGrid ? handleGridCellClick : undefined}
        onKeyDown={isGrid ? handleCellKeyboard : undefined}
        onDoubleClick={beginTitleEdit}
      >
        <div className="min-w-0 flex-1">
          {editingTitle ? (
            <Input
              autoFocus
              bordered={false}
              className="task-item__title-input"
              value={titleDraft}
              onBlur={commitTitle}
              onChange={(event) => setTitleDraft(event.target.value)}
              onClick={(event) => event.stopPropagation()}
              onDoubleClick={(event) => event.stopPropagation()}
              onKeyDown={handleTitleKeyDown}
            />
          ) : (
            <div
              className={cx(
                "truncate text-[14px] leading-5 text-[var(--text-main)]",
                task.completed &&
                  "text-[var(--text-disabled)] line-through decoration-[var(--text-disabled)]",
              )}
            >
              {task.title}
            </div>
          )}

          {/* Title con với dạng list*/}
          {!isGrid && (
            <div className="mt-0.5! flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] leading-4 text-[var(--text-secondary)]">
              {metadata.map((item) => (
                <span
                  key={item.key}
                  className={cx(
                    "task-item__meta inline-flex min-w-0 items-center gap-1 whitespace-nowrap",
                    item.tone === "accent" && "is-accent",
                    item.tone === "danger" && "is-danger",
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              ))}

              {task.categories?.map((category) => (
                <span
                  className="task-item__meta inline-flex min-w-0 items-center gap-1 whitespace-nowrap"
                  key={category.id}
                >
                  <TagOutlined />
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: getCategoryColor(category.color),
                    }}
                  />
                  <span>{category.name}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {isGrid && (
          <InfoCircleOutlined className="task-item__info-icon ml-2 shrink-0 text-[var(--primary)]" />
        )}
      </div>

      {/* Due date */}
      {isGrid && (
        <div
          className={cx(
            "task-item__cell task-item__grid-cell flex h-10 min-w-0 items-center justify-center truncate px-2 text-center text-[13px] text-[var(--text-secondary)]",
            dueDateLabel === "Today" && "is-today",
            isOverdue && "is-overdue",
          )}
          tabIndex={0}
          onClick={handleGridCellClick}
          onDoubleClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            beginDueDateEdit();
          }}
          onKeyDown={handleDueDateKeyDown}
        >
          {editingDueDate ? (
            <DatePicker
              autoFocus
              allowClear
              bordered={false}
              className="task-item__date-picker"
              open={editingDueDate}
              placeholder="Add due date"
              value={task.dueDate ? dayjs(task.dueDate) : undefined}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
              onOpenChange={(open) => {
                if (!open) setEditingDueDate(false);
              }}
              onChange={(value) => {
                updateTask({
                  dueDate: value ? value.toDate().toISOString() : null,
                });
                setEditingDueDate(false);
              }}
            />
          ) : (
            <>
              <CalendarOutlined className="task-item__due-icon shrink-0" />
              <span className="truncate">{gridDueDateLabel}</span>
            </>
          )}
        </div>
      )}

      <div
        className={cx(
          "task-item__cell flex items-center",
          isGrid ? "h-10 justify-center px-2" : "h-9 justify-center",
        )}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <Button
          className="task-item__star-button"
          type="text"
          size="small"
          aria-label={isImportant ? "Remove importance" : "Mark important"}
          aria-pressed={isImportant}
          onClick={(event) => {
            event.stopPropagation();
            toggleImportant();
          }}
          icon={
            isImportant ? (
              <StarFilled className="task-item__star-icon is-important" />
            ) : (
              <StarOutlined className="task-item__star-icon" />
            )
          }
        />
      </div>

      {isGrid && <div className="min-w-0" />}
    </div>
  );
}
