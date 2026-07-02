import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { HTMLAttributes, ReactNode } from "react";

import type { TodoListGroup } from "@/types/list";

import { getGroupDragId } from "./dndIds";

type Props = {
  children: (dragHandleProps: DragHandleProps) => ReactNode;
  group: TodoListGroup;
};

export type DragHandleProps = HTMLAttributes<HTMLElement> & {
  ref: (element: HTMLElement | null) => void;
};

export default function SortableGroupItem({ children, group }: Props) {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: getGroupDragId(group.id),
    data: {
      groupId: group.id,
      type: "group-sort",
    },
  });

  const dragHandleProps = {
    ref: setActivatorNodeRef,
    ...attributes,
    ...listeners,
  } as DragHandleProps;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={isDragging ? "relative z-10 opacity-85" : ""}
    >
      {children(dragHandleProps)}
    </div>
  );
}
