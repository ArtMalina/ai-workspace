import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import type { MockApiPluginOptions, MockRoute } from "./types";
import { matchPath } from "./router";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readBody(req: IncomingMessage): Promise<unknown> {
  const method = req.method?.toUpperCase() ?? "GET";
  if (method === "GET" || method === "HEAD") return Promise.resolve(undefined);

  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk: Buffer) => (raw += chunk.toString()));
    req.on("end", () => {
      if (!raw) return resolve(undefined);
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve(raw);
      }
    });
  });
}

function sendJson(res: ServerResponse, payload: unknown, status: number) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
    "X-Mock-Api": "1",
  });
  res.end(body);
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

/**
 * Vite dev-server plugin that intercepts requests matching `basePath` and
 * returns mock JSON responses without touching the real backend.
 *
 * Unmatched routes are passed through to the next middleware (proxy, etc.).
 * If a handler returns `null` or `undefined` a `404` is sent automatically.
 *
 * @example
 * // vite.config.ts
 * import { mockApiPlugin } from "./src/dev/mock-api";
 * import { routes } from "./src/mocks";
 *
 * export default defineConfig({
 *   plugins: [sveltekit(), mockApiPlugin({ routes })],
 * });
 */
export function mockApiPlugin(options: MockApiPluginOptions): Plugin {
  const { routes, basePath = "/api", enabled = true } = options;

  return {
    name: "vite-plugin-mock-api",
    // Run before SvelteKit / proxy middlewares
    configureServer(server) {
      if (!enabled) return;

      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "/";

        // Only handle requests under basePath
        if (!url.startsWith(basePath)) return next();

        // Strip basePath + query string for route matching
        const pathname = url.slice(basePath.length).split("?")[0] || "/";
        const method = (req.method ?? "GET").toUpperCase();

        // Find the first matching route
        let matched: MockRoute | null = null;
        let params: Record<string, string> = {};

        for (const route of routes) {
          if (route.method !== "*" && route.method !== method) continue;
          const result = matchPath(route.path, pathname);
          if (result) {
            matched = route;
            params = result.params;
            break;
          }
        }

        // No mock registered for this path → fall through
        if (!matched) return next();

        try {
          if (matched.delay && matched.delay > 0) await sleep(matched.delay);

          const urlObj = new URL(url, "http://localhost");
          const body = await readBody(req);

          const data = await matched.handler({
            params,
            query: urlObj.searchParams,
            body,
            req,
          });

          // Returning null / undefined from a handler → 404
          if (data === null || data === undefined) {
            return sendJson(res, { error: "Not found" }, 404);
          }

          sendJson(res, data, matched.status ?? 200);
        } catch (err) {
          console.error("[mock-api]", `${method} ${basePath}${pathname}`, err);
          sendJson(res, { error: "Mock handler threw an exception", detail: String(err) }, 500);
        }
      });
    },
  };
}
