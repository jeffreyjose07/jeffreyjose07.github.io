import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages specific configuration - root domain deployment
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  // Configure static file serving to handle blog routes
  publicDir: 'public',
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Build configuration for GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Copy public directory contents to dist
    copyPublicDir: true,
  }
}));