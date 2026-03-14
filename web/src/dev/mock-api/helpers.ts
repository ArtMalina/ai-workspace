import type { MockHandler, MockRoute } from "./types";

// ─── Route builder shorthands ─────────────────────────────────────────────────
//
// Usage:
//   get("/workspace/chats",       () => ({ data: CHATS }))
//   get("/workspace/chats/:id",   ({ params }) => CHATS.find(c => c.id === params.id))
//   post("/workspace/chats",      ({ body }) => createChat(body), { delay: 200 })

type RouteOptions = Partial<Pick<MockRoute, "status" | "delay">>;

export function get(path: string, handler: MockHandler, opts?: RouteOptions): MockRoute {
  return { method: "GET", path, handler, ...opts };
}

export function post(path: string, handler: MockHandler, opts?: RouteOptions): MockRoute {
  return { method: "POST", path, handler, status: 201, ...opts };
}

export function put(path: string, handler: MockHandler, opts?: RouteOptions): MockRoute {
  return { method: "PUT", path, handler, ...opts };
}

export function patch(path: string, handler: MockHandler, opts?: RouteOptions): MockRoute {
  return { method: "PATCH", path, handler, ...opts };
}

export function del(path: string, handler: MockHandler, opts?: RouteOptions): MockRoute {
  return { method: "DELETE", path, handler, status: 204, ...opts };
}

/**
 * Convenience wrapper — groups route definitions and makes them easy to
 * split across multiple files.
 *
 * @example
 * export const chatRoutes = defineRoutes([
 *   get("/workspace/chats", () => ({ data: CHATS })),
 *   get("/workspace/chats/:id", ({ params }) => CHATS.find(c => c.id === params.id)),
 * ]);
 */
export function defineRoutes(routes: MockRoute[]): MockRoute[] {
  return routes;
}
