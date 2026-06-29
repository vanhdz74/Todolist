import { Navigate, useParams } from "react-router-dom";

import { getTodoListByKey, type TodoListKey } from "@/constants/todoLists";

import TaskCollectionPage from "./TaskCollectionPage";

const customListKeys: TodoListKey[] = ["personal", "work"];

export const CustomListPage = () => {
  const { listKey } = useParams();

  if (!listKey || !customListKeys.includes(listKey as TodoListKey)) {
    return <Navigate to="/tasks" replace />;
  }

  const list = getTodoListByKey(listKey as TodoListKey);

  return list ? <TaskCollectionPage list={list} /> : null;
};
