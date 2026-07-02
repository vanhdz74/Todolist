import { CheckOutlined, DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Empty, Skeleton } from "antd";
import type { MenuProps } from "antd";
import { useMemo, useState } from "react";

import {
  matchesTaskMainSearch,
  matchesTaskNoteSearch,
  sortTasks,
} from "@/features/tasks";
import type { Task } from "@/types/task";

import TaskItem from "./TaskItem";

type Props = {
  query: string;
  tasks: Task[];
  listNameById: Map<number, string>;
  loading: boolean;
  selectedTaskId?: number;
  onSelectTask: (task: Task) => void;
};

export default function TaskSearchResults({
  query,
  tasks,
  listNameById,
  loading,
  selectedTaskId,
  onSelectTask,
}: Props) {
  const [hideCompleted, setHideCompleted] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(true);
  const [notesOpen, setNotesOpen] = useState(true);

  const { taskResults, noteResults } = useMemo(() => {
    const candidates = hideCompleted
      ? tasks.filter((task) => !task.completed)
      : tasks;
    const sortedTasks = sortTasks(candidates, "createdAt");

    return {
      taskResults: sortedTasks.filter((task) =>
        matchesTaskMainSearch(
          task,
          query,
          task.listId ? listNameById.get(task.listId) : "Tasks",
        ),
      ),
      noteResults: sortedTasks.filter((task) =>
        matchesTaskNoteSearch(task, query),
      ),
    };
  }, [hideCompleted, listNameById, query, tasks]);

  const optionsMenu: MenuProps = {
    items: [
      {
        key: "hide-completed",
        label: (
          <span className="task-search-options__item">
            <span>Hide completed tasks</span>
            {hideCompleted && <CheckOutlined />}
          </span>
        ),
        onClick: () => setHideCompleted((current) => !current),
      },
    ],
  };

  const sections = [
    {
      key: "tasks",
      title: "Tasks",
      open: tasksOpen,
      setOpen: setTasksOpen,
      tasks: taskResults,
    },
    {
      key: "notes",
      title: "Notes",
      open: notesOpen,
      setOpen: setNotesOpen,
      tasks: noteResults,
    },
  ];

  return (
    <div className="task-search-page">
      <header className="task-search-page__header">
        <h2>Searching for &quot;{query}&quot;</h2>

        <Dropdown menu={optionsMenu} trigger={["click"]}>
          <Button type="text" className="task-search-page__options">
            Options
          </Button>
        </Dropdown>
      </header>

      <div className="task-search-page__body">
        {loading && tasks.length === 0 ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : taskResults.length === 0 && noteResults.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={`No results for "${query}"`}
            className="mt-12"
          />
        ) : (
          sections.map((section) => (
            <section className="task-search-section" key={section.key}>
              <button
                type="button"
                className="task-search-section__title"
                onClick={() => section.setOpen((current) => !current)}
              >
                <DownOutlined
                  className={section.open ? "" : "is-collapsed"}
                />
                <span>{section.title}</span>
                <span>{section.tasks.length}</span>
              </button>

              {section.open && (
                <div className="task-search-section__items">
                  {section.tasks.map((task) => (
                    <TaskItem
                      key={`${section.key}-${task.id}`}
                      task={task}
                      variant="list"
                      selected={task.id === selectedTaskId}
                      onSelect={onSelectTask}
                    />
                  ))}
                </div>
              )}
            </section>
          ))
        )}
      </div>
    </div>
  );
}
