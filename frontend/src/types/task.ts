export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH";
  myDay: boolean;
  dueDate: string | null;
  reminderDate: string | null;
  repeat: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";
  assignedTo: number | null;
  listId: number | null;
  createdAt: string;
  updatedAt: string;
  userId: number;
  steps?: TaskStep[];
  categories?: TaskCategory[];
  attachments?: TaskAttachment[];
}

export interface TaskStep {
  id: number;
  taskId: number;
  title: string;
  completed: boolean;
  order: number;
}

export interface TaskCategory {
  id: number;
  name: string;
  color: string;
  userId: number;
}

export interface TaskCategoryLink {
  id: number;
  taskId: number;
  categoryId: number;
}

export interface TaskAttachment {
  id: number;
  taskId: number;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
}

export type GetTasksResponse = Task[];

export interface GetTasksRequest {
  completed?: boolean;
  priority?: string;
  userId?: number;
  myDay?: boolean;
  listId?: number;
  assignedTo?: number;
}

export type CreateTaskRequest = Omit<Task, "id">;

export type CreateTaskResponse = Task;

export type UpdateTaskRequest = Partial<CreateTaskRequest>;

export type UpdateTaskResponse = Task;
