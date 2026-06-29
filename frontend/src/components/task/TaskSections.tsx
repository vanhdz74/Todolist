import { Collapse, Empty, Skeleton } from "antd";

import type { Task } from "@/types/task";

import TaskItem from "./TaskItem";

type Props = {
  data: Task[];
  loading: boolean;
  variant: "grid" | "list";
  selectedTaskId?: number;
  onSelectTask: (task: Task) => void;
};

// Phần display tasks
export default function TaskSections({
  data,
  loading,
  variant,
  selectedTaskId,
  onSelectTask,
}: Props) {
  const activeTasks = data.filter((task) => !task.completed);
  const completedTasks = data.filter((task) => task.completed);

  // Loading...
  if (loading) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  // Trống
  if (!data.length) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No tasks here yet"
        className="mt-12"
      />
    );
  }

  return (
    <div>
      {/* Các task chưa hoàn thành */}
      {activeTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          variant={variant}
          selected={task.id === selectedTaskId}
          onSelect={onSelectTask}
        />
      ))}

      {/* Các task đã chưa hoàn thành */}
      {completedTasks.length > 0 && (
        <Collapse
          ghost
          className="mt-3!"
          items={[
            {
              key: "completed",
              label: `Completed (${completedTasks.length})`,
              children: completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  variant={variant}
                  selected={task.id === selectedTaskId}
                  onSelect={onSelectTask}
                />
              )),
            },
          ]}
        />
      )}
    </div>
  );
}
