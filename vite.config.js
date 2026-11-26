import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, host: true },
  build: { outDir: "build" },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.js",
    css: false,
  },
});
