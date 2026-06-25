import { apiClient } from "../../api";
import type { AuthTokens, LoginRequest } from "./authTypes";

export const authApi = {
  login(payload: LoginRequest) {
    return apiClient.request<AuthTokens, LoginRequest>("/login", {
      method: "POST",
      body: payload,
    });
  },
};
