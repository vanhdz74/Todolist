export const UNGROUPED_KEY = "ungrouped";

export const getGroupDropId = (groupId: number | null) =>
  `group-${groupId === null ? UNGROUPED_KEY : groupId}`;

export const getListDragId = (listId: number) => `list-${listId}`;

export const parseListDragId = (value: string) => {
  if (!value.startsWith("list-")) return null;

  const id = Number(value.replace("list-", ""));

  return Number.isNaN(id) ? null : id;
};

export const parseGroupDropId = (value: string) => {
  if (!value.startsWith("group-")) return null;

  const groupKey = value.replace("group-", "");

  if (groupKey === UNGROUPED_KEY) return null;

  const id = Number(groupKey);

  return Number.isNaN(id) ? null : id;
};
