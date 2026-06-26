export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export type GetTasksResponse = Task[];

export interface GetTasksRequest {
  completed?: boolean;
  priority?: string;
  userId?: number;
}

export interface CreateTaskRequest extends Omit<
  Task,
  "id" | "createdAt" | "updatedAt"
> {}

export type CreateTaskResponse = Task;

export type UpdateTaskRequest = Partial<CreateTaskRequest>;

export type UpdateTaskResponse = Task;
