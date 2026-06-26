import { api } from "./axios";

import type {
  CreateTaskRequest,
  CreateTaskResponse,
  GetTasksRequest,
  GetTasksResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
} from "@/types/task";

// call API để lấy danh sách task, tạo mới, cập nhật và xóa task.
export const taskApi = {
  // Lấy danh sách task
  getAll(params?: GetTasksRequest) {
    return api.get<GetTasksResponse>("/tasks", {
      params,
    });
  },

  create(data: CreateTaskRequest) {
    return api.post<CreateTaskResponse>("/tasks", data);
  },

  update(id: number, data: UpdateTaskRequest) {
    return api.patch<UpdateTaskResponse>(`/tasks/${id}`, data);
  },

  remove(id: number) {
    return api.delete<void>(`/tasks/${id}`);
  },
};
