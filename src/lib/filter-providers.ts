import { z } from "zod";
import type { Hospital } from "@/lib/schemas/provider";
import { isSponsoredAllowed } from "@/lib/schemas/provider";
import { isVerifiedAndFresh, rankProviders } from "@/lib/rank-providers";
import { findTaxonomyMatches, getTaxonomyById } from "@/lib/taxonomy";

export const ALLOWED_CITIES = [
  "Kuala Lumpur",
  "Penang",
  "Johor Bahru",
  "Malacca",
  "Kota Kinabalu",
  "Kuching",
  "Ipoh",
  "Cyberjaya",
] as const;

export const ALLOWED_LANGUAGES = ["en", "bn", "ms", "zh"] as const;

export const DirectoryFilterSchema = z.object({
  q: z.string().trim().max(200).optional(),
  specialty: z.string().trim().max(80).optional(),
  city: z.enum(ALLOWED_CITIES).optional(),
  language: z.enum(ALLOWED_LANGUAGES).optional(),
  verification: z.enum(["verified", "all"]).optional(),
  internationalPatientService: z.enum(["true", "false"]).optional(),
});

export type DirectoryFilters = z.infer<typeof DirectoryFilterSchema>;

export type DirectoryResult = {
  organic: Hospital[];
  sponsored: Hospital[];
  filters: DirectoryFilters | null;
  invalid: boolean;
};

function firstString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseDirectorySearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): { filters: DirectoryFilters; invalid: boolean } {
  const raw = {
    q: firstString(searchParams.q),
    specialty: firstString(searchParams.specialty),
    city: firstString(searchParams.city),
    language: firstString(searchParams.language),
    verification: firstString(searchParams.verification),
    internationalPatientService: firstString(
      searchParams.internationalPatientService,
    ),
  };
  const cleaned = Object.fromEntries(
    Object.entries(raw).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );
  const parsed = DirectoryFilterSchema.safeParse(cleaned);
  if (!parsed.success) {
    return { filters: {}, invalid: true };
  }

  if (parsed.data.specialty && !getTaxonomyById(parsed.data.specialty)) {
    return { filters: {}, invalid: true };
  }

  return { filters: parsed.data, invalid: false };
}

function matchesQuery(
  hospital: Hospital,
  query: string,
  locale: "en" | "bn",
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const nameHit =
    hospital.displayName.toLowerCase().includes(q) ||
    hospital.legalName.toLowerCase().includes(q);
  const synonymHit = findTaxonomyMatches(q, locale).some((record) =>
    hospital.offeringIds.includes(record.id),
  );
  return nameHit || synonymHit;
}

export function filterProviders(
  providers: Hospital[],
  searchParams: Record<string, string | string[] | undefined>,
  locale: "en" | "bn" = "en",
  now = new Date(),
): DirectoryResult {
  const { filters, invalid } = parseDirectorySearchParams(searchParams);
  if (invalid) {
    return { organic: [], sponsored: [], filters: null, invalid: true };
  }

  const published = providers.filter((hospital) => hospital.published);
  let matched = published;

  if (filters.q) {
    matched = matched.filter((hospital) =>
      matchesQuery(hospital, filters.q!, locale),
    );
  }
  if (filters.specialty) {
    matched = matched.filter((hospital) =>
      hospital.offeringIds.includes(filters.specialty!),
    );
  }
  if (filters.city) {
    matched = matched.filter(
      (hospital) => hospital.branch.city === filters.city,
    );
  }
  if (filters.language) {
    matched = matched.filter((hospital) =>
      hospital.languages.includes(filters.language!),
    );
  }
  if (filters.internationalPatientService === "true") {
    matched = matched.filter((hospital) =>
      Boolean(hospital.internationalPatientContact),
    );
  }

  const verification = filters.verification ?? "verified";
  const organicPool =
    verification === "verified"
      ? matched.filter((hospital) => isVerifiedAndFresh(hospital, now))
      : matched;

  const organic = rankProviders(organicPool, {
    specialty: filters.specialty,
    city: filters.city,
    language: filters.language,
    locale,
    now,
  });

  const sponsored = rankProviders(matched.filter(isSponsoredAllowed), {
    specialty: filters.specialty,
    city: filters.city,
    language: filters.language,
    locale,
    now,
  });

  return { organic, sponsored, filters, invalid: false };
}
