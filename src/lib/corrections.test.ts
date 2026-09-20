import { describe, expect, it } from "vitest";
import { canTransitionCorrection, transitionCorrection } from "./corrections";

describe("correction transitions", () => {
  it("allows submitted → under review → approved|rejected → published", () => {
    expect(canTransitionCorrection("submitted", "under_review")).toBe(true);
    expect(transitionCorrection("under_review", "approved")).toBe("approved");
    expect(transitionCorrection("under_review", "rejected")).toBe("rejected");
    expect(transitionCorrection("approved", "published")).toBe("published");
  });

  it("rejects skipped or clinical-like jumps", () => {
    expect(canTransitionCorrection("submitted", "published")).toBe(false);
    expect(() => transitionCorrection("rejected", "published")).toThrow(
      /Cannot move correction/,
    );
  });
});
