// Shared — API client and base request utilities
import { httpClient } from "./client";
import type { RequestConfig } from "./types";

// ─── Typed request helpers ────────────────────────────────────────────────────
//
// Every method resolves with `response.data` — i.e. the parsed JSON body —
// so the type parameter T should describe the full server response shape.
//
// Our mock server wraps payloads in `{ data: T }`, so for a list endpoint:
//
//   const res = await api.get<{ data: ChatShort[] }>("/workspace/chats");
//   const chats = res.data;
//
// For a more ergonomic pattern, define typed wrappers in the entity layer:
//
//   export async function fetchWorkspaceChats() {
//     const { data } = await api.get<{ data: ChatShort[] }>("/workspace/chats");
//     return data;
//   }

export const api = {
  /**
   * HTTP GET — fetches a resource.
   * @param url  Path relative to `baseURL` (e.g. `"/workspace/chats"`)
   */
  get<T>(url: string, config?: RequestConfig): Promise<T> {
    return httpClient.get<T>(url, config).then((r) => r.data);
  },

  /**
   * HTTP POST — creates a resource.
   * Returns the created resource; status defaults to 201.
   */
  post<T>(url: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return httpClient.post<T>(url, body, config).then((r) => r.data);
  },

  /**
   * HTTP PUT — fully replaces a resource.
   */
  put<T>(url: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return httpClient.put<T>(url, body, config).then((r) => r.data);
  },

  /**
   * HTTP PATCH — partially updates a resource.
   */
  patch<T>(url: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return httpClient.patch<T>(url, body, config).then((r) => r.data);
  },

  /**
   * HTTP DELETE — removes a resource.
   * Generic defaults to `void` since 204 responses have no body.
   */
  del<T = void>(url: string, config?: RequestConfig): Promise<T> {
    return httpClient.delete<T>(url, config).then((r) => r.data);
  },
} as const;

// ─── Re-exports ───────────────────────────────────────────────────────────────

export { httpClient } from "./client";
export { ApiError } from "./types";
export type { ApiErrorBody, RequestConfig } from "./types";
