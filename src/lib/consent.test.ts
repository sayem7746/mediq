import { describe, expect, it } from "vitest";
import { createDb } from "@/lib/db";
import {
  appendConsentEvent,
  deleteConsentEvent,
  getConsentForRequest,
  mutateConsentEvent,
} from "./consent";

describe("consent events", () => {
  it("appends consent and refuses later mutation", () => {
    const { db, sqlite } = createDb(":memory:");
    sqlite
      .prepare(
        `insert into navigation_requests (
          id, status, locale, display_name, contact_method, contact_value,
          preferred_language, message, created_at, updated_at
        ) values ('req-1', 'received', 'en', 'A', 'email', 'a@example.com', 'en', 'hi', datetime('now'), datetime('now'))`,
      )
      .run();
    appendConsentEvent(db, {
      requestId: "req-1",
      consentVersion: "2026-09-20.1",
      locale: "en",
    });
    expect(getConsentForRequest(db, "req-1")).toHaveLength(1);
    expect(() => mutateConsentEvent()).toThrow(/immutable/);
    expect(() => deleteConsentEvent()).toThrow(/immutable/);
    sqlite.close();
  });
});
