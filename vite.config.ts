import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages project URL: /TinsleyToolbox/ — use "/" locally so dev stays at /
const repoBase = "/TinsleyToolbox/";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.NODE_ENV === "production" ? repoBase : "/",
  server: {
    open: true,
    port: 5173,
  },
});
