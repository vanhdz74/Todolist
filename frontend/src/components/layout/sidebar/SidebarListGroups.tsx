import { FolderOutlined, PlusOutlined } from "@ant-design/icons";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Button } from "antd";
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
  updateListRequest,
} from "@/redux/list/listSlice";
import type { TodoList } from "@/types/list";

import CreateListDraft from "./listGroups/CreateListDraft";
import {
  UNGROUPED_KEY,
  parseGroupDropId,
  parseListDragId,
} from "./listGroups/dndIds";
import DroppableGroup from "./listGroups/DroppableGroup";
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

  const lists = useAppSelector(selectLists);
  const groups = useAppSelector(selectListGroups);
  const listsByGroupId = useAppSelector(selectListsByGroupId);
  const listLoaded = useAppSelector(selectListLoaded);
  const listLoading = useAppSelector(selectListLoading);
  const groupLoaded = useAppSelector(selectListGroupsLoaded);
  const groupLoading = useAppSelector(selectListGroupLoading);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
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
          groupId: null,
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
    groupId: number | null,
    orderedLists: TodoList[],
  ) => {
    const now = new Date().toISOString();

    orderedLists.forEach((list, index) => {
      const nextPosition = index + 1;

      if (list.groupId === groupId && list.position === nextPosition) return;

      dispatch(
        updateListRequest({
          id: list.id,
          data: {
            groupId,
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

    const activeListId = parseListDragId(String(active.id));
    if (activeListId === null) return;

    const activeList = lists.find((list) => list.id === activeListId);
    if (!activeList) return;

    const overListId = parseListDragId(String(over.id));
    const overList =
      overListId === null
        ? null
        : (lists.find((list) => list.id === overListId) ?? null);
    const destinationGroupId =
      overList?.groupId ?? parseGroupDropId(String(over.id));

    if (overList?.id === activeList.id) return;

    if (activeList.groupId === destinationGroupId && overList) {
      reorderWithinGroup(activeList, overList);
      return;
    }

    moveToGroup(activeList, overList, destinationGroupId);
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
    destinationGroupId: number | null,
  ) => {
    const targetLists = lists
      .filter(
        (list) =>
          list.groupId === destinationGroupId && list.id !== activeList.id,
      )
      .sort((first, second) => first.position - second.position);
    const overIndex = overList
      ? targetLists.findIndex((list) => list.id === overList.id)
      : targetLists.length;
    const insertIndex = overIndex < 0 ? targetLists.length : overIndex;
    const nextTargetLists = [...targetLists];

    nextTargetLists.splice(insertIndex, 0, {
      ...activeList,
      groupId: destinationGroupId,
    });

    updateListPositions(destinationGroupId, nextTargetLists);

    if (activeList.groupId !== destinationGroupId) {
      const nextSourceLists = lists
        .filter(
          (list) =>
            list.groupId === activeList.groupId && list.id !== activeList.id,
        )
        .sort((first, second) => first.position - second.position);

      updateListPositions(activeList.groupId, nextSourceLists);
    }
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
            selectedPath={location.pathname}
            onOpenList={(list) => navigate(`/lists/${list.id}`)}
          />

          {orderedGroups.map((group) => (
            <DroppableGroup
              key={group.id}
              groupId={group.id}
              title={group.name}
              lists={listsByGroupId[String(group.id)] ?? []}
              collapsed={collapsedGroupIds.has(group.id)}
              counts={counts}
              selectedPath={location.pathname}
              onToggle={() => toggleGroup(group.id)}
              onOpenList={(list) => navigate(`/lists/${list.id}`)}
            />
          ))}
        </div>
      </DndContext>

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
