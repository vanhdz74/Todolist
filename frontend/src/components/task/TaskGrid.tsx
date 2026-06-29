import type { Task } from "../../types/task";

import "./TaskGrid.css";
import TaskSections from "./TaskSections";

type Props = {
  data: Task[];
  loading: boolean;
  selectedTaskId?: number;
  onSelectTask: (task: Task) => void;
};

export default function TaskGrid({
  data,
  loading,
  selectedTaskId,
  onSelectTask,
}: Props) {
  return (
    <div className="task-table">
      <div className="task-table__header">
        <div />
        <div>Title</div>
        <div>Due date</div>
        <div>Importance</div>
        <div />
      </div>

      <TaskSections
        data={data}
        loading={loading}
        variant="grid"
        selectedTaskId={selectedTaskId}
        onSelectTask={onSelectTask}
      />
    </div>
  );
}
