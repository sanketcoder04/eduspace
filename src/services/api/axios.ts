// src/services/api/axios.ts
import axios from "axios";
import { ENV } from "@/config/env";
import { tokenService } from "@/features/auth/services/token.service";
import { authEvents } from "@/features/auth/services/authEvents";
import { API_ENDPOINTS } from "./endpoints";

const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const flushQueue = (error: unknown, token: string | null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH)) {
      // the refresh call itself failed — don't loop
      tokenService.removeAccessToken();
      tokenService.removeRefreshToken();
      authEvents.emit(null);
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = tokenService.getRefreshToken();
      const { data } = await api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });

      tokenService.setAccessToken(data.data.accessToken);
      tokenService.setRefreshToken(data.data.refreshToken);
      authEvents.emit(data.data.accessToken);

      flushQueue(null, data.data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      tokenService.removeAccessToken();
      tokenService.removeRefreshToken();
      authEvents.emit(null);
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
