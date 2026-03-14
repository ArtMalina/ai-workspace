import type { IncomingMessage } from "node:http";

// ─── Context passed to every handler ─────────────────────────────────────────

export interface MockContext {
  /** Path params extracted from the route pattern, e.g. `{ id: "abc" }` */
  params: Record<string, string>;
  /** Parsed query-string parameters */
  query: URLSearchParams;
  /** Parsed JSON body (POST/PUT/PATCH), `undefined` for body-less requests */
  body: unknown;
  /** Raw Node.js request object */
  req: IncomingMessage;
}

// ─── Route definition ─────────────────────────────────────────────────────────

export type MockMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "*";

export type MockHandler = (ctx: MockContext) => unknown | Promise<unknown>;

export interface MockRoute {
  method: MockMethod;
  /** Path relative to `basePath`, e.g. `"/workspace/chats/:id"` */
  path: string;
  handler: MockHandler;
  /** HTTP status for a successful response (default: `200`) */
  status?: number;
  /** Artificial latency in milliseconds — simulates network delay */
  delay?: number;
}

// ─── Plugin options ───────────────────────────────────────────────────────────

export interface MockApiPluginOptions {
  routes: MockRoute[];
  /**
   * URL prefix that activates mock interception.
   * Requests NOT starting with this prefix pass through to the real proxy.
   * Default: `"/api"`
   */
  basePath?: string;
  /**
   * Enable the plugin. When `false` all requests fall through.
   * Default: `true`
   */
  enabled?: boolean;
}
