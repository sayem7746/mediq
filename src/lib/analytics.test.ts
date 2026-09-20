import { describe, expect, it } from "vitest";
import { assertNoPii, AnalyticsValidationError } from "./analytics";

describe("analytics PII validator", () => {
  it("allows allowlisted metadata and rejects enquiry text", () => {
    expect(() =>
      assertNoPii({ specialty: "cardiology", city: "Kuala Lumpur" }),
    ).not.toThrow();
    expect(() => assertNoPii({ message: "please help" })).toThrow(
      AnalyticsValidationError,
    );
    expect(() => assertNoPii({ diagnosis: "x" })).toThrow(
      AnalyticsValidationError,
    );
  });
});
