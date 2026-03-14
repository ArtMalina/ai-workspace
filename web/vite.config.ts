import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { mockApiPlugin } from "./src/dev/mock-api";
import { routes } from "./src/mocks";

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    // Intercepts /api/* requests in dev and returns mock JSON.
    // Unmatched routes fall through to the proxy below.
    mockApiPlugin({ routes }),
  ],
  server: {
    proxy: {
      // Real backend fallback — only reached if no mock is registered
      "/api": {
        target: "http://localhost:3000",
      },
    },
  },
});
