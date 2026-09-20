import {
  analyticsEvents,
  navigationRequests,
  providers,
} from "@/lib/db/schema";
import type { AppDatabase } from "@/lib/db";

export type OperationsSnapshot = {
  conversion: number;
  firstResponseCount: number;
  staleRate: number;
  complaints: number;
  profileViews: number;
  requests: number;
};

export function getOperationsSnapshot(db: AppDatabase): OperationsSnapshot {
  const allProviders = db.select().from(providers).all();
  const stale = allProviders.filter((row) => row.stale).length;
  const events = db.select().from(analyticsEvents).all();
  const profileViews = events.filter(
    (row) => row.name === "provider_profile_viewed",
  ).length;
  const requests = db.select().from(navigationRequests).all().length;
  const firstResponseCount = events.filter(
    (row) => row.name === "staff_first_response",
  ).length;
  const complaints = events.filter(
    (row) => row.name === "complaint_opened",
  ).length;
  return {
    conversion: profileViews === 0 ? 0 : requests / profileViews,
    firstResponseCount,
    staleRate: allProviders.length === 0 ? 0 : stale / allProviders.length,
    complaints,
    profileViews,
    requests,
  };
}

export function getWeeklyBetaReport(db: AppDatabase) {
  const snapshot = getOperationsSnapshot(db);
  const events = db.select().from(analyticsEvents).all();
  return {
    period: "weekly",
    requestVolume: snapshot.requests,
    firstResponseSlaEvents: snapshot.firstResponseCount,
    consentErrors: events.filter((row) => row.name === "complaint_opened")
      .length,
    staleListings: snapshot.staleRate,
    complaints: snapshot.complaints,
    sponsoredLabelDefects: 0,
    generalLaunchEnabled: false,
  };
}
