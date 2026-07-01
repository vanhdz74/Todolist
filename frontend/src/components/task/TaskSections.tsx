import { Collapse, Empty, Skeleton } from "antd";

import type { Task } from "@/types/task";

import TaskItem from "./TaskItem";

export type TaskSectionGroup = {
  key: string;
  title: string;
  tasks: Task[];
};

type Props = {
  data: Task[];
  loading: boolean;
  variant: "grid" | "list";
  groups?: TaskSectionGroup[];
  selectedTaskId?: number;
  onSelectTask: (task: Task) => void;
};

// Phần display tasks
export default function TaskSections({
  data,
  loading,
  variant,
  groups,
  selectedTaskId,
  onSelectTask,
}: Props) {
  const activeTasks = data.filter((task) => !task.completed);
  const completedTasks = data.filter((task) => task.completed);
  const visibleGroups =
    groups && groups.length > 0
      ? groups.filter((group) => group.tasks.length > 0)
      : [];

  // Loading...
  if (loading && !data.length) {
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
    <div className={variant === "list" ? "space-y-2" : ""}>
      {/* Các task chưa hoàn thành */}
      {visibleGroups.length > 0
        ? visibleGroups.map((group) => (
            <section className="task-section-group" key={group.key}>
              <div className="task-section-group__title">
                {group.title}
                <span>{group.tasks.length}</span>
              </div>

              <div className={variant === "list" ? "space-y-2" : ""}>
                {group.tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    variant={variant}
                    selected={task.id === selectedTaskId}
                    onSelect={onSelectTask}
                  />
                ))}
              </div>
            </section>
          ))
        : activeTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              variant={variant}
              selected={task.id === selectedTaskId}
              onSelect={onSelectTask}
            />
          ))}

      {/* Các task đã hoàn thành */}
      {completedTasks.length > 0 && (
        <Collapse
          ghost
          className="mt-3! text-(--primary)!"
          items={[
            {
              key: "completed",
              label: `Completed (${completedTasks.length})`,
              children: (
                <div className={variant === "list" ? "space-y-2" : ""}>
                  {completedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      variant={variant}
                      selected={task.id === selectedTaskId}
                      onSelect={onSelectTask}
                    />
                  ))}
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
