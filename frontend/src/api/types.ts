export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
