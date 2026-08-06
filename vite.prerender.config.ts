import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { buildConstants } from "./vite.build-constants";

/**
 * Build-time-only bundle for the prerender harness (see prerender.html and
 * src/entry-prerender.tsx). Output goes to dist-prerender/ and is never
 * deployed — scripts/prerender.js loads it in a headless browser to obtain
 * React's own HTML serialization for the homepage.
 *
 * `publicDir` is false because the harness is served alongside dist/, which
 * already contains public/.
 */
export default defineConfig({
  base: "/",
  publicDir: false,
  plugins: [react()],
  // Must match vite.config.ts — see vite.build-constants.ts.
  define: buildConstants,
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
  build: {
    outDir: "dist-prerender",
    assetsDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      input: { prerender: path.resolve(import.meta.dirname, "prerender.html") },
    },
  },
});
