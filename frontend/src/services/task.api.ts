import { api } from "./axios";

import type {
  CreateTaskRequest,
  CreateTaskCategoryLinkRequest,
  CreateTaskResponse,
  CreateTaskStepRequest,
  GetTasksRequest,
  GetTasksResponse,
  TaskAttachment,
  TaskCategory,
  TaskCategoryLink,
  TaskStep,
  UpdateTaskStepRequest,
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

  getById(id: number) {
    return api.get<UpdateTaskResponse>(`/tasks/${id}`);
  },

  getSteps(params?: Partial<TaskStep>) {
    return api.get<TaskStep[]>("/taskSteps", {
      params,
    });
  },

  createStep(data: CreateTaskStepRequest) {
    return api.post<TaskStep>("/taskSteps", data);
  },

  updateStep(id: number, data: UpdateTaskStepRequest) {
    return api.patch<TaskStep>(`/taskSteps/${id}`, data);
  },

  removeStep(id: number) {
    return api.delete<void>(`/taskSteps/${id}`);
  },

  getCategories() {
    return api.get<TaskCategory[]>("/categories");
  },

  getTaskCategories(params?: Partial<TaskCategoryLink>) {
    return api.get<TaskCategoryLink[]>("/taskCategories", {
      params,
    });
  },

  createTaskCategory(data: CreateTaskCategoryLinkRequest) {
    return api.post<TaskCategoryLink>("/taskCategories", data);
  },

  removeTaskCategory(id: number) {
    return api.delete<void>(`/taskCategories/${id}`);
  },

  getAttachments(params?: Partial<TaskAttachment>) {
    return api.get<TaskAttachment[]>("/attachments", {
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
