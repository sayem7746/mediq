import { defineConfig, devices } from "@playwright/test";

const testEnv = {
  NODE_ENV: "development",
  DATABASE_PATH: "./data/mediq.e2e.sqlite",
  SESSION_SECRET: "test-session-secret-min-32-chars!",
  STAFF_BOOTSTRAP_EMAIL: "staff@example.com",
  STAFF_BOOTSTRAP_PASSWORD: "test-bootstrap-password",
  ANALYTICS_ENABLED: "false",
  GENERAL_LAUNCH_ENABLED: "false",
  TEST_FIXTURES: "1",
};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "android-320",
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 320, height: 720 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: testEnv,
  },
});
