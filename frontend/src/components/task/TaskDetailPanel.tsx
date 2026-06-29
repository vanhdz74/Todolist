import {
  BellOutlined,
  CalendarOutlined,
  CloseOutlined,
  DeleteOutlined,
  LoginOutlined,
  PaperClipOutlined,
  PlusOutlined,
  RetweetOutlined,
  StarFilled,
  StarOutlined,
  SunOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, DatePicker, Divider, Input, Space, Tag } from "antd";
import { useEffect, useMemo, useState } from "react";

import "./TaskDetailPanel.css";
import type { Task } from "@/types/task";

type Props = {
  task: Task | null;
  onClose: () => void;
};

const categoryColors = ["blue", "green", "volcano", "purple"];

const formatCreatedDate = (value?: string) => {
  if (!value) return "Created recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Created recently";

  return `Created ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)}`;
};

export default function TaskDetailPanel({ task, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [stepTitle, setStepTitle] = useState("");
  const [note, setNote] = useState("");
  const [inMyDay, setInMyDay] = useState(false);
  const [priority, setPriority] = useState<Task["priority"]>("LOW");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!task) return;

    setTitle(task.title ?? "");
    setNote(task.description ?? "");
    setPriority(task.priority);
    setSteps([]);
    setStepTitle("");
    setInMyDay(false);
    setCategories(["Blue category", "Green category"]);
  }, [task]);

  const isImportant = priority === "HIGH";

  const createdLabel = useMemo(
    () => (task ? formatCreatedDate(task.createdAt) : ""),
    [task],
  );

  const handleAddStep = () => {
    const value = stepTitle.trim();
    if (!value) return;

    setSteps((current) => [...current, value]);
    setStepTitle("");
  };

  return (
    <aside className={`task-detail-panel ${task ? "is-open" : ""}`}>
      {task && (
        <div className="task-detail-panel__inner">
          <div className="task-detail-panel__body">
            <section className="task-detail-card task-detail-card--main">
              <div className="task-detail-title-row">
                <Checkbox checked={task.completed} />

                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  bordered={false}
                  className="task-detail-title-input"
                />

                <Button
                  type="text"
                  className="task-detail-star-button"
                  icon={
                    isImportant ? (
                      <StarFilled className="task-detail-star-icon is-important" />
                    ) : (
                      <StarOutlined className="task-detail-star-icon" />
                    )
                  }
                  onClick={() =>
                    setPriority((current) =>
                      current === "HIGH" ? "LOW" : "HIGH",
                    )
                  }
                />
              </div>

              <div className="task-detail-add-step">
                <PlusOutlined className="task-detail-add-step__icon" />

                <Input
                  value={stepTitle}
                  onChange={(event) => setStepTitle(event.target.value)}
                  onPressEnter={handleAddStep}
                  bordered={false}
                  placeholder="Add step"
                  className="task-detail-add-step__input"
                />

                <Button
                  size="small"
                  type="text"
                  disabled={!stepTitle.trim()}
                  onClick={handleAddStep}
                >
                  Add
                </Button>
              </div>

              {steps.map((step, index) => (
                <div className="task-detail-step" key={`${step}-${index}`}>
                  <Checkbox />
                  <span>{step}</span>
                </div>
              ))}
            </section>

            <section className="task-detail-card">
              <button
                className={`task-detail-action ${inMyDay ? "is-active" : ""}`}
                onClick={() => setInMyDay((value) => !value)}
                type="button"
              >
                <SunOutlined />
                <span>{inMyDay ? "Added to My Day" : "Add to My Day"}</span>
              </button>
            </section>

            <section className="task-detail-card">
              <button className="task-detail-action" type="button">
                <BellOutlined />
                <span>Remind me</span>
              </button>

              <Divider className="task-detail-divider" />

              <div className="task-detail-action task-detail-action--field">
                <CalendarOutlined />

                <DatePicker
                  bordered={false}
                  placeholder="Add due date"
                  className="task-detail-date-picker"
                />
              </div>

              <Divider className="task-detail-divider" />

              <button className="task-detail-action" type="button">
                <RetweetOutlined />
                <span>Repeat</span>
              </button>
            </section>

            <section className="task-detail-card">
              <div className="task-detail-action task-detail-action--wrap">
                <TagOutlined className="task-detail-action__icon" />

                <Space size={[6, 6]} wrap>
                  {categories.map((category, index) => (
                    <Tag
                      key={category}
                      color={categoryColors[index % categoryColors.length]}
                      closable
                      onClose={() =>
                        setCategories((current) =>
                          current.filter((item) => item !== category),
                        )
                      }
                    >
                      {category}
                    </Tag>
                  ))}

                  <Button
                    size="small"
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() =>
                      setCategories((current) => [
                        ...current,
                        `Category ${current.length + 1}`,
                      ])
                    }
                  >
                    Category
                  </Button>
                </Space>
              </div>
            </section>

            <section className="task-detail-card">
              <button className="task-detail-action" type="button">
                <PaperClipOutlined />
                <span>Add file</span>
              </button>
            </section>

            <section className="task-detail-card">
              <Input.TextArea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Add note"
                bordered={false}
                autoSize={{ minRows: 4, maxRows: 8 }}
                className="task-detail-note"
              />
            </section>
          </div>

          <footer className="task-detail-panel__footer">
            <Button type="text" icon={<LoginOutlined />} onClick={onClose} />

            <span className="task-detail-created">{createdLabel}</span>

            <Button type="text" danger icon={<DeleteOutlined />} />

            <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
          </footer>
        </div>
      )}
    </aside>
  );
}
