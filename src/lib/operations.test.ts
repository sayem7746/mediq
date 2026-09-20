import { describe, expect, it } from "vitest";
import { createDb } from "@/lib/db";
import { recordAnalyticsEvent } from "@/lib/analytics";
import { getWeeklyBetaReport } from "./operations";

describe("weekly beta report", () => {
  it("counts consent_rejected separately from complaints", () => {
    const { db, sqlite } = createDb(":memory:");
    recordAnalyticsEvent(db, {
      name: "consent_rejected",
      locale: "en",
      anonymizedRef: "abc123",
    });
    recordAnalyticsEvent(db, {
      name: "complaint_opened",
      locale: "en",
      anonymizedRef: "def456",
    });
    const report = getWeeklyBetaReport(db);
    expect(report.consentErrors).toBe(1);
    expect(report.complaints).toBe(1);
    expect(report.generalLaunchEnabled).toBe(false);
    sqlite.close();
  });
});
