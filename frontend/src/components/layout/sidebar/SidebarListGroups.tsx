import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  EditOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  PlusOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, Input, Modal } from "antd";
import type { MenuProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { DEFAULT_LIST_COLOR } from "@/constants/listThemes";
import { CURRENT_USER_ID } from "@/constants/user";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  selectListGroupLoading,
  selectListGroups,
  selectListGroupsLoaded,
  selectListLoaded,
  selectListLoading,
  selectLists,
  selectListsByGroupId,
} from "@/redux/list/listSelector";
import {
  createListGroupRequest,
  createListRequest,
  getListGroupsRequest,
  getListsRequest,
  removeListGroupRequest,
  updateListGroupRequest,
  updateListRequest,
} from "@/redux/list/listSlice";
import { selectSearchQuery } from "@/redux/ui/uiSelector";
import { clearSearchQuery } from "@/redux/ui/uiSlice";
import type { TodoList, TodoListGroup } from "@/types/list";

import CreateListDraft from "./listGroups/CreateListDraft";
import {
  UNGROUPED_KEY,
  getGroupDragId,
  parseGroupDropId,
  parseGroupDragId,
  parseListDragId,
} from "./listGroups/dndIds";
import DroppableGroup from "./listGroups/DroppableGroup";
import SortableGroupItem from "./listGroups/SortableGroupItem";
import type { DraftMode } from "./listGroups/types";

type Props = {
  counts: Record<number, number>;
};

