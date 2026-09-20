import type { Hospital } from "@/lib/schemas/provider";

export type RankFilters = {
  specialty?: string;
  city?: string;
  language?: string;
  locale: "en" | "bn";
  now?: Date;
};

function compareBooleanDesc(a: boolean, b: boolean): number {
  return Number(b) - Number(a);
}

export function isStale(hospital: Hospital, now = new Date()): boolean {
  return new Date(hospital.nextReviewAt).getTime() < now.getTime();
}

export function isVerifiedAndFresh(
  hospital: Hospital,
  now = new Date(),
): boolean {
  return hospital.verification.status === "verified" && !isStale(hospital, now);
}

/**
 * Deterministic organic sort. Do not add revenue, commission, or payment arguments.
 */
export function rankProviders(
  providers: Hospital[],
  filters: RankFilters,
): Hospital[] {
  const now = filters.now ?? new Date();
  const locale = filters.locale === "bn" ? "bn" : "en";

  return [...providers].sort((a, b) => {
    // 1. Specialty match — selected offering ID before non-match.
    if (filters.specialty) {
      const specialtyDelta = compareBooleanDesc(
        a.offeringIds.includes(filters.specialty),
        b.offeringIds.includes(filters.specialty),
      );
      if (specialtyDelta !== 0) return specialtyDelta;
    }

    // 2. Verified and not stale before unverified or stale.
    const verifiedDelta = compareBooleanDesc(
      isVerifiedAndFresh(a, now),
      isVerifiedAndFresh(b, now),
    );
    if (verifiedDelta !== 0) return verifiedDelta;

    // 3. Selected city match.
    if (filters.city) {
      const cityDelta = compareBooleanDesc(
        a.branch.city === filters.city,
        b.branch.city === filters.city,
      );
      if (cityDelta !== 0) return cityDelta;
    }

    // 4. Selected language match.
    if (filters.language) {
      const languageDelta = compareBooleanDesc(
        a.languages.includes(filters.language),
        b.languages.includes(filters.language),
      );
      if (languageDelta !== 0) return languageDelta;
    }

    // 5. Locale-aware alphabetical display name.
    return a.displayName.localeCompare(b.displayName, locale, {
      sensitivity: "base",
    });
  });
}
