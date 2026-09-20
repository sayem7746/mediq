import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { AppDatabase } from "@/lib/db";
import { auditEvents, providers } from "@/lib/db/schema";
import { isStale } from "@/lib/rank-providers";
import { HospitalSchema, type Hospital } from "@/lib/schemas/provider";

export function listingIsStale(nextReviewAt: string, now: Date): boolean {
  return new Date(nextReviewAt).getTime() < now.getTime();
}

export function flagStaleProviders(
  records: Hospital[],
  now = new Date(),
): Array<Hospital & { stale: boolean }> {
  return records.map((record) => ({
    ...record,
    stale: record.published && isStale(record, now),
  }));
}

export function runFlagStaleListingsJob(
  db: AppDatabase,
  now = new Date(),
): { flagged: number; examined: number; runId: string } {
  const rows = db.select().from(providers).all();
  let flagged = 0;
  for (const row of rows) {
    const hospital = HospitalSchema.parse(JSON.parse(row.payloadJson));
    const stale =
      hospital.published && listingIsStale(hospital.nextReviewAt, now);
    if (stale !== row.stale) {
      db.update(providers)
        .set({ stale, updatedAt: now.toISOString() })
        .where(eq(providers.id, row.id))
        .run();
    }
    if (stale) flagged += 1;
  }
  const runId = randomUUID();
  db.insert(auditEvents)
    .values({
      id: runId,
      actorId: "system",
      action: "listing_stale_job",
      entityType: "job",
      entityId: runId,
      metadataJson: JSON.stringify({
        flagged,
        examined: rows.length,
        at: now.toISOString(),
      }),
      createdAt: now.toISOString(),
    })
    .run();
  return { flagged, examined: rows.length, runId };
}
