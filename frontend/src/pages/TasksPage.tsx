import { getTodoListByKey } from "@/constants/todoLists";

import TaskCollectionPage from "./TaskCollectionPage";

export const TasksPage = () => {
  // Chọn key của sidebar
  const list = getTodoListByKey("tasks");

  // Lấy list tương ứng
  return list ? <TaskCollectionPage key={list.key} list={list} /> : null;
};
