import { defineConfig, loadEnv } from "vite";
import preact from "@preact/preset-vite";
import path from "path";

// https://vitejs.dev/config/

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };

  return defineConfig({
    plugins: [preact()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    preview: {
      port: process.env.DASHBOARD_PORT,
      host: process.env.DASHBOARD_HOST,
    },
  });
};