export default function SidebarListGroups({ counts }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsedGroupIds, setCollapsedGroupIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [draftMode, setDraftMode] = useState<DraftMode | null>(null);
  const [draftName, setDraftName] = useState("");
  const [renamingGroup, setRenamingGroup] = useState<TodoListGroup | null>(
    null,
  );
  const [renamingGroupName, setRenamingGroupName] = useState("");

  const lists = useAppSelector(selectLists);
  const groups = useAppSelector(selectListGroups);
  const listsByGroupId = useAppSelector(selectListsByGroupId);
  const listLoaded = useAppSelector(selectListLoaded);
  const listLoading = useAppSelector(selectListLoading);
  const groupLoaded = useAppSelector(selectListGroupsLoaded);
  const groupLoading = useAppSelector(selectListGroupLoading);
  const searchQuery = useAppSelector(selectSearchQuery);
  const isSearching = searchQuery.trim().length > 0;
  const selectedPath = isSearching ? "" : location.pathname;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
  );

  useEffect(() => {
    if (!listLoaded && !listLoading) {
      dispatch(getListsRequest({ userId: CURRENT_USER_ID }));
    }
  }, [dispatch, listLoaded, listLoading]);

  useEffect(() => {
    if (!groupLoaded && !groupLoading) {
      dispatch(getListGroupsRequest({ userId: CURRENT_USER_ID }));
    }
  }, [dispatch, groupLoaded, groupLoading]);

  const orderedGroups = useMemo(
    () => [...groups].sort((first, second) => first.position - second.position),
    [groups],
  );

  const ungroupedLists = listsByGroupId[UNGROUPED_KEY] ?? [];

  const beginRenameGroup = (group: TodoListGroup) => {
    setRenamingGroup(group);
    setRenamingGroupName(group.name);
  };

  const cancelRenameGroup = () => {
    setRenamingGroup(null);
    setRenamingGroupName("");
  };

  const submitRenameGroup = () => {
    if (!renamingGroup) return;

    const nextName = renamingGroupName.trim();

    if (!nextName || nextName === renamingGroup.name) {
      cancelRenameGroup();
      return;
    }

    dispatch(
      updateListGroupRequest({
        id: renamingGroup.id,
        data: {
          name: nextName,
          updatedAt: new Date().toISOString(),
        },
      }),
    );
    cancelRenameGroup();
  };

  const beginDraft = (mode: DraftMode) => {
    setDraftMode(mode);
    setDraftName("");
  };

  const cancelDraft = () => {
    setDraftMode(null);
    setDraftName("");
  };

  const submitDraft = () => {
    const value = draftName.trim();
    const now = new Date().toISOString();

    if (!value || !draftMode) {
      cancelDraft();
      return;
    }

    if (draftMode === "list") {
      dispatch(
        createListRequest({
          name: value,
          color: DEFAULT_LIST_COLOR,
          groupId: undefined,
          position: ungroupedLists.length + 1,
          userId: CURRENT_USER_ID,
          createdAt: now,
          updatedAt: now,
        }),
      );
    }

    if (draftMode === "group") {
      dispatch(
        createListGroupRequest({
          name: value,
          position: orderedGroups.length + 1,
          userId: CURRENT_USER_ID,
          createdAt: now,
          updatedAt: now,
        }),
      );
    }

    cancelDraft();
  };

  const toggleGroup = (groupId: number) => {
    setCollapsedGroupIds((current) => {
      const next = new Set(current);

      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }

      return next;
    });
  };

  const updateListPositions = (
    groupId: number | null | undefined,
    orderedLists: TodoList[],
  ) => {
    const now = new Date().toISOString();
    const normalizedGroupId = groupId ?? null;

    orderedLists.forEach((list, index) => {
      const nextPosition = index + 1;

      if (
        (list.groupId ?? null) === normalizedGroupId &&
        list.position === nextPosition
      ) {
        return;
      }

      dispatch(
        updateListRequest({
          id: list.id,
          data: {
            groupId: groupId ?? undefined,
            position: nextPosition,
            updatedAt: now,
          },
        }),
      );
    });
  };

  const updateGroupPositions = (nextGroups: TodoListGroup[]) => {
    const now = new Date().toISOString();

    nextGroups.forEach((group, index) => {
      const nextPosition = index + 1;

      if (group.position === nextPosition) return;

      dispatch(
        updateListGroupRequest({
          id: group.id,
          data: {
            position: nextPosition,
            updatedAt: now,
          },
        }),
      );
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeGroupId = parseGroupDragId(String(active.id));

    if (activeGroupId !== null) {
      reorderGroup(activeGroupId, String(over.id));
      return;
    }

    const activeListId = parseListDragId(String(active.id));
    if (activeListId === null) return;

    const activeList = lists.find((list) => list.id === activeListId);
    if (!activeList) return;

    const overListId = parseListDragId(String(over.id));
    const overList =
      overListId === null
        ? null
        : (lists.find((list) => list.id === overListId) ?? null);
    const overId = String(over.id);
    const destinationGroupId =
      overList?.groupId ?? parseGroupDragId(overId) ?? parseGroupDropId(overId);

    if (overList?.id === activeList.id) return;

    if (activeList.groupId === destinationGroupId && overList) {
      reorderWithinGroup(activeList, overList);
      return;
    }

    moveToGroup(activeList, overList, destinationGroupId);
  };

  const reorderGroup = (activeGroupId: number, overId: string) => {
    const overGroupId =
      parseGroupDragId(overId) ??
      parseGroupDropId(overId) ??
      (() => {
        const overListId = parseListDragId(overId);
        if (overListId === null) return null;

        return lists.find((list) => list.id === overListId)?.groupId ?? null;
      })();

    if (overGroupId === null || activeGroupId === overGroupId) return;

    const oldIndex = orderedGroups.findIndex(
      (group) => group.id === activeGroupId,
    );
    const newIndex = orderedGroups.findIndex((group) => group.id === overGroupId);

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    updateGroupPositions(arrayMove(orderedGroups, oldIndex, newIndex));
  };

  const reorderWithinGroup = (activeList: TodoList, overList: TodoList) => {
    const orderedLists = lists
      .filter((list) => list.groupId === activeList.groupId)
      .sort((first, second) => first.position - second.position);
    const oldIndex = orderedLists.findIndex(
      (list) => list.id === activeList.id,
    );
    const newIndex = orderedLists.findIndex((list) => list.id === overList.id);

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    updateListPositions(
      activeList.groupId,
      arrayMove(orderedLists, oldIndex, newIndex),
    );
  };

  const moveToGroup = (
    activeList: TodoList,
    overList: TodoList | null,
    destinationGroupId: number | null | undefined,
  ) => {
    const normalizedDestinationGroupId = destinationGroupId ?? null;
    const targetLists = lists
      .filter(
        (list) =>
          (list.groupId ?? null) === normalizedDestinationGroupId &&
          list.id !== activeList.id,
      )
      .sort((first, second) => first.position - second.position);
    const overIndex = overList
      ? targetLists.findIndex((list) => list.id === overList.id)
      : targetLists.length;
    const insertIndex = overIndex < 0 ? targetLists.length : overIndex;
    const nextTargetLists = [...targetLists];

    nextTargetLists.splice(insertIndex, 0, {
      ...activeList,
      groupId: normalizedDestinationGroupId,
    });

    updateListPositions(destinationGroupId, nextTargetLists);

    if ((activeList.groupId ?? null) !== normalizedDestinationGroupId) {
      const nextSourceLists = lists
        .filter(
          (list) =>
            (list.groupId ?? null) === (activeList.groupId ?? null) &&
            list.id !== activeList.id,
        )
        .sort((first, second) => first.position - second.position);

      updateListPositions(activeList.groupId, nextSourceLists);
    }
  };

  const moveGroup = (group: TodoListGroup, direction: "up" | "down") => {
    const currentIndex = orderedGroups.findIndex((item) => item.id === group.id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (
      currentIndex === -1 ||
      targetIndex < 0 ||
      targetIndex >= orderedGroups.length
    ) {
      return;
    }

    updateGroupPositions(arrayMove(orderedGroups, currentIndex, targetIndex));
  };

  const confirmUngroup = (group: TodoListGroup) => {
    Modal.confirm({
      title: `Ungroup "${group.name}"?`,
      content: "Lists inside this group will move back to Lists.",
      okText: "Ungroup",
      cancelText: "Cancel",
      onOk: () => {
        dispatch(removeListGroupRequest(group.id));
      },
    });
  };

  const getGroupContextMenu = (group: TodoListGroup): MenuProps => {
    const groupIndex = orderedGroups.findIndex((item) => item.id === group.id);

    return {
      items: [
        {
          key: "rename",
          icon: <EditOutlined />,
          label: "Rename group",
          onClick: () => beginRenameGroup(group),
        },
        {
          key: "move",
          icon: <SwapOutlined />,
          label: "Move group",
          children: [
            {
              key: "move-up",
              icon: <ArrowUpOutlined />,
              label: "Move up",
              disabled: groupIndex <= 0,
              onClick: () => moveGroup(group, "up"),
            },
            {
              key: "move-down",
              icon: <ArrowDownOutlined />,
              label: "Move down",
              disabled:
                groupIndex === -1 || groupIndex >= orderedGroups.length - 1,
              onClick: () => moveGroup(group, "down"),
            },
          ],
        },
        { type: "divider" },
        {
          key: "ungroup",
          icon: <FolderOpenOutlined />,
          label: "Ungroup",
          danger: true,
          onClick: () => confirmUngroup(group),
        },
      ],
    };
  };

  const openList = (list: TodoList) => {
    dispatch(clearSearchQuery());
    navigate(`/lists/${list.id}`);
  };

  return (
    <div className="mt-1! border-t border-(--border)">
      <DndContext
        collisionDetection={closestCenter}
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <div className="py-2!">
          <DroppableGroup
            groupId={null}
            title="Lists"
            lists={ungroupedLists}
            counts={counts}
            showHeader={false}
            selectedPath={selectedPath}
            onOpenList={openList}
          />

          <SortableContext
            items={orderedGroups.map((group) => getGroupDragId(group.id))}
            strategy={verticalListSortingStrategy}
          >
            {orderedGroups.map((group) => (
              <SortableGroupItem key={group.id} group={group}>
                {(groupDragHandleProps) => (
                  <DroppableGroup
                    groupId={group.id}
                    groupDragHandleProps={groupDragHandleProps}
                    title={group.name}
                    lists={listsByGroupId[String(group.id)] ?? []}
                    contextMenu={getGroupContextMenu(group)}
                    collapsed={collapsedGroupIds.has(group.id)}
                    counts={counts}
                    selectedPath={selectedPath}
                    onToggle={() => toggleGroup(group.id)}
                    onOpenList={openList}
                  />
                )}
              </SortableGroupItem>
            ))}
          </SortableContext>
        </div>
      </DndContext>

      <Modal
        title="Rename group"
        open={Boolean(renamingGroup)}
        okText="Rename"
        destroyOnHidden
        onCancel={cancelRenameGroup}
        onOk={submitRenameGroup}
      >
        <Input
          autoFocus
          value={renamingGroupName}
          onChange={(event) => setRenamingGroupName(event.target.value)}
          onPressEnter={submitRenameGroup}
        />
      </Modal>

      {draftMode && (
        <CreateListDraft
          draftMode={draftMode}
          draftName={draftName}
          onCancel={cancelDraft}
          onChange={setDraftName}
          onSubmit={submitDraft}
        />
      )}

      <div className="mt-1 flex items-center border-t border-[var(--border)] px-2! pt-1!">
        <Button
          type="text"
          icon={<PlusOutlined />}
          onClick={() => beginDraft("list")}
          className="h-10! flex-1 justify-start! rounded-sm! px-3! text-[var(--primary)]!"
        >
          New list
        </Button>

        <Button
          type="text"
          icon={<FolderOutlined />}
          onClick={() => beginDraft("group")}
          className="h-10! w-10! rounded-sm! text-[var(--text-secondary)]!"
          aria-label="New group"
        />
      </div>
    </div>
  );
}
