import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Project page served from https://didi6135.github.io/forum-demo/
  base: "/forum-demo/",
  plugins: [react()],
  server: {
    port: 5180,
    open: true,
  },
});
