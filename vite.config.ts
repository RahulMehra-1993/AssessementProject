import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  console.log("VITE_API_URL from .env:", env.VITE_API_URL); // Debug log

  return {
    plugins: [react()],
    server: {
      port: 5000,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:5001",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
