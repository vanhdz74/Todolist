import type { Task } from "../../types/task";

import "./TaskGrid.css";
import TaskSections from "./TaskSections";
import type { TaskSectionGroup } from "./TaskSections";

type Props = {
  data: Task[];
  loading: boolean;
  groups?: TaskSectionGroup[];
  selectedTaskId?: number;
  onSelectTask: (task: Task) => void;
};

export default function TaskGrid({
  data,
  loading,
  groups,
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

      <div className="task-table__body">
        <TaskSections
          data={data}
          loading={loading}
          variant="grid"
          groups={groups}
          selectedTaskId={selectedTaskId}
          onSelectTask={onSelectTask}
        />
      </div>
    </div>
  );
}
