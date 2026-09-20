import { describe, expect, it } from "vitest";
import { parseEnv } from "./env";

describe("parseEnv", () => {
  const valid = {
    NODE_ENV: "development",
    DATABASE_PATH: "./data/mediq.sqlite",
    SESSION_SECRET: "x".repeat(32),
    STAFF_BOOTSTRAP_EMAIL: "staff@example.com",
    STAFF_BOOTSTRAP_PASSWORD: "password12",
    ANALYTICS_ENABLED: "false",
    GENERAL_LAUNCH_ENABLED: "false",
  };

  it("applies defaults", () => {
    const env = parseEnv({
      ...valid,
      DATABASE_PATH: undefined,
      ANALYTICS_ENABLED: undefined,
    });
    expect(env.DATABASE_PATH).toBe("./data/mediq.sqlite");
    expect(env.ANALYTICS_ENABLED).toBe(false);
  });

  it("throws on invalid production env", () => {
    expect(() =>
      parseEnv({
        ...valid,
        NODE_ENV: "production",
        SESSION_SECRET: "short",
      }),
    ).toThrow(/Invalid production environment/);
  });
});
