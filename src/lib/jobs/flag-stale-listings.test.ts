import { describe, expect, it } from "vitest";
import { listingIsStale } from "./flag-stale-listings";

describe("listingIsStale", () => {
  const now = new Date("2026-09-20T00:00:00.000Z");

  it("flags a nextReviewAt in the past", () => {
    expect(listingIsStale("2026-09-19T23:59:59.000Z", now)).toBe(true);
  });

  it("does not flag a nextReviewAt in the future", () => {
    expect(listingIsStale("2026-09-21T00:00:00.000Z", now)).toBe(false);
  });
});
