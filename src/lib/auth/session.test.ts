import { describe, expect, it } from "vitest";
import { createSessionToken, verifySessionToken } from "./session";

describe("session", () => {
  it("round-trips a valid session and rejects expiry", () => {
    const token = createSessionToken({
      sub: "1",
      email: "staff@example.com",
      role: "staff",
      exp: Date.now() + 60_000,
    });
    expect(verifySessionToken(token)?.email).toBe("staff@example.com");
    const expired = createSessionToken({
      sub: "1",
      email: "staff@example.com",
      role: "staff",
      exp: Date.now() - 1000,
    });
    expect(verifySessionToken(expired)).toBeNull();
  });
});
