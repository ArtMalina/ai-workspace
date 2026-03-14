// ─── Error ────────────────────────────────────────────────────────────────────

/** Shape of the JSON error body our server (and mock) return on failure */
export interface ApiErrorBody {
  error: string;
  detail?: string;
  /** Machine-readable error code, e.g. "NOT_FOUND", "VALIDATION_ERROR" */
  code?: string;
}

/**
 * Normalised HTTP error thrown by every `api.*` method.
 * Replaces the raw `AxiosError` so callers never import axios directly.
 *
 * @example
 * try {
 *   await api.get("/workspace/chats/missing");
 * } catch (e) {
 *   if (e instanceof ApiError && e.isNotFound) { ... }
 * }
 */
export class ApiError extends Error {
  readonly name = "ApiError";

  constructor(
    /** HTTP status code. `0` = network/timeout error. */
    public readonly status: number,
    public readonly body: ApiErrorBody,
    /** Request URL that caused the error */
    public readonly url: string,
  ) {
    super(body.error || `HTTP ${status}`);
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
  get isUnauthorized(): boolean {
    return this.status === 401;
  }
  get isForbidden(): boolean {
    return this.status === 403;
  }
  get isConflict(): boolean {
    return this.status === 409;
  }
  get isServerError(): boolean {
    return this.status >= 500;
  }
  get isNetworkError(): boolean {
    return this.status === 0;
  }
}

// ─── Request config ───────────────────────────────────────────────────────────

/** Extra options accepted by every `api.*` method (on top of axios defaults) */
export interface RequestConfig {
  /** Query-string params, `undefined`/`null` values are omitted */
  params?: Record<string, string | number | boolean | null | undefined>;
  /** Additional headers merged with client defaults */
  headers?: Record<string, string>;
  /** AbortSignal for request cancellation */
  signal?: AbortSignal;
  /** Per-request timeout in ms (overrides client default) */
  timeout?: number;
}
