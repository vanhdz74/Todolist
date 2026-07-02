import {
  AppstoreAddOutlined,
  BgColorsOutlined,
  BulbOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FilterOutlined,
  FolderOpenOutlined,
  MoreOutlined,
  PrinterOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Input, Modal } from "antd";
import type { MenuProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import AddTaskBox from "@/components/task/AddTaskBox/AddTaskBox";
import type { AddTaskOptions } from "@/components/task/AddTaskBox/addTaskTypes";
import TaskDetailPanel from "@/components/task/TaskDetailPanel";
import TaskGrid from "@/components/task/TaskGrid";
import TaskList from "@/components/task/TaskList";
import TaskSuggestionsPanel from "@/components/task/TaskSuggestionsPanel";
import type { TaskSectionGroup } from "@/components/task/TaskSections";
import {
  DEFAULT_LIST_COLOR,
  getListThemeKeyByColor,
  listThemes,
} from "@/constants/listThemes";
import type { ListThemeKey } from "@/constants/listThemes";
import type { TodoListConfig, ViewMode } from "@/constants/todoLists";
import { CURRENT_USER_ID } from "@/constants/user";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectListGroups, selectLists } from "@/redux/list/listSelector";
import { removeListRequest, updateListRequest } from "@/redux/list/listSlice";
import {
  selectLoaded,
  selectLoading,
  selectSelectedTask,
  selectTasks,
  selectTasksByList,
} from "@/redux/task/taskSelector";
import {
  createTaskRequest,
  getTaskDetailRequest,
  getTasksRequest,
  selectTask,
  updateTaskRequest,
} from "@/redux/task/taskSlice";
import type { Task } from "@/types/task";

import "./TaskCollectionPage.css";

type Props = {
  list: TodoListConfig;
};

type SortKey = "importance" | "dueDate" | "alphabetical" | "createdAt";
type GroupKey = "none" | "dueDate" | "importance" | "list";
type FilterKey =
  | "all"
  | "active"
  | "completed"
  | "important"
  | "planned"
  | "assigned"
  | "myDay"
  | "reminder"
  | "repeating";

type GroupInfo = {
  key: string;
  title: string;
  order: number;
};

const sortLabels: Record<SortKey, string> = {
  importance: "Importance",
  dueDate: "Due date",
  alphabetical: "Alphabetically",
  createdAt: "Creation date",
};

const sortIndicatorLabels: Record<SortKey, string> = {
  importance: "importance",
  dueDate: "due date",
  alphabetical: "alphabetically",
  createdAt: "creation date",
};

const getDefaultSortBy = (list: TodoListConfig): SortKey => {
  return list.key === "planned" ? "dueDate" : "createdAt";
};

type SortPreference = {
  sortBy: SortKey;
  indicatorVisible: boolean;
};

const sortPreferences = new Map<TodoListConfig["key"], SortPreference>();

const getSortPreference = (list: TodoListConfig): SortPreference => {
  return (
    sortPreferences.get(list.key) ?? {
      sortBy: getDefaultSortBy(list),
      indicatorVisible: false,
    }
  );
};

const setSortPreference = (
  list: TodoListConfig,
  preference: SortPreference,
) => {
  sortPreferences.set(list.key, preference);
};

const groupLabels: Record<GroupKey, string> = {
  none: "None",
  dueDate: "Due date",
  importance: "Importance",
  list: "List",
};

const filterLabels: Record<FilterKey, string> = {
  all: "All tasks",
  active: "Active",
  completed: "Completed",
  important: "Important",
  planned: "Planned",
  assigned: "Assigned to me",
  myDay: "My Day",
  reminder: "Has reminder",
  repeating: "Repeating",
};

const priorityOrder: Record<Task["priority"], number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
};

const parseDate = (value?: string | null) => {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const startOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);

  return result;
};

const isSameDay = (first: Date, second: Date) => {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
};

const toIsoAtLocalTime = (
  dateValue: string | null | undefined,
  hours: number,
  minutes = 0,
) => {
  if (!dateValue) return null;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

  date.setHours(hours, minutes, 0, 0);

  return date.toISOString();
};

