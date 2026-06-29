import {
  AppstoreAddOutlined,
  BulbOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { useEffect, useMemo, useState } from "react";

import PageHeader from "@/components/common/PageHeader";
import AddTaskBox from "@/components/task/AddTaskBox";
import TaskDetailPanel from "@/components/task/TaskDetailPanel";
import TaskGrid from "@/components/task/TaskGrid";
import TaskList from "@/components/task/TaskList";
import type { TodoListConfig, ViewMode } from "@/constants/todoLists";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectLoading, selectTasks } from "@/redux/task/taskSelector";
import { getTasksRequest } from "@/redux/task/taskSlice";

type Props = {
  list: TodoListConfig;
};

export default function TaskCollectionPage({ list }: Props) {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const loading = useAppSelector(selectLoading);

  // grid | list
  const [viewMode, setViewMode] = useState<ViewMode>(list.defaultView);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // Lấy ds task
  useEffect(() => {
    if (tasks.length === 0) {
      dispatch(getTasksRequest());
    }
  }, [dispatch, tasks.length]);

  // Set view grid | list
  useEffect(() => {
    setViewMode(list.defaultView);
  }, [list.defaultView, list.key]);

  const filteredTasks = useMemo(
    () => tasks.filter((task) => list.filter(task)),
    [list, tasks],
  );

  const selectedTask = useMemo(() => {
    if (selectedTaskId === null) return null;

    return filteredTasks.find((task) => task.id === selectedTaskId) ?? null;
  }, [filteredTasks, selectedTaskId]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1 gap-6 overflow-hidden">
        <main className="flex min-w-0 flex-1 flex-col">
          {/* Header chung */}
          <PageHeader
            icon={list.icon}
            iconClassName={list.accentClassName}
            title={list.title}
            subtitle={list.subtitle}
            viewMode={viewMode}
            setViewMode={setViewMode}
            actions={
              <>
                <Button type="text" icon={<SwapOutlined />}>
                  Sort
                </Button>

                <Button type="text" icon={<AppstoreAddOutlined />}>
                  Group
                </Button>

                {list.key === "my-day" && (
                  <Button type="text" icon={<BulbOutlined />}>
                    Suggestions
                  </Button>
                )}
              </>
            }
          />

          {/* Phần khung add */}
          <AddTaskBox />

          {/* Tùy vào grid hay list */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {viewMode === "grid" ? (
              <TaskGrid
                data={filteredTasks}
                loading={loading}
                selectedTaskId={selectedTaskId}
                onSelectTask={(task) => setSelectedTaskId(task.id)}
              />
            ) : (
              <TaskList
                data={filteredTasks}
                loading={loading}
                selectedTaskId={selectedTaskId}
                onSelectTask={(task) => setSelectedTaskId(task.id)}
              />
            )}
          </div>
        </main>

        {/* Phần panel chi tiết của 1 task */}
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTaskId(null)}
        />
      </div>
    </div>
  );
}
