import type { Task } from "../../types/task";

import TaskSections from "./TaskSections";

type Props = {
  data: Task[];
  loading: boolean;
  selectedTaskId?: number;
  onSelectTask: (task: Task) => void;
};

export default function TaskList({
  data,
  loading,
  selectedTaskId,
  onSelectTask,
}: Props) {
  return (
    <div className="pb-3">
      <TaskSections
        data={data}
        loading={loading}
        variant="list"
        selectedTaskId={selectedTaskId}
        onSelectTask={onSelectTask}
      />
    </div>
  );
}
