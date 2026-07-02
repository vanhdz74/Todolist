import { MenuOutlined } from "@ant-design/icons";
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
        {...attributes}
        {...listeners}
        className={[
          "group/list relative flex h-8 cursor-grab items-center rounded-sm text-sm text-[var(--text-main)] active:cursor-grabbing",
          "hover:bg-[var(--sidebar-hover)]",
          selected ? "bg-[var(--sidebar-selected)] font-semibold" : "",
          nested ? "pl-6! pr-2!" : "pl-2! pr-2!",
          isDragging ? "bg-[var(--bg-surface)] opacity-80 shadow-md" : "",
        ].join(" ")}
      >
        {selected && (
          <span className="absolute left-0 top-0 h-full w-0.5 rounded-r bg-[var(--primary)]" />
        )}

        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--text-secondary)]"
          aria-hidden="true"
        >
          <MenuOutlined className="text-xs" />
        </span>

        <button
          className="flex h-full min-w-0 flex-1 items-center gap-2 text-left"
          type="button"
          onClick={() => onOpen(list)}
        >
          <span className="min-w-0 flex-1 truncate text-[13px]">
            {list.name}
          </span>

          {count > 0 && (
            <span className="shrink-0 text-[12px] font-normal text-[var(--text-main)]">
              {count}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
