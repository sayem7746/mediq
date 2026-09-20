import { describe, expect, it } from "vitest";
import { createDb } from "@/lib/db";
import {
  lookupAccessToken,
  revokeAccessToken,
  storeAccessToken,
} from "./request-access";

describe("request access tokens", () => {
  it("resolves a valid token, hides expired and revoked, and blocks cross-request use", () => {
    const { db, sqlite } = createDb(":memory:");
    sqlite
      .prepare(
        `insert into navigation_requests (
          id, status, locale, display_name, contact_method, contact_value,
          preferred_language, message, created_at, updated_at
        ) values (?, 'received', 'en', 'A', 'email', 'a@example.com', 'en', 'hi', datetime('now'), datetime('now')),
                (?, 'received', 'en', 'B', 'email', 'b@example.com', 'en', 'hi', datetime('now'), datetime('now'))`,
      )
      .run("req-a", "req-b");

    const valid = storeAccessToken(db, "req-a");
    const expired = storeAccessToken(db, "req-a", {
      ttlMs: -1000,
      token: "expired-token-value-0000000000000000",
    });
    const revoked = storeAccessToken(db, "req-a", {
      token: "revoked-token-value-0000000000000000",
    });
    revokeAccessToken(db, revoked.hashedToken);
    const other = storeAccessToken(db, "req-b");

    expect(lookupAccessToken(db, valid.token)).toEqual({
      ok: true,
      requestId: "req-a",
    });
    expect(lookupAccessToken(db, expired.token)).toEqual({
      ok: false,
      reason: "invalid",
    });
    expect(lookupAccessToken(db, revoked.token)).toEqual({
      ok: false,
      reason: "invalid",
    });
    const otherLookup = lookupAccessToken(db, other.token);
    expect(otherLookup.ok && otherLookup.requestId).toBe("req-b");
    expect(
      lookupAccessToken(db, valid.token).ok &&
        lookupAccessToken(db, valid.token),
    ).toEqual({
      ok: true,
      requestId: "req-a",
    });
    sqlite.close();
  });
});
