import { describe, expect, it } from "vitest";
import type { Hospital } from "@/lib/schemas/provider";
import { rankProviders } from "./rank-providers";

const now = new Date("2026-09-20T00:00:00.000Z");

function hospital(
  overrides: Partial<Hospital> & Pick<Hospital, "id" | "displayName">,
): Hospital {
  return {
    slug: overrides.id,
    legalName: overrides.displayName,
    branch: { city: "Kuala Lumpur", country: "Malaysia" },
    publicContact: {},
    officialWebsite: "https://example.com",
    offeringIds: ["cardiology"],
    source: { url: "https://example.com/s", kind: "official_website" },
    verification: {
      status: "verified",
      verifiedAt: "2026-01-01T00:00:00.000Z",
      reviewer: "ops",
    },
    nextReviewAt: "2027-01-01T00:00:00.000Z",
    relationship: "published",
    sponsored: false,
    published: true,
    languages: ["en"],
    ...overrides,
  };
}

describe("rankProviders", () => {
  it("orders by specialty, verified+fresh, city, language, then locale-aware name", () => {
    const providers = [
      hospital({
        id: "c",
        displayName: "Charlie Centre",
        offeringIds: ["dental"],
        verification: { status: "unverified" },
      }),
      hospital({
        id: "b",
        displayName: "Bravo Centre",
        offeringIds: ["cardiology"],
        branch: { city: "Penang", country: "Malaysia" },
      }),
      hospital({
        id: "a",
        displayName: "Alpha Centre",
        offeringIds: ["cardiology"],
        languages: ["bn"],
      }),
      hospital({
        id: "d",
        displayName: "Delta Centre",
        offeringIds: ["cardiology"],
        nextReviewAt: "2026-01-01T00:00:00.000Z",
      }),
    ];

    const ordered = rankProviders(providers, {
      specialty: "cardiology",
      city: "Kuala Lumpur",
      language: "bn",
      locale: "en",
      now,
    });

    expect(ordered.map((item) => item.id)).toEqual(["a", "b", "d", "c"]);
  });

  it("keeps organic order identical when sponsored flags change", () => {
    const base = [
      hospital({ id: "b", displayName: "Beta Medical Centre" }),
      hospital({ id: "a", displayName: "Alpha Medical Centre" }),
      hospital({ id: "c", displayName: "Gamma Medical Centre" }),
    ];
    const withSponsored = base.map((item, index) =>
      index === 1
        ? { ...item, sponsored: true, relationship: "contracted" as const }
        : item,
    );
    const filters = { locale: "en" as const, now };
    expect(rankProviders(base, filters).map((item) => item.id)).toEqual(
      rankProviders(withSponsored, filters).map((item) => item.id),
    );
  });
});
