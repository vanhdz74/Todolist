import {
  BellOutlined,
  CalendarOutlined,
  CheckOutlined,
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
  Dropdown,
  Input,
  Modal,
  Select,
  Space,
  Tag,
} from "antd";
import type { MenuProps } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";

import "./TaskDetailPanel.css";
import {
  cx,
  fixedCategories,
  formatCreatedDate,
  formatModifiedDate,
  formatReminderDisplay,
  isTaskOverdue,
  repeatOptions,
} from "@/features/tasks";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  getTaskDetailRequest,
  removeTaskRequest,
  updateTaskRequest,
} from "@/redux/task/taskSlice";
import { taskApi } from "@/services/task.api";
import type {
  Task,
  TaskAttachment,
  TaskCategory,
  TaskStep,
} from "@/types/task";

type Props = {
  task: Task | null;
  onClose: () => void;
};

type ContentProps = {
  task: Task;
  onClose: () => void;
};

const TaskDetailPanelContent = ({ task, onClose }: ContentProps) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [attachments, setAttachments] = useState<TaskAttachment[]>(
    task.attachments ?? [],
  );

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
  const dueDateOverdue = isTaskOverdue(task);

  const createdLabel = useMemo(
    () => formatCreatedDate(task.createdAt),
    [task.createdAt],
  );
  const modifiedLabel = useMemo(
    () => formatModifiedDate(task.updatedAt),
    [task.updatedAt],
  );
  const reminderDisplay = useMemo(
    () => formatReminderDisplay(task.reminderDate),
    [task.reminderDate],
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

  const refreshTaskDetail = () => {
    dispatch(getTaskDetailRequest(task.id));
  };

  const touchTask = async () => {
    await taskApi.update(task.id, {
      updatedAt: new Date().toISOString(),
    });
    refreshTaskDetail();
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
    await touchTask();
  };

  const handleToggleStep = async (step: TaskStep, completed: boolean) => {
    const response = await taskApi.updateStep(step.id, { completed });

    setSteps((current) =>
      current.map((item) => (item.id === step.id ? response.data : item)),
    );
    await touchTask();
  };

  const removeStep = async (stepId: number) => {
    const previousSteps = steps;

    setSteps((current) => current.filter((item) => item.id !== stepId));

    try {
      await taskApi.removeStep(stepId);
      await touchTask();
    } catch {
      try {
        const response = await taskApi.getSteps({ taskId: task.id });
        const stillExists = response.data.some((step) => step.id === stepId);

        if (stillExists) {
          setSteps(previousSteps);
          return;
        }

        await touchTask();
      } catch {
        setSteps(previousSteps);
      }
    }
  };

  const handleRemoveStep = (step: TaskStep) => {
    Modal.confirm({
      title: "Delete this step?",
      content: step.title,
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => removeStep(step.id),
    });
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

  const removeCategory = async (category: TaskCategory) => {
    const previousCategories = categories;
    let linkId = category.linkId;

    setCategories((current) =>
      current.filter((item) => item.id !== category.id),
    );

    try {
      if (!linkId) {
        const response = await taskApi.getTaskCategories({
          taskId: task.id,
          categoryId: category.id,
        });

        linkId = response.data[0]?.id;
      }

      if (linkId) {
        await taskApi.removeTaskCategory(linkId);
      }

      await touchTask();
    } catch {
      try {
        const response = await taskApi.getTaskCategories({
          taskId: task.id,
          categoryId: category.id,
        });
        const stillExists = response.data.some((link) => link.id === linkId);

        if (stillExists) {
          setCategories(previousCategories);
          return;
        }

        await touchTask();
      } catch {
        setCategories(previousCategories);
      }
    }
  };

  const handleRemoveCategory = (category: TaskCategory) => {
    Modal.confirm({
      title: "Remove this category?",
      content: category.name,
      okText: "Remove",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => removeCategory(category),
    });
  };

  const handleToggleFixedCategory = async (
    option: (typeof fixedCategories)[number],
  ) => {
    const linkedCategory = categories.find(
      (category) =>
        category.name === option.name || category.color === option.color,
    );

    if (linkedCategory) {
      await removeCategory(linkedCategory);
      return;
    }

    let category = allCategories.find(
      (item) => item.name === option.name || item.color === option.color,
    );

    if (!category) {
      const response = await taskApi.createCategory({
        name: option.name,
        color: option.color,
        userId: task.userId,
      });

      category = response.data;
      setAllCategories((current) => [...current, response.data]);
    }

    const linkResponse = await taskApi.createTaskCategory({
      taskId: task.id,
      categoryId: category.id,
    });

    setCategories((current) => [
      ...current,
      { ...category, linkId: linkResponse.data.id },
    ]);
    await touchTask();
  };

  const handleAddFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    const now = new Date().toISOString();
    const responses = await Promise.all(
      Array.from(files).map((file) =>
        taskApi.createAttachment({
          taskId: task.id,
          name: file.name,
          url: `/uploads/${encodeURIComponent(file.name)}`,
          type: file.type || "application/octet-stream",
          size: file.size,
          createdAt: now,
        }),
      ),
    );

    setAttachments((current) => [
      ...current,
      ...responses.map((response) => response.data),
    ]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    await touchTask();
  };

  const removeAttachment = async (attachmentId: number) => {
    const previousAttachments = attachments;

    setAttachments((current) =>
      current.filter((attachment) => attachment.id !== attachmentId),
    );

    try {
      await taskApi.removeAttachment(attachmentId);
      await touchTask();
    } catch {
      try {
        const response = await taskApi.getAttachments({ taskId: task.id });
        const stillExists = response.data.some(
          (attachment) => attachment.id === attachmentId,
        );

        if (stillExists) {
          setAttachments(previousAttachments);
          return;
        }

        await touchTask();
      } catch {
        setAttachments(previousAttachments);
      }
    }
  };

  const handleRemoveAttachment = (attachment: TaskAttachment) => {
    Modal.confirm({
      title: "Delete this file?",
      content: attachment.name,
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => removeAttachment(attachment.id),
    });
  };

  const categoryMenuItems: MenuProps["items"] = fixedCategories.map(
    (option) => {
      const checked = categories.some(
        (category) =>
          category.name === option.name || category.color === option.color,
      );

      return {
        key: option.color,
        label: (
          <span className="task-detail-category-option">
            <span
              className="task-detail-category-dot"
              style={{ backgroundColor: option.swatch }}
            />
            <span>{option.name}</span>
            {checked && <CheckOutlined />}
          </span>
        ),
        onClick: () => handleToggleFixedCategory(option),
      };
    },
  );

  const handleDeleteTask = () => {
    Modal.confirm({
      title: "Delete this task?",
      content: task.title,
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => {
        dispatch(removeTaskRequest(task.id));
        onClose();
      },
    });
  };

  return (
    <div className="task-detail-panel__inner">
      {/* Header panel */}
      <div className="task-detail-panel__header">
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
            onKeyDown={(event) => {
              if (event.key !== "Enter" || event.shiftKey) return;

              event.preventDefault();
              handleUpdateTitle();
              event.currentTarget.blur();
            }}
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
      </div>

      {/* Chi tiết 1 task */}
      <div className="task-detail-panel__body">
        <section className="task-detail-card task-detail-card--main">
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
                onClick={() => handleRemoveStep(step)}
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
            <div className="task-detail-reminder-field">
              <DatePicker
                showTime={{ format: "HH:mm" }}
                format="MMM D, YYYY HH:mm"
                value={task.reminderDate ? dayjs(task.reminderDate) : null}
                bordered={false}
                placeholder="Remind me"
                className="task-detail-date-picker task-detail-date-picker--overlay"
                onChange={(value) =>
                  updateTask({
                    reminderDate: value ? value.toDate().toISOString() : null,
                  })
                }
                suffixIcon={null}
              />

              <div className="task-detail-reminder-copy">
                <span>{reminderDisplay.title}</span>
                {reminderDisplay.subtitle && (
                  <small>{reminderDisplay.subtitle}</small>
                )}
              </div>
            </div>
          </div>

          <Divider className="task-detail-divider" />

          <div
            className={cx(
              "task-detail-action task-detail-action--field",
              dueDateOverdue && "is-overdue",
            )}
          >
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
              suffixIcon={null}
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

            <div className="task-detail-category-manager">
              <Space size={[6, 6]} wrap>
                {categories.map((category, index) => (
                  <Tag
                    key={category.id}
                    color={category.color ?? fixedCategories[index]?.color}
                    closable
                    onClose={(event) => {
                      event.preventDefault();
                      handleRemoveCategory(category);
                    }}
                  >
                    {category.name}
                  </Tag>
                ))}
              </Space>

              <Dropdown
                trigger={["click"]}
                overlayClassName="task-detail-category-dropdown"
                menu={{ items: categoryMenuItems }}
              >
                <Button size="small" type="text" icon={<PlusOutlined />}>
                  Category
                </Button>
              </Dropdown>
            </div>
          </div>
        </section>

        <section className="task-detail-card">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={(event) => handleAddFiles(event.target.files)}
          />
          <button
            className="task-detail-action"
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            <PaperClipOutlined />
            <span>Add file</span>
          </button>

          {attachments.map((attachment) => (
            <div className="task-detail-attachment" key={attachment.id}>
              <PaperClipOutlined />
              <span title={attachment.name}>{attachment.name}</span>
              <Button
                size="small"
                type="text"
                icon={<CloseOutlined />}
                onClick={() => handleRemoveAttachment(attachment)}
              />
            </div>
          ))}
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
          <div className="task-detail-note-updated">{modifiedLabel}</div>
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
  const panelContentKey = task
    ? [
        task.id,
        task.updatedAt,
        task.steps?.length ?? 0,
        task.categories?.length ?? 0,
        task.attachments?.length ?? 0,
      ].join("-")
    : "empty";

  return (
    <aside className={`task-detail-panel ${task ? "is-open" : ""}`}>
      {task && (
        <TaskDetailPanelContent
          key={panelContentKey}
          task={task}
          onClose={onClose}
        />
      )}
    </aside>
  );
}
