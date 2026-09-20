import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { scanFiles, scanText } from "./content-policy";

const root = path.resolve(__dirname, "../..");

function collect(target: string, matcher: (name: string) => boolean): string[] {
  const full = path.join(root, target);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter(matcher)
    .map((name) => path.join(full, name));
}

describe("content policy", () => {
  it("scans messages, fixtures, and staff templates for prohibited medical-advice phrasing", () => {
    const files = [
      ...collect("messages", (name) => name.endsWith(".json")),
      path.join(root, "src/test/fixtures/providers.json"),
    ];
    const templateHits = collect("content", (name) =>
      name.startsWith("staff-templates."),
    ).flatMap((file) => {
      const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as {
        templates: Record<string, string>;
      };
      return scanText(Object.values(parsed.templates).join("\n"), file);
    });
    expect([...scanFiles(files), ...templateHits]).toEqual([]);
  });

  it("allowlists quoted prohibited examples in docs", () => {
    const hits = scanText(
      `## Prohibited copy examples\n\n1. “You may have a heart problem — see a cardiologist.”\n`,
      path.join(root, "docs/service-boundary.md"),
    );
    expect(hits).toEqual([]);
  });
});
