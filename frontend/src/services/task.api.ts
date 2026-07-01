import { api } from "./axios";

import type {
  CreateTaskRequest,
  CreateTaskResponse,
  GetTasksRequest,
  GetTasksResponse,
  TaskAttachment,
  TaskCategory,
  TaskCategoryLink,
  TaskStep,
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

  getSteps() {
    return api.get<TaskStep[]>("/taskSteps");
  },

  getCategories() {
    return api.get<TaskCategory[]>("/categories");
  },

  getTaskCategories() {
    return api.get<TaskCategoryLink[]>("/taskCategories");
  },

  getAttachments() {
    return api.get<TaskAttachment[]>("/attachments");
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
