import { describe, expect, it } from "vitest";
import fixtureProviders from "@/../src/test/fixtures/providers.json";
import { HospitalSchema, type Hospital } from "@/lib/schemas/provider";
import { filterProviders } from "./filter-providers";

const providers = fixtureProviders.map((record) =>
  HospitalSchema.parse(record),
);
const now = new Date("2026-09-20T00:00:00.000Z");

describe("filterProviders", () => {
  it("returns a safe empty result for invalid filters", () => {
    const result = filterProviders(providers as Hospital[], {
      city: "Unknown City",
    });
    expect(result.invalid).toBe(true);
    expect(result.organic).toEqual([]);
    expect(result.sponsored).toEqual([]);
  });

  it("matches English and Bangla taxonomy synonyms", () => {
    const en = filterProviders(
      providers as Hospital[],
      { q: "cardiac services", verification: "all" },
      "en",
      now,
    );
    const bn = filterProviders(
      providers as Hospital[],
      { q: "কার্ডিওলজি", verification: "all" },
      "bn",
      now,
    );
    expect(
      en.organic.some((item) => item.slug === "fixture-alpha-medical-centre"),
    ).toBe(true);
    expect(
      bn.organic.some((item) => item.slug === "fixture-alpha-medical-centre"),
    ).toBe(true);
  });

  it("does not change organic order when sponsored flags flip", () => {
    const params = { specialty: "cardiology", verification: "all" };
    const original = filterProviders(
      providers as Hospital[],
      params,
      "en",
      now,
    );
    const flipped = (providers as Hospital[]).map((item) =>
      item.id === "hosp-alpha"
        ? { ...item, sponsored: true, relationship: "contracted" as const }
        : { ...item, sponsored: false },
    );
    const after = filterProviders(flipped, params, "en", now);
    expect(after.organic.map((item) => item.id)).toEqual(
      original.organic.map((item) => item.id),
    );
  });

  it("excludes stale listings from the default verified filter", () => {
    const result = filterProviders(
      providers as Hospital[],
      { verification: "verified" },
      "en",
      now,
    );
    expect(result.organic.some((item) => item.id === "hosp-gamma")).toBe(false);
  });
});
