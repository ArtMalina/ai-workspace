import axios from "axios";
import { ApiError, type ApiErrorBody } from "./types";

// ─── Instance ─────────────────────────────────────────────────────────────────

/**
 * Shared axios instance.
 * Base URL defaults to `/api` which is intercepted by `vite-plugin-mock-api`
 * in dev and forwarded to the real backend in production.
 *
 * Override at startup:
 *   httpClient.defaults.baseURL = import.meta.env.PUBLIC_API_BASE_URL;
 */
export const httpClient = axios.create({
  baseURL: "/api",
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Request interceptor — auth token injection ───────────────────────────────

httpClient.interceptors.request.use((config) => {
  // Skip in SSR (localStorage is browser-only)
  if (typeof localStorage === "undefined") return config;

  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor — error normalisation ───────────────────────────────

httpClient.interceptors.response.use(
  // Pass successful responses through unchanged
  (response) => response,

  (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      // Unexpected non-Axios error — rethrow as-is
      throw error;
    }

    const url = error.config?.url ?? "";

    // Server responded with a non-2xx status
    if (error.response) {
      const { status, data } = error.response;
      const body: ApiErrorBody =
        data && typeof data === "object" && "error" in data
          ? (data as ApiErrorBody)
          : { error: String(data ?? `HTTP ${status}`) };
      throw new ApiError(status, body, url);
    }

    // Request timed out
    if (error.code === "ECONNABORTED") {
      throw new ApiError(408, { error: "Request timeout" }, url);
    }

    // No response at all (network down, CORS blocked, etc.)
    throw new ApiError(0, { error: "Network error" }, url);
  },
);
