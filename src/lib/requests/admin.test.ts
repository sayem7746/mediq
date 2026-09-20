import { describe, expect, it } from "vitest";
import { createDb } from "@/lib/db";
import { HttpError } from "@/lib/auth/rbac";
import { resetRateLimit } from "@/lib/rate-limit";
import { submitInformationRequest } from "@/lib/requests/submit";
import {
  assignRequest,
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
    sqlite.close();
  });
});
