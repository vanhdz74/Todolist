import {
  CalendarOutlined,
  InfoCircleOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, DatePicker, Dropdown } from "antd";
import { useState } from "react";

import "./TaskItem.css";
import type { Task } from "@/types/task";

type Props = {
  task: Task;
  variant: "grid" | "list";
  selected: boolean;
  onSelect: (task: Task) => void;
};

const formatDueDate = (value?: string) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

export default function TaskItem({ task, variant, selected, onSelect }: Props) {
  const [dueDateLabel, setDueDateLabel] = useState(formatDueDate(task.dueDate));
  const [priority, setPriority] = useState(task.priority);

  const isImportant = priority === "HIGH";

  return (
    <div
      className={[
        "task-item",
        `task-item--${variant}`,
        selected ? "is-selected" : "",
        task.completed ? "is-completed" : "",
      ].join(" ")}
    >
      <div className="task-item__check-cell">
        <Checkbox checked={task.completed} />
      </div>

      <div className="task-item__title-cell">
        <span className="task-item__title">{task.title}</span>

        <Button
          className="task-item__detail-button"
          type="text"
          size="small"
          aria-label="Open task details"
          icon={<InfoCircleOutlined />}
          onClick={() => onSelect(task)}
        />
      </div>

      <div className="task-item__due-cell">
        <span className="task-item__due-label">
          {dueDateLabel || <CalendarOutlined />}
        </span>

        <DatePicker
          className="task-item__date-picker"
          bordered={false}
          placeholder="Add due date"
          size="small"
          onChange={(value) => {
            if (!value) {
              setDueDateLabel("");
              return;
            }

            setDueDateLabel(
              new Intl.DateTimeFormat("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              }).format(value.toDate()),
            );
          }}
        />
      </div>

      <div className="task-item__importance-cell">
        <Dropdown
          trigger={["click"]}
          menu={{
            selectedKeys: [priority],
            onClick: ({ key }) => setPriority(key as Task["priority"]),
            items: [
              {
                key: "HIGH",
                label: "Mark important",
                icon: (
                  <StarFilled className="task-item__menu-star is-important" />
                ),
              },
              {
                key: "MEDIUM",
                label: "Medium importance",
                icon: <StarOutlined className="task-item__menu-star" />,
              },
              {
                key: "LOW",
                label: "Remove importance",
                icon: <StarOutlined />,
              },
            ],
          }}
        >
          <Button
            className="task-item__star-button"
            type="text"
            size="small"
            aria-label="Change importance"
            icon={
              isImportant ? (
                <StarFilled className="task-item__star-icon is-important" />
              ) : (
                <StarOutlined className="task-item__star-icon" />
              )
            }
          />
        </Dropdown>
      </div>

      <div className="task-item__empty-cell" />
    </div>
  );
}
