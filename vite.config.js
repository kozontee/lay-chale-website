import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// LAY CHALÉ — React + Vite
// Use Vite's default base path (/) for deployment at the domain root.
// React Router fallback for /reservation must be configured on the hosting service.
export default defineConfig({
  plugins: [react()],
});