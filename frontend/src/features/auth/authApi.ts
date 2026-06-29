import { api } from "@/services/axios";
import type { AuthTokens, LoginRequest } from "./authTypes";

export const authApi = {
  login(payload: LoginRequest) {
    return api.post<AuthTokens>("/login", payload);
  },
};
