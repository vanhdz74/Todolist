import axios from "axios";

type ClerkTokenGetter = () => Promise<string | null>;

let clerkTokenGetter: ClerkTokenGetter | null = null;

export const setClerkTokenGetter = (tokenGetter: ClerkTokenGetter | null) => {
  clerkTokenGetter = tokenGetter;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = clerkTokenGetter ? await clerkTokenGetter() : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);
