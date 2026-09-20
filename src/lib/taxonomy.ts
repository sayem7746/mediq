import { z } from "zod";
import taxonomyJson from "../../data/specialty-taxonomy.json";

const localeText = z.object({
  en: z.string().min(1),
  bn: z.string().min(1),
});

export const TaxonomyRecordSchema = z.object({
  id: z.string().min(1),
  label: localeText,
  synonyms: z.object({
    en: z.array(z.string().min(1)),
    bn: z.array(z.string().min(1)),
  }),
  shortDescription: localeText,
  active: z.boolean(),
});

export type TaxonomyRecord = z.infer<typeof TaxonomyRecordSchema>;

export const TAXONOMY_BLOCKLIST = [
  "diagnosis",
  "symptom",
  "chest pain",
  "heart attack",
  "best",
  "recommend",
] as const;

export function loadTaxonomy(
  records: unknown = taxonomyJson,
): TaxonomyRecord[] {
  const parsed = z.array(TaxonomyRecordSchema).parse(records);
  validateTaxonomy(parsed);
  return parsed;
}

export function validateTaxonomy(records: TaxonomyRecord[]): void {
  const ids = new Set<string>();
  for (const record of records) {
    if (ids.has(record.id)) {
      throw new Error(`Duplicate taxonomy id: ${record.id}`);
    }
    ids.add(record.id);
    if (!record.label.en.trim() || !record.label.bn.trim()) {
      throw new Error(`Missing locale labels for ${record.id}`);
    }
    const haystack = [
      record.id,
      record.label.en,
      record.label.bn,
      ...record.synonyms.en,
      ...record.synonyms.bn,
      record.shortDescription.en,
      record.shortDescription.bn,
    ]
      .join(" ")
      .toLowerCase();
    for (const term of TAXONOMY_BLOCKLIST) {
      if (haystack.includes(term)) {
        throw new Error(
          `Diagnosis-like or ranking term "${term}" is not allowed in taxonomy (${record.id})`,
        );
      }
    }
  }
}

export function getTaxonomyById(
  id: string,
  records: TaxonomyRecord[] = loadTaxonomy(),
): TaxonomyRecord | undefined {
  return records.find((record) => record.id === id && record.active);
}

export function collectSearchTerms(
  record: TaxonomyRecord,
  locale: "en" | "bn",
): string[] {
  return [record.id, record.label[locale], ...record.synonyms[locale]].map(
    (term) => term.toLowerCase(),
  );
}

export function findTaxonomyMatches(
  query: string,
  locale: "en" | "bn",
  records: TaxonomyRecord[] = loadTaxonomy(),
): TaxonomyRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return records.filter((record) =>
    collectSearchTerms(record, locale).some(
      (term) => term.includes(q) || q.includes(term),
    ),
  );
}
