import { describe, expect, it } from "vitest";
import { checkRateLimit, resetRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  it("allows a burst then blocks", () => {
    resetRateLimit();
    const now = 1_000;
    expect(checkRateLimit("ip", { limit: 3, windowMs: 1000, now }).ok).toBe(
      true,
    );
    expect(checkRateLimit("ip", { limit: 3, windowMs: 1000, now }).ok).toBe(
      true,
    );
    expect(checkRateLimit("ip", { limit: 3, windowMs: 1000, now }).ok).toBe(
      true,
    );
    expect(checkRateLimit("ip", { limit: 3, windowMs: 1000, now }).ok).toBe(
      false,
    );
  });
});
