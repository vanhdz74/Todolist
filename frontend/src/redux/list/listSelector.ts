import type { RootState } from "@/app/store";
import type { TodoList } from "@/types/list";

export const selectLists = (state: RootState) => state.list.lists;
export const selectListGroups = (state: RootState) => state.list.groups;
export const selectSelectedList = (state: RootState) => state.list.selectedList;
export const selectListLoading = (state: RootState) => state.list.loading;
export const selectListGroupLoading = (state: RootState) =>
  state.list.groupLoading;
export const selectListLoaded = (state: RootState) => state.list.loaded;
export const selectListGroupsLoaded = (state: RootState) =>
  state.list.groupsLoaded;
export const selectListError = (state: RootState) => state.list.error;

export const selectListsByGroupId = (state: RootState) => {
  return state.list.lists.reduce<Record<string, TodoList[]>>(
    (result, list) => {
      const key = String(list.groupId ?? "ungrouped");

      result[key] = [...(result[key] ?? []), list].sort(
        (first, second) => first.position - second.position,
      );

      return result;
    },
    {},
  );
};
