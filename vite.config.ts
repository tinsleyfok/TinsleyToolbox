import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages project site: https://<user>.github.io/<repo>/ — base must match repo name.
const repoBase = "/TinsleyToolbox/";

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  base: command === "build" ? repoBase : "/",
  /** Dev URL is fixed: http://localhost:5188/ — avoids 5173, which is often taken by other Vite apps. */
  server: {
    open: true,
    host: "localhost",
    port: 5188,
    strictPort: true,
    /** Avoid stale HTML/CSS in embedded browsers during dev */
    headers: {
      "Cache-Control": "no-store",
    },
  },
  preview: {
    host: "localhost",
    port: 4173,
    strictPort: true,
  },
}));
