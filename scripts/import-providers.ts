import fs from "node:fs";
import path from "node:path";
import { HospitalSchema, type Hospital } from "../src/lib/schemas/provider";

const directory = path.resolve(process.cwd(), "data/providers");
const dryRun = process.argv.includes("--dry-run");

function loadHospitals(): Hospital[] {
  if (!fs.existsSync(directory)) return [];
  const records: Hospital[] = [];
  for (const name of fs.readdirSync(directory)) {
    if (!name.endsWith(".json")) continue;
    const raw = JSON.parse(
      fs.readFileSync(path.join(directory, name), "utf8"),
    ) as unknown;
    const items = Array.isArray(raw) ? raw : [raw];
    for (const item of items) {
      records.push(HospitalSchema.parse(item));
    }
  }
  return records;
}

function main() {
  const hospitals = loadHospitals();
  const published = hospitals.filter((item) => item.published).length;
  const sponsored = hospitals.filter((item) => item.sponsored).length;
  const unverified = hospitals.filter(
    (item) => item.verification.status === "unverified",
  ).length;
  console.log(
    JSON.stringify(
      {
        dryRun,
        files: hospitals.length,
        published,
        sponsored,
        unverified,
      },
      null,
      2,
    ),
  );
  if (!dryRun) {
    console.log(
      "Live import is a no-op until directory ops connects this script to the database.",
    );
  }
}

main();
