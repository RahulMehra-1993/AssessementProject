import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Load environment variables from `.env` files
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      port: 5000, // Development port
      proxy: {
        "/api": {
          target: env.VITE_API_URL ? env.VITE_API_URL : "http://localhost:4000",
          changeOrigin: true,
          secure: false,
        },
      }, // Development proxy
    },
    define: {
      "process.env": {
        // Use environment variables depending on the mode
        REACT_APP_API_URL: env.VITE_API_URL || "https://production-api.com",
      },
    },
    build: {
      outDir: "dist", // Build folder for production
      minify: mode === "production", // Minify only in production
    },
  };
});
