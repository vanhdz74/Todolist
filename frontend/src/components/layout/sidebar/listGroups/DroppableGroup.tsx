import { DownOutlined } from "@ant-design/icons";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";

import type { TodoList } from "@/types/list";

import { getGroupDropId, getListDragId } from "./dndIds";
import SortableListItem from "./SortableListItem";
import type { DragHandleProps } from "./SortableGroupItem";

type Props = {
  collapsed?: boolean;
  counts: Record<number, number>;
  groupId: number | null;
  groupDragHandleProps?: DragHandleProps;
  lists: TodoList[];
  contextMenu?: MenuProps;
  onOpenList: (list: TodoList) => void;
  onToggle?: () => void;
  selectedPath: string;
  showHeader?: boolean;
  title: string;
};

export default function DroppableGroup({
  collapsed = false,
  counts,
  groupId,
  groupDragHandleProps,
  lists,
  contextMenu,
  onOpenList,
  onToggle,
  selectedPath,
  showHeader = true,
  title,
}: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: getGroupDropId(groupId),
    data: {
      groupId,
      type: "group",
    },
  });

  const { ref: groupDragRef, ...dragHandleProps } = groupDragHandleProps ?? {};

  const headerButton = (
    <button
      {...dragHandleProps}
      ref={groupDragRef}
      type="button"
      onClick={onToggle}
      className="
        flex h-9 w-full cursor-grab items-center gap-2 rounded-sm px-3! text-left text-sm
        font-semibold text-[var(--text-main)] hover:bg-[var(--sidebar-hover)] active:cursor-grabbing
      "
    >
      <span className="min-w-0 flex-1 truncate">{title}</span>
      <DownOutlined
        className={[
          "shrink-0 text-[11px] text-[var(--text-secondary)] transition-transform",
          collapsed ? "-rotate-90" : "",
        ].join(" ")}
      />
    </button>
  );

  return (
    <section
      ref={setNodeRef}
      className={[
        "mx-2! rounded-sm",
        isOver ? "bg-[var(--bg-drop)] ring-1 ring-[var(--border-drop)]" : "",
      ].join(" ")}
    >
      {showHeader && (
        contextMenu ? (
          <Dropdown menu={contextMenu} trigger={["contextMenu"]}>
            {headerButton}
          </Dropdown>
        ) : (
          headerButton
        )
      )}

      <div
        className={[
          collapsed ? "min-h-1" : "min-h-2",
          showHeader && !collapsed
            ? "ml-3! border-l border-[var(--border-strong)] pl-3!"
            : "",
        ].join(" ")}
      >
        <SortableContext
          items={lists.map((list) => getListDragId(list.id))}
          strategy={verticalListSortingStrategy}
        >
          {!collapsed && lists.length === 0 && showHeader && (
            <div className="flex h-10 items-center justify-center text-[13px] text-[var(--text-secondary)]">
              Drag here to add lists
            </div>
          )}

          {!collapsed &&
            lists.map((list) => (
              <SortableListItem
                key={list.id}
                count={counts[list.id] ?? 0}
                list={list}
                nested={showHeader}
                onOpen={onOpenList}
                selected={selectedPath === `/lists/${list.id}`}
              />
            ))}
        </SortableContext>
      </div>
    </section>
  );
}
