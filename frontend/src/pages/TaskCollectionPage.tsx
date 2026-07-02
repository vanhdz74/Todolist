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
  ShareAltOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  ConfigProvider,
  Dropdown,
  Input,
  Modal,
  message,
} from "antd";
import type { MenuProps } from "antd";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import AddTaskBox from "@/components/task/AddTaskBox/AddTaskBox";
import type { AddTaskOptions } from "@/components/task/AddTaskBox/addTaskTypes";
import {
  applyFilter,
  buildMenuItems,
  filterLabels,
  getDefaultSortBy,
  getDueDateGroup,
  getImportanceGroup,
  getReminderDate,
  getRepeatValue,
  getSortPreference,
  getStoredTasksPageThemeColor,
  groupLabels,
  setSortPreference,
  setStoredTasksPageThemeColor,
  sortIndicatorLabels,
  sortLabels,
  sortTasks,
  toIsoAtLocalTime,
} from "@/features/tasks";
import type { FilterKey, GroupInfo, GroupKey, SortKey } from "@/features/tasks";
import TaskDetailPanel from "@/components/task/TaskDetailPanel";
import TaskGrid from "@/components/task/TaskGrid";
import TaskList from "@/components/task/TaskList";
import TaskSearchResults from "@/components/task/TaskSearchResults";
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
import { selectSearchQuery } from "@/redux/ui/uiSelector";
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
import { listShareApi } from "@/services/list.api";
import type { ListShareOwner, ListShareResponse } from "@/types/list";

import "./TaskCollectionPage.css";

type Props = {
  list: TodoListConfig;
};

// css chung cho list item
const listOptionsMenuClassName = `
  [&_.ant-dropdown-menu-item]:!h-9
  [&_.ant-dropdown-menu-submenu-title]:!h-9

  [&_.ant-dropdown-menu-item]:!items-center
  [&_.ant-dropdown-menu-submenu-title]:!items-center

  [&_.ant-dropdown-menu-item-icon]:!m-0
  [&_.ant-dropdown-menu-item-icon]:!w-4
  [&_.ant-dropdown-menu-item-icon]:!min-w-4
  [&_.ant-dropdown-menu-item-icon]:!text-center

  [&_.ant-dropdown-menu-title-content]:!ml-3

  [&_.ant-dropdown-menu-submenu-expand-icon]:!ml-auto
`;

const getInitials = (value: string) => {
  return (
    value
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  );
};

const createFallbackInviteCode = () => {
  if (crypto.randomUUID) {
    return crypto.randomUUID().replaceAll("-", "").slice(0, 16);
  }

  return Math.random().toString(36).slice(2, 18);
};

