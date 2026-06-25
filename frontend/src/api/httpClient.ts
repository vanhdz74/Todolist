import type { ApiResponse, HttpMethod } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8081";

interface RequestOptions<TBody> {
  method?: HttpMethod;
  body?: TBody;
  token?: string;
}

export const apiClient = {
  async request<TData, TBody = unknown>(
    path: string,
    options: RequestOptions<TBody> = {},
  ): Promise<ApiResponse<TData>> {
    const headers = new Headers({ "Content-Type": "application/json" });

    if (options.token) {
      headers.set("Authorization", `Bearer ${options.token}`);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const payload = (await response.json()) as ApiResponse<TData>;

    if (!response.ok) {
      throw payload;
    }

    return payload;
  },
};
