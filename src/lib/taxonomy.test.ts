import { describe, expect, it } from "vitest";
import {
  loadTaxonomy,
  TAXONOMY_BLOCKLIST,
  validateTaxonomy,
  type TaxonomyRecord,
} from "./taxonomy";

const sample: TaxonomyRecord = {
  id: "cardiology",
  label: { en: "Cardiology", bn: "হৃদরোগ বিভাগ" },
  synonyms: { en: ["cardiac services"], bn: ["কার্ডিওলজি"] },
  shortDescription: {
    en: "Provider-stated cardiology services.",
    bn: "প্রদানকারী-ঘোষিত কার্ডিওলজি সেবা।",
  },
  active: true,
};

describe("taxonomy", () => {
  it("loads and validates the production taxonomy file", () => {
    const records = loadTaxonomy();
    expect(records.length).toBeGreaterThanOrEqual(28);
    expect(records.length).toBeLessThanOrEqual(35);
  });

  it("rejects duplicate IDs", () => {
    expect(() => validateTaxonomy([sample, { ...sample }])).toThrow(
      /Duplicate taxonomy id/,
    );
  });

  it("rejects missing locale labels", () => {
    expect(() =>
      validateTaxonomy([
        {
          ...sample,
          label: { en: "Cardiology", bn: "   " },
        },
      ]),
    ).toThrow(/Missing locale labels/);
  });

  it.each(TAXONOMY_BLOCKLIST)(
    "rejects diagnosis-like term %s in synonyms",
    (term) => {
      expect(() =>
        validateTaxonomy([
          {
            ...sample,
            synonyms: { en: [term], bn: ["কার্ডিওলজি"] },
          },
        ]),
      ).toThrow(/not allowed/);
    },
  );
});