const getReminderDate = (value: string | null | undefined) => {
  if (!value) return null;

  const today = startOfDay(new Date());

  if (value === "later-today") {
    const reminderDate = new Date(today);
    reminderDate.setHours(18, 0, 0, 0);

    return reminderDate.toISOString();
  }

  if (value === "tomorrow-morning") {
    const reminderDate = new Date(today);
    reminderDate.setDate(reminderDate.getDate() + 1);
    reminderDate.setHours(9, 0, 0, 0);

    return reminderDate.toISOString();
  }

  if (value === "next-week") {
    const reminderDate = new Date(today);
    reminderDate.setDate(reminderDate.getDate() + 7);
    reminderDate.setHours(9, 0, 0, 0);

    return reminderDate.toISOString();
  }

  const customReminderDate = new Date(value.replace(" ", "T"));

  return Number.isNaN(customReminderDate.getTime())
    ? null
    : customReminderDate.toISOString();
};

const getRepeatValue = (value: string | null | undefined): Task["repeat"] => {
  if (!value) return "NONE";

  if (value.startsWith("every-")) {
    return value.toUpperCase().replaceAll("-", "_");
  }

  const repeatMap: Record<string, Task["repeat"]> = {
    daily: "DAILY",
    weekdays: "WEEKDAYS",
    weekly: "WEEKLY",
    monthly: "MONTHLY",
  };

  return repeatMap[value] ?? "NONE";
};

const compareCreatedDesc = (first: Task, second: Task) => {
  return (
    (parseDate(second.createdAt)?.getTime() ?? 0) -
    (parseDate(first.createdAt)?.getTime() ?? 0)
  );
};

const applyFilter = (task: Task, filterBy: FilterKey) => {
  switch (filterBy) {
    case "active":
      return !task.completed;
    case "completed":
      return task.completed;
    case "important":
      return task.priority === "HIGH";
    case "planned":
      return Boolean(task.dueDate);
    case "assigned":
      return task.assignedTo === CURRENT_USER_ID;
    case "myDay":
      return task.myDay;
    case "reminder":
      return Boolean(task.reminderDate);
    case "repeating":
      return task.repeat !== "NONE";
    case "all":
    default:
      return true;
  }
};

