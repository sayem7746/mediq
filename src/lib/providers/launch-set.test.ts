import { describe, expect, it } from "vitest";
import { loadFileProviders } from "./repository";

describe("official-source launch directory", () => {
  it("has at least 20 published, source-linked, verified listings", () => {
    const records = loadFileProviders();
    const published = records.filter((hospital) => hospital.published);
    expect(published.length).toBeGreaterThanOrEqual(20);
    for (const hospital of published) {
      expect(hospital.source.url.startsWith("https://")).toBe(true);
      expect(hospital.verification.status).toBe("verified");
      expect(hospital.verification.verifiedAt).toBeTruthy();
      expect(hospital.verification.reviewer).toBeTruthy();
      expect(["published", "contracted"]).toContain(hospital.relationship);
      expect(hospital.offeringIds.length).toBeGreaterThan(0);
    }
    expect(published.every((hospital) => hospital.sponsored === false)).toBe(
      true,
    );
  });
});
