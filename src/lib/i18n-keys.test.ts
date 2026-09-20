import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import bn from "../../messages/bn.json";
import disclosuresEn from "../../content/disclosures.en.json";
import disclosuresBn from "../../content/disclosures.bn.json";
import feeEn from "../../content/fee-disclosure.en.json";
import feeBn from "../../content/fee-disclosure.bn.json";

function keyPaths(value: unknown, prefix = ""): string[] {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value as Record<string, unknown>).flatMap(
      ([key, nested]) => {
        const path = prefix ? `${prefix}.${key}` : key;
        return keyPaths(nested, path);
      },
    );
  }
  return [prefix];
}

function expectSameKeys(a: unknown, b: unknown) {
  expect(keyPaths(a).sort()).toEqual(keyPaths(b).sort());
}

describe("locale key parity", () => {
  it("keeps message files on identical nested key paths", () => {
    expectSameKeys(en, bn);
  });

  it("keeps disclosure files on identical nested key paths", () => {
    expectSameKeys(disclosuresEn, disclosuresBn);
  });

  it("keeps fee-disclosure files on identical nested key paths", () => {
    expectSameKeys(feeEn, feeBn);
  });
});
