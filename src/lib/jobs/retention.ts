import { randomUUID } from "node:crypto";
import type { AppDatabase } from "@/lib/db";
import { auditEvents, deletionJobs, navigationRequests } from "@/lib/db/schema";
import { lt } from "drizzle-orm";

/** Counsel must set a retention duration before any destructive run. */
export const RETENTION_DURATION_PLACEHOLDER = "PLACEHOLDER";

export type RetentionResult = {
  dryRun: boolean;
  deleted: number;
  candidateCount: number;
  blocked: boolean;
  reason: string;
  jobId: string;
};

export function runRetentionJob(
  db: AppDatabase,
  options: {
    now?: Date;
    dryRun?: boolean;
    retentionDays?: number | typeof RETENTION_DURATION_PLACEHOLDER;
  } = {},
): RetentionResult {
  const now = options.now ?? new Date();
  const dryRun = options.dryRun ?? true;
  const retentionDays = options.retentionDays ?? RETENTION_DURATION_PLACEHOLDER;
  const jobId = randomUUID();

  if (
    retentionDays === RETENTION_DURATION_PLACEHOLDER ||
    typeof retentionDays !== "number"
  ) {
    const result: RetentionResult = {
      dryRun: true,
      deleted: 0,
      candidateCount: 0,
      blocked: true,
      reason: "Retention duration is PLACEHOLDER pending counsel",
      jobId,
    };
    db.insert(deletionJobs)
      .values({
        id: jobId,
        status: "blocked",
        dryRun: true,
        detailsJson: JSON.stringify(result),
        createdAt: now.toISOString(),
        completedAt: now.toISOString(),
      })
      .run();
    db.insert(auditEvents)
      .values({
        id: randomUUID(),
        actorId: "system",
        action: "retention_job",
        entityType: "deletion_job",
        entityId: jobId,
        metadataJson: JSON.stringify(result),
        createdAt: now.toISOString(),
      })
      .run();
    return result;
  }

  const cutoff = new Date(
    now.getTime() - retentionDays * 24 * 60 * 60 * 1000,
  ).toISOString();
  const candidates = db
    .select()
    .from(navigationRequests)
    .where(lt(navigationRequests.createdAt, cutoff))
    .all();

  let deleted = 0;
  if (!dryRun) {
    // Destructive delete is intentionally unimplemented until counsel sets duration.
    deleted = 0;
  }

  const result: RetentionResult = {
    dryRun,
    deleted,
    candidateCount: candidates.length,
    blocked: false,
    reason: dryRun ? "dry-run" : "live",
    jobId,
  };
  db.insert(deletionJobs)
    .values({
      id: jobId,
      status: dryRun ? "dry_run" : "completed",
      dryRun,
      detailsJson: JSON.stringify(result),
      createdAt: now.toISOString(),
      completedAt: now.toISOString(),
    })
    .run();
  db.insert(auditEvents)
    .values({
      id: randomUUID(),
      actorId: "system",
      action: "retention_job",
      entityType: "deletion_job",
      entityId: jobId,
      metadataJson: JSON.stringify(result),
      createdAt: now.toISOString(),
    })
    .run();
  return result;
}
