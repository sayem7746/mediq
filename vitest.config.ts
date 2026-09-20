import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    exclude: ["e2e/**", "node_modules/**"],
    env: {
      NODE_ENV: "test",
      DATABASE_PATH: ":memory:",
      SESSION_SECRET: "test-session-secret-min-32-chars!",
      STAFF_BOOTSTRAP_EMAIL: "staff@example.com",
      STAFF_BOOTSTRAP_PASSWORD: "test-bootstrap-password",
      ANALYTICS_ENABLED: "false",
      GENERAL_LAUNCH_ENABLED: "false",
      TEST_FIXTURES: "1",
    },
  },
});