export default function TaskCollectionPage({ list }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useUser();

  const tasks = useAppSelector((state) => selectTasksByList(state, list));
  const allTasks = useAppSelector(selectTasks);
  const selectedTask = useAppSelector(selectSelectedTask);
  const lists = useAppSelector(selectLists);
  const listGroups = useAppSelector(selectListGroups);
  const loading = useAppSelector(selectLoading);
  const loaded = useAppSelector(selectLoaded);
  const searchQuery = useAppSelector(selectSearchQuery);

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
  const [selectedTaskListKey, setSelectedTaskListKey] = useState<
    TodoListConfig["key"] | null
  >(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(list.title);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareData, setShareData] = useState<ListShareResponse | null>(null);
  const [tasksPageThemeColor, setTasksPageThemeColor] = useState(
    getStoredTasksPageThemeColor,
  );

  const listNameById = useMemo(() => {
    return new Map(lists.map((item) => [item.id, item.name]));
  }, [lists]);
  const currentShareOwner = useMemo<ListShareOwner>(() => {
    const email = user?.primaryEmailAddress?.emailAddress ?? "";
    const name = user?.fullName || email || "You";

    return {
      id: user?.id ?? CURRENT_USER_ID,
      name,
      email,
      initials: getInitials(name),
    };
  }, [user]);
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
        assignedTo: list.key === "assigned" ? CURRENT_USER_ID : undefined,
        listId: listId ?? undefined,
        userId: CURRENT_USER_ID,
        createdAt: now,
        updatedAt: now,
      }),
    );
  };

  const handleSelectTask = (task: Task) => {
    setSuggestionsOpen(false);
    setSelectedTaskId(task.id);
    setSelectedTaskListKey(list.key);
    dispatch(selectTask(task));
    dispatch(getTaskDetailRequest(task.id));
  };

  const handleOpenSuggestions = () => {
    setSelectedTaskId(null);
    setSelectedTaskListKey(null);
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
          groupId: groupId ?? undefined,
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

  const changeTasksPageTheme = (theme: ListThemeKey) => {
    setTasksPageThemeColor(setStoredTasksPageThemeColor(theme));
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

  const openShareDialog = async () => {
    if (!currentList) return;

    setShareOpen(true);
    setShareLoading(true);
    setShareData(null);

    try {
      const response = await listShareApi.getOrCreate(currentList.id, {
        origin: window.location.origin,
        owner: currentShareOwner,
      });

      setShareData(response.data);
    } catch {
      const now = new Date().toISOString();
      const code = createFallbackInviteCode();

      setShareData({
        id: -currentList.id,
        listId: currentList.id,
        code,
        inviteUrl: `${window.location.origin}/tasks/sharing?invite=${code}`,
        createdBy: CURRENT_USER_ID,
        createdAt: now,
        updatedAt: now,
        owner: currentShareOwner,
      });
      message.warning("Using a local invite link because the API is unavailable");
    } finally {
      setShareLoading(false);
    }
  };

  const copyShareLink = async () => {
    if (!shareData) return;

    try {
      await navigator.clipboard.writeText(shareData.inviteUrl);
      message.success("Invite link copied");
    } catch {
      message.error("Could not copy invite link");
    }
  };

  const inviteViaEmail = () => {
    if (!shareData || !currentList) return;

    const subject = encodeURIComponent(`Join my list: ${currentList.name}`);
    const body = encodeURIComponent(
      `Use this invite link to join and edit "${currentList.name}":\n\n${shareData.inviteUrl}`,
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
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
  const isTasksPage = list.key === "tasks";
  const isThemeablePage = list.group === "custom" || isTasksPage;
  const listThemeColor = currentList?.color ?? DEFAULT_LIST_COLOR;
  const pageThemeColor = isTasksPage ? tasksPageThemeColor : listThemeColor;
  const selectedListTheme = getListThemeKeyByColor(pageThemeColor);
  const themeMenuItems = (Object.keys(listThemes) as ListThemeKey[]).map(
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
      onClick: () =>
        isTasksPage ? changeTasksPageTheme(theme) : changeListTheme(theme),
    }),
  );
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
          children: themeMenuItems,
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
  const taskPageOptionsItems: MenuProps["items"] = [
    {
      key: "heading",
      label: <span className="list-options-menu__heading">Task options</span>,
      disabled: true,
    },
    { type: "divider" },
    {
      key: "theme",
      icon: <BgColorsOutlined />,
      label: "Change theme",
      children: themeMenuItems,
    },
    {
      key: "print",
      icon: <PrinterOutlined />,
      label: "Print list",
      onClick: () => window.print(),
    },
  ];

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
  const hideCommandActions = ["planned", "assigned"].includes(list.key);
  const showSortAction = !hideCommandActions;
  const showGroupAction = !hideCommandActions && list.key !== "important";
  const showFilterAction =
    !hideCommandActions && !["my-day", "important"].includes(list.key);
  const pageAccentStyle = isThemeablePage
    ? ({
        "--primary": pageThemeColor,
        "--primary-hover": pageThemeColor,
      } as React.CSSProperties)
    : undefined;
  const pageAntTheme = useMemo(
    () => ({
      token: {
        colorPrimary: pageThemeColor,
        colorPrimaryActive: pageThemeColor,
        colorPrimaryHover: pageThemeColor,
        colorWhite: "#ffffff",
      },
    }),
    [pageThemeColor],
  );
  const titleActions =
    currentList && list.group === "custom" ? (
      <Dropdown
        menu={{
          items: listOptionsItems,
          className: listOptionsMenuClassName,
        }}
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
    ) : isTasksPage ? (
      <Dropdown
        menu={{ items: taskPageOptionsItems }}
        trigger={["click"]}
        overlayClassName="list-options-menu"
      >
        <Button
          type="text"
          className="list-options-trigger"
          aria-label="Open task options"
          icon={<MoreOutlined />}
        />
      </Dropdown>
    ) : undefined;
  const activeSelectedTaskId =
    selectedTaskListKey === list.key ? selectedTaskId : null;
  const activeSelectedTask =
    selectedTaskListKey === list.key ? selectedTask : null;
  const trimmedSearchQuery = searchQuery.trim();
  const isSearching = trimmedSearchQuery.length > 0;

  return (
    <ConfigProvider theme={pageAntTheme}>
      <div
        className="task-collection-page flex h-full min-h-0 flex-col overflow-hidden"
        style={pageAccentStyle}
      >
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <main className="flex min-w-0 flex-1 flex-col overflow-hidden px-6 pt-1">
            {isSearching ? (
              <TaskSearchResults
                query={trimmedSearchQuery}
                tasks={allTasks}
                listNameById={listNameById}
                loading={loading}
                selectedTaskId={activeSelectedTaskId ?? undefined}
                onSelectTask={handleSelectTask}
              />
            ) : (
              <>
                <PageHeader
                  icon={list.icon}
                  iconClassName={isThemeablePage ? "" : list.accentClassName}
                  iconStyle={
                    isThemeablePage ? { color: pageThemeColor } : undefined
                  }
                  titleStyle={
                    isThemeablePage ? { color: pageThemeColor } : undefined
                  }
                  title={list.title}
                  subtitle={list.subtitle}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  titleActions={titleActions}
                  actions={
                    <>
                      {showSortAction && (
                        <Dropdown menu={sortMenu} trigger={["click"]}>
                          <Button
                            type="text"
                            className="task-command-button"
                            icon={<SwapOutlined />}
                          >
                            Sort
                          </Button>
                        </Dropdown>
                      )}

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

                      {currentList && list.group === "custom" && (
                        <Button
                          type="text"
                          icon={<ShareAltOutlined />}
                          onClick={openShareDialog}
                          className="task-command-button"
                        >
                          Share
                        </Button>
                      )}
                    </>
                  }
                />

                {showSortAction && sortIndicatorVisible && (
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
              </>
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

            <Modal
              title="Share list"
              open={shareOpen}
              footer={null}
              width={352}
              destroyOnHidden
              className="share-list-modal"
              onCancel={() => setShareOpen(false)}
            >
              <div className="share-list-modal__content">
                <div className="share-list-modal__section-title">
                  List members
                </div>

                <div className="share-list-modal__member">
                  <Avatar className="share-list-modal__avatar">
                    {(shareData?.owner ?? currentShareOwner).initials}
                  </Avatar>

                  <div className="share-list-modal__member-name">
                    {(shareData?.owner ?? currentShareOwner).name}
                  </div>

                  <div className="share-list-modal__role">Owner</div>
                </div>

                <Input
                  readOnly
                  value={shareData?.inviteUrl ?? ""}
                  placeholder={shareLoading ? "Creating invite link..." : ""}
                  className="share-list-modal__link"
                />

                <div className="share-list-modal__actions">
                  <Button
                    type="primary"
                    disabled={!shareData}
                    loading={shareLoading}
                    onClick={inviteViaEmail}
                  >
                    Invite via email
                  </Button>

                  <Button disabled={!shareData} onClick={copyShareLink}>
                    Copy link
                  </Button>
                </div>

                <p className="share-list-modal__hint">
                  Anyone with this link and an account can join and edit this
                  list.
                </p>

                <Button type="link" className="share-list-modal__manage">
                  Manage access
                </Button>
              </div>
            </Modal>

            {!isSearching && (
              <>
                <div className="shrink-0">
                  <AddTaskBox onAdd={handleAddTask} />
                </div>

                <div className="min-h-0 flex-1 overflow-hidden pb-6">
                  {viewMode === "grid" ? (
                    <TaskGrid
                      data={visibleTasks}
                      loading={loading}
                      groups={taskGroups}
                      selectedTaskId={activeSelectedTaskId ?? undefined}
                      onSelectTask={handleSelectTask}
                    />
                  ) : (
                    <TaskList
                      data={visibleTasks}
                      loading={loading}
                      groups={taskGroups}
                      selectedTaskId={activeSelectedTaskId ?? undefined}
                      onSelectTask={handleSelectTask}
                    />
                  )}
                </div>
              </>
            )}
          </main>

          <TaskDetailPanel
            task={activeSelectedTask}
            onClose={() => {
              setSelectedTaskId(null);
              setSelectedTaskListKey(null);
              dispatch(selectTask(null));
            }}
          />

          <TaskSuggestionsPanel
            open={!isSearching && list.key === "my-day" && suggestionsOpen}
            tasks={allTasks}
            lists={lists}
            onClose={() => setSuggestionsOpen(false)}
            onSelectTask={handleSelectTask}
            onAddToMyDay={handleAddSuggestionToMyDay}
          />
        </div>
      </div>
    </ConfigProvider>
  );
}
