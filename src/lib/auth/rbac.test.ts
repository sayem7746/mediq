import { describe, expect, it } from "vitest";
import { assertCan, assertCanAccessRequest, can, HttpError } from "./rbac";

describe("rbac", () => {
  it("allows approvers to publish and blocks staff", () => {
    expect(can("approver", "providers.publish")).toBe(true);
    expect(can("staff", "providers.publish")).toBe(false);
    expect(() => assertCan("staff", "providers.publish")).toThrow(HttpError);
  });

  it("denies cross-case access for ordinary staff", () => {
    const staff = {
      id: "staff-1",
      email: "a@example.com",
      role: "staff" as const,
    };
    expect(() =>
      assertCanAccessRequest(staff, { id: "req-2", ownerId: "staff-other" }),
    ).toThrow(/Forbidden/);
  });

  it("throws 401 when unauthenticated", () => {
    try {
      assertCanAccessRequest(undefined as never, {
        id: "req-1",
        ownerId: null,
      });
      throw new Error("expected throw");
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).status).toBe(401);
    }
  });
});
