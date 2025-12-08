import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/WatchList/",  // must match your repo name EXACTLY
  plugins: [react()],
});
