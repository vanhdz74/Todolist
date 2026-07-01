import { UnorderedListOutlined } from "@ant-design/icons";
import { Navigate, useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";

import TaskCollectionPage from "./TaskCollectionPage";

import type { TodoListConfig } from "@/constants/todoLists";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  selectListLoaded,
  selectListLoading,
  selectLists,
} from "@/redux/list/listSelector";
import { getListsRequest } from "@/redux/list/listSlice";

export const CustomListPage = () => {
  const { listId } = useParams();

  const dispatch = useAppDispatch();

  const lists = useAppSelector(selectLists);
  const loading = useAppSelector(selectListLoading);
  const loaded = useAppSelector(selectListLoaded);

  const numericListId = Number(listId);
  const isInvalidListId = !listId || Number.isNaN(numericListId);

  // Lấy list
  useEffect(() => {
    if (!loaded) {
      dispatch(getListsRequest({ userId: 1 }));
    }
  }, [dispatch, loaded]);

  const currentList = useMemo(() => {
    return lists.find((list) => list.id === numericListId) ?? null;
  }, [lists, numericListId]);

  const customListConfig = useMemo<TodoListConfig | null>(() => {
    if (!currentList) return null;

    return {
      key: `list-${currentList.id}`,
      path: `/lists/${currentList.id}`,
      title: currentList.name,
      subtitle: undefined,
      icon: <UnorderedListOutlined />,
      accentClassName: "text-[var(--text-secondary)]",
      defaultView: "list",
      group: "custom",

      // filter phụ, fetch chính nằm ở TaskCollectionPage
      filter: (task) => task.listId === currentList.id,
    };
  }, [currentList]);

  if (isInvalidListId) {
    return <Navigate to="/tasks" replace />;
  }

  if (loading || !loaded) {
    return null;
  }

  if (!customListConfig) {
    return <Navigate to="/tasks" replace />;
  }

  return (
    <TaskCollectionPage key={customListConfig.key} list={customListConfig} />
  );
};
