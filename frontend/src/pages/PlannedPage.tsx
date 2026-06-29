import { getTodoListByKey } from "@/constants/todoLists";

import TaskCollectionPage from "./TaskCollectionPage";

export const PlannedPage = () => {
  const list = getTodoListByKey("planned");

  return list ? <TaskCollectionPage list={list} /> : null;
};
