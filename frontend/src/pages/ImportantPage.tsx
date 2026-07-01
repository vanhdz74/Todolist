import { getTodoListByKey } from "@/constants/todoLists";

import TaskCollectionPage from "./TaskCollectionPage";

export const ImportantPage = () => {
  const list = getTodoListByKey("important");

  return list ? <TaskCollectionPage key={list.key} list={list} /> : null;
};
