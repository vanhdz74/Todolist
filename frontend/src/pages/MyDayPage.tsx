import { getTodoListByKey } from "@/constants/todoLists";

import TaskCollectionPage from "./TaskCollectionPage";

export const MyDayPage = () => {
  const list = getTodoListByKey("my-day");

  return list ? <TaskCollectionPage key={list.key} list={list} /> : null;
};
