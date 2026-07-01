import { getTodoListByKey } from "@/constants/todoLists";

import TaskCollectionPage from "./TaskCollectionPage";

export const PlannedPage = () => {
  const list = getTodoListByKey("planned");

  return list ? <TaskCollectionPage key={list.key} list={list} /> : null;
};
