import { describe, expect, it } from "vitest";
import { createDb } from "@/lib/db";
import { actorFromCookie } from "@/lib/auth/session";
import { resetRateLimit, checkRateLimit } from "@/lib/rate-limit";
import { submitInformationRequest } from "@/lib/requests/submit";
import { lookupAccessToken, storeAccessToken } from "@/lib/request-access";

describe("pre-launch security checks", () => {
  it("does not treat a missing admin cookie as a session", () => {
    expect(actorFromCookie(undefined)).toBeNull();
  });

  it("fails expired request tokens", () => {
    const { db, sqlite } = createDb(":memory:");
    sqlite
      .prepare(
        `insert into navigation_requests (
          id, status, locale, display_name, contact_method, contact_value,
          preferred_language, message, created_at, updated_at
        ) values ('req-x', 'received', 'en', 'A', 'email', 'a@example.com', 'en', 'hi', datetime('now'), datetime('now'))`,
      )
      .run();
    const expired = storeAccessToken(db, "req-x", { ttlMs: -1 });
    expect(lookupAccessToken(db, expired.token).ok).toBe(false);
    sqlite.close();
  });

  it("rate limit and honeypot leave no request row", () => {
    resetRateLimit();
    const { db, sqlite } = createDb(":memory:");
    const payload = {
      name: "Sam",
      contactMethod: "email",
      contactValue: "sam@example.com",
      preferredLanguage: "en",
      categoryId: "cardiology",
      message: "Hours",
      consent: true,
    };
    const honey = submitInformationRequest(
      db,
      { ...payload, website: "bot" },
      { ip: "1.2.3.4", locale: "en" },
    );
    expect(honey.ok).toBe(true);
    expect(
      (
        sqlite
          .prepare("select count(*) as n from navigation_requests")
          .get() as { n: number }
      ).n,
    ).toBe(0);
    expect(checkRateLimit("x", { limit: 1, now: 1 }).ok).toBe(true);
    expect(checkRateLimit("x", { limit: 1, now: 1 }).ok).toBe(false);
    sqlite.close();
  });
});
