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
import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Input,
  Select,
  Space,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

import "./TaskDetailPanel.css";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { removeTaskRequest, updateTaskRequest } from "@/redux/task/taskSlice";
import { taskApi } from "@/services/task.api";
import type { Task, TaskCategory, TaskStep } from "@/types/task";

type Props = {
  task: Task | null;
  onClose: () => void;
};

type ContentProps = {
  task: Task;
  onClose: () => void;
};

const categoryColors = ["blue", "green", "volcano", "purple"];

const repeatOptions = [
  { label: "Does not repeat", value: "NONE" },
  { label: "Daily", value: "DAILY" },
  { label: "Weekdays", value: "WEEKDAYS" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
];

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

const TaskDetailPanelContent = ({ task, onClose }: ContentProps) => {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState(task.title ?? "");
  const [steps, setSteps] = useState<TaskStep[]>(task.steps ?? []);
  const [stepTitle, setStepTitle] = useState("");
  const [note, setNote] = useState(task.description ?? "");
  const [inMyDay, setInMyDay] = useState(task.myDay);
  const [priority, setPriority] = useState<Task["priority"]>(task.priority);
  const [categories, setCategories] = useState<TaskCategory[]>(
    task.categories ?? [],
  );
  const [allCategories, setAllCategories] = useState<TaskCategory[]>([]);

  useEffect(() => {
    setTitle(task.title ?? "");
    setSteps(task.steps ?? []);
    setNote(task.description ?? "");
    setInMyDay(task.myDay);
    setPriority(task.priority);
    setCategories(task.categories ?? []);
    setStepTitle("");
  }, [task]);

  useEffect(() => {
    let mounted = true;

    taskApi.getCategories().then((response) => {
      if (mounted) {
        setAllCategories(response.data);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const isImportant = priority === "HIGH";

  const createdLabel = useMemo(
    () => formatCreatedDate(task.createdAt),
    [task.createdAt],
  );

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

  const handleAddStep = async () => {
    const value = stepTitle.trim();
    if (!value) return;

    const response = await taskApi.createStep({
      taskId: task.id,
      title: value,
      completed: false,
      order: steps.length + 1,
    });

    setSteps((current) => [...current, response.data]);
    setStepTitle("");
  };

  const handleToggleStep = async (step: TaskStep, completed: boolean) => {
    const response = await taskApi.updateStep(step.id, { completed });

    setSteps((current) =>
      current.map((item) => (item.id === step.id ? response.data : item)),
    );
  };

  const handleRemoveStep = async (stepId: number) => {
    await taskApi.removeStep(stepId);
    setSteps((current) => current.filter((item) => item.id !== stepId));
  };

  const handleUpdateTitle = () => {
    const value = title.trim();

    if (!value || value === task.title) {
      setTitle(task.title ?? "");
      return;
    }

    updateTask({ title: value });
  };

  const handleUpdateNote = () => {
    if (note === task.description) return;

    updateTask({ description: note });
  };

  const handleToggleImportant = () => {
    const nextPriority = priority === "HIGH" ? "LOW" : "HIGH";

    setPriority(nextPriority);
    updateTask({ priority: nextPriority });
  };

  const handleToggleMyDay = () => {
    const nextInMyDay = !inMyDay;

    setInMyDay(nextInMyDay);
    updateTask({ myDay: nextInMyDay });
  };

  const handleAddCategory = async () => {
    const linkedCategoryIds = new Set(categories.map((category) => category.id));
    const nextCategory = allCategories.find(
      (category) => !linkedCategoryIds.has(category.id),
    );

    if (!nextCategory) return;

    const response = await taskApi.createTaskCategory({
      taskId: task.id,
      categoryId: nextCategory.id,
    });

    setCategories((current) => [
      ...current,
      { ...nextCategory, linkId: response.data.id },
    ]);
  };

  const handleRemoveCategory = async (category: TaskCategory) => {
    if (!category.linkId) return;

    await taskApi.removeTaskCategory(category.linkId);
    setCategories((current) =>
      current.filter((item) => item.id !== category.id),
    );
  };

  const handleDeleteTask = () => {
    dispatch(removeTaskRequest(task.id));
    onClose();
  };

  return (
    <div className="task-detail-panel__inner">
      <div className="task-detail-panel__body">
        <section className="task-detail-card task-detail-card--main">
          <div className="task-detail-title-row">
            <Checkbox
              checked={task.completed}
              onChange={(event) =>
                updateTask({ completed: event.target.checked })
              }
            />

            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={handleUpdateTitle}
              onPressEnter={handleUpdateTitle}
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
              onClick={handleToggleImportant}
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

          {steps.map((step) => (
            <div className="task-detail-step" key={step.id}>
              <Checkbox
                checked={step.completed}
                onChange={(event) =>
                  handleToggleStep(step, event.target.checked)
                }
              />
              <span>{step.title}</span>
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={() => handleRemoveStep(step.id)}
              />
            </div>
          ))}
        </section>

        <section className="task-detail-card">
          <button
            className={`task-detail-action ${inMyDay ? "is-active" : ""}`}
            onClick={handleToggleMyDay}
            type="button"
          >
            <SunOutlined />
            <span>{inMyDay ? "Added to My Day" : "Add to My Day"}</span>
          </button>
        </section>

        <section className="task-detail-card">
          <div className="task-detail-action task-detail-action--field">
            <BellOutlined />
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="MMM D, YYYY HH:mm"
              value={task.reminderDate ? dayjs(task.reminderDate) : null}
              bordered={false}
              placeholder="Remind me"
              className="task-detail-date-picker"
              onChange={(value) =>
                updateTask({
                  reminderDate: value ? value.toDate().toISOString() : null,
                })
              }
            />
          </div>

          <Divider className="task-detail-divider" />

          <div className="task-detail-action task-detail-action--field">
            <CalendarOutlined />

            <DatePicker
              value={task.dueDate ? dayjs(task.dueDate) : null}
              bordered={false}
              placeholder="Add due date"
              format="MMM D, YYYY"
              className="task-detail-date-picker"
              onChange={(value) =>
                updateTask({
                  dueDate: value ? value.toDate().toISOString() : null,
                })
              }
            />
          </div>

          <Divider className="task-detail-divider" />

          <div className="task-detail-action task-detail-action--field">
            <RetweetOutlined />
            <Select
              variant="borderless"
              value={task.repeat}
              options={repeatOptions}
              className="task-detail-select"
              onChange={(repeat) => updateTask({ repeat })}
            />
          </div>
        </section>

        <section className="task-detail-card">
          <div className="task-detail-action task-detail-action--wrap">
            <TagOutlined className="task-detail-action__icon" />

            <Space size={[6, 6]} wrap>
              {categories.map((category, index) => (
                <Tag
                  key={category.id}
                  color={
                    category.color ??
                    categoryColors[index % categoryColors.length]
                  }
                  closable
                  onClose={(event) => {
                    event.preventDefault();
                    handleRemoveCategory(category);
                  }}
                >
                  {category.name}
                </Tag>
              ))}

              <Button
                size="small"
                type="text"
                icon={<PlusOutlined />}
                disabled={categories.length >= allCategories.length}
                onClick={handleAddCategory}
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
            onBlur={handleUpdateNote}
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

        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={handleDeleteTask}
        />

        <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
      </footer>
    </div>
  );
};

export default function TaskDetailPanel({ task, onClose }: Props) {
  return (
    <aside className={`task-detail-panel ${task ? "is-open" : ""}`}>
      {task && (
        <TaskDetailPanelContent key={task.id} task={task} onClose={onClose} />
      )}
    </aside>
  );
}
