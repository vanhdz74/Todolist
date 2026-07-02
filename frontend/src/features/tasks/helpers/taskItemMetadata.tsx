import {
  BellOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  FileOutlined,
  PaperClipOutlined,
  RetweetOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";

import type { Task } from "@/types/task";

import {
  getTaskItemDateLabels,
  getTaskStepStats,
  isTaskOverdue,
} from "./taskItemHelpers";
import type { TaskMetadataItem } from "./taskItemTypes";

export const getTaskMetadataItems = (task: Task) => {
  const { completed, total } = getTaskStepStats(task);
  const { dueDateLabel, reminderLabel, repeatLabel } =
    getTaskItemDateLabels(task);
  const overdue = isTaskOverdue(task);

  const metadataItems: Array<TaskMetadataItem | null> = [
    task.myDay
      ? {
          key: "my-day",
          label: "My Day",
          icon: <SunOutlined />,
        }
      : null,
    total > 0
      ? {
          key: "steps",
          label: `${completed} of ${total}`,
          icon: <CheckCircleOutlined />,
        }
      : null,
    dueDateLabel
      ? {
          key: "due-date",
          label: dueDateLabel,
          icon: <CalendarOutlined />,
          tone: overdue
            ? "danger"
            : dueDateLabel === "Today"
              ? "accent"
              : "default",
        }
      : null,
    reminderLabel
      ? {
          key: "reminder",
          label: reminderLabel,
          icon: <BellOutlined />,
        }
      : null,
    repeatLabel
      ? {
          key: "repeat",
          label: repeatLabel,
          icon: <RetweetOutlined />,
        }
      : null,
    task.attachments?.length
      ? {
          key: "attachments",
          label:
            task.attachments.length === 1
              ? "File attached"
              : `${task.attachments.length} files attached`,
          icon: <PaperClipOutlined />,
        }
      : null,
    task.description.trim()
      ? {
          key: "note",
          label: "Note",
          icon: <FileOutlined />,
        }
      : null,
    task.assignedTo
      ? {
          key: "assigned",
          label: "Assigned",
          icon: <UserOutlined />,
        }
      : null,
  ];

  return metadataItems.filter((item): item is TaskMetadataItem =>
    Boolean(item),
  );
};
