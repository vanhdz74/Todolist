import type { Task } from "../../types/task";

import TaskSections from "./TaskSections";
import type { TaskSectionGroup } from "./TaskSections";

type Props = {
  data: Task[];
  loading: boolean;
  groups?: TaskSectionGroup[];
  selectedTaskId?: number;
  emptyDescription?: React.ReactNode;
  onSelectTask: (task: Task) => void;
};

export default function TaskList({
  data,
  loading,
  groups,
  selectedTaskId,
  emptyDescription,
  onSelectTask,
}: Props) {
  return (
    <div className="h-full min-h-0 overflow-y-auto pb-3">
      <TaskSections
        data={data}
        loading={loading}
        variant="list"
        groups={groups}
        selectedTaskId={selectedTaskId}
        emptyDescription={emptyDescription}
        onSelectTask={onSelectTask}
      />
    </div>
  );
}
