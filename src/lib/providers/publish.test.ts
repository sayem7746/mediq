import { describe, expect, it } from "vitest";
import { createDb } from "@/lib/db";
import { HospitalSchema, type Hospital } from "@/lib/schemas/provider";
import fixtureProviders from "@/test/fixtures/providers.json";
import {
  listProviderHistory,
  publishProvider,
  saveProviderDraft,
} from "./publish";
import { HttpError } from "@/lib/auth/rbac";

const alpha = HospitalSchema.parse(
  fixtureProviders.find((item) => item.id === "hosp-alpha"),
);

const editor = {
  id: "editor-1",
  email: "editor@example.com",
  role: "editor" as const,
};
const approver = {
  id: "approver-1",
  email: "approver@example.com",
  role: "approver" as const,
};
const staff = {
  id: "staff-1",
  email: "staff@example.com",
  role: "staff" as const,
};

describe("provider publish", () => {
  it("redirects/401s unauthenticated actors", () => {
    const { db, sqlite } = createDb(":memory:");
    expect(() =>
      publishProvider(db, undefined as never, alpha as Hospital),
    ).toThrow(HttpError);
    sqlite.close();
  });

  it("blocks staff from publishing", () => {
    const { db, sqlite } = createDb(":memory:");
    expect(() => publishProvider(db, staff, alpha as Hospital)).toThrow(
      /Forbidden/,
    );
    sqlite.close();
  });

  it("rejects an invalid source URL", () => {
    const { db, sqlite } = createDb(":memory:");
    expect(() =>
      saveProviderDraft(db, editor, {
        ...alpha,
        source: { url: "not-a-url", kind: "official_website" },
      } as Hospital),
    ).toThrow();
    sqlite.close();
  });

  it("preserves before/after history on publish", () => {
    const { db, sqlite } = createDb(":memory:");
    saveProviderDraft(db, editor, { ...alpha, published: false });
    publishProvider(db, approver, alpha as Hospital);
    const history = listProviderHistory(db, alpha.id);
    expect(history.length).toBeGreaterThanOrEqual(2);
    expect(history[0]?.beforeJson).toBeDefined();
    expect(history[1]?.afterJson).toContain("Fixture Alpha");
    sqlite.close();
  });
});
