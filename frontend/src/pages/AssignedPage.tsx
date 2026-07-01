import { getTodoListByKey } from "@/constants/todoLists";

import TaskCollectionPage from "./TaskCollectionPage";

export const AssignedPage = () => {
  const list = getTodoListByKey("assigned");

  return list ? <TaskCollectionPage key={list.key} list={list} /> : null;
};