const sortTasks = (tasks: Task[], sortBy: SortKey) => {
  return [...tasks].sort((first, second) => {
    switch (sortBy) {
      case "importance": {
        const priorityDiff =
          priorityOrder[first.priority] - priorityOrder[second.priority];

        return priorityDiff || compareCreatedDesc(first, second);
      }

      case "dueDate": {
        const firstDate =
          parseDate(first.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const secondDate =
          parseDate(second.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;

        return firstDate - secondDate || compareCreatedDesc(first, second);
      }

      case "alphabetical":
        return (
          first.title.localeCompare(second.title, undefined, {
            sensitivity: "base",
          }) || compareCreatedDesc(first, second)
        );

      case "createdAt":
      default:
        return compareCreatedDesc(first, second);
    }
  });
};

const getDueDateGroup = (task: Task): GroupInfo => {
  const dueDate = parseDate(task.dueDate);

  if (!dueDate) {
    return { key: "no-date", title: "No date", order: 4 };
  }

  const today = startOfDay(new Date());
  const taskDay = startOfDay(dueDate);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (taskDay < today) return { key: "earlier", title: "Earlier", order: 0 };
  if (isSameDay(taskDay, today)) {
    return { key: "today", title: "Today", order: 1 };
  }
  if (isSameDay(taskDay, tomorrow)) {
    return { key: "tomorrow", title: "Tomorrow", order: 2 };
  }

  return { key: "later", title: "Later", order: 3 };
};

const getImportanceGroup = (task: Task): GroupInfo => {
  const labels: Record<Task["priority"], string> = {
    HIGH: "Important",
    MEDIUM: "Medium",
    LOW: "Not important",
  };

  return {
    key: task.priority,
    title: labels[task.priority],
    order: priorityOrder[task.priority],
  };
};

const buildMenuItems = <Key extends string>(
  labels: Record<Key, string>,
  selectedKey: Key,
) => {
  return (Object.keys(labels) as Key[]).map((key) => ({
    key,
    label: (
      <span className="task-command-menu__item">
        <span>{labels[key]}</span>
        {selectedKey === key && <CheckOutlined />}
      </span>
    ),
  }));
};

export default function TaskCollectionPage({ list }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const tasks = useAppSelector((state) => selectTasksByList(state, list));
  const allTasks = useAppSelector(selectTasks);
  const selectedTask = useAppSelector(selectSelectedTask);
  const lists = useAppSelector(selectLists);
  const listGroups = useAppSelector(selectListGroups);
  const loading = useAppSelector(selectLoading);
  const loaded = useAppSelector(selectLoaded);

  const [viewMode, setViewMode] = useState<ViewMode>(list.defaultView);
  const [sortBy, setSortBy] = useState<SortKey>(
    () => getSortPreference(list).sortBy,
  );
  const [sortIndicatorVisible, setSortIndicatorVisible] = useState(
    () => getSortPreference(list).indicatorVisible,
  );
  const [groupBy, setGroupBy] = useState<GroupKey>(() => {
    if (list.key === "planned") return "dueDate";
    if (list.key === "assigned") return "list";

    return "none";
  });
  const [filterBy, setFilterBy] = useState<FilterKey>("all");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(list.title);

  const listNameById = useMemo(() => {
    return new Map(lists.map((item) => [item.id, item.name]));
  }, [lists]);
  const customListId =
    list.group === "custom" ? Number(list.key.replace("list-", "")) : null;
  const currentList =
    customListId === null
      ? null
      : (lists.find((item) => item.id === customListId) ?? null);
  const sortedListGroups = useMemo(
    () =>
      [...listGroups].sort((first, second) => first.position - second.position),
    [listGroups],
  );

  // Lấy task 1 lần
  useEffect(() => {
    if (!loaded) {
      dispatch(getTasksRequest({ userId: CURRENT_USER_ID }));
    }
  }, [dispatch, loaded]);

  const visibleTasks = useMemo(() => {
    return sortTasks(
      tasks.filter((task) => applyFilter(task, filterBy)),
      sortBy,
    );
  }, [filterBy, sortBy, tasks]);

  const taskGroups = useMemo<TaskSectionGroup[] | undefined>(() => {
    if (groupBy === "none") return undefined;

    const groups = new Map<string, TaskSectionGroup & { order: number }>();

    visibleTasks
      .filter((task) => !task.completed)
      .forEach((task) => {
        let group: GroupInfo;

        if (groupBy === "dueDate") {
          group = getDueDateGroup(task);
        } else if (groupBy === "importance") {
          group = getImportanceGroup(task);
        } else {
          const title = task.listId
            ? (listNameById.get(task.listId) ?? `List ${task.listId}`)
            : "Tasks";

          group = {
            key: String(task.listId ?? "tasks"),
            title,
            order: task.listId ?? Number.MAX_SAFE_INTEGER,
          };
        }

        const current = groups.get(group.key);

        if (current) {
          current.tasks.push(task);
          return;
        }

        groups.set(group.key, {
          key: group.key,
          title: group.title,
          tasks: [task],
          order: group.order,
        });
      });

    return Array.from(groups.values())
      .sort(
        (first, second) =>
          first.order - second.order || first.title.localeCompare(second.title),
      )
      .map(({ order, ...group }) => {
        void order;

        return group;
      });
  }, [groupBy, listNameById, visibleTasks]);

  // Xử lý thêm task
  const handleAddTask = (title: string, options?: AddTaskOptions) => {
    const now = new Date().toISOString();
    const listId =
      list.group === "custom" ? Number(list.key.replace("list-", "")) : null;

    dispatch(
      createTaskRequest({
        title,
        description: "",
        completed: false,
        priority: "LOW",
        myDay: list.key === "my-day",
        dueDate: toIsoAtLocalTime(options?.dueDate, 23, 59),
        reminderDate: getReminderDate(options?.reminder),
        repeat: getRepeatValue(options?.repeat),
        assignedTo: list.key === "assigned" ? CURRENT_USER_ID : null,
        listId,
        userId: CURRENT_USER_ID,
        createdAt: now,
        updatedAt: now,
      }),
    );
  };

  const handleSelectTask = (task: Task) => {
    setSuggestionsOpen(false);
    setSelectedTaskId(task.id);
    dispatch(selectTask(task));
    dispatch(getTaskDetailRequest(task.id));
  };

  const handleOpenSuggestions = () => {
    setSelectedTaskId(null);
    setSuggestionsOpen((current) => !current);
  };

  const handleAddSuggestionToMyDay = (task: Task) => {
    dispatch(
      updateTaskRequest({
        id: task.id,
        data: {
          myDay: true,
          updatedAt: new Date().toISOString(),
        },
      }),
    );
  };

  const handleRenameList = () => {
    if (!currentList) return;

    const nextName = renameValue.trim();
    if (!nextName || nextName === currentList.name) {
      setRenameOpen(false);
      setRenameValue(currentList.name);
      return;
    }

    dispatch(
      updateListRequest({
        id: currentList.id,
        data: {
          name: nextName,
          updatedAt: new Date().toISOString(),
        },
      }),
    );
    setRenameOpen(false);
  };

  const moveListToGroup = (groupId: number | null) => {
    if (!currentList) return;

    const targetLists = lists.filter(
      (item) => item.groupId === groupId && item.id !== currentList.id,
    );

    dispatch(
      updateListRequest({
        id: currentList.id,
        data: {
          groupId,
          position: targetLists.length + 1,
          updatedAt: new Date().toISOString(),
        },
      }),
    );
  };

  const changeListTheme = (theme: ListThemeKey) => {
    if (!currentList) return;

    dispatch(
      updateListRequest({
        id: currentList.id,
        data: {
          color: listThemes[theme].color,
          updatedAt: new Date().toISOString(),
        },
      }),
    );
  };

  const handleDeleteList = () => {
    if (!currentList) return;

    Modal.confirm({
      title: `Delete "${currentList.name}"?`,
      content: "Tasks in this list will remain in Tasks.",
      okText: "Delete list",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => {
        dispatch(removeListRequest(currentList.id));
        navigate("/tasks");
      },
    });
  };

  const sortMenuItems = useMemo(
    () => buildMenuItems(sortLabels, sortBy),
    [sortBy],
  );
  const groupMenuItems = useMemo(
    () => buildMenuItems(groupLabels, groupBy),
    [groupBy],
  );
  const filterMenuItems = useMemo(
    () => buildMenuItems(filterLabels, filterBy),
    [filterBy],
  );
  const listThemeColor = currentList?.color ?? DEFAULT_LIST_COLOR;
  const selectedListTheme = getListThemeKeyByColor(listThemeColor);
  const moveGroupItems: NonNullable<MenuProps["items"]> = currentList
    ? [
        {
          key: "move-none",
          label: "No group",
          onClick: () => moveListToGroup(null),
        },
        ...sortedListGroups.map((group) => ({
          key: `move-${group.id}`,
          label: group.name,
          onClick: () => moveListToGroup(group.id),
        })),
      ]
    : [];

  const listOptionsItems: MenuProps["items"] = currentList
    ? [
        {
          key: "heading",
          label: (
            <span className="list-options-menu__heading">List options</span>
          ),
          disabled: true,
        },
        { type: "divider" },
        {
          key: "rename",
          icon: <EditOutlined />,
          label: "Rename list",
          onClick: () => {
            setRenameValue(currentList.name);
            setRenameOpen(true);
          },
        },
        {
          key: "theme",
          icon: <BgColorsOutlined />,
          label: "Change theme",
          children: (Object.keys(listThemes) as ListThemeKey[]).map(
            (theme) => ({
              key: `theme-${theme}`,
              label: (
                <span className="list-options-menu__theme">
                  <span
                    className="list-options-menu__swatch"
                    style={{ backgroundColor: listThemes[theme].color }}
                  />
                  {listThemes[theme].label}
                  {selectedListTheme === theme && <CheckOutlined />}
                </span>
              ),
              onClick: () => changeListTheme(theme),
            }),
          ),
        },
        {
          key: "move",
          icon: <FolderOpenOutlined />,
          label: "Move list to...",
          children: moveGroupItems,
        },
        {
          key: "print",
          icon: <PrinterOutlined />,
          label: "Print list",
          onClick: () => window.print(),
        },
        { type: "divider" },
        {
          key: "delete",
          danger: true,
          icon: <DeleteOutlined />,
          label: "Delete list",
          onClick: handleDeleteList,
        },
      ]
    : [];

  const sortMenu: MenuProps = {
    items: sortMenuItems,
    onClick: ({ key }) => {
      const nextSortBy = key as SortKey;

      setSortBy(nextSortBy);
      setSortIndicatorVisible(true);
      setSortPreference(list, {
        sortBy: nextSortBy,
        indicatorVisible: true,
      });
    },
    selectedKeys: [sortBy],
    selectable: true,
  };
  const groupMenu: MenuProps = {
    items: groupMenuItems,
    onClick: ({ key }) => setGroupBy(key as GroupKey),
    selectedKeys: [groupBy],
    selectable: true,
  };
  const filterMenu: MenuProps = {
    items: filterMenuItems,
    onClick: ({ key }) => setFilterBy(key as FilterKey),
    selectedKeys: [filterBy],
    selectable: true,
  };
  const showGroupAction = list.key !== "important";
  const showFilterAction = list.key !== "my-day" && list.key !== "important";
  const customListAccentStyle =
    list.group === "custom"
      ? ({
          "--primary": listThemeColor,
          "--primary-hover": listThemeColor,
        } as React.CSSProperties)
      : undefined;
  const titleActions =
    currentList && list.group === "custom" ? (
      <Dropdown
        menu={{ items: listOptionsItems }}
        trigger={["click"]}
        overlayClassName="list-options-menu"
      >
        <Button
          type="text"
          className="list-options-trigger"
          aria-label="Open list options"
          icon={<MoreOutlined />}
        />
      </Dropdown>
    ) : undefined;

  return (
    <div
      className="task-collection-page flex h-full min-h-0 flex-col overflow-hidden"
      style={customListAccentStyle}
    >
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden px-6 pt-1">
          <PageHeader
            icon={list.icon}
            iconClassName={list.group === "custom" ? "" : list.accentClassName}
            iconStyle={
              list.group === "custom" ? { color: listThemeColor } : undefined
            }
            titleStyle={
              list.group === "custom" ? { color: listThemeColor } : undefined
            }
            title={list.title}
            subtitle={list.subtitle}
            viewMode={viewMode}
            setViewMode={setViewMode}
            titleActions={titleActions}
            actions={
              <>
                <Dropdown menu={sortMenu} trigger={["click"]}>
                  <Button
                    type="text"
                    className="task-command-button"
                    icon={<SwapOutlined />}
                  >
                    Sort
                  </Button>
                </Dropdown>

                {showGroupAction && (
                  <Dropdown menu={groupMenu} trigger={["click"]}>
                    <Button
                      type="text"
                      className="task-command-button"
                      icon={<AppstoreAddOutlined />}
                    >
                      Group
                    </Button>
                  </Dropdown>
                )}

                {showFilterAction && (
                  <Dropdown menu={filterMenu} trigger={["click"]}>
                    <Button
                      type="text"
                      icon={<FilterOutlined />}
                      className={[
                        "task-command-button",
                        filterBy !== "all" ? "is-filtered" : "",
                      ].join(" ")}
                    >
                      Filter
                    </Button>
                  </Dropdown>
                )}

                {list.key === "my-day" && (
                  <Button
                    type="text"
                    icon={<BulbOutlined />}
                    onClick={handleOpenSuggestions}
                    className={[
                      "task-command-button",
                      suggestionsOpen ? "is-filtered" : "",
                    ].join(" ")}
                  >
                    Suggestions
                  </Button>
                )}
              </>
            }
          />

          {sortIndicatorVisible && (
            <div className="task-sort-indicator" aria-live="polite">
              <DownOutlined className="task-sort-indicator__chevron" />
              <span>Sorted by {sortIndicatorLabels[sortBy]}</span>
              <Button
                type="text"
                size="small"
                aria-label="Clear sorting"
                icon={<CloseOutlined />}
                onClick={() => {
                  const defaultSortBy = getDefaultSortBy(list);

                  setSortBy(defaultSortBy);
                  setSortIndicatorVisible(false);
                  setSortPreference(list, {
                    sortBy: defaultSortBy,
                    indicatorVisible: false,
                  });
                }}
              />
            </div>
          )}

          <Modal
            title="Rename list"
            open={renameOpen}
            okText="Rename"
            destroyOnHidden
            onCancel={() => setRenameOpen(false)}
            onOk={handleRenameList}
          >
            <Input
              autoFocus
              value={renameValue}
              onChange={(event) => setRenameValue(event.target.value)}
              onPressEnter={handleRenameList}
            />
          </Modal>

          <div className="shrink-0">
            <AddTaskBox onAdd={handleAddTask} />
          </div>

          <div className="min-h-0 flex-1 overflow-hidden pb-6">
            {viewMode === "grid" ? (
              <TaskGrid
                data={visibleTasks}
                loading={loading}
                groups={taskGroups}
                selectedTaskId={selectedTaskId ?? undefined}
                onSelectTask={handleSelectTask}
              />
            ) : (
              <TaskList
                data={visibleTasks}
                loading={loading}
                groups={taskGroups}
                selectedTaskId={selectedTaskId ?? undefined}
                onSelectTask={handleSelectTask}
              />
            )}
          </div>
        </main>

        <TaskDetailPanel
          task={selectedTask}
          onClose={() => {
            setSelectedTaskId(null);
            dispatch(selectTask(null));
          }}
        />

        <TaskSuggestionsPanel
          open={list.key === "my-day" && suggestionsOpen}
          tasks={allTasks}
          lists={lists}
          onClose={() => setSuggestionsOpen(false)}
          onAddToMyDay={handleAddSuggestionToMyDay}
        />
      </div>
    </div>
  );
}
