import { describe, expect, it } from "vitest";
import { createDb } from "@/lib/db";
import { HttpError } from "@/lib/auth/rbac";
import { resetRateLimit } from "@/lib/rate-limit";
import { submitInformationRequest } from "@/lib/requests/submit";
import {
  assignRequest,
  exportCase,
  getRequestForActor,
  updateRequestStatus,
} from "./admin";

const staffA = {
  id: "staff-a",
  email: "a@example.com",
  role: "staff" as const,
};
const staffB = {
  id: "staff-b",
  email: "b@example.com",
  role: "staff" as const,
};

describe("request authorization", () => {
  it("denies unauthenticated reads and cross-case access", () => {
    resetRateLimit();
    const { db, sqlite } = createDb(":memory:");
    const created = submitInformationRequest(
      db,
      {
        name: "Sam",
        contactMethod: "email",
        contactValue: "sam@example.com",
        preferredLanguage: "en",
        categoryId: "cardiology",
        message: "Hours for international desk",
        consent: true,
      },
      { ip: "10.0.0.1", locale: "en" },
    );
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    expect(() =>
      getRequestForActor(db, undefined as never, created.requestId),
    ).toThrow(HttpError);
    assignRequest(db, staffA, created.requestId, staffA.id);
    expect(() => getRequestForActor(db, staffB, created.requestId)).toThrow(
      /Forbidden/,
    );
    updateRequestStatus(db, staffA, created.requestId, "being-routed");
    expect(() =>
      updateRequestStatus(db, staffA, created.requestId, "closed"),
    ).toThrow(/reason/);
    expect(() => exportCase(db, staffA, created.requestId)).toThrow(
      /Forbidden/,
    );
    sqlite.close();
  });

  it("exports consent and audit for an admin without mutating consent", () => {
    resetRateLimit();
    const { db, sqlite } = createDb(":memory:");
    const created = submitInformationRequest(
      db,
      {
        name: "Sam",
        contactMethod: "email",
        contactValue: "sam@example.com",
        preferredLanguage: "en",
        categoryId: "cardiology",
        message: "Hours for international desk",
        consent: true,
      },
      { ip: "10.0.0.8", locale: "en" },
    );
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const admin = {
      id: "admin-1",
      email: "admin@example.com",
      role: "admin" as const,
    };
    getRequestForActor(db, admin, created.requestId);
    const exported = exportCase(db, admin, created.requestId);
    expect(exported.consent).toHaveLength(1);
    expect(exported.consent[0]?.consentVersion).toBe("2026-09-20.1");
    expect(exported.audit.some((row) => row.action === "request_viewed")).toBe(
      true,
    );
    sqlite.close();
  });
});
