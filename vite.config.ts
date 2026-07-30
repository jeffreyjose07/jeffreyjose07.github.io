import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const REACT_VENDOR = new Set(["react", "react-dom", "react-router", "react-router-dom"]);
const UI_VENDOR_PREFIXES = [
  "@radix-ui/react-toast",
  "@radix-ui/react-tooltip",
  "@radix-ui/react-avatar",
  "sonner",
];

function manualChunks(id: string): string | undefined {
  if (!id.includes("node_modules")) return undefined;

  const normalized = id.replace(/\\/g, "/");
  const match = normalized.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/);
  const pkg = match?.[1];
  if (!pkg) return undefined;

  if (REACT_VENDOR.has(pkg)) return "react-vendor";
  if (UI_VENDOR_PREFIXES.some((prefix) => pkg === prefix || pkg.startsWith(`${prefix}/`))) {
    return "ui-vendor";
  }
  return undefined;
}

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages specific configuration - root domain deployment
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  // Configure static file serving to handle blog routes
  publicDir: "public",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  // Build configuration for GitHub Pages
  build: {
    outDir: "dist",
    assetsDir: "assets",
    copyPublicDir: true,
    // Vite 8 uses Rolldown; object-form manualChunks is unsupported
    rolldownOptions: {
      output: {
        manualChunks,
      },
    },
  },
});
