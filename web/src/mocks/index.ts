import type { MockRoute } from "../dev/mock-api";
import { workspaceRoutes } from "./workspace";

/**
 * All mock API routes collected in priority order.
 * Add new route groups here as the app grows.
 */
export const routes: MockRoute[] = [
  ...workspaceRoutes,
  // ...authRoutes,
  // ...llmRoutes,
];
