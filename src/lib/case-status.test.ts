import { describe, expect, it } from "vitest";
import { canTransitionCase, transitionCase } from "./case-status";

describe("case status transitions", () => {
  it("allows the documented path and being-routed → closed", () => {
    expect(transitionCase("received", "being-routed")).toBe("being-routed");
    expect(transitionCase("being-routed", "provider-contacted")).toBe(
      "provider-contacted",
    );
    expect(transitionCase("being-routed", "closed")).toBe("closed");
  });

  it("does not skip to undocumented clinical states", () => {
    expect(canTransitionCase("received", "closed")).toBe(false);
    expect(canTransitionCase("received", "provider-response-received")).toBe(
      false,
    );
  });
});
