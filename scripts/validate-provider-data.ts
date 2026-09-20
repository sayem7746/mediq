import fs from "node:fs";
import path from "node:path";
import { HospitalSchema } from "../src/lib/schemas/provider";
import { loadTaxonomy } from "../src/lib/taxonomy";

const directory = path.resolve(process.cwd(), "data/providers");

function loadFiles(): Array<{ file: string; data: unknown }> {
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory)
    .filter((name) => name.endsWith(".json"))
    .map((name) => ({
      file: name,
      data: JSON.parse(
        fs.readFileSync(path.join(directory, name), "utf8"),
      ) as unknown,
    }));
}

function main() {
  const taxonomy = new Set(loadTaxonomy().map((record) => record.id));
  const files = loadFiles();
  let failed = false;

  for (const { file, data } of files) {
    const items = Array.isArray(data) ? data : [data];
    for (const item of items) {
      const parsed = HospitalSchema.safeParse(item);
      if (!parsed.success) {
        failed = true;
        console.error(`${file}: schema error`, parsed.error.issues);
        continue;
      }
      for (const offeringId of parsed.data.offeringIds) {
        if (!taxonomy.has(offeringId)) {
          failed = true;
          console.error(`${file}: unknown offering ${offeringId}`);
        }
      }
      if (parsed.data.published) {
        const missing =
          !parsed.data.source.url ||
          !parsed.data.verification.verifiedAt ||
          !parsed.data.verification.reviewer ||
          !["published", "contracted"].includes(parsed.data.relationship);
        if (missing) {
          failed = true;
          console.error(
            `${file}: published listing lacks official sourceUrl, verifiedAt, reviewer, or approved status`,
          );
        }
      }
    }
  }

  if (failed) {
    process.exit(1);
  }
  console.log(`Validated ${files.length} provider file(s).`);
}

main();
