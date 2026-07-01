import {
  DownOutlined,
  FolderOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { TodoList } from "@/types/list";

import { getGroupDropId, getListDragId } from "./dndIds";
import SortableListItem from "./SortableListItem";

type Props = {
  collapsed?: boolean;
  counts: Record<number, number>;
  groupId: number | null;
  lists: TodoList[];
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
  lists,
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

  return (
    <section
      ref={setNodeRef}
      className={[
        "mx-2! rounded-sm",
        isOver ? "bg-[var(--bg-drop)] ring-1 ring-[var(--border-drop)]" : "",
      ].join(" ")}
    >
      {showHeader && (
        <button
          type="button"
          onClick={onToggle}
          className="
            flex h-10 w-full items-center gap-2 rounded-sm px-3! text-left text-sm
            font-medium text-[var(--text-main)] hover:bg-[var(--bg-hover)]
          "
        >
          <span className="flex h-5 w-5 items-center justify-center text-[10px] text-[var(--text-secondary)]">
            {collapsed ? <RightOutlined /> : <DownOutlined />}
          </span>
          <FolderOutlined className="shrink-0 text-[var(--text-secondary)]" />
          <span className="min-w-0 flex-1 truncate">{title}</span>
        </button>
      )}

      <div className={collapsed ? "min-h-1" : "min-h-2"}>
        <SortableContext
          items={lists.map((list) => getListDragId(list.id))}
          strategy={verticalListSortingStrategy}
        >
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
