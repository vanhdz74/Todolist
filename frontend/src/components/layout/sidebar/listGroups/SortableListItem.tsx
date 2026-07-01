import { MenuOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { TodoList } from "@/types/list";

import { getListDragId } from "./dndIds";

type Props = {
  count: number;
  list: TodoList;
  nested?: boolean;
  onOpen: (list: TodoList) => void;
  selected: boolean;
};

export default function SortableListItem({
  count,
  list,
  nested = false,
  onOpen,
  selected,
}: Props) {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: getListDragId(list.id),
    data: {
      groupId: list.groupId,
      listId: list.id,
      type: "list",
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={["w-full px-4! py-0.5", isDragging ? "z-10" : ""].join(" ")}
    >
      <div
        className={[
          "group/list relative flex h-8 items-center rounded text-sm text-[var(--text-main)]",
          "hover:bg-[var(--bg-hover)]",
          selected ? "bg-[var(--bg-selected)] font-medium" : "",
          nested ? "pl-6 pr-2" : "pl-2 pr-2",
          isDragging ? "bg-[var(--bg-surface)] opacity-80 shadow-md" : "",
        ].join(" ")}
      >
        {selected && (
          <span className="absolute left-0 top-1 h-6 w-0.5 rounded-r bg-[var(--primary)]" />
        )}

        <button
          ref={setActivatorNodeRef}
          className="
            flex h-6 w-6 shrink-0 cursor-grab items-center justify-center rounded
            text-[var(--text-disabled)] opacity-0 transition-opacity
            hover:bg-[var(--bg-surface)] active:cursor-grabbing
            group-hover/list:opacity-100
            focus:opacity-100
          "
          type="button"
          aria-label={`Drag ${list.name}`}
          {...attributes}
          {...listeners}
        >
          <MenuOutlined className="text-xs" />
        </button>

        <button
          className="flex h-full min-w-0 flex-1 items-center gap-2 text-left"
          type="button"
          onClick={() => onOpen(list)}
        >
          <UnorderedListOutlined className="shrink-0 text-xs text-[var(--text-secondary)]" />

          <span className="min-w-0 flex-1 truncate text-[13px]">
            {list.name}
          </span>

          {count > 0 && (
            <span className="mr-5! shrink-0 text-[11px] font-normal text-[var(--text-disabled)]">
              {count}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
