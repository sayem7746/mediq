import { describe, expect, it } from "vitest";
import { HospitalSchema, type Hospital } from "./provider";

const validHospital: Hospital = {
  id: "hosp-alpha",
  slug: "fixture-alpha-medical-centre",
  legalName: "Fixture Alpha Medical Centre Sdn Bhd",
  displayName: "Fixture Alpha Medical Centre",
  branch: { city: "Kuala Lumpur", country: "Malaysia", name: "KL Campus" },
  publicContact: { phone: "+60-3-0000-0001", email: "info@alpha.example" },
  officialWebsite: "https://alpha.example",
  offeringIds: ["cardiology"],
  source: { url: "https://alpha.example/services", kind: "official_website" },
  verification: {
    status: "verified",
    verifiedAt: "2026-06-01T00:00:00.000Z",
    reviewer: "directory-ops",
  },
  nextReviewAt: "2027-03-01T00:00:00.000Z",
  relationship: "published",
  sponsored: false,
  published: true,
  languages: ["en", "bn"],
};

describe("HospitalSchema", () => {
  it("accepts a valid published hospital", () => {
    expect(HospitalSchema.parse(validHospital).id).toBe("hosp-alpha");
  });

  it("rejects a missing source URL", () => {
    const result = HospitalSchema.safeParse({
      ...validHospital,
      source: { url: "", kind: "official_website" },
    });
    expect(result.success).toBe(false);
  });

  it("allows a stale nextReviewAt when published and verified (flagged, not invalid)", () => {
    const result = HospitalSchema.safeParse({
      ...validHospital,
      nextReviewAt: "2020-01-01T00:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("rejects published listings that omit required verification dates", () => {
    const result = HospitalSchema.safeParse({
      ...validHospital,
      verification: { status: "verified" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects published listings without an approved relationship", () => {
    const result = HospitalSchema.safeParse({
      ...validHospital,
      relationship: "invited",
    });
    expect(result.success).toBe(false);
  });

  it("rejects sponsored=true when relationship is none", () => {
    const result = HospitalSchema.safeParse({
      ...validHospital,
      published: false,
      relationship: "none",
      sponsored: true,
    });
    expect(result.success).toBe(false);
  });
});
