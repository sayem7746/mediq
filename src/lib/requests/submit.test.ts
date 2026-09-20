import { describe, expect, it } from "vitest";
import { createDb } from "@/lib/db";
import { resetRateLimit } from "@/lib/rate-limit";
import { submitInformationRequest } from "./submit";
import { getConsentForRequest } from "@/lib/consent";

const valid = {
  name: "Sam Example",
  contactMethod: "email",
  contactValue: "sam@example.com",
  preferredLanguage: "en",
  providerSlug: "fixture-alpha-medical-centre",
  message: "Please share international patient desk hours.",
  consent: true,
};

describe("submitInformationRequest", () => {
  it("rejects invalid payloads", () => {
    resetRateLimit();
    const { db, sqlite } = createDb(":memory:");
    const result = submitInformationRequest(
      db,
      { ...valid, name: "" },
      {
        ip: "1.1.1.1",
        locale: "en",
      },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("invalid");
    sqlite.close();
  });

  it("rejects missing consent", () => {
    resetRateLimit();
    const { db, sqlite } = createDb(":memory:");
    const result = submitInformationRequest(
      db,
      { ...valid, consent: false },
      { ip: "2.2.2.2", locale: "en" },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("consent");
    sqlite.close();
  });

  it("honeypot returns success without a record", () => {
    resetRateLimit();
    const { db, sqlite } = createDb(":memory:");
    const result = submitInformationRequest(
      db,
      { ...valid, website: "https://spam.example" },
      { ip: "3.3.3.3", locale: "en" },
    );
    expect(result.ok).toBe(true);
    const count = sqlite
      .prepare("select count(*) as n from navigation_requests")
      .get() as {
      n: number;
    };
    expect(count.n).toBe(0);
    sqlite.close();
  });

  it("rate-limits repeated submits from the same IP", () => {
    resetRateLimit();
    const { db, sqlite } = createDb(":memory:");
    for (let i = 0; i < 5; i += 1) {
      const result = submitInformationRequest(db, valid, {
        ip: "9.9.9.9",
        locale: "en",
      });
      expect(result.ok).toBe(true);
    }
    const blocked = submitInformationRequest(db, valid, {
      ip: "9.9.9.9",
      locale: "en",
    });
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) expect(blocked.error).toBe("rate_limit");
    sqlite.close();
  });

  it("stores consent in the same transaction and keeps it immutable", () => {
    resetRateLimit();
    const { db, sqlite } = createDb(":memory:");
    const result = submitInformationRequest(db, valid, {
      ip: "8.8.8.8",
      locale: "bn",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(getConsentForRequest(db, result.requestId)[0]?.locale).toBe("bn");
    }
    sqlite.close();
  });
});
