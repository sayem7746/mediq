import { describe, expect, it } from "vitest";
import { createDb } from "@/lib/db";
import { runRetentionJob } from "./retention";

describe("runRetentionJob", () => {
  it("dry-runs and writes an audit log without deleting when duration is PLACEHOLDER", () => {
    const { db, sqlite } = createDb(":memory:");
    const result = runRetentionJob(db, { dryRun: true });
    expect(result.dryRun).toBe(true);
    expect(result.deleted).toBe(0);
    expect(result.blocked).toBe(true);
    const jobs = sqlite
      .prepare("select count(*) as n from deletion_jobs")
      .get() as {
      n: number;
    };
    const audits = sqlite
      .prepare("select count(*) as n from audit_events")
      .get() as {
      n: number;
    };
    expect(jobs.n).toBe(1);
    expect(audits.n).toBeGreaterThan(0);
    sqlite.close();
  });
});
