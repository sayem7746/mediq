import fs from "node:fs";
import path from "node:path";
import fixtureProviders from "@/test/fixtures/providers.json";
import { HospitalSchema, type Hospital } from "@/lib/schemas/provider";
import { getEnv, testFixturesEnabled } from "@/lib/env";
import { getDb } from "@/lib/db";
import { providers } from "@/lib/db/schema";

function readJsonFiles(directory: string): unknown[] {
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory)
    .filter((name) => name.endsWith(".json"))
    .map(
      (name) =>
        JSON.parse(
          fs.readFileSync(path.join(directory, name), "utf8"),
        ) as unknown,
    );
}

export function loadFixtureProviders(): Hospital[] {
  return fixtureProviders.map((record) => HospitalSchema.parse(record));
}

export function loadFileProviders(): Hospital[] {
  const directory = path.resolve(process.cwd(), "data/providers");
  const records: Hospital[] = [];
  for (const raw of readJsonFiles(directory)) {
    const items = Array.isArray(raw) ? raw : [raw];
    for (const item of items) {
      records.push(HospitalSchema.parse(item));
    }
  }
  return records;
}

export function loadDbProviders(): Hospital[] {
  try {
    return getDb()
      .select()
      .from(providers)
      .all()
      .map((row) => HospitalSchema.parse(JSON.parse(row.payloadJson)));
  } catch {
    return [];
  }
}

export function loadProviderRecords(): Hospital[] {
  if (testFixturesEnabled(getEnv())) {
    return loadFixtureProviders();
  }
  const fromFiles = loadFileProviders();
  if (fromFiles.length > 0) return fromFiles;
  return loadDbProviders();
}

export function getPublishedProviders(): Hospital[] {
  return loadProviderRecords().filter((hospital) => hospital.published);
}

export function getPublishedProviderBySlug(slug: string): Hospital | undefined {
  return getPublishedProviders().find((hospital) => hospital.slug === slug);
}

export function getProviderById(id: string): Hospital | undefined {
  return loadProviderRecords().find((hospital) => hospital.id === id);
}
