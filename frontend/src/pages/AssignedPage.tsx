import { getTodoListByKey } from "@/constants/todoLists";

import TaskCollectionPage from "./TaskCollectionPage";

export const AssignedPage = () => {
  const list = getTodoListByKey("assigned");

  return list ? <TaskCollectionPage list={list} /> : null;
};
