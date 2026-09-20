import { z } from "zod";

const booleanFromEnv = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") return false;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes"].includes(normalized)) return true;
    if (["false", "0", "no"].includes(normalized)) return false;
  }
  return value;
}, z.boolean());

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_PATH: z.string().min(1).default("./data/mediq.sqlite"),
  SESSION_SECRET: z.string().min(32),
  STAFF_BOOTSTRAP_EMAIL: z.email(),
  STAFF_BOOTSTRAP_PASSWORD: z.string().min(8),
  ANALYTICS_ENABLED: booleanFromEnv.default(false),
  GENERAL_LAUNCH_ENABLED: booleanFromEnv.default(false),
  TEST_FIXTURES: z.string().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

let cached: AppEnv | undefined;

function readRawEnv() {
  return {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_PATH: process.env.DATABASE_PATH,
    SESSION_SECRET: process.env.SESSION_SECRET,
    STAFF_BOOTSTRAP_EMAIL: process.env.STAFF_BOOTSTRAP_EMAIL,
    STAFF_BOOTSTRAP_PASSWORD: process.env.STAFF_BOOTSTRAP_PASSWORD,
    ANALYTICS_ENABLED: process.env.ANALYTICS_ENABLED,
    GENERAL_LAUNCH_ENABLED: process.env.GENERAL_LAUNCH_ENABLED,
    TEST_FIXTURES: process.env.TEST_FIXTURES,
  };
}

export function parseEnv(
  input: Record<string, unknown> = readRawEnv(),
): AppEnv {
  const result = envSchema.safeParse(input);
  if (!result.success) {
    const nodeEnv =
      typeof input.NODE_ENV === "string"
        ? input.NODE_ENV
        : process.env.NODE_ENV;
    const message = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    if (nodeEnv === "production") {
      throw new Error(`Invalid production environment: ${message}`);
    }
    throw new Error(`Invalid environment: ${message}`);
  }
  return result.data;
}

export function getEnv(): AppEnv {
  if (!cached) {
    cached = parseEnv();
  }
  return cached;
}

export function resetEnvCache() {
  cached = undefined;
}

export function testFixturesEnabled(env: AppEnv = getEnv()): boolean {
  return env.TEST_FIXTURES === "1" || env.NODE_ENV === "test";
}
